"use client";
import * as React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import CatalogSection from "./CatalogSection";
import FeaturesSection from "./FeaturesSection";
import FaqSection from "./FaqSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";


function GeoMimoLandingPage() {
  

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Avenir+LT+Std:wght@400;700&family=Lato:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <main className="landing-page">
        <Header />
        <HeroSection />
        <CatalogSection />
        <FeaturesSection />
        <FaqSection/>
        <CtaSection />
        <Footer />
      </main>
      <style jsx>{`
        .landing-page {
          max-width: none;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
          font-family: "Avenir LT Std", sans-serif;
          background-color: #f1f1f1;
        }


        @media (max-width: 991px) {
          .landing-page {
            max-width: 991px;
          }

          .faq-item {
            width: 90%;
          }
        }

        @media (max-width: 640px) {
          .landing-page {
            max-width: 640px;
          }

          .faq-item {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}




export default GeoMimoLandingPage;
