"use client";
import React from "react";

function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="breadcrumb-separator" aria-hidden="true">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1a88b8d1141781b44c997bcf4caacdccc9c11832?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" alt="" className="separator-icon" />
              </li>
            )}
            <li className="breadcrumb-item">
              {item.active ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a href={item.url} className="breadcrumb-link">
                  {item.label}
                </a>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>

      <style jsx>{`
        .breadcrumb {
          align-self: flex-start;
          display: flex;
          margin: 20px 40px 20px 20px;
          align-items: center;
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          gap: 32px;
          font-family: Lato, sans-serif;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0px;
          line-height: 24px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
        }

        .breadcrumb-link {
          color: #205072;
          text-decoration: none;
        }

        .breadcrumb-current {
          color: #7c7c7c;
        }

        .breadcrumb-separator {
          display: flex;
          align-items: center;
        }

        .separator-icon {
          aspect-ratio: 0.5;
          object-fit: contain;
          object-position: center;
          width: 12px;
        }

        @media (max-width: 991px) {
          .breadcrumb {
            margin-left: 10px;
            margin-top: 40px;
          }
        }
      `}</style>
    </nav>
  );
}

export default Breadcrumb;
