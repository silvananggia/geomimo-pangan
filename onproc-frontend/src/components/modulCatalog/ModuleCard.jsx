"use client";
import React from "react";

function ModuleCard({ title, subtitle, url, description, datasets, iconUrl }) {
  return (
    <article className="module-card">      <a href={url} >

      <div className="module-content">

        <div className="module-info">
          <div className="module-text">
            <h2 className="module-title">{title}</h2>
            <p className="module-description">{subtitle}</p>
            <p className="module-description">{description}</p>
          </div>
          <div className="module-datasets">
            <img src={iconUrl} alt="Dataset icon" className="dataset-icon" />
            <span className="dataset-list">{datasets}</span>
          </div>
        </div>

      </div>
      </a>
      <div className="module-divider" aria-hidden="true" />

      <style jsx>{`
        .module-card {
          margin-top: 38px;
          width: 100%;
          font-family: Lato, sans-serif;
          text-decoration: none;
        }

        @media (max-width: 991px) {
          .module-card {
            max-width: 100%;
          }
        }

        .module-content {
          display: flex;
          width: 100%;
          align-items: flex-start;
          gap: 40px 128px;
          justify-content: flex-start;
          flex-wrap: wrap;
          text-decoration: none;
        }

        @media (max-width: 991px) {
          .module-content {
            max-width: 100%;
          }
        }

        .module-info {
          min-width: 240px;
          flex-grow: 1;
          flex-shrink: 1;
          width: 594px;
           text-decoration: none;
        }

        @media (max-width: 991px) {
          .module-info {
            max-width: 100%;
          }
        }

        .module-text {
          width: 100%;
        }

        .module-title {
          color: #202020;
          font-size: 24px;
          font-weight: 500;
          line-height: 32px;
          letter-spacing: 0px;
          margin: 0;
text-decoration: none;
        }
        .module-card a {
          text-decoration: none; // Add this line to remove text decoration
        }
        @media (max-width: 991px) {
          .module-title {
            max-width: 100%;
          }
        }

        .module-description {
          color: #7c7c7c;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          letter-spacing: 0px;
          margin-top: 12px;
          margin-bottom: 0;
           text-decoration: none;
        }

        @media (max-width: 991px) {
          .module-description {
            max-width: 100%;
          }
        }

        .module-datasets {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: #202020;
          font-weight: 400;
          letter-spacing: 0px;
          line-height: 24px;
          justify-content: flex-start;
          margin-top: 16px;
        }

        .dataset-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 24px;
          align-self: stretch;
          margin-top: auto;
          margin-bottom: auto;
          flex-shrink: 0;
        }

        .dataset-list {
          align-self: stretch;
          margin-top: auto;
          margin-bottom: auto;
          width: 200px;
        }

        .module-divider {
          border: 1px solid rgba(0, 0, 0, 1);
          min-height: 0px;
          margin-top: 40px;
          width: 100%;
        }

        @media (max-width: 991px) {
          .module-divider {
            max-width: 100%;
          }
        }
      `}</style>
    </article>
  );
}

export default ModuleCard;
