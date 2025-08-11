import React from "react";
import Header from "../../layouts/Header";
import RawanSawahMap from "./RawanSawahMap";

function InfoZPPI() {
  return (
    <main className="info-page">
      <Header />
     <RawanSawahMap />
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

export default InfoZPPI;
