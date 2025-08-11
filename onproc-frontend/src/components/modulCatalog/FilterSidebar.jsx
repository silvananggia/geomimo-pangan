"use client";
import React from "react";

function FilterSidebar() {
  return (
    <aside className="filter-sidebar" aria-label="Filter options">
      <div className="filter-container">
        <div className="filter-header">
          <h2 className="filter-title">Filter</h2>
          <div className="filter-category">
            <div className="filter-dropdown">
              <span className="filter-label">Dataset</span>
              <button
                className="filter-toggle"
                aria-expanded="false"
                aria-controls="dataset-options"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/211c5b6dcc11286e3f6faed74ef30165db111365?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
                  alt="Toggle dataset options"
                  className="filter-icon"
                />
              </button>
            </div>
            <div className="filter-divider" />
          </div>
        </div>
        <div className="filter-separator" aria-hidden="true" />
      </div>

      <style jsx>{`
        .filter-sidebar {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 24%;
          margin-left: 0px;
        }

        @media (max-width: 991px) {
          .filter-sidebar {
            width: 100%;
          }
        }

        .filter-container {
          display: flex;
          align-items: stretch;
          gap: 16px;
          font-family: Lato, sans-serif;
          font-size: 24px;
          color: #202020;
          font-weight: 500;
          white-space: nowrap;
          letter-spacing: 0px;
          line-height: 32px;
        }

        @media (max-width: 991px) {
          .filter-container {
            margin-top: 38px;
            white-space: initial;
          }
        }

        .filter-header {
          align-self: flex-start;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: 0;
          width: fit-content;
        }

        @media (max-width: 991px) {
          .filter-header {
            white-space: initial;
          }
        }

        .filter-title {
          align-self: flex-start;
          margin: 0;
          font-size: 24px;
          font-weight: 500;
        }

        .filter-category {
          margin-top: 12px;
          width: 100%;
        }

        @media (max-width: 991px) {
          .filter-category {
            white-space: initial;
          }
        }

        .filter-dropdown {
          display: flex;
          width: 100%;
          padding: 16px 8px;
          align-items: center;
          gap: 40px 100px;
          justify-content: space-between;
        }

        @media (max-width: 991px) {
          .filter-dropdown {
            white-space: initial;
          }
        }

        .filter-label {
          align-self: stretch;
          margin-top: auto;
          margin-bottom: auto;
          padding: 4px;
          gap: 6px;
        }

        @media (max-width: 991px) {
          .filter-label {
            white-space: initial;
          }
        }

        .filter-toggle {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .filter-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 24px;
          align-self: stretch;
          margin-top: auto;
          margin-bottom: auto;
          flex-shrink: 0;
        }

        .filter-divider {
          border: 1px solid rgba(32, 32, 32, 1);
          min-height: 1px;
          width: 100%;
        }

        .filter-separator {
          border: 1px solid rgba(0, 0, 0, 1);
          width: 1px;
          flex-shrink: 0;
          height: 617px;
        }
      `}</style>
    </aside>
  );
}

export default FilterSidebar;
