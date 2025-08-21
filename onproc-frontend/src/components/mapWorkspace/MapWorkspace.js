import React, { useState } from "react";
import MapComponent from "../map/MapComponent";
import SidebarComponent from "../sidebar/SidebarComponent";
import MenuIcon from '@mui/icons-material/Menu'; // Importing MUI Menu icon
import { Typography } from "@mui/material";
import ProcessingComponent from "../processingbox/ProcessingComponent";
import PaletteIcon from '@mui/icons-material/Palette';
import WorkspaceComponent from "../workspace/workspaceComponent";

const Home = () => {
  const [bbox, setBbox] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [aoiCoords, setAoiCoords] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState(true);
  const [isProccesingVisible, setIsProcessingVisible] = useState(false);
  const [footprints, setFootprints] = useState([]);

  const handleHoverItem = (bbox) => {
    setBbox(bbox);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleCollectionSelect = (id) => {
    setCollectionId(id);
  };

  const handleAoiChange = (coords) => {
    setAoiCoords(coords);
  };

  const toggleSidebar = () => { // New function to toggle sidebar
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleWorkspace = (isWorkspaceVisible) => { // New function to toggle sidebar
    setIsWorkspaceVisible(isWorkspaceVisible);
    console.log(isWorkspaceVisible);
  };


  const toggleProcessing = () => { // New function to toggle sidebar
    setIsProcessingVisible(!isProccesingVisible);
  };

  const handleFootprintsUpdate = (footprints) => {
    setFootprints(footprints || []); // Ensure footprints is always an array
  };

  const handleDrop = (itemId) => {
    console.log('Dropped item ID:', itemId); // Handle the dropped item ID
    // Add your logic to process the dropped item here
  };

  const toggleWorkspace = () => {
    setIsWorkspaceVisible(!isWorkspaceVisible);
    console.log(isWorkspaceVisible);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div onClick={toggleSidebar} className="button-tools">
        <MenuIcon /> {/* MUI Menu icon */}
      </div>
      {isSidebarVisible && ( // Conditional rendering of SidebarComponent
        <SidebarComponent
          onHoverItem={handleHoverItem}
          onItemSelect={handleItemSelect}
          onCollectionSelect={handleCollectionSelect}
          aoiCoords={aoiCoords}
          onFootprintsUpdate={handleFootprintsUpdate}
        />
      )}
      {/* 
      <div onClick={toggleProcessing} className="button-proccesing">
        <Typography>Proceesing</Typography>
      </div>
      {isProccesingVisible && (
        <ProcessingComponent onDrop={handleDrop} />
      )}

      <div onClick={toggleProcessing} className="button-visualize">
        <PaletteIcon />
        <Typography>Visualize</Typography>
      </div>
      {isProccesingVisible && (
        <ProcessingComponent onDrop={handleDrop} />
      )} */}

      <MapComponent
        bbox={bbox}
        selectedItem={selectedItem}
        collectionId={collectionId}
        onAoiChange={handleAoiChange}
        footprints={footprints}
        workspace={handleWorkspace}
        isWorkspaceVisible={isWorkspaceVisible}
        toggleWorkspace={toggleWorkspace}
      />

      {isWorkspaceVisible && ( // Conditional rendering of WorkspaceComponent
        <WorkspaceComponent
        />
      )}


    </div>
  );
};

export default Home;
