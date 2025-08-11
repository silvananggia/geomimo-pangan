import React, { useState, useCallback } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import Draw, { createBox } from "ol/interaction/Draw";
import { toLonLat } from "ol/proj";

const DrawButton = ({ map, vectorLayerRef, onAoiChange }) => {
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [hasFeatures, setHasFeatures] = useState(false);
  const [aoiCoords, setAoiCoords] = useState(null);

  const handleDrawBox = useCallback(() => {
    if (!map || !vectorLayerRef.current) return;

    // Clear existing features from the source
    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear();

    const newDrawInteraction = new Draw({
      source: vectorSource,
      type: "Circle",
      geometryFunction: createBox(),
    });

    newDrawInteraction.on('drawend', (event) => {
      setHasFeatures(vectorSource.getFeatures().length > 0);
      const feature = event.feature;
      drawBoundingBox(feature);
      map.removeInteraction(newDrawInteraction);
      setDrawInteraction(null);
    });

    map.addInteraction(newDrawInteraction);
    setDrawInteraction(newDrawInteraction);
  }, [map, vectorLayerRef]);

  const handleUndo = () => {
    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
      setDrawInteraction(null);

      const vectorSource = vectorLayerRef.current.getSource();
      if (vectorSource) {
        vectorSource.clear();
        setHasFeatures(false);
        setAoiCoords(null);
        onAoiChange(null);
      }
    }
  };

  const drawBoundingBox = (feature) => {
    const geometry = feature.getGeometry();
    const extent = geometry.getExtent();
    const bottomLeft = toLonLat([extent[0], extent[1]]);
    const topRight = toLonLat([extent[2], extent[3]]);
    const coords = `${bottomLeft.join(',')},${topRight.join(',')}`;
    
    setAoiCoords(coords);
    onAoiChange(coords);
  };

  return (
    <div className="button-container">
      <button onClick={handleDrawBox} className="draw-box-button">
        <CheckBoxOutlineBlankIcon className="img" /> Draw AoI
      </button>
      {hasFeatures && (
        <button onClick={handleUndo} className="delete-button">
          <DeleteIcon className="img" />
        </button>
      )}
      {aoiCoords && (
        <div className="coordinate-box-embed">
          <p>AOI Coordinates: {aoiCoords}</p>
        </div>
      )}
    </div>
  );
};

export default DrawButton;
