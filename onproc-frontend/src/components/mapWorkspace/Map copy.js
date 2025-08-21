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

const BaseMapComponent = ({ map, setMap, vectorLayerRef, bbox, selectedItem, collectionId, footprints }) => {
  const scale = () =>
    (window.devicePixelRatio && window.devicePixelRatio >= 2) ||
    (window.matchMedia && window.matchMedia('(min-resolution: 192dpi)').matches)
      ? 2
      : 1
  
  const wmsLayerName = useSelector((state) => state.map.wmsLayer); // Get the WMS layer name from Redux state

  useEffect(() => {
    if (!map) {
      const rasterLayer = new TileLayer({
        title: "Basemap",
        source: new XYZ({
          url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        }),
      });

      const newMap = new Map({
        target: "map",
        controls: defaultControls(),
        layers: [
          new LayerGroup({
            title: "Basemap",
            layers: [rasterLayer], // Add your initial basemap layer here
          }),
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
     const assetsParam = collectionId == 'landsat-c2-l2'
     ? ['red', 'green', 'blue'].map(asset => `assets=${asset}`).join('&')
     : 'assets=visual';

   const params = new URLSearchParams({
     ...(collectionId == 'landsat-c2-l2' ? {
       color_formula: 'Gamma RGB 1.7 Saturation 1.7 Sigmoidal RGB 15 0.35',
     } : {})
   }).toString();

   const tileUrl = `${titilerEndpoint}/stac/tiles/{z}/{x}/{y}@${scale()}x.png?url=${process.env.REACT_APP_STAC_URL}/collections/${collectionId}/items/${selectedItem}&${assetsParam}&${params}`;

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
      });

      map.addLayer(wmsLayer); // Add the new WMS layer to the map
    }
  }, [map, wmsLayerName]);

  return <div id="map" className="map"></div>;
};

export default BaseMapComponent;