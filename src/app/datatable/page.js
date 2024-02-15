"use client"
import React from 'react'
import Table from './Table'
import ShowSpace from './ShowSpace'
import "primereact/resources/primereact.min.css";
// import "primereact/resources/themes/saga-blue/theme.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/themes/tailwind-light/theme.css";

const DataTable = () => {
  return (
    <div>
      <div className='width-[10px]'>
      <Table/>
      </div>
    </div>
  )
}

export default DataTable