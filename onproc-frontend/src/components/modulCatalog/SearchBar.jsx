"use client";
import React from "react";

function SearchBar() {
  return (
    <section className="search-section" aria-label="Search modules">
      <div className="search-container">
        <div className="search-field">
          <div className="search-input-wrapper">
            <div className="search-icon-container">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff304e6de55c7504ab5ca64e02d1cc4ac7d87ce3?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" alt="" className="search-icon-bg" />
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e12f6fc1d5e24425d7384a1af0601d07b51f5036?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" alt="" className="search-icon" />
            </div>
            <input
              type="text"
              placeholder="Cari data"
              className="search-input"
            />
          </div>
        </div>
        <button className="search-button">Cari</button>
      </div>

      <style jsx>{`
        .search-section {
          margin-bottom: 40px;
        }

        .search-container {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media (max-width: 991px) {
          .search-container {
            max-width: 100%;
          }
        }

        .search-field {
          min-height: 58px;
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: 0;
          width: fit-content;
        }

        @media (max-width: 991px) {
          .search-field {
            max-width: 100%;
          }
        }

        .search-input-wrapper {
          border-radius: 4px;
          border: 1px solid rgba(32, 32, 32, 1);
          display: flex;
          width: 100%;
          align-items: center;
          gap: 12px;
          justify-content: center;
          flex: 1;
          flex-wrap: wrap;
          height: 58px;
        }

        @media (max-width: 991px) {
          .search-input-wrapper {
            max-width: 100%;
          }
        }

        .search-icon-container {
          display: flex;
          flex-direction: column;
          align-self: stretch;
          position: relative;
          aspect-ratio: 1;
          margin-top: auto;
          margin-bottom: auto;
          width: 24px;
          padding: 1px;
          overflow: hidden;
          align-items: center;
          height: 24px;
        }

        .search-icon-bg {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }

        .search-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 100%;
        }

        .search-input {
          align-self: stretch;
          min-width: 240px;
          margin-top: auto;
          margin-bottom: auto;
          gap: 40px 80px;
          font-family: Lato, sans-serif;
          font-size: 16px;
          color: #7c7c7c;
          font-weight: 500;
          letter-spacing: 0px;
          line-height: 32px;
          flex: 1;
          flex-shrink: 1;
          flex-basis: 0%;
          border: none;
          outline: none;
          background: transparent;
        }

        @media (max-width: 991px) {
          .search-input {
            max-width: 100%;
          }
        }

        .search-button {
          align-self: stretch;
          border-radius: 8px;
          background-color: rgba(32, 80, 114, 1);
          padding: 0 32px;
          height: 58px;
          gap: 10px;
          font-family:
            Lato,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 16px;
          color: rgba(241, 241, 241, 1);
          font-weight: 400;
          white-space: nowrap;
          line-height: 1.6;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 991px) {
          .search-button {
            padding: 16px 20px;
            white-space: initial;
          }
        }
      `}</style>
    </section>
  );
}

export default SearchBar;
