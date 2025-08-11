import React, { useEffect, useState, useRef, useMemo } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Circle, Fill, Stroke } from "ol/style";
import { transform } from 'ol/proj';
import "ol/ol.css";
import "./HotspotMap.css";
import { useDispatch, useSelector } from "react-redux";
import { getHSInfo, getLocationLookup } from "../../../actions/informationActions";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import WarningIcon from '@mui/icons-material/Warning';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';



export default function HotspotMap() {
  const [map, setMap] = useState(null);
  const hotspotLayerRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const dispatch = useDispatch();
  const hotspotInfo = useSelector((state) => state.information.hotspotInfo);
  const locationLookup = useSelector((state) => state.information.locationLookup) || [];
  console.log('Current locationLookup:', locationLookup); // Debug log for location data
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Default Indonesia location
  const defaultLocation = {
    stt: 'Indonesia',
    disp: 'Indonesia'
  };
  
  // State for filter parameters
  const [filterParams, setFilterParams] = useState({
    conf_lvl: 'low',
    time: 'last24h',
    startdate: '',
    enddate: '',
    loc: JSON.stringify(defaultLocation)
  });

  // Transform API results to match the format
  const locationOptions = useMemo(() => {
    const transformedResults = locationLookup.map(loc => ({
      stt: loc.kab || loc.prov,
      disp: loc.disp
    }));
    return [defaultLocation, ...transformedResults];
  }, [locationLookup]);

  // Set default location on component mount
  useEffect(() => {
    setSelectedLocation(defaultLocation);
    setFilterParams(prev => ({
      ...prev,
      loc: JSON.stringify(defaultLocation)
    }));
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle filter changes
  const handleFilterChange = (field) => (event) => {
    setFilterParams(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Function to handle date changes
  const handleDateChange = (field) => (date) => {
    setFilterParams(prev => ({
      ...prev,
      [field]: date ? date.format('YYYY-MM-DD') : '',
      time: 'usedate' // Switch to custom time mode when dates are selected
    }));
  };

  // Function to handle location input change
  const handleLocationInputChange = (event, newInputValue) => {
    console.log('Input changed to:', newInputValue); // Debug log for input
    setLocationInput(newInputValue);
    if (newInputValue.length >= 3) {
      setIsLoading(true);
      dispatch(getLocationLookup(newInputValue))
        .then((response) => {
          console.log('Location lookup response:', response); // Debug log for API response
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // Function to handle location selection
  const handleLocationChange = (event, newValue) => {
    console.log('Selected location:', newValue); // Debug log
    if (newValue) {
      setSelectedLocation(newValue);
      setFilterParams(prev => ({
        ...prev,
        loc: JSON.stringify(newValue)
      }));
    } else {
      setSelectedLocation(null);
      setLocationInput('');
      setFilterParams(prev => ({
        ...prev,
        loc: JSON.stringify(defaultLocation)
      }));
    }
  };

  // Function to fetch hotspot data with current parameters
  const fetchHotspotData = () => {
    const params = {
      ...filterParams,
      mode: 'cluster',
      class: 'hotspot',
      visibility: true,
      id: 0
    };
    console.log('Fetching hotspot data with params:', params); // Debug log
    dispatch(getHSInfo(params));
  };

  // Initial fetch and fetch when parameters change
  useEffect(() => {
    fetchHotspotData();
  }, [filterParams]);

  // Function to get style based on satellite and confidence
  const getHotspotStyle = (feature) => {
    const properties = feature.getProperties();
    const confidence = properties.c;
    const resolution = properties.r;

    // Base color based on confidence
    let color;
    if (confidence >= 9) {
      color = 'rgba(255, 0, 0, 0.7)'; // Red for high confidence
    } else if (confidence >= 8) {
      color = 'rgba(255, 165, 0, 0.7)'; // Orange for medium-high confidence
    } else if (confidence >= 7) {
      color = 'rgba(255, 255, 0, 0.7)'; // Yellow for medium confidence
    } else {
      color = 'rgba(0, 255, 0, 0.7)'; // Green for low confidence
    }

    // Adjust size based on resolution
    const radius = Math.max(4, Math.min(8, 12 - (resolution / 500)));

    return new Style({
      image: new Circle({
        radius: radius,
        fill: new Fill({
          color: color
        }),
        stroke: new Stroke({
          color: color.replace('0.7', '1'),
          width: 2
        })
      })
    });
  };

  // Update hotspot layer when data changes
  useEffect(() => {
    if (!map || !hotspotInfo?.features) return;

    // Remove existing hotspot layer if it exists
    if (hotspotLayerRef.current) {
      map.removeLayer(hotspotLayerRef.current);
    }

    // Create vector source from GeoJSON
    const vectorSource = new VectorSource({
      features: new GeoJSON({
        featureProjection: 'EPSG:3857'
      }).readFeatures(hotspotInfo)
    });

    // Create vector layer with style function
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: getHotspotStyle,
      name: 'Hotspots',
      zIndex: 1000
    });

    // Store the layer reference and add to map
    hotspotLayerRef.current = vectorLayer;
    map.addLayer(vectorLayer);

  }, [map, hotspotInfo]);

  // Initialize map
  useEffect(() => {
    if (map) return; // Prevent multiple map initializations

    const baseLayer = new TileLayer({
      title: "Basemap",
      source: new XYZ({ 
        url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      }),
    });

    // Create popup element
    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup';
    
    const popupCloser = document.createElement('a');
    popupCloser.className = 'ol-popup-closer';
    popupCloser.href = '#';
    popupElement.appendChild(popupCloser);
    
    const popupContent = document.createElement('div');
    popupContent.className = 'ol-popup-content';
    popupElement.appendChild(popupContent);

    // Create popup overlay
    const popupOverlay = new Overlay({
      element: popupElement,
      positioning: 'bottom-center',
      offset: [0, -10],
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    const olMap = new Map({
      target: "map",
      layers: [baseLayer],
      overlays: [popupOverlay],
      view: new View({
        center: [13124075.715923082, -277949.29803053016],
        zoom: 5,
        projection: "EPSG:3857",
      }),
    });

    // Handle map clicks
    olMap.on('click', function(evt) {
      const hotspotFeature = olMap.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });

      if (hotspotFeature) {
        const properties = hotspotFeature.getProperties();
        let content = '<div class="popup-content">';
        content += `<p><strong>ID:</strong> ${properties.id}</p>`;
        content += `<p><strong>Confidence:</strong> ${properties.c}</p>`;
        content += `<p><strong>Satellite:</strong> ${properties.s}</p>`;
        content += `<p><strong>Resolution:</strong> ${properties.r} m</p>`;
        content += `<p><strong>Date:</strong> ${new Date(properties.d).toLocaleString()}</p>`;
        content += '</div>';
        popupContent.innerHTML = content;
        popupOverlay.setPosition(evt.coordinate);
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    // Handle popup closer
    popupCloser.onclick = function() {
      popupOverlay.setPosition(undefined);
      popupCloser.blur();
      return false;
    };

    setMap(olMap);
    setPopup(popupOverlay);

    return () => {
      if (olMap) {
        olMap.setTarget(undefined);
      }
    };
  }, []);

  // Calculate statistics from hotspot data
  const statistics = useMemo(() => {
    if (!hotspotInfo?.features) {
      return {
        total: 0,
        bySatellite: {},
        byConfidence: {
          high: 0,    // ≥9
          medium: 0,  // ≥8
          low: 0      // ≥7
        }
      };
    }

    const stats = {
      total: hotspotInfo.features.length,
      bySatellite: {},
      byConfidence: {
        high: 0,
        medium: 0,
        low: 0
      }
    };

    hotspotInfo.features.forEach(feature => {
      const props = feature.properties;
      
      // Count by satellite
      const satellite = props.s;
      stats.bySatellite[satellite] = (stats.bySatellite[satellite] || 0) + 1;

      // Count by confidence
      const confidence = props.c;
      if (confidence >= 9) {
        stats.byConfidence.high++;
      } else if (confidence >= 8) {
        stats.byConfidence.medium++;
      } else if (confidence >= 7) {
        stats.byConfidence.low++;
      }
    });

    return stats;
  }, [hotspotInfo]);

  return (
    <div className="zppi-map-container" >
      <div id="map" className="map-container"></div>
      
      {/* Filter Form - Top Left */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '40px',
        width: '400px',
        zIndex: 1000
      }}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h6" gutterBottom>
            Hotspot Filter
          </Typography>
          <Grid container spacing={2}>
            {/* Location Filter */}
            <Grid item xs={12}>
              <Autocomplete
                options={locationOptions}
                getOptionLabel={(option) => option?.disp || ''}
                inputValue={locationInput}
                value={selectedLocation}
                onInputChange={handleLocationInputChange}
                onChange={handleLocationChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location"
                    fullWidth
                  />
                )}
                loading={isLoading}
                loadingText="Loading locations..."
                noOptionsText={locationInput.length < 3 ? "Type at least 3 characters" : "No locations found"}
                filterOptions={(x) => x}
                freeSolo={false}
                clearOnBlur={false}
                blurOnSelect={true}
                disableClearable={false}
                renderOption={(props, option) => (
                  <li {...props} key={`${option.stt || ''}-${option.disp}`}>
                    <Typography>{option.disp}</Typography>
                  </li>
                )}
                isOptionEqualToValue={(option, value) => 
                  option?.stt === value?.stt && 
                  option?.disp === value?.disp
                }
              />
            </Grid>

            {/* Confidence Level Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Confidence Level</InputLabel>
                <Select
                  value={filterParams.conf_lvl}
                  onChange={handleFilterChange('conf_lvl')}
                  label="Confidence Level"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Time Mode Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Time Mode</InputLabel>
                <Select
                  value={filterParams.time}
                  onChange={handleFilterChange('time')}
                  label="Time Mode"
                >
                  <MenuItem value="last24h">Last 24 Hours</MenuItem>
                  <MenuItem value="last48h">Last 48 Hours</MenuItem>
                  <MenuItem value="last72h">Last 72 Hours</MenuItem>
                  <MenuItem value="usedate">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Date Range Filters - Only show when custom time mode is selected */}
            {filterParams.time === 'usedate' && (
              <>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={filterParams.startdate ? dayjs(filterParams.startdate) : null}
                      onChange={handleDateChange('startdate')}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={filterParams.enddate ? dayjs(filterParams.enddate) : null}
                      onChange={handleDateChange('enddate')}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </div>

      {/* Bottom Dashboard Section - More Compact */}
      <div style={{ 
        position: 'absolute', 
        bottom: '80px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '800px',
        zIndex: 1000
      }}>
        <Paper elevation={3} sx={{ p: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Grid container spacing={1}>
            {/* Total Hotspots Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(245, 245, 245, 0.9)', p: 1 }}>
                <CardContent sx={{ p: '8px !important' }}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <WarningIcon color="error" sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>Total Hotspot</Typography>
                  </Box>
                  <Typography variant="h4" color="error" sx={{ fontSize: '1.8rem' }}>
                    {statistics.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* By Satellite Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(245, 245, 245, 0.9)', p: 1 }}>
                <CardContent sx={{ p: '8px !important' }}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <SatelliteAltIcon color="primary" sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>By Satellite</Typography>
                  </Box>
                  {Object.entries(statistics.bySatellite).map(([satellite, count]) => (
                    <Box key={satellite} display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{satellite}</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* By Confidence Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(245, 245, 245, 0.9)', p: 1 }}>
                <CardContent sx={{ p: '8px !important' }}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <SignalCellularAltIcon color="secondary" sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>By Confidence</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="error" sx={{ fontSize: '0.8rem' }}>High</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>{statistics.byConfidence.high}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="warning.main" sx={{ fontSize: '0.8rem' }}>Medium</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>{statistics.byConfidence.medium}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="success.main" sx={{ fontSize: '0.8rem' }}>Low</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>{statistics.byConfidence.low}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
}
