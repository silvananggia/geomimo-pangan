import React from "react";

function ProgramSection() {
  return (
    <section className="program-section">
      <h2 className="program-title">
        <span>GEOMIMO</span>
      </h2>
      <p className="program-description">
        GEOMIMO menyediakan berbagai data satelit penginderaan jauh dan geospasial (multi-input) kemudian diolah dan dianalisis secara otomatis untuk menghasilkan berbagai informasi (multi-output)
      </p>
      
      <style jsx>{`
        .program-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
          margin: 0 20px 0 20px;
        }

        .program-title {
          font-family: "Avenir LT Std", sans-serif;
          font-size: 24px;
          line-height: 48px;
          font-weight: 600;
          background: linear-gradient(90deg, #205072 0%, #32909c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        .program-description {
          font-family: "Lato", sans-serif;
          font-size: 20px;
          line-height: 32px;
          font-weight: 500;
          color: #202020;
          margin: 0;
        }
        .program-links {
          font-family: "Lato", sans-serif;
          font-size: 24px;
          line-height: 32px;
          font-weight: 500;
          color: #205072;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .program-link {
          color: #205072;
          text-decoration: underline;
        }
        @media (max-width: 991px) {
          .program-section {
            align-items: center;
          }
        }
        @media (max-width: 640px) {
          .program-section {
            padding: 0 16px;
          }
        }
      `}</style>
    </section>
  );
}

export default ProgramSection;
