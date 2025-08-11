"use client";
import React, { useState } from "react";

function FAQSection() {
  const [openSections, setOpenSections] = useState({
    general: true,
    technical: false,
    collaboration: false,
    publication: false,
  });

  const [openQuestions, setOpenQuestions] = useState({
    question1: true,
    question1_1: false,
    question2: true,
    question3: true,
  });

  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  const toggleQuestion = (question) => {
    setOpenQuestions({
      ...openQuestions,
      [question]: !openQuestions[question],
    });
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {/* General Questions Section */}
        <div className="faq-category">
          <div
            className="category-header"
            onClick={() => toggleSection("general")}
          >
            <h3 className="category-title">Apa saja fitur utama GEOMIMO?</h3>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fea64ff50ecb2cf0cd6e1a01cc32bd3b1f9077e3?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
              className="dropdown-icon"
              alt={openSections.general ? "Collapse section" : "Expand section"}
              aria-hidden="true"
            />
          </div>
          <div className="category-divider" />
        </div>

        {openSections.general && (
          <>
            <div className="faq-item">
              <p className="answer-text">
                GEOMIMO adalah suatu sistem atau platform yang mengumpulkan
                seluruh data input data spasial, statistik, maupun crowd
                sourcing yang masuk dalam suatu platform dan di dalam platform
                tersebut digunakan untuk mengolah data multi input dan
                menghasilkan beberapa produk informasi spasial (multi output)
                dan nantinya akan langsung disampaikan kepada pengguna,
              </p>
            </div>
          </>
        )}

        {/* Technical Questions Section */}
        <div className="faq-category">
          <div
            className="category-header"
            onClick={() => toggleSection("technical")}
          >
            <h3 className="category-title">
              Apakah data dan informasi GEOMIMO dapat diakses Publik?
            </h3>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/65427ead14353c1b2fba0e1c4284f62ada041930?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
              className="dropdown-icon"
              alt={
                openSections.technical ? "Collapse section" : "Expand section"
              }
              aria-hidden="true"
            />
          </div>
          <div className="category-divider" />
        </div>
        {openSections.technical && (
          <>
            <div className="faq-item">
              <p className="answer-text">
                Ya, GEOMIMO memiliki data dan informasi yang dapat diakses oleh
                Publik. Akan tetapi, GEOMIMO juga menyediakan akses khusus untuk
                kementerian/lembaga, pengusaha maupun akademisi yang memerlukan
                data dan informasi spesifik serta modul pengolahan data
                penginderaan jauh.{" "}
                <a href="#" className="link-text">
                  Pelajari seputar jenis pengguna
                </a>
                .
              </p>
            </div>
          </>
        )}

        {/* Collaboration Questions Section */}
        <div className="faq-category">
          <div
            className="category-header"
            onClick={() => toggleSection("collaboration")}
          >
            <h3 className="category-title">
              {" "}
              Apakah Perguruan Tinggi/Mahasiswa dapat melakukan permintaan data
              dan informasi penginderaan jauh melalui GEOMIMO?{" "}
            </h3>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/65427ead14353c1b2fba0e1c4284f62ada041930?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
              className="dropdown-icon"
              alt={
                openSections.collaboration
                  ? "Collapse section"
                  : "Expand section"
              }
              aria-hidden="true"
            />
          </div>
          <div className="category-divider" />
        </div>
        {openSections.collaboration && (
          <>
            <div className="faq-item">
              <p className="answer-text">
                Untuk saat ini, permintaan data dan informasi penginderaan jauh
                dapat dilakukan dengan menghubungi{" "}
                <a href="#" className="link-text">
                  Pusat Data dan Informasi BRIN
                </a>
                . Akan tetapi, pihak Perguruan Tinggi dan Mahasiswa dapat
                melihat preview data dan informasi penginderaan jauh yang
                tersedia melalui GEOMIMO.
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .faq-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .faq-container {
          width: 100%;
          padding: 0 50px 50px 0;
        }

        .faq-title {
          align-self: center;
          margin-top: 100px;
          padding: 4px;
          gap: 6px;
          font-family: "Avenir LT Std", -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 32px;
          color: #000;
          font-weight: 700;
          letter-spacing: 4px;
          line-height: 48px;
        }

        .faq-category {
          display: flex;
          margin-top: 5px;
          padding: 28px 88px 0;
          flex-direction: column;
          align-items: stretch;
          font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 24px;
          color: #202020;
          font-weight: 500;
          letter-spacing: 0px;
          line-height: 32px;
          justify-content: center;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 40px 100px;
          justify-content: space-between;
          flex-wrap: wrap;
          cursor: pointer;
        }

        .category-title {
          align-self: stretch;
          margin: auto 0;
          padding: 4px;
          gap: 6px;
          font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 24px;
          font-weight: 500;
          margin: 0;
        }

        .dropdown-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 24px;
          align-self: stretch;
          margin: auto 0;
          flex-shrink: 0;
        }

        .category-divider {
          border-color: rgba(107, 107, 107, 1);
          border-style: solid;
          border-width: 1px;
          min-height: 1px;
        }

        .faq-item {
          display: flex;
          padding: 28px 128px 0;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        }

        .question-header {
          display: flex;
          align-items: center;
          gap: 40px 100px;
          justify-content: space-between;
          flex-wrap: wrap;
          cursor: pointer;
        }

        .question-text {
          align-self: stretch;
          margin: auto 0;
          padding: 4px;
          gap: 6px;
          font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 24px;
          color: #202020;
          font-weight: 500;
          letter-spacing: 0px;
          line-height: 32px;
          margin: 0;
        }

        .dropdown-container {
          align-self: stretch;
          display: flex;
          margin: auto 0;
          padding: 9px 7px;
          flex-direction: column;
          overflow: hidden;
          align-items: flex-end;
          justify-content: center;
          width: 24px;
        }

        .question-dropdown {
          aspect-ratio: 2;
          object-fit: contain;
          object-position: center;
          width: 10px;
        }

        .answer-text {
          align-self: stretch;
          flex: 1;
          flex-shrink: 1;
          flex-basis: 0%;
          margin-top: 12px;
          width: 100%;
          font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          color: #7c7c7c;
          letter-spacing: 0px;
          line-height: 32px;
        }

        .link-text {
          text-decoration: underline;
          color: rgba(32, 80, 114, 1);
        }

        .question-divider {
          border-color: rgba(107, 107, 107, 1);
          border-style: solid;
          border-width: 1px;
          min-height: 1px;
        }

        .sub-question {
          margin-top: 20px;
          margin-left: 20px;
          border-left: 2px solid rgba(107, 107, 107, 0.3);
          padding-left: 20px;
        }

        .general-questions {
          padding: 0 88px;
        }

        @media (max-width: 991px) {
          .faq-title {
            margin-top: 40px;
          }

          .faq-category {
            padding-left: 20px;
            padding-right: 20px;
            margin-top: 40px;
          }

          .category-header {
            max-width: 100%;
          }

          .category-divider {
            max-width: 100%;
          }

          .faq-item {
            max-width: 100%;
            padding-left: 20px;
            padding-right: 20px;
          }

          .question-header {
            max-width: 100%;
          }

          .question-text {
            max-width: 100%;
          }

          .answer-text {
            max-width: 100%;
          }

          .question-divider {
            max-width: 100%;
          }

          .general-questions {
            padding: 0 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default FAQSection;
