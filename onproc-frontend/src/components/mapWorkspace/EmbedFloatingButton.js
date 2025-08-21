import React from "react";
import Typography from "@mui/material/Typography";

const FloatingButton = ({
  basemapOptions,
  basemap,
  changeBasemap,
}) => {
  return (
    <div className="embed-floating-button">
      
      <Typography id="opacity-slider-label" fontSize={12}>
        Peta Dasar :
      </Typography>{" "}
      <div className="basemap-option">
        {basemapOptions.map((option) => (
          <div key={option.key} className="button-container-embed">
            <div
              className={`image ${basemap === option.key ? "active" : ""}`}
              id={option.key}
              onClick={() => changeBasemap(option.key)}
            ></div>
            <div
              className={`label-basemap ${
                basemap === option.key ? "active" : ""
              }`}
            >
              <Typography fontSize={10} align="center">
                {" "}
                {option.label}
              </Typography>
            </div>{" "}
            {/* Label below div */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingButton;
