// src/components/HotspotMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { fetchHotspotData } from './hotspotService';
import "ol/ol.css";

const HotspotMap = () => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [vectorSource] = useState(new VectorSource());

  const [startDate, setStartDate] = useState('2025-01-06T17:00:00.000Z');
  const [endDate, setEndDate] = useState('2025-01-07T17:00:00.000Z');
  const [confLevel, setConfLevel] = useState('medium');

  useEffect(() => {
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
          style: new Style({
            image: new Icon({
              src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
              scale: 0.05,
            }),
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([118, -2]), // Indonesia center
        zoom: 5,
      }),
    });
    setMap(initialMap);

    return () => initialMap.setTarget(null);
  }, []);

  const loadHotspot = async () => {
    try {
      const data = await fetchHotspotData(startDate, endDate, confLevel);
     
      
      vectorSource.clear();
      
      if (data && data.features) {
        data.features.forEach((feature) => {
         
          const coords = feature.geometry.coordinates;
          if (coords && coords.length === 2) {
            const point = new Feature({
              geometry: new Point(fromLonLat(coords)),
              name: `Source: ${feature.properties.s}`,
            });
            vectorSource.addFeature(point);
          } else {
            console.warn('Invalid coordinates:', coords);
          }
        });
        
        // Fit view to extent of features
        const extent = vectorSource.getExtent();
        if (extent && !isNaN(extent[0]) && !isNaN(extent[1])) {
          map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 10
          });
        }
      } else {
        console.warn('No features found in data:', data);
      }
    } catch (err) {
      console.error("Error fetching hotspot data:", err);
    }
  };

  useEffect(() => {
    if (map) loadHotspot();
  }, [map, startDate, endDate, confLevel]);

  return (
    <div>
      <h2>Hotspot Map (OpenLayers)</h2>
      <div style={{ marginBottom: 10 }}>
        <label>Dari: </label>
        <input 
          type="datetime-local" 
          value={startDate.slice(0, 16)} 
          onChange={(e) => setStartDate(new Date(e.target.value).toISOString())} 
        />
        <label> Sampai: </label>
        <input 
          type="datetime-local" 
          value={endDate.slice(0, 16)} 
          onChange={(e) => setEndDate(new Date(e.target.value).toISOString())} 
        />
        <label> Confidence: </label>
        <select value={confLevel} onChange={(e) => setConfLevel(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={loadHotspot}>Tampilkan Hotspot</button>
      </div>

      <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
};

export default HotspotMap;
