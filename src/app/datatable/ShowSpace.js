import { scanData } from "@/utilsFunctions/apiCallUnit";
import React from "react";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';


const ShowSpace = ({data,show}) => {

  // const handleScan = async() => {
  //   const res = await scanData()
  //   console.log(res);
  // }
    
  return (
    <div>
      {/* <button className="bg-blue-500 text-white p-2" onClick={handleScan}> getData here</button> */}
        <JsonView data={JSON.parse(data)}  shouldExpandNode={allExpanded} style={darkStyles}
        show={show} />
        
        {/* <JsonView data={json} shouldExpandNode={allExpanded} style={defaultStyles} /> */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default ShowSpace;
