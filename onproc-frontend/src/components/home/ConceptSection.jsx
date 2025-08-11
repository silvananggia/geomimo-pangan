import React from "react";

function ConceptSection() {
  return (
    <section className="concept-section">
      <h2 className="concept-title">
        <span>Konsep</span>
         <span>  GEOMIMO</span>
      </h2>
      <p className="concept-description">
        Kami menggambarkan konsep untuk memungkinkan banyak data dapat
        dimasukkan dalam satu mesin yang dilengkapi dengan berbagai plugin yang
        terspesialisasikan. Setiap plugin ini dirancang untuk menghasilkan
        output yang beragam, disebut sebagai multi output
      </p>
      <style jsx>{`
        .concept-section {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left:  20px;
        }
        .concept-title {
          font-family: "Avenir LT Std", sans-serif;
          font-size: 36px;
          line-height: 48px;
          font-weight: 600;
          background: linear-gradient(90deg, #32909c 0%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        .concept-description {
          font-family: "Lato", sans-serif;
          font-size: 24px;
          line-height: 32px;
          font-weight: 500;
          color: #202020;
          width: 880px;
          margin: 0;
        }
        @media (max-width: 991px) {
          .concept-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .concept-description {
            width: 100%;
          }
        }
        @media (max-width: 640px) {
          .concept-section {
            padding: 0 16px;
          }
        }
      `}</style>
    </section>
  );
}

export default ConceptSection;
