import React from "react";
import LoaderGif from "../../assets/images/loading.gif";



const LoadingIndicator = () => {

  return  (
    <div className="loader-container">
      <div className="loader">
        <img src={LoaderGif} alt="loading"/>
      </div>
      <style jsx>
        {`
        .loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
}
        `}
        </style>
    </div>

  )
};

export default LoadingIndicator;
