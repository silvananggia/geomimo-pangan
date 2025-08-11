import React from "react";
import Header from "../layouts/Header";

function InfoFasePadi() {
  return (
    <main className="info-page">
      <Header />
      <iframe 
        src="https://ee-dededirgahayu11.projects.earthengine.app/view/olahs1siscrop"
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

export default InfoFasePadi;
