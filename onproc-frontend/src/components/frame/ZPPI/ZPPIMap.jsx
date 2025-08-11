import React, { useEffect, useState, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import "ol/ol.css";
import "./ZPPIMap.css";

export default function ZppiMap() {
  const [map, setMap] = useState(null);
  const currentLayerRef = useRef(null);
  const [layersData, setLayersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [popup, setPopup] = useState(null);
  const [activeSections, setActiveSections] = useState({
    data: false,
    method: false,
    layers: true
  });

  // Indonesia bounding box in EPSG:3857
  const indonesiaBbox = {
    minX: 95.2930261576,
    minY: -10.3599874813,
    maxX: 140.7181246124,
    maxY: 5.47982086834
  };

  useEffect(() => {
    fetch("https://spbn.brin.go.id/public/getlayersfromcategory/140")
      .then((res) => res.json())
      .then((data) => {
        setLayersData(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      });

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
      if (currentLayerRef.current) {
        const view = olMap.getView();
        const viewResolution = view.getResolution();
        const url = currentLayerRef.current.getSource().getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          view.getProjection(),
          {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': 50,
            'QUERY_LAYERS': currentLayerRef.current.getSource().getParams().LAYERS,
            'WIDTH': olMap.getSize()[0],
            'HEIGHT': olMap.getSize()[1],
            'X': Math.floor(evt.pixel[0]),
            'Y': Math.floor(evt.pixel[1])
          }
        );

        if (url) {
          console.log('Fetching feature info from:', url);
          fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Feature info response:', data);
              if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const properties = feature.properties;
                let content = '<div class="popup-content">';
                
                // Add all properties to popup content
                Object.entries(properties).forEach(([key, value]) => {
                  if (value !== null && value !== undefined) {
                    content += `<p><strong>${key}:</strong> ${value}</p>`;
                  }
                });
                
                content += '</div>';
                popupContent.innerHTML = content;
                popupOverlay.setPosition(evt.coordinate);
              } else {
                console.log('No features found at clicked location');
                popupOverlay.setPosition(undefined);
              }
            })
            .catch(error => {
              console.error('Error fetching feature info:', error);
              popupOverlay.setPosition(undefined);
            });
        } else {
          console.log('No feature info URL generated');
          popupOverlay.setPosition(undefined);
        }
      } else {
        console.log('No current layer selected');
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
  }, []);

  // Add effect to select first layer when data is loaded
  useEffect(() => {
    if (layersData.length > 0 && map) {
      const firstLayer = layersData[0];
      handleLayerSelect(firstLayer.slug, firstLayer.name);
    }
  }, [layersData, map]);

  const handleLayerSelect = (slug, name) => {
    // Remove current layer if exists
    if (currentLayerRef.current) {
      map.removeLayer(currentLayerRef.current);
    }

    const wmsSource = new ImageWMS({
      url: "https://spbn.brin.go.id/geoserver/lapan/wms",
      params: {
        LAYERS: `lapan:${slug}`,
        TILED: true,
        VERSION: '1.1.1',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        STYLES: '',
        EXCEPTIONS: 'application/vnd.ogc.se_inimage',
        SRS: 'EPSG:3857',
        FORMAT_OPTIONS: 'dpi:180'
      },
      ratio: 1,
      serverType: "geoserver",
      crossOrigin: 'anonymous'
    });

    const newLayer = new ImageLayer({
      source: wmsSource,
      name: name,
      visible: true
    });

    map.addLayer(newLayer);
    currentLayerRef.current = newLayer;
    
    // Log the layer configuration
    console.log('Layer selected:', {
      name: name,
      slug: slug,
      source: wmsSource.getParams()
    });
  };

  const paginatedData = layersData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="zppi-map-container">
      <div className="layer-list">
        <div 
          className={`layer-list-header ${activeSections.layers ? 'active' : ''}`}
          onClick={() => toggleSection('layers')}
        >
          <h2>Zona Potensi Penangkapan Ikan</h2>
        </div>
        
        <div className={`layer-list-content ${activeSections.layers ? '' : 'collapsed'}`}>
          <ul>
            {paginatedData.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="radio"
                    name="layer"
                    onChange={() => handleLayerSelect(item.slug, item.name)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{item.name}</span>
                </label>
              </li>
            ))}
          </ul>
          
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              ←
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              →
            </button>
          </div>
        </div>

        <div className="info-box">
          <h3 
            className={activeSections.data ? 'active' : ''}
            onClick={() => toggleSection('data')}
          >
            Data Yang Digunakan
          </h3>
          <div className={`content ${activeSections.data ? 'active' : ''}`}>
            <ul className="list-disc">
              <li>Data satelit Terra/Aqua MODIS (resolusi spasial 1000 meter x 1000 meter; sumber: Pusat Data dan Informasi - BRIN)</li>
              <li>Data satelit SNPP VIIRS (resolusi spasial 750 meter x 750 meter; sumber: Pusat Data dan Informasi - BRIN)</li>
            </ul>
          </div>

          <h3 
            className={activeSections.method ? 'active' : ''}
            onClick={() => toggleSection('method')}
          >
            Metode Yang Digunakan
          </h3>
          <div className={`content ${activeSections.method ? 'active' : ''}`}>
            <ol className="list-decimal space-y-1">
              <li>Pengolahan data Terra/Aqua MODIS dan SNPP VIIRS menjadi data suhu permukaan laut (SPL).</li>
              <li>Kalibrasi dan reproyeksi (koreksi geometri) untuk mengatur posisi data satelit sesuai di bumi.</li>
              <li>Destriping untuk memperhalus atau menghilangkan efek garis pada data SPL.</li>
              <li>Deteksi termal front dengan metode SIED (ambang batas perbedaan suhu 0,5°C) dan hasil berupa vektor poligon.</li>
              <li>Menghitung minimum bounding rectangle dari poligon.</li>
              <li>Partisi area poligon untuk mempermudah penentuan titik pusat ZPPI.</li>
              <li>Penentuan titik pusat (koordinat) untuk setiap partisi sebagai titik informasi ZPPI.</li>
              <li>Informasi ZPPI disusun dalam peta dan tersedia dalam format pdf, kmz, shp, csv, jason, xml.</li>
              <li>Pembagian area dalam 24 Project Area (PA) untuk efektivitas distribusi informasi.</li>
              <li>Cakupan ZPPI berjarak 3,3 km dari titik, berlaku 2–3 hari ke depan.</li>
            </ol>
          </div>
        </div>
      </div>
      <div id="map" className="map-container"></div>
     

    </div>
  );
}
