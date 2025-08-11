"use client";
import React from "react";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import IntroSection from "./IntroSection";
import ProgramSection from "./ProgramSection";
import ConceptSection from "./ConceptSection";
import JourneySection from "./JourneySection";
import Footer from "../layouts/Footer";

function AboutUsPage() {
  return (
    <div className="about-page">
      <Header />
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          {
            label: "Tentang Kami",
            url: "/tentang",
            active: true,
          },
        ]}
      />
      <main className="main-content">
        <IntroSection />
        <ProgramSection />
        <ConceptSection />
        <JourneySection />
      </main>
      <Footer />
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
