import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";

import {
  deleteData,
  getAllKeys,
  getData,
  postData,
} from "@/utilsFunctions/apiCallUnit";

import ShowSpace from "./ShowSpace";
import { Button } from "primereact/button";
import { MdDelete } from "react-icons/md";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import DataSettingModal from "@/PageComponents/DataSettingModal";

const Table = () => {
  const toast = useRef(null);

  const [keys, setKeys] = useState([]);
  const [data, setData] = useState(null);
  const [show, setShow] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [post, setPost] = useState({
    key: "",
    value: "",
    jsonContent: false,
    valueType: "",
    restValues: {},
  });
  const [selectContent, setSelectContent] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getAllKeys();
      setKeys(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type, title, message) => {
    toast.current.show({ severity: type, summary: title, detail: message });
  };


  const handlePost = async (post) => {
    try {
      const data = await postData(post);
      if (data) {
        fetchData();
        setVisible(prev => !prev)
        showToast(
          "success",
          "Posted Successfully",
          `value posted for the redis key ${post.key}`
        );
      }
    } catch (error) {
      showToast("error", "Post failed", "Data has not been posted.");
    }
  };

  const handleDelete = (key) => {
    deleteData(key).then(() => {
      fetchData();
      showToast("warn", "Delete successful", "Data has been deleted.");
    });
  };
  console.log(data,"mrygbid");
  const dataObjects = keys.map((item, index) => ({
    id: index + 1,
    value: item.key,
    type: item.type,
    actions: (
      <div className="flex gap-2 items-center">
        <div onClick={() => handleDelete(item.key)}>
          <MdDelete size={25} />
        </div>
        <Button
          onClick={() => handleShow(item) }
          className="border-[1px] p-1 px-4 rounded-xl bg-blue-500 text-white"
          severity="success"
        >
          Get
        </Button>
      </div>
    ),
  }));


  const handleShow = async (data) => {
    const { key , type } = data;
    const res = await getData(key , type);
    if(res){
      setShow(true)
      setData(res)
    }
    else{
      showToast("error", "Get failed", "Data has not been fetched.");
    }
    console.log(res);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const selectedObject = keys.map((item) => ({
    name: item.key,
  }));

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectContent.map((key) => deleteData(key.name)));
      setSelectContent([]);
      const updatedKeys = await getAllKeys();
      setKeys(updatedKeys);
      showToast(
        "warn",
        "Delete successful",
        "Data has been deleted successfully."
      );
    } catch (error) {
      if (error) {
        showToast("error", "Delete failed", "Data has not been deleted.");
      }
    }
  };

  return (
    <div className="flex overflow-hidden w-full h-screen">
      <Toast ref={toast} />
      <div className="flex-shrink-0 overflow-y-auto w-3/4">
        <div className="card flex justify-content-center py-5">
          <MultiSelect
            value={selectContent}
            onChange={(e) => setSelectContent(e.value)}
            options={selectedObject}
            optionLabel="name"
            filter
            placeholder="Select Content"
            maxSelectedLabels={1}
            className="w-20px md:w-20rem"
          />
          <Button
            label="Add Data"
            icon="pi pi-external-link"
            onClick={() => setVisible(true)}
          />
          <Dialog
            header="Post Data"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => {
              setVisible(false);
              setPost({
                key: "",
                value: "",
                jsonContent: false,
                valueType: "",
                restValues: {},
              });
            }}
          >
            <DataSettingModal
              handlePost={handlePost}
              post={post}
              setPost={setPost}
            />
          </Dialog>
          {selectContent && (
          <Button
            onClick={handleBulkDelete}
            label="Delete "
            hidden={selectContent.length === 0}
            icon={<MdDelete />}
            className="p-button-danger ml-2"
          />
        )}
        </div>
        <DataTable
          value={dataObjects}
          first={first}
          paginator
          rows={rows}
          rowsPerPageOptions={[10, 20]}
          onPageChange={onPageChange}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column sortable field="id" header="ID" />
          <Column
            sortable
            field="value"
            header="Content"
            filter
            filterPlaceholder="Search by value"
          />
          <Column
            field="type"
            header="Type"
            filter
            filterPlaceholder="Search by Type"
          />
          <Column
            field="actions"
            header="Actions"
            body={(rowData) => rowData.actions}
          />
        </DataTable>
      </div>
      <div className="flex-shrink-0 overflow-y-auto w-1/4 mt-5">
        
        {data && show && <ShowSpace data={data} show={show} />}
      </div>
    </div>
  );
};

export default Table;
