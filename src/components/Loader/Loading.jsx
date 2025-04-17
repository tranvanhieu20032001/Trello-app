import React from "react";
import "./loaderSearch.css";

const Loading = () => {
  return (
    <div className="absolute bg-white rounded-md w-full mt-10 z-10 p-2 flex justify-center">
      <div className="loader">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Loading;
