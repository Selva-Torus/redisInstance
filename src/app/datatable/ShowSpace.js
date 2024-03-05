import React from "react";
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const ShowSpace = ({ data, selectedKey, selectedDataType }) => {
  return (
    <div className="flex flex-col w-full h-full justify-start items-center">
      <h2 className="text-center font-bold">{selectedKey}</h2>
      {["list", "zset", "hash", "set", "stream"].includes(selectedDataType) ? (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Key
              </th>
              <th scope="col" className="px-6 py-3">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{key}</td>
                <td className="px-6 py-4">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedDataType == "string" ? (
        <>
          <h2 className="text-center font-bold text-gray-400">{data}</h2>
        </>
      ) : (
        <JsonView
          data={data}
          shouldExpandNode={allExpanded}
          style={darkStyles}
        />
      )}
    </div>
  );
};

export default ShowSpace;
