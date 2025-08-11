import React from "react";
import Header from "../../layouts/Header";
import HotspotMap from "./HotspotMap";

function InfoHotspot() {
  return (
    <main className="info-page">
      <Header />
     <HotspotMap />
      <style jsx>{`
        .info-page {
          background-color: #ffffff;
          flex-direction: column;
          overflow: hidden;
          align-items: center;
          width: 100%;
          height: 100vh;
        }
      `}</style>
    </main>
  );
}

export default InfoHotspot;
