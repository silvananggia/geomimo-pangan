import React from "react";
import Header from "../layouts/Header";

function InfoHotspot() {
  return (
    <main className="info-page">
      <Header />
      <iframe 
        src="http://geomimo-prototype.brin.go.id/catalogue/#/dashboard/35"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
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
