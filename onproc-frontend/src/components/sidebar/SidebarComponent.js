import React, { useState } from 'react';
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

const SidebarComponent = ({ onHoverItem, onItemSelect, onCollectionSelect, aoiCoords }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const [isVisible, setIsVisible] = useState(true);
  const [showCollections, setShowCollections] = useState(false); // New state for showing collections
  const [checked, setChecked] = useState([false, false, false]);
  const [cloud, setCloud] = React.useState(30);
  const [dateFrom, setDateFrom] = React.useState(dayjs().subtract(14, 'day')); // Set dateFrom to 14 days ago
  const [dateUntil, setDateUntil] = React.useState(dayjs()); // Set dateUntil to now
  const [collection, setCollection] = React.useState([]);
  const [sattelite, setSattelite] = React.useState('');
  const [params, setParams] = React.useState('');

  const handleChange = (event, newValue) => {
    setCloud(newValue);
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

  const handleSubmit = () => {
    const params = new URLSearchParams({
      collections: collection,
      datetime: `${dateFrom.toISOString()}/${dateUntil.toISOString()}`, // Format dates
      limit: 50,
      query: JSON.stringify({
        'eo:cloud_cover': {
          'lte': cloud // Use cloud value
        }
      })
    }).toString();

    dispatch(selectCollection(collection)); // Dispatch collection on submit
    setParams(params);
    // Log the formatted parameters
    setShowCollections(true); // Show collections on submit
  };

  const handleCollectionSelect = () => {

    setShowCollections(false); // Hide collections and show search form
    onCollectionSelect(collection);

  };

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
            <Grid item xs={12}>
              <Box sx={{ padding: 1 }}>
                <div className='title-font'>Data Source : </div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Satellite</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sattelite || 'sentinel'}
                    label="Collection"
                    onChange={satteliteChange}
                  >
                    <MenuItem value={'landsat'}>Landsat</MenuItem>
                    <MenuItem value={'sentinel'}>Sentinel-2</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ padding: 1 }}>
                <div className='title-font'>Collection : </div>
                <FormControl fullWidth>
                  <FormGroup>
                    {sattelite === 'landsat' ? (
                      <FormControlLabel
                        control={<Checkbox checked={checked[0]} onChange={handleCheckboxChange} name="landsat-c2-l2" />}
                        label="L2"
                      />
                    ) : (
                      <>
                        <FormControlLabel
                          control={<Checkbox checked={checked[1]} onChange={handleCheckboxChange} name="sentinel-2-l1c" />}
                          label="L1C"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={checked[2]} onChange={handleCheckboxChange} name="sentinel-2-c1-l2a" />}
                          label="L2A"
                        />
                      </>
                    )}
                  </FormGroup>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ padding: 1 }}>
                <div className='title-font'>Date Range : </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <DatePicker
                      label="From"
                      value={dateFrom}
                      onChange={(newValue) => setDateFrom(newValue)}
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
                      onChange={(newValue) => setDateUntil(newValue)}
                      slotProps={{
                        actionBar: {
                          actions: ['today'],
                        },
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ padding: 1 }}>
                <div className='title-font'>Cloud Cover : </div>
                <Box sx={{ width: 300 }}>
                  <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <CloudQueueIcon />
                    <Slider aria-label="Volume" value={cloud} onChange={handleChange} />
                    <CloudIcon />
                    <Typography>{cloud}</Typography> %
                  </Stack>
                </Box>
              </Box>

              <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit} 
              disabled={!aoiCoords || aoiCoords.length === 0} // Disable if aoiCoords is null or empty
              fullWidth // Set button to full width
            >
              Search
            </Button>
            </Grid>
            
          </Grid>
        )}
      </div>
    </div>
  );
};

export default SidebarComponent;