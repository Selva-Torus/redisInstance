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
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import DataSettingModal from "@/PageComponents/DataSettingModal";

const Table = () => {
  const toast = useRef(null);
  const [keys, setKeys] = useState([]);
  const [data, setData] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [post, setPost] = useState({
    key: "",
    value: "",
    jsonContent: false,
    valueType: "",
    restValues: {},
  });
  const [selectContent, setSelectContent] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedKey , setSelectedKey] = useState('');
  const [selectedDataType , setSelectedDataType] = useState('');

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
        setVisible((prev) => !prev);
        showToast(
          "success",
          "Posted Successfully",
          `value posted for the redis key ${post.key}`
        );
      }else{
        showToast("error", "Post failed", "Data has not been posted.");
      }
    } catch (error) {
      showToast("error", "Post failed", "Data has not been posted.");
    }
  };

  const dataObjects = keys.map((item, index) => ({
    id: index + 1,
    key : item.key,
    type: item.type,
  }));

  const handleGetData = async (data) => {
    const { key, type } = data;
    const res = await getData(key, type);
    if (res) {
      setSelectedKey(key);
      setData(res);
      setSelectedDataType(type);
    } else {
      showToast("error", "Get failed", "Data has not been fetched.");
    }
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
     const res = await Promise.all(selectContent.map((key) => deleteData(key.name)));
     if(res){
      setSelectContent([]);
      const updatedKeys = await getAllKeys();
      setKeys(updatedKeys);
        showToast(
          "warn",
          "Delete successful",
          "Data has been deleted successfully."
        );
      }else{
        showToast("error", "Delete failed", "Data has not been deleted.");

      }
    } catch (error) {
      if (error) {
        showToast("error", "Delete failed", "Data has not been deleted.");
      }
    }
  };

  return (
    <div>
      <Toast ref={toast} />
        <div className="flex w-full px-2 py-2 gap-2 justify-center my-3 shadow">
          <MultiSelect
            value={selectContent}
            onChange={(e) => setSelectContent(e.value)}
            options={selectedObject}
            optionLabel="name"
            filter
            placeholder="Select keys to perform action"
            maxSelectedLabels={1}
            className="w-20px md:w-20rem"
          />
          {selectContent.length ? (
            <button
            className="border-[1px] py-0 px-4 rounded-xl bg-red-500 text-white"
          onClick={handleBulkDelete}
            >Delete</button>
          ): null}
          <button
            className="border-[1px] py-0 px-4 rounded-xl bg-blue-500 text-white"
            onClick={() => setVisible(true)}
          >New</button>
          <Dialog
            header="Post Data"
            visible={visible}
            style={{ width: "30vw" }}
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
        </div>
        <div className={`overflow-hidden h-[80vh] ${data ? 'flex gap-1': null}`}>
      <div className={` ${data ? ' overflow-y-auto w-3/4': null}` }>
        <DataTable
          value={dataObjects}
          first={first}
          showGridlines={true}
          stripedRows
          loading={!dataObjects || dataObjects.length === 0}
          rowHover
          onRowClick={(e) => handleGetData(e.data)}
          paginator
          size="small"
          rows={rows}
          rowsPerPageOptions={[10, 20]}
          onPageChange={onPageChange}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column sortable field="id" header="ID" />
          <Column
            sortable
            field="key"
            header="Content"
            filter
            filterPlaceholder="Search by value"
          />
          <Column
            field="type"
            header="Type"
            filter
            style={{ minWidth: '8rem' }}
            filterPlaceholder="Search by Type"
          />
        </DataTable>
      </div>
      <div className={`min-h-screen ${data ? 'overflow-y-auto w-1/4': null}`}>
        {data && <ShowSpace data={data} selectedKey={selectedKey} selectedDataType={selectedDataType}/>}
      </div>

      </div>
    </div>
  );
};

export default Table;
