"use client";
import * as React from "react";

function SocialMedia() {
  return (
    <section className="social-section">
      <h2 className="social-title">Tetap Ikuti Aktivitas Kami</h2>

      <div className="social-links">
        <div className="social-item">
          <a href="#" className="social-button">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/07341618134022baa7e3b382ee6bdb9650e593a8?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
              className="social-icon"
              alt="YouTube icon"
            />
            <span className="social-name">Youtube</span>
          </a>
        </div>

        <div className="social-item">
          <a href="#" className="social-button">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4df916f50b2903c9226c49281d6922f444023821?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
              className="social-icon"
              alt="Instagram icon"
            />
            <span className="social-name">Instagram</span>
          </a>
        </div>
        <div className="social-item">
          <a href="#" className="social-button">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca95d20c-e65c-4af0-a405-0a9a78d04e57?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
              className="social-icon"
              alt="Facebook icon"
            />
            <span className="social-name">Facebook</span>
          </a>
        </div>
        <div className="social-item">
          <a href="#" className="social-button">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1199db3d-cc55-451d-bc02-8e00ab3557a9?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
              className="social-icon"
              alt="Twitter icon"
            />
            <span className="social-name">X/Twitter</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .social-section {
          margin-top: 20px;
        }
        .social-title {
          align-self: center;
          margin-top: 72px;
          padding: 4px;
          gap: 6px;
          font-family: "Avenir LT Std", sans-serif;
          font-size: 36px;
          color: #202020;
          font-weight: 600;
          letter-spacing: 4px;
          line-height: 48px;
          text-align: center;
        }
        @media (max-width: 991px) {
          .social-title {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .social-links {
          align-self: center;
          display: flex;
          padding: 0 150px 0 150px;
          align-items: stretch;
          gap: 40px 86px;
          font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
          font-weight: 400;
          white-space: nowrap;
          line-height: 1.6;
          flex-wrap: wrap;
        }
        @media (max-width: 991px) {
          .social-links {
            max-width: 100%;
            white-space: initial;
          }
        }
        .social-item {
          padding-bottom: 16px;
          flex: 1;
        }
        @media (max-width: 991px) {
          .social-item {
            white-space: initial;
          }
        }
        .social-button {
          border-radius: 8px;
          background-color: rgba(241, 241, 241, 1);
          border: 2px solid rgba(32, 32, 32, 1);
          display: flex;
          padding: 16px 32px;
          align-items: center;
          gap: 10px;
          justify-content: center;
          text-decoration: none;
          color: inherit;
          flex: 1;
        }
        @media (max-width: 991px) {
          .social-button {
            padding: 16px 20px;
            white-space: initial;
          }
        }
        .social-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 26px;
          align-self: stretch;
          margin: auto 0;
          flex-shrink: 0;
        }
        .social-name {
          align-self: stretch;
          margin: auto 0;
        }
        .social-badge {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 26px;
          z-index: 10;
          margin-top: -42px;
          margin-left: 42px;
        }
        @media (max-width: 991px) {
          .social-badge {
            margin-left: 10px;
          }
        }
      `}</style>
    </section>
  );
}

export default SocialMedia;
