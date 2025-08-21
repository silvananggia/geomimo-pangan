import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Map, View } from "ol";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import "./Map.scss";

import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { defaults as defaultControls } from "ol/control";
import LayerGroup from "ol/layer/Group";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Style, Stroke } from "ol/style";
import GeoJSON from 'ol/format/GeoJSON';
import TileWMS from "ol/source/TileWMS";
import { get as getProjection } from "ol/proj";
import { transformExtent } from "ol/proj";
import { unByKey } from "ol/Observable";
import axios from "axios";

const BaseMapComponent = ({ map, setMap, vectorLayerRef, bbox, selectedItem, collectionId, footprints }) => {
  const [popup, setPopup] = useState(null);
  const [pixelValue, setPixelValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const clickListenerRef = useRef(null);
  
  const scale = () =>
    (window.devicePixelRatio && window.devicePixelRatio >= 2) ||
    (window.matchMedia && window.matchMedia('(min-resolution: 192dpi)').matches)
      ? 2
      : 1
  
  const wmsLayerName = useSelector((state) => state.map.wmsLayer); // Get the WMS layer name from Redux state
  const collection = useSelector((state) => state.map.collection); // Get selectedJobId from Redux

  // Function to get pixel value from WMS layer
  const getPixelValue = useCallback(async (coordinate, map) => {
    if (!wmsLayerName) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const wmsSource = map.getLayers().getArray().find(layer => 
        layer.get('title') === 'WMS Layer'
      )?.getSource();
      
      if (!wmsSource) {
        setError('WMS layer not found');
        return null;
      }
      
      const url = wmsSource.getFeatureInfoUrl(coordinate, map.getView().getResolution(), 
        map.getView().getProjection(), {
          'INFO_FORMAT': 'application/json',
          'FEATURE_COUNT': 1,
          'QUERY_LAYERS': `test:${wmsLayerName}`
        });
      
      if (url) {
        const response = await axios.get(url);
        return response.data;
      } else {
        setError('Unable to generate feature info URL');
        return null;
      }
    } catch (error) {
      console.error('Error getting pixel value:', error);
      setError('Failed to fetch pixel data. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [wmsLayerName]);

  // Function to handle map clicks
  const handleMapClick = useCallback(async (event) => {
    console.log('Map clicked!', event);
    if (!map) {
      console.log('No map available');
      return;
    }
    
    const coordinate = event.coordinate;
    const pixel = map.getEventPixel(event.originalEvent);
    const viewResolution = map.getView().getResolution();
    
    console.log('Click coordinate:', coordinate);
    console.log('Click pixel:', pixel);
    
    // Get pixel value from WMS layer
    const pixelData = await getPixelValue(coordinate, map);
    console.log('Pixel data received:', pixelData);
    
    if (pixelData && pixelData.features && pixelData.features.length > 0) {
      console.log('Setting popup with data');
      setPixelValue(pixelData);
      setPopup({
        coordinate: coordinate,
        pixel: pixel,
        data: pixelData
      });
    } else if (error) {
      console.log('Setting popup with error');
      // Show error popup
      setPopup({
        coordinate: coordinate,
        pixel: pixel,
        error: error
      });
    } else {
      console.log('Setting popup with no data');
      // No data available
      setPopup({
        coordinate: coordinate,
        pixel: pixel,
        noData: true
      });
    }
  }, [map, getPixelValue, error]);

  // Function to close popup
  const closePopup = () => {
    setPopup(null);
    setPixelValue(null);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!map) {
      const rasterLayer = new TileLayer({
        title: "Basemap",
        source: new XYZ({
          url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        }),
      });

      const vectorSource = new VectorSource({ wrapX: false });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        name: "BBOX Layer",
      });
      vectorLayerRef.current = vectorLayer;
      
      const newMap = new Map({
        target: "map",
        controls: defaultControls(),
        layers: [
          new LayerGroup({
            title: "Basemap",
            layers: [rasterLayer], // Add your initial basemap layer here
          }),
          vectorLayer,
        ],
        view: new View({
          center: [13124075.715923082, -277949.29803053016],
          zoom: 6,
          maxZoom: 20,
        }),
      });

      setMap(newMap);
    }
  }, [map]);

  useEffect(() => {
    if (bbox && map) {
      const vectorLayer = vectorLayerRef.current;

      const [minLon, minLat, maxLon, maxLat] = bbox;
      const [minX, minY] = fromLonLat([minLon, minLat]);
      const [maxX, maxY] = fromLonLat([maxLon, maxLat]);

      const polygonFeature = new Feature({
        title: "BBOX Layer",
        geometry: new Polygon([
          [
            [minX, minY],
            [minX, maxY],
            [maxX, maxY],
            [maxX, minY],
            [minX, minY],
          ],
        ]),
      });

      polygonFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "black",
            width: 2,
          }),
        })
      );

      // Remove only the BBOX layer from the vector layer source
      const features = vectorLayer.getSource().getFeatures();
      features.forEach(feature => {
        if (feature.get('title') === 'BBOX Layer') {
          vectorLayer.getSource().removeFeature(feature);
        }
      });
      vectorLayer.getSource().addFeature(polygonFeature);

      const extent = polygonFeature.getGeometry().getExtent();
      //  map.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }
  }, [bbox, map]);

  useEffect(() => {
    if (selectedItem && map) {
      const titilerEndpoint = "https://tiler.aws.element84.com";
     // Manually construct the query string for assets
     const assetsParam = collection == 'landsat-c2-l2'
     ? ['red', 'green', 'blue'].map(asset => `assets=${asset}`).join('&')
     : 'assets=visual';

   const params = new URLSearchParams({
     ...(collection == 'landsat-c2-l2' ? {
       color_formula: 'Gamma RGB 1.7 Saturation 1.7 Sigmoidal RGB 15 0.35',
     } : {})
   }).toString();

   const tileUrl = `${titilerEndpoint}/stac/tiles/{z}/{x}/{y}@${scale()}x.png?url=${process.env.REACT_APP_STAC_URL}/collections/${collection}/items/${selectedItem}&${assetsParam}&${params}`;

      // New condition to check if map is valid
      if (map && Object.keys(map).length > 0) {
        const currentSelectionImageTileLayer = new TileLayer(
          {
            title: "STAC Layer",
            source: new XYZ({
              url: tileUrl,
              tileSize: 256,
              minZoom: 8, // Set appropriate min zoom
              maxZoom: 14, // Set appropriate max zoom
              attributions: "ESA",
            }),
            zIndex: 1, // Set z-index for STAC Layer
          }
        );

        map.getLayers().getArray().slice(1).forEach(layer => {
          if (layer.get('title') === 'STAC Layer') {
            map.removeLayer(layer);
          }
        });
        map.addLayer(currentSelectionImageTileLayer);
      }
    }
  }, [selectedItem, map]);

  useEffect(() => {
    if (map && wmsLayerName) {
      // Remove the existing WMS layer if it exists
      const existingLayers = map.getLayers().getArray();
      existingLayers.forEach(layer => {
        if (layer.get('title') === 'WMS Layer') {
          map.removeLayer(layer);
        }
      });

      const wmsLayer = new TileLayer({
        title: "WMS Layer",
        source: new TileWMS({
          url: process.env.REACT_APP_GEOSERVER_URL + '/wms',
          params: { 'LAYERS': 'test:'+wmsLayerName, 'TILED': true },
          serverType: 'geoserver',
        }),
        zIndex: 2, // Set z-index for WMS Layer (higher than STAC)
      });

      map.addLayer(wmsLayer); // Add the WMS layer to the map

      // Get the WMS layer extent using axios
      const url = process.env.REACT_APP_GEOSERVER_URL + '/wms?service=WMS&version=1.3.0&request=GetCapabilities';
      axios.get(url).then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const layers = xmlDoc.getElementsByTagName("Layer");
        for (let i = 0; i < layers.length; i++) {
          const name = layers[i].getElementsByTagName("Name")[0].textContent;
          if (name === `test:${wmsLayerName}`) {
            const boundingBox = layers[i].getElementsByTagName("BoundingBox")[0];
            const minX = parseFloat(boundingBox.getAttribute("minx"));
            const minY = parseFloat(boundingBox.getAttribute("miny"));
            const maxX = parseFloat(boundingBox.getAttribute("maxx"));
            const maxY = parseFloat(boundingBox.getAttribute("maxy"));
            const extent = [minX, minY, maxX, maxY];

            const mapProjection = map.getView().getProjection();
            const layerProjection = getProjection("EPSG:4326");
            const transformedExtent = transformExtent(extent, layerProjection, mapProjection);
            // Enable smooth zooming with animation
            map.getView().fit(transformedExtent, { padding: [50, 50, 50, 50], duration: 1000, animate: true }); // Added animate option
            break;
          }
        }
      }).catch((error) => {
        console.error(`Error fetching WMS capabilities: ${error}`);
      });
    }
  }, [map, wmsLayerName]);

  // Add click event listener when map is ready
  useEffect(() => {
    if (map && !clickListenerRef.current) {
      console.log('Setting up click listener for map');
      clickListenerRef.current = map.on('click', handleMapClick);
    }

    return () => {
      if (clickListenerRef.current) {
        unByKey(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [map, wmsLayerName, handleMapClick]);

  // Handle clicks outside popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Check if the click is not on the map element
        const mapElement = document.getElementById('map');
        if (mapElement && !mapElement.contains(event.target)) {
          closePopup();
        }
      }
    };

    if (popup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popup]);

  // Close popup when WMS layer changes
  useEffect(() => {
    if (wmsLayerName) {
      closePopup();
    }
  }, [wmsLayerName]);

  // Debug popup state changes
  useEffect(() => {
    console.log('Popup state changed:', popup);
  }, [popup]);

  // Debug pixelValue state changes
  useEffect(() => {
    console.log('PixelValue state changed:', pixelValue);
  }, [pixelValue]);

  // Render popup
  const renderPopup = () => {
    console.log('renderPopup called, popup state:', popup);
    if (!popup) return null;

    const pixel = map.getPixelFromCoordinate(popup.coordinate);
    console.log('Pixel from coordinate:', pixel);
    if (!pixel) return null;

    // Calculate popup position to keep it within viewport
    const popupWidth = 300;
    const popupHeight = 200;
    const mapElement = document.getElementById('map');
    const mapRect = mapElement.getBoundingClientRect();
    
    let left = pixel[0];
    let top = pixel[1] - popupHeight - 20; // Position above the click point
    
    // Adjust horizontal position if popup would go off-screen
    if (left + popupWidth > mapRect.width) {
      left = mapRect.width - popupWidth - 10;
    }
    if (left < 10) {
      left = 10;
    }
    
    // Adjust vertical position if popup would go off-screen
    if (top < 10) {
      top = pixel[1] + 20; // Position below the click point
    }
    if (top + popupHeight > mapRect.height) {
      top = mapRect.height - popupHeight - 10;
    }

    console.log('Popup position - left:', left, 'top:', top);

    const style = {
      left: left + 'px',
      top: top + 'px',
      position: 'absolute',
      backgroundColor: 'red', // Changed to red for debugging
      border: '3px solid blue', // Changed to blue for debugging
      borderRadius: '4px',
      padding: '20px', // Increased padding
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 10000, // Increased z-index
      maxWidth: '400px', // Increased width
      fontSize: '14px', // Increased font size
      fontFamily: 'Arial, sans-serif',
      color: 'white' // White text for visibility
    };

    return (
      <div ref={popupRef} style={style} className="pixel-popup">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong>Pixel Information</strong>
          <button 
            onClick={closePopup}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <strong>Coordinates:</strong><br />
          Lat: {popup.coordinate[1].toFixed(6)}<br />
          Lon: {popup.coordinate[0].toFixed(6)}
        </div>
        
        {isLoading && (
          <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            Loading pixel data...
          </div>
        )}
        
        {error && (
          <div style={{ color: '#d32f2f', fontStyle: 'italic' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {popup.noData && !isLoading && !error && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            No pixel data available at this location.
          </div>
        )}
        
        {pixelValue && pixelValue.features && pixelValue.features.length > 0 && !isLoading && !error && (
          <div>
            <strong>Values:</strong><br />
            {Object.entries(pixelValue.features[0].properties).map(([key, value]) => (
              <div key={key} style={{ marginTop: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>{key}:</span> {value !== null ? value.toString() : 'N/A'}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <div id="map" className="map"></div>
      {renderPopup()}
    </div>
  );
};

export default BaseMapComponent;
