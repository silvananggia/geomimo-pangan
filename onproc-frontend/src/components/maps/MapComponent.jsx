import React, { useState, useRef } from "react";
import Map from "./Map";
import GeolocationButton from "./GeolocationButton";
import BasemapSelect from "./BasemapSelect";
import DrawButton from "../map/DrawButton";


const MapComponent = ({ bbox, selectedItem, collectionId, onAoiChange, isWorkspaceVisible, toggleWorkspace }) => {
  const [map, setMap] = useState(null);
  const vectorLayerRef = useRef(null);



  return (
    <div className="contentRoot">
      <Map map={map} setMap={setMap} vectorLayerRef={vectorLayerRef} bbox={bbox} selectedItem={selectedItem} collectionId={collectionId} />
      {map && (
        <div className="button-container">
          <DrawButton 
            map={map} 
            vectorLayerRef={vectorLayerRef} 
            onAoiChange={onAoiChange}
          />
          <GeolocationButton map={map} />
          <BasemapSelect map={map} />
        </div>
      )}
     

    </div>
  );
};

export default MapComponent;
