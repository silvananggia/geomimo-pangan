"use client";
import React from "react";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";

import Map from "./MapComponent";

function AboutUsPage() {
  return (
    <div className="about-page">
      <Header />
      
      <main className="main-content">
        <Map />
      </main>
      
      <style jsx>{`

        .main-content {
         
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 72px;
        }
        @media (max-width: 991px) {
          .main-content {
            padding: 20px;
          }
        }
        @media (max-width: 640px) {
          .main-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default AboutUsPage;
