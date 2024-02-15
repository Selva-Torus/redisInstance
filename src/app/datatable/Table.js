import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  deleteData,
  getAllKeys,
  getData,
  getString,
} from "@/utilsFunctions/apiCallUnit";

import ShowSpace from "./ShowSpace";
import { Button } from "primereact/button";
import { MdDelete } from "react-icons/md";
import { MultiSelect } from "primereact/multiselect";

const Table = () => {
  const [keys, setKeys] = useState([]);
  const [data, setData] = useState(null);
  const [show, setShow] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [selectContent, setSelectContent] = useState(null);
  useEffect(() => {
    getAllKeys().then((data) => {
      setKeys(data);
    });
  }, []);

  const handleDelete = (key) => {
    deleteData(key).then((data) => {
      getAllKeys().then((data) => {
        setKeys(data);
      });
    });
  };

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
          onClick={() => handleShow(item)}
          className="border-[1px] p-1 px-4 rounded-xl bg-blue-500 text-white"
          severity="success"
        >
          Get
        </Button>
      </div>
    ),
  }));

  useEffect(() => {
    console.log(selectContent);
  }, [selectContent]);

  const handleShow = (item) => {
    // console.log(item.type);
    if (item.type === "string") {
      getString(item.key)
        .then((data) => {
          const str = { string: data };
          setData(JSON.stringify(str));
          setShow(true);
        })
        .catch((error) => {
          console.log(error);
          setShow(false);
        });
    } else {
      getData(item.key)
        .then((data) => {
          // console.log(data);
          setData(data);
          setShow(true);
        })
        .catch((error) => {
          console.log(error);
          setShow(false);
        });
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
    // Promise.all(selectContent.map((key) => deleteData(key))).then(() => {
    //   setSelectContent([]);
    //   getAllKeys().then((data) => {
    //     setKeys(data);
    //   });
    // });
    // selectContent.map((key) => deleteData(key).then((res) => console.log(res)));
    try{
      await Promise.all(selectContent.map((key)=>deleteData(key))); 
      setSelectContent([])
      const updatedKeys=await getAllKeys()
      setKeys(updatedKeys)
    }
    catch(error){
      console.log(error)
    }
  };

  //   const handleFilter = (e) => {
  //     setFilterData(e.target.value);
  //   };

  return (
    <div className="flex overflow-hidden w-full h-screen">
      <div className="flex-shrink-0 overflow-y-auto w-3/4">
        <div className="card flex justify-content-center">
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
        {selectContent && (
          <Button
            onClick={handleBulkDelete}
            label="DELETES"
            className="p-button-danger"
          />
        )}
        {data && show && <ShowSpace data={data} show={show} />}
      </div>
    </div>
  );
};

export default Table;
