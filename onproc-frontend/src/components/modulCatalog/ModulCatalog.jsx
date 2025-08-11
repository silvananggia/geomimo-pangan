"use client";
import React from "react";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSidebar";
import ModuleList from "./ModuleList";
import Footer from "../layouts/Footer";

function ModulCatalog() {
  return (
    <div className="catalog-container">
      <Header />
      <main className="catalog-main">
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          {
            label: "Katalog Modul",
            url: "/katalog-modul",
            active: true,
          },
        ]}
      />
        <SearchBar />
        <section
          className="catalog-content"
          aria-label="Module catalog content"
        >
          <div className="catalog-layout">
            <FilterSidebar />
            <ModuleList />
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .catalog-container {
          background-color: rgba(255, 255, 255, 1);
          overflow: hidden;
        }

        .catalog-main {
          display: flex;
          padding: 0 40px 40px 40px;
          flex-direction: column;
          align-items: stretch;
        }

        @media (max-width: 991px) {
          .catalog-main {
          
            padding: 0 20px;
          }
        }

        .catalog-content {
          margin-top: 64px;
        }

        @media (max-width: 991px) {
          .catalog-content {
            margin-top: 40px;
          }
        }

        .catalog-layout {
          gap: 20px;
          display: flex;
        }

        @media (max-width: 991px) {
          .catalog-layout {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
      `}</style>
    </div>
  );
}

export default ModulCatalog;
