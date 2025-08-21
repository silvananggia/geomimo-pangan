import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import {
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Slider,
  Stack,
  Button,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CollectionsComponent from '../stac/CollectionsComponent'; // Adjust the path as necessary
import { useDispatch } from 'react-redux'; // Import useDispatch
import { selectCollection } from '../../actions/mapActions'; // Import your action

import { v4 as uuidv4 } from 'uuid';
import { createJob } from '../../actions/jobsActions';
import { getUserData } from "../../utility/Utils";
import { getJobById, setSelectedJob } from '../../actions/jobsActions'; // Import the action

const SidebarComponent = ({ onHoverItem, onItemSelect, onCollectionSelect, aoiCoords }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const user = getUserData();
  const [isVisible, setIsVisible] = useState(true);
  const [showCollections, setShowCollections] = useState(false); // New state for showing collections
  const [checked, setChecked] = useState([false, false, false]);
  const [cloud, setCloud] = React.useState(30);
  const [dateFrom, setDateFrom] = React.useState(dayjs().subtract(2, 'year')); // Set dateFrom to 2 years ago
  const [dateUntil, setDateUntil] = React.useState(dayjs()); // Set dateUntil to today
  const [collection, setCollection] = React.useState([]);
  const [sattelite, setSattelite] = React.useState('');
  const [params, setParams] = React.useState('');
  const [dateRangeError, setDateRangeError] = React.useState(''); // Add state for date range validation error
  const [jobId, setJobId] = useState(null);
  
  // Add new state variables for all input parameters
  const [jarakAntarTanam, setJarakAntarTanam] = useState('8');
  const [ekstremMin, setEkstremMin] = useState('2');
  const [ekstremMax, setEkstremMax] = useState('4');
  const [perbedaanDN, setPerbedaanDN] = useState('0.3');
  const [batasEkstremMin, setBatasEkstremMin] = useState('0.7');
  const [kelasPertumbuhanMin, setKelasPertumbuhanMin] = useState('7');
  const handleChange = (event, newValue) => {
    setCloud(newValue);
  };

  const validateDateRange = (from, until) => {
    const diffInYears = until.diff(from, 'year', true);
    if (Math.abs(diffInYears - 2) > 0.1) { // Allow small tolerance for day differences
      setDateRangeError('Date range must be exactly 2 years');
    } else {
      setDateRangeError('');
    }
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const satteliteChange = (event) => {
    setSattelite(event.target.value);
    setChecked([false, false, false]); // Reset checkboxes when satellite changes
    setCollection([]);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedChecked = checked
      ? [...collection, name]
      : collection.filter(item => item !== name);
    setCollection(updatedChecked); // Update local state

    // Dispatch the collection to Redux
    dispatch(selectCollection(updatedChecked)); // Dispatch action to store in Redux

    // Update the checkbox state for UI
    const index = name === "landsat-c2-l2" ? 0 : name === "sentinel-2-l1c" ? 1 : 2;
    setChecked((prev) => {
      const newChecked = [...prev];
      newChecked[index] = checked;
      return newChecked;
    });
  };

  const handleSubmit = async () => {
    // Check if AOI coordinates are selected
    if (!aoiCoords) {
      alert('Please select an Area of Interest (AOI) by drawing a bounding box on the map first.');
      return;
    }

    // Validate input parameters
    const parameters = [
      { name: 'Jarak Antar Tanam', value: jarakAntarTanam, min: 1, max: 365 },
      { name: 'Ekstrem Minimum', value: ekstremMin, min: 1, max: 50 },
      { name: 'Ekstrem Maksimum', value: ekstremMax, min: 1, max: 50 },
      { name: 'Perbedaan nilai DN', value: perbedaanDN, min: 0, max: 1 },
      { name: 'Batas Ekstrem Minimum', value: batasEkstremMin, min: 0, max: 1 },
      { name: 'Kelas Pertumbuhan Minimum', value: kelasPertumbuhanMin, min: 1, max: 50 }
    ];

    for (const param of parameters) {
      if (!param.value || isNaN(parseFloat(param.value))) {
        alert(`Please enter a valid number for ${param.name}`);
        return;
      }
      
      const value = parseFloat(param.value);
      if (value < param.min || value > param.max) {
        alert(`${param.name} must be between ${param.min} and ${param.max}`);
        return;
      }
    }

    // Validate that ekstremMin < ekstremMax
    if (parseFloat(ekstremMin) >= parseFloat(ekstremMax)) {
      alert('Ekstrem Minimum must be less than Ekstrem Maksimum');
      return;
    }

    const newJobId = uuidv4();
    const jobname = `IP Padi`;
    const cpurequired = '1';
    const priority = '1';
    
    // Parse AOI coordinates from the format "minLon,minLat,maxLon,maxLat"
    const [aoi_xmin, aoi_ymin, aoi_xmax, aoi_ymax] = aoiCoords.split(',').map(coord => parseFloat(coord));
    
    // Validate coordinates
    if (isNaN(aoi_xmin) || isNaN(aoi_ymin) || isNaN(aoi_xmax) || isNaN(aoi_ymax)) {
      alert('Invalid AOI coordinates. Please draw a new bounding box.');
      return;
    }
    
    // Validate coordinate ranges for Indonesia (rough bounds)
    if (aoi_xmin < 90 || aoi_xmax > 150 || aoi_ymin < -15 || aoi_ymax > 10) {
      alert('AOI coordinates are outside the expected range for Indonesia. Please select an area within Indonesia.');
      return;
    }
    
    // Ensure min < max for both longitude and latitude
    if (aoi_xmin >= aoi_xmax || aoi_ymin >= aoi_ymax) {
      alert('Invalid AOI coordinates: minimum values must be less than maximum values.');
      return;
    }
    
    const command = `http://10.27.57.82:5000/run_ip_padi?implementation=modul_ip_padi&per1sikluspadi=${jarakAntarTanam}&perekstremmin=${ekstremMin}&perekstremmax=${ekstremMax}&btsbedaekstremmaxmin=${perbedaanDN}&batasekstremmin=${batasEkstremMin}&jlmkelaspertumbuhanminimum=${kelasPertumbuhanMin}&aoi_xmin=${aoi_xmin}&aoi_xmax=${aoi_xmax}&aoi_ymin=${aoi_ymin}&aoi_ymax=${aoi_ymax}&output=Subang&id_proses=${newJobId}`;
    
    console.log('AOI Coordinates:', aoiCoords);
    console.log('Parsed coordinates:', { aoi_xmin, aoi_ymin, aoi_xmax, aoi_ymax });
    console.log('Processing Parameters:', {
      jarakAntarTanam,
      ekstremMin,
      ekstremMax,
      perbedaanDN,
      batasEkstremMin,
      kelasPertumbuhanMin
    });
    console.log('API Command:', command);
    console.log(user);
    console.log(user.username);
    
    try {
        await dispatch(createJob(newJobId, user.username, jobname, command, cpurequired, priority));
        setJobId(newJobId); // Set jobId state
     
        await  dispatch(setSelectedJob(newJobId)); // Dispatch the action
        await dispatch(getJobById(newJobId));
    } catch (error) {
        console.error("Error:", error);
    }
  };

  const handleCollectionSelect = () => {

    setShowCollections(false); // Hide collections and show search form
    onCollectionSelect(collection);

  };

  useEffect(() => {
    validateDateRange(dateFrom, dateUntil);
  }, [dateFrom]);

  return (
    <div className={`sidebar ${isVisible ? '' : 'hidden'}`}>
      <div className='sidebar-header'>
        <div className='circle-background'>
          <ArrowBackIcon
            onClick={toggleSidebar}
            style={{ color: 'white', fontSize: '20px' }}
          />
        </div>
        <Box display="flex" flexDirection="column">
          <a href="/" style={{ textDecoration: 'none', color:'#fff' }}><Typography variant="h4">GEOMIMO</Typography></a>
          <Typography variant="body2" style={{ fontSize: '0.75rem' }}>Geoinformatics Multi Input Multi Output</Typography>
        </Box>
      </div>

      <div className='sidebar-content'>
        {showCollections ? ( // Conditional rendering
          <CollectionsComponent
            onHoverItem={onHoverItem}
            onItemSelect={onItemSelect}
            onCollectionSelect={handleCollectionSelect} // Use the updated function
            aoiCoords={aoiCoords}
            collection={collection}
            params={params} // Pass params to CollectionsComponent
            
          />
        ) : (
          <Grid container spacing={2}>
            {/* AOI Instructions */}
            <Grid item xs={12}>
              <Box sx={{ padding: 1, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  <strong>How to use:</strong>
                  <br />1. Use the "Draw AoI" button on the map to select your area of interest
                  <br />2. Fill in the parameters below
                  <br />3. Click Submit to process your request
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ padding: 1 }}>
                <div className='title-font'>Parameter : </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <DatePicker
                      label="From"
                      value={dateFrom}
                      onChange={(newValue) => {
                        const calculatedDateUntil = newValue.add(2, 'year');
                        if (calculatedDateUntil.isAfter(dayjs())) {
                          setDateRangeError('Selected date would result in a future end date. Please choose an earlier start date.');
                          return; // Don't update the dates
                        }
                        setDateFrom(newValue);
                        setDateUntil(calculatedDateUntil);
                        setDateRangeError(''); // Clear any previous errors
                        validateDateRange(newValue, calculatedDateUntil);
                      }}
                      maxDate={dayjs().subtract(2, 'year')}
                      slotProps={{
                        actionBar: {
                          actions: ['today'],
                        },
                      }}
                    />
                    <Typography variant='h5'> to </Typography>
                    <DatePicker
                      label="Until"
                      value={dateUntil}
                      disabled={true}
                      slotProps={{
                        actionBar: {
                          actions: ['today'],
                        },
                      }}
                    />
                  </Box>
                  {dateRangeError && (
                    <Typography 
                      variant="body2" 
                      color="error" 
                      sx={{ mt: 1, fontSize: '0.75rem' }}
                    >
                      {dateRangeError}
                    </Typography>
                  )}
                </LocalizationProvider>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Processing Parameters
              </Typography>
              
              <Box sx={{ padding: 1 }}>
                <TextField
                  label="Jarak Antar Tanam (Days)"
                  variant="outlined"
                  value={jarakAntarTanam}
                  onChange={(e) => setJarakAntarTanam(e.target.value)}
                  fullWidth
                  helperText="Interval between planting cycles in days"
                  type="number"
                  inputProps={{ min: 1, max: 365, step: 1 }}
                />
              </Box>
              
                              <Box sx={{ padding: 1 }}>
                  <TextField
                    label="Ekstrem Minimum"
                    variant="outlined"
                    value={ekstremMin}
                    onChange={(e) => setEkstremMin(e.target.value)}
                    fullWidth
                    helperText="Minimum extreme value for vegetation index"
                    type="number"
                    inputProps={{ min: 1, max: 50, step: 1 }}
                  />
                </Box>  
              
                              <Box sx={{ padding: 1 }}>
                  <TextField
                    label="Ekstrem Maksimum"
                    variant="outlined"
                    value={ekstremMax}
                    onChange={(e) => setEkstremMax(e.target.value)}
                    fullWidth
                    helperText="Maximum extreme value for vegetation index"
                    type="number"
                    inputProps={{ min: 1, max: 50, step: 1 }}
                  />
                </Box> 
              
                              <Box sx={{ padding: 1 }}>
                  <TextField
                    label="Perbedaan nilai DN antara maximum dan minimum"
                    variant="outlined"
                    value={perbedaanDN}
                    onChange={(e) => setPerbedaanDN(e.target.value)}
                    fullWidth
                    helperText="DN value difference threshold between max and min"
                    type="number"
                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                  />
                </Box> 
              
                              <Box sx={{ padding: 1 }}>
                  <TextField
                    label="Batas Ekstrem Minimum"
                    variant="outlined"
                    value={batasEkstremMin}
                    onChange={(e) => setBatasEkstremMin(e.target.value)}
                    fullWidth
                    helperText="Minimum extreme boundary threshold"
                    type="number"
                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                  />
                </Box> 
              
                              <Box sx={{ padding: 1 }}>
                  <TextField
                    label="Kelas Pertumbuhan Minimum"
                    variant="outlined"
                    value={kelasPertumbuhanMin}
                    onChange={(e) => setKelasPertumbuhanMin(e.target.value)}
                    fullWidth
                    helperText="Minimum growth class threshold"
                    type="number"
                    inputProps={{ min: 1, max: 50, step: 1 }}
                  />
                </Box> 
            </Grid>

            <Grid item xs={12}>
              {/* AOI Status Message */}
              {!aoiCoords ? (
                <Box sx={{ padding: 1, mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    color="warning.main" 
                    sx={{ fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    ⚠️ Please draw an Area of Interest (AOI) on the map first
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ padding: 1, mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    color="success.main" 
                    sx={{ fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    ✅ AOI Selected: {aoiCoords}
                  </Typography>
                  {/* Calculate and display approximate area */}
                  {(() => {
                    try {
                      const [minLon, minLat, maxLon, maxLat] = aoiCoords.split(',').map(coord => parseFloat(coord));
                      // Rough calculation: 1 degree ≈ 111 km at equator, adjust for latitude
                      const latAdjustment = Math.cos((minLat + maxLat) * Math.PI / 360);
                      const widthKm = (maxLon - minLon) * 111 * latAdjustment;
                      const heightKm = (maxLat - minLat) * 111;
                      const areaKm2 = Math.round(widthKm * heightKm);
                      return (
                        <Typography 
                          variant="caption" 
                          color="success.main" 
                          sx={{ fontSize: '0.65rem', textAlign: 'center', display: 'block', mt: 0.5 }}
                        >
                          Approximate area: {areaKm2} km²
                        </Typography>
                      );
                    } catch (e) {
                      return null;
                    }
                  })()}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit} 
                  disabled={!aoiCoords || aoiCoords.length === 0} // Disable if aoiCoords is null or empty
                  sx={{ flex: 1 }} // Take up available space
                >
                  Submit
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => {
                    setJarakAntarTanam('8');
                    setEkstremMin('4');
                    setEkstremMax('4');
                    setPerbedaanDN('0.3');
                    setBatasEkstremMin('0.7');
                    setKelasPertumbuhanMin('7');
                  }}
                  sx={{ minWidth: '100px' }}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
            
          </Grid>
        )}
      </div>
    </div>
  );
};

export default SidebarComponent;