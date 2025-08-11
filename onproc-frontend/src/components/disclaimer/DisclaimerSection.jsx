"use client";
import React from "react";

function DisclaimerSection({ id, title, content }) {
  return (
    <section
      id={id}
      className="disclaimer-section"
      aria-labelledby={`section-title-${id}`}
    >
      <h2 id={`section-title-${id}`} className="section-title">
        {title}
      </h2>
      <div className="section-content">
        {content.map((paragraph, index) =>
          typeof paragraph === "string" ? (
            <p key={index} className="content-paragraph">
              {paragraph}
            </p>
          ) : (
            React.cloneElement(paragraph, {
              key: index,
              className: "content-paragraph",
            })
          ),
        )}
      </div>

      <style jsx>{`
        .disclaimer-section {
          margin-top: 30px;
          width: 100%;
          padding: 0 40px;
          margin-bottom: 30px;
          
        }

        .section-title {
          color: #205072;
          font-family: "Avenir LT Std", sans-serif;
          font-size: 32px;
          font-weight: 600;
          line-height: 36px;
          letter-spacing: 4px;
          margin: 0;
        }

        .section-content {
          color: #202020;
          font-family: Lato, sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 32px;
          letter-spacing: 0px;
          margin-top: 16px;
        }

        .content-paragraph {
          margin: 0 0 8px 0;
        }

        .content-paragraph:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 991px) {
          .disclaimer-section {
            max-width: 100%;
            margin-top: 40px;
          }

          .section-title {
            max-width: 100%;
          }

          .section-content {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default DisclaimerSection;
