import React from "react";
import {
  JsonView,
  allExpanded,
  darkStyles,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const ShowSpace = ({ data, show }) => {
  return (
    <div>
      <JsonView data={data} shouldExpandNode={allExpanded} style={darkStyles} />
    </div>
  );
};

export default ShowSpace;
