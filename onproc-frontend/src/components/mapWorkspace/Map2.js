import React, { useEffect, useRef, useState } from "react";
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

const BaseMapComponent = ({ map, setMap, vectorLayerRef, bbox, selectedItem, collectionId }) => {

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
      });
      vectorLayerRef.current = vectorLayer;

      const newMap = new Map({
        target: "map",
        controls: defaultControls(),
        layers: [
          new LayerGroup({
            title: "Basemap",
            layers: [rasterLayer],
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
      const titilerEndpoint = "https://titiler.xyz";
      const params = new URLSearchParams({
         assets: 'visual',
        minzoom: "8",
        maxzoom: "14", 

        /*expression: "(nir_b1-red_b1)/(nir_b1+red_b1)", // NDVI
        rescale: "-1,1",
        minzoom: "8",
        maxzoom: "14",
        colormap_name: "viridis" */
      }).toString();

      fetch(`${titilerEndpoint}/stac/WebMercatorQuad/tilejson.json?url=${process.env.REACT_APP_STAC_URL}/collections/${collectionId}/items/${selectedItem}&${params}`)
        .then(response => response.json())
        .then(async tileJson => {
          const stacLayer = new TileLayer({
            title: "STAC Layer",
            source: new XYZ({
              url: tileJson.tiles[0],
              minZoom: tileJson.minzoom,
              maxZoom: tileJson.maxzoom,
              attributions: "ESA",
            }),
          });

          map.getLayers().getArray().slice(1).forEach(layer => {
            if (layer.get('title') === 'STAC Layer') {
              map.removeLayer(layer);
            }
          });
          map.addLayer(stacLayer);
        })
        .catch(error => console.error('Error fetching tile JSON:', error));
    }
  }, [selectedItem, map]);

  return <div id="map" className="map"></div>;
};

export default BaseMapComponent;
