"use client";
import * as React from "react";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import IntroSection from "./IntroSection";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./AddressInfo";
import SocialMedia from "./SocialMedia";
import Footer from "../layouts/Footer";

function ProtoKontak() {
  return (
    <main className="proto-kontak">
      <Header />
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          {
            label: "Kontak",
            url: "/kontak",
            active: true,
          },
        ]}
      />
      <IntroSection />
      <ContactInfo />
      <AddressInfo />
      <SocialMedia />
      <Footer />

      <style jsx>{`
        .proto-kontak {
          background-color: rgba(255, 255, 255, 1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          align-items: stretch;
        }
      `}</style>
    </main>
  );
}

export default ProtoKontak;
