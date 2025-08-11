import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import TileArcGISRest from 'ol/source/TileArcGISRest';
import { Point } from 'ol/geom';
import { Circle as CircleStyle, Fill } from 'ol/style';

const BaseMapComponent = ({ map, setMap, vectorLayerRef, bbox, selectedItem, collectionId, footprints }) => {
  // Layer visibility state
  const [layerVisibility, setLayerVisibility] = useState({
    basemap: true,
    sawah2023: true,
    wms: true,
    wms2024: true,
  });
  // Layer opacity state
  const [layerOpacity, setLayerOpacity] = useState({
    sawah2023: 0.7,
    wms: 1,
    wms2024: 0.7,
  });
  // Layer refs
  const basemapLayerRef = useRef();
  const sawah2023LayerRef = useRef();
  const wmsLayerRef = useRef();
  const wms2024LayerRef = useRef();
  // Highlight layer ref
  const highlightLayerRef = useRef();

  const scale = () =>
    (window.devicePixelRatio && window.devicePixelRatio >= 2) ||
    (window.matchMedia && window.matchMedia('(min-resolution: 192dpi)').matches)
      ? 2
      : 1
  
  const wmsLayerName = useSelector((state) => state.map.wmsLayer); // Get the WMS layer name from Redux state
  const collection = useSelector((state) => state.map.collection); // Get selectedJobId from Redux

  useEffect(() => {
    if (!map) {
      const rasterLayer = new TileLayer({
        title: "Basemap",
        source: new XYZ({
          url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        }),
      });
      basemapLayerRef.current = rasterLayer;

      const vectorSource = new VectorSource({ wrapX: false });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
      if (vectorLayerRef && typeof vectorLayerRef === "object") {
        vectorLayerRef.current = vectorLayer;
      }
      
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
    if (map) {
      // --- WMS LAYER ---
      const wmsLayer = new TileLayer({
        title: "Manual WMS Layer",
        source: new TileWMS({
          url: "http://10.28.12.103:8080/geoserver/test/wms",
          params: {
            'LAYERS': 'test:IP_2023',
            TILED: true,
            VERSION: '1.1.1',
            FORMAT: 'image/png',
            TRANSPARENT: true,
            STYLES: '',
            EXCEPTIONS: 'application/vnd.ogc.se_inimage',
            SRS: 'EPSG:4326',
            FORMAT_OPTIONS: 'dpi:180'
          },
          serverType: 'geoserver'
        }),
        zIndex: 2.5,
        opacity: layerOpacity.wms,
      });
      wmsLayerRef.current = wmsLayer;
      map.addLayer(wmsLayer);

      // --- WMS LAYER IP_2024 ---
      const wms2024Layer = new TileLayer({
        title: "WMS IP 2024",
        source: new TileWMS({
          url: "http://10.28.12.103:8080/geoserver/test/wms",
          params: {
            'LAYERS': 'test:IP_2024',
            TILED: true,
            VERSION: '1.1.1',
            FORMAT: 'image/png',
            TRANSPARENT: true,
            STYLES: '',
            EXCEPTIONS: 'application/vnd.ogc.se_inimage',
            SRS: 'EPSG:4326',
            FORMAT_OPTIONS: 'dpi:180'
          },
          serverType: 'geoserver'
        }),
        zIndex: 3,
        opacity: layerOpacity.wms2024,
      });
      wms2024LayerRef.current = wms2024Layer;
      map.getLayers().insertAt(2, wms2024Layer); // After sawah2023, before wmsLayer

      // --- ARCGIS REST LAYER: Sawah 2023 ---
      const sawah2023Layer = new TileLayer({
        title: 'Sawah 2023',
        source: new TileArcGISRest({
          url: 'https://sig02.pertanian.go.id/server/rest/services/Sawah/Sawah2023/MapServer/0',
          params: {},
        }),
        zIndex: 2,
        opacity: layerOpacity.sawah2023,
      });
      sawah2023LayerRef.current = sawah2023Layer;
      map.getLayers().insertAt(1, sawah2023Layer);

      // --- HIGHLIGHT LAYER ---
      const highlightSource = new VectorSource();
      const highlightLayer = new VectorLayer({
        source: highlightSource,
        zIndex: 99,
        style: new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: 'rgba(255,0,0,0.7)' }),
            stroke: new Stroke({ color: '#fff', width: 2 })
          })
        })
      });
      highlightLayerRef.current = highlightLayer;
      map.addLayer(highlightLayer);

      // --- POPUP SETUP ---
      let popupContainer = document.getElementById('popup');
      let popupContent = document.getElementById('popup-content');
      let popupCloser = document.getElementById('popup-closer');
      if (!popupContainer) {
        popupContainer = document.createElement('div');
        popupContainer.id = 'popup';
        popupContainer.className = 'ol-popup';
        popupContent = document.createElement('div');
        popupContent.id = 'popup-content';
        popupCloser = document.createElement('a');
        popupCloser.id = 'popup-closer';
        popupCloser.href = '#';
        popupCloser.className = 'ol-popup-closer';
        popupContainer.appendChild(popupCloser);
        popupContainer.appendChild(popupContent);
        document.body.appendChild(popupContainer);
      }
      // OpenLayers Overlay
      const Overlay = require('ol/Overlay').default;
      const popupOverlay = new Overlay({
        element: popupContainer,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      map.addOverlay(popupOverlay);
      // Closer
      popupCloser.onclick = function () {
        popupOverlay.setPosition(undefined);
        popupCloser.blur();
        return false;
      };
      // --- END POPUP SETUP ---

      // Add click event for GetFeatureInfo
      const handleMapClick = (evt) => {
        const view = map.getView();
        const viewResolution = view.getResolution();
        // --- GetFeatureInfo for both IP_2023 and IP_2024 ---
        const wmsUrl = "http://10.28.12.103:8080/geoserver/test/wms";
        const getUrl = (layer) => {
          return new TileWMS({
            url: wmsUrl,
            params: {
              'LAYERS': layer,
              TILED: true,
              VERSION: '1.1.1',
              FORMAT: 'image/png',
              TRANSPARENT: true,
              STYLES: '',
              EXCEPTIONS: 'application/vnd.ogc.se_inimage',
              SRS: 'EPSG:4326',
              FORMAT_OPTIONS: 'dpi:180'
            },
            serverType: 'geoserver'
          }).getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            view.getProjection(),
            {
              'INFO_FORMAT': 'application/json',
              'QUERY_LAYERS': layer,
            }
          );
        };
        const url2023 = getUrl('test:IP_2023');
        const url2024 = getUrl('test:IP_2024');

        // Highlight selected pixel
        if (highlightLayerRef.current) {
          const source = highlightLayerRef.current.getSource();
          source.clear();
          const feature = new Feature({ geometry: new Point(evt.coordinate) });
          source.addFeature(feature);
        }

        // Fetch both values in parallel
        Promise.all([
          url2023 ? axios.get(url2023).catch(() => null) : Promise.resolve(null),
          url2024 ? axios.get(url2024).catch(() => null) : Promise.resolve(null)
        ]).then(([res2023, res2024]) => {
          function extractValue(response) {
            if (response && response.data && response.data.features && response.data.features.length > 0) {
              const props = response.data.features[0].properties;
              for (const key in props) {
                if (typeof props[key] === 'number') return props[key];
                if (!isNaN(parseInt(props[key]))) return parseInt(props[key]);
              }
            }
            return null;
          }
          const val2023 = extractValue(res2023);
          const val2024 = extractValue(res2024);

          function formatTanamPanen(val) {
            if (val !== null && val >= 10 && val <= 99) {
              const tanam = Math.floor(val / 10);
              const panen = val % 10;
              return `<b>Tanam:</b> ${tanam}<br/><b>Panen:</b> ${panen}`;
            } else if (val !== null) {
              return `<b>Nilai:</b> ${val}`;
            } else {
              return '-';
            }
          }

          popupContent.innerHTML =
            `<b>IP 2023:</b><br/>${formatTanamPanen(val2023)}<br/><br/>` +
            `<b>IP 2024:</b><br/>${formatTanamPanen(val2024)}`;
          popupOverlay.setPosition(evt.coordinate);
        });
      };
      map.on('singleclick', handleMapClick);
      // Cleanup
      return () => {
        map.un('singleclick', handleMapClick);
        map.removeOverlay(popupOverlay);
        if (popupContainer && popupContainer.parentNode) popupContainer.parentNode.removeChild(popupContainer);
        map.removeLayer(sawah2023Layer);
        map.removeLayer(wmsLayer);
        map.removeLayer(wms2024Layer);
        map.removeLayer(highlightLayer);
      };
    }
  }, [map]);
  
  // Sync layer visibility with state
  useEffect(() => {
    if (basemapLayerRef.current) basemapLayerRef.current.setVisible(layerVisibility.basemap);
    if (sawah2023LayerRef.current) sawah2023LayerRef.current.setVisible(layerVisibility.sawah2023);
    if (wmsLayerRef.current) wmsLayerRef.current.setVisible(layerVisibility.wms);
    if (wms2024LayerRef.current) wms2024LayerRef.current.setVisible(layerVisibility.wms2024);
  }, [layerVisibility]);

  // Sync layer opacity with state
  useEffect(() => {
    if (sawah2023LayerRef.current) sawah2023LayerRef.current.setOpacity(layerOpacity.sawah2023);
    if (wmsLayerRef.current) wmsLayerRef.current.setOpacity(layerOpacity.wms);
    if (wms2024LayerRef.current) wms2024LayerRef.current.setOpacity(layerOpacity.wms2024);
  }, [layerOpacity]);

  // Layer control panel handler
  const handleLayerToggle = (layer) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };
  const handleOpacityChange = (layer, value) => {
    setLayerOpacity((prev) => ({ ...prev, [layer]: value }));
  };

  return (
    <>
      <div id="map" className="map"></div>
      {/* Layer Control Panel */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '12px 18px',
        zIndex: 1000,
        minWidth: 180,
      }}>
        <strong>Layer Control</strong>
        {/* Sawah 2023 */}
        <div>
          <label>
            <input type="checkbox" checked={layerVisibility.sawah2023} onChange={() => handleLayerToggle('sawah2023')} /> Lahan Baku Sawah
          </label>
          <div style={{marginLeft: 8, marginTop: 2, marginBottom: 8}}>
            <input type="range" min={0} max={1} step={0.01} value={layerOpacity.sawah2023} onChange={e => handleOpacityChange('sawah2023', parseFloat(e.target.value))} />
            <span style={{marginLeft: 8}}>{Math.round(layerOpacity.sawah2023*100)}%</span>
          </div>
        </div>

        {/* WMS IP 2023 */}
        <div>
          <label>
            <input type="checkbox" checked={layerVisibility.wms} onChange={() => handleLayerToggle('wms')} /> Indeks Pertanaman 2023
          </label>
          <div style={{marginLeft: 8, marginTop: 2, marginBottom: 8}}>
            <input type="range" min={0} max={1} step={0.01} value={layerOpacity.wms} onChange={e => handleOpacityChange('wms', parseFloat(e.target.value))} />
            <span style={{marginLeft: 8}}>{Math.round(layerOpacity.wms*100)}%</span>
          </div>
        </div>
                {/* WMS IP 2024 */}
                <div>
          <label>
            <input type="checkbox" checked={layerVisibility.wms2024} onChange={() => handleLayerToggle('wms2024')} /> Indeks Pertanaman 2024
          </label>
          <div style={{marginLeft: 8, marginTop: 2, marginBottom: 8}}>
            <input type="range" min={0} max={1} step={0.01} value={layerOpacity.wms2024} onChange={e => handleOpacityChange('wms2024', parseFloat(e.target.value))} />
            <span style={{marginLeft: 8}}>{Math.round(layerOpacity.wms2024*100)}%</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseMapComponent;

// Tambahkan CSS popup jika belum ada
document.head.insertAdjacentHTML('beforeend', `<style>.ol-popup{position:absolute;background:white;-webkit-filter:drop-shadow(0 1px 4px rgba(0,0,0,0.2));filter:drop-shadow(0 1px 4px rgba(0,0,0,0.2));padding:15px;border-radius:10px;border:1px solid #cccccc;bottom:12px;left:-50px;min-width:180px}.ol-popup:after,.ol-popup:before{top:100%;border:solid transparent;content:" ";height:0;width:0;position:absolute;pointer-events:none}.ol-popup:after{border-top-color:white;border-width:10px;left:48px;margin-left:-10px}.ol-popup-closer{text-decoration:none;position:absolute;top:2px;right:8px}</style>`);
