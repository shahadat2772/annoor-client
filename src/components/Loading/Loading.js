import React from "react";
import MoonLoader from "react-spinners/MoonLoader";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <MoonLoader color="#FF884B" />
    </div>
  );
};

export default Loading;
