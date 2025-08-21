"use client";
import React from "react";
import ModuleCard from "./ModuleCard";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";


function ModuleList() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user ? user.email : null;
  const modules = [
    {
      id: 1,
      title: "Indeks Penanaman Padi",
      subtitle: user ? "":"(Akses Memerlukan Login)",
      url: user ? "/map" : "/login",
      description:
        "Indeks Penanaman Padi dari data Satelit Sentinel-1.",
      datasets: "Sentinel-2, Landsat 8/9",
      iconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/26d491c1fe71ad3856bc02054b6aae605efec76a?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e",
    },
    {
      id:2,
      title: "Fase Pertumbuhan Padi",
      url: "/info-fase-padi",
      description:
        "Modul pemetaan geospasial yang dirancang untuk mengidentifikasi dan memetakan fase pertumbuhan tanaman padi di lahan pertanian.  Informasi yang dihasilkan berguna untuk monitoring pertanian, estimasi produksi, serta mendukung kebijakan ketahanan pangan berbasis data spasial",
      datasets: "Sentinel-1",
      iconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/18be0e4c2c7964d619cb063d3b64f0f6fad52187?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e",
    },
    {
      id: 3,
      title: "Zona Potensi Penangkapan Ikan",
      url: "/info-zppi",
      description:
        "Modul pemetaan geospasial yang digunakan untuk mengidentifikasi dan memetakan area laut yang berpotensi tinggi sebagai lokasi penangkapan ikan. Analisis dalam modul ini didasarkan pada data oseanografi seperti suhu permukaan laut, klorofil, dan arus laut yang diintegrasikan dengan data penginderaan jauh. Informasi yang dihasilkan dapat membantu nelayan dalam menentukan lokasi tangkapan yang lebih efisien, mendukung pengelolaan sumber daya perikanan yang berkelanjutan, serta meminimalkan biaya operasional dan waktu pencarian ikan di laut.",
      datasets: "Modis, VIIRS",
      iconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/18be0e4c2c7964d619cb063d3b64f0f6fad52187?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e",
    },
  ];

  return (
    <main className="module-list-container">
      <div className="module-list-content">
        <div className="module-list-header">
          <div className="module-list-title-container">
            <h1 className="module-list-title">Katalog Modul</h1>
            <p className="module-list-count">Menampilkan 4 dari 4 Data</p>
          </div>
          <button className="sort-button" aria-label="Sort modules">
            <div className="sort-icon-container">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a2d25684fe309cafbe65b192a67bfcdb5b95d7aa?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" alt="" className="sort-icon-bg" />
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9d9f953a5669181440c2456184ac219b1f7b3ca3?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" alt="" className="sort-icon" />
            </div>
            <span className="sort-label">Sortir</span>
          </button>
        </div>

        <div className="modules-container">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              subtitle={module.subtitle}
              url={module.url}
              description={module.description}
              datasets={module.datasets}
              iconUrl={module.iconUrl}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .module-list-container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 76%;
          margin-left: 20px;
        }

        @media (max-width: 991px) {
          .module-list-container {
            width: 100%;
          }
        }

        .module-list-content {
          width: 100%;
        }

        @media (max-width: 991px) {
          .module-list-content {
            max-width: 100%;
            margin-top: 38px;
          }
        }

        .module-list-header {
          display: flex;
          width: 100%;
          align-items: stretch;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        @media (max-width: 991px) {
          .module-list-header {
            max-width: 100%;
          }
        }

        .module-list-title-container {
          align-self: flex-start;
          display: flex;
          align-items: stretch;
          gap: 32px;
          flex-wrap: wrap;
        }

        .module-list-title {
          color: #000;
          text-align: center;
          font-family: "Avenir LT Std", sans-serif;
          font-size: 40px;
          font-weight: 600;
          line-height: 48px;
          letter-spacing: 4px;
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: auto;
          margin: 0;
        }

        .module-list-count {
          color: #7c7c7c;
          font-family: Lato, sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 32px;
          letter-spacing: 0px;
          align-self: flex-start;
          margin-top: 16px;
          flex-basis: auto;
          margin-bottom: 0;
        }

        .sort-button {
          border-radius: 8px;
          background-color: rgba(241, 241, 241, 1);
          border: 2px solid rgba(32, 80, 114, 1);
          display: flex;
          padding: 14px 24px;
          align-items: center;
          gap: 8px;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 991px) {
          .sort-button {
            padding: 14px 20px;
          }
        }

        .sort-icon-container {
          display: flex;
          flex-direction: column;
          align-self: stretch;
          position: relative;
          aspect-ratio: 1;
          margin-top: auto;
          margin-bottom: auto;
          width: 22px;
          overflow: hidden;
        }

        .sort-icon-bg {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }

        .sort-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 100%;
        }

        .sort-label {
          color: rgba(32, 80, 114, 1);
          font-size: 14px;
          font-family:
            Lato,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-weight: 400;
          line-height: 1.6;
          align-self: stretch;
          margin-top: auto;
          margin-bottom: auto;
        }

        .modules-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      `}</style>
    </main>
  );
}

export default ModuleList;
