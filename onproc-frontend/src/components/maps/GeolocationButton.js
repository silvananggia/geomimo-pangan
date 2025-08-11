// GeolocationButton.js
import React, { useState } from "react";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";

const GeolocationButton = ({ map }) => {
  const [userMarkerFeature, setUserMarkerFeature] = useState(null);
  const handleCenterGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lonLat = [position.coords.longitude, position.coords.latitude];
        const coordinates = fromLonLat(lonLat);

        map.getView().animate({
          center: coordinates,
          duration: 1000, // Animation duration in milliseconds
          zoom: 12,
        });

        const userMarkerSource = new VectorSource();
        const userMarkerLayer = new VectorLayer({
          source: userMarkerSource,
          zIndex: 1,
        });

        map.addLayer(userMarkerLayer);

        const userMarkerFeature = new Feature({
          geometry: new Point(fromLonLat([0, 0])),
        });
        userMarkerFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              zIndex: 1,
              fill: new Fill({
                color: "#3399CC",
              }),
              stroke: new Stroke({
                color: "#fff",
                width: 2,
              }),
            }),
          })
        );
        userMarkerSource.addFeature(userMarkerFeature);
        userMarkerLayer.setZIndex(1);
        setUserMarkerFeature(userMarkerFeature);
        userMarkerFeature.getGeometry().setCoordinates(coordinates);
      });
    }
  };

  return (
    <button
      onClick={handleCenterGeolocation}
      className="center-geolocation-button"
    >
      <MyLocationOutlinedIcon className="img" />
    </button>
  );
};

export default GeolocationButton;
