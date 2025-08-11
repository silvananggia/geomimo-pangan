import React, { useState, useRef } from "react";
import Map from "./Map";
import GeolocationButton from "./GeolocationButton";
import BasemapSelect from "./BasemapSelect";


const MapComponent = ({ bbox, selectedItem, collectionId, onAoiChange, isWorkspaceVisible, toggleWorkspace }) => {
  const [map, setMap] = useState(null);
  const vectorLayerRef = useRef(null);



  return (
    <div className="contentRoot">
      <Map map={map} setMap={setMap} vectorLayerRef={vectorLayerRef} bbox={bbox} selectedItem={selectedItem} collectionId={collectionId} />
      {map && (
        <div className="button-container">
         
          <GeolocationButton map={map} />
          <BasemapSelect map={map} />
        </div>
      )}
     

    </div>
  );
};

export default MapComponent;
