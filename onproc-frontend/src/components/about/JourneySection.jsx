import React from "react";
import Card from "./Card";

function JourneySection() {
  return (
    <section className="journey-section">
      <h2 className="journey-title">
        <span>Perjalanan GEOMIMO</span>
      </h2>
      <div className="journey-cards">
        <Card
          title="Newsroom"
          description="Baca liputan terbaru seputar GEOMIMO seputar data dan informasi geospasial dan pelatihan penggunaan teknologi penginderaan jauh"
          actionText="Pelajari Lebih Lanjut"
        />
        <Card
          title="Impact"
          description="Pelajari bagaimana data dan informasi geospasial GEOMIMO berpengaruh dalam kehidupan"
          actionText="Pelajari Lebih Lanjut"
        />
      </div>
      <style jsx>{`
        .journey-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }
        .journey-title {
          font-family: "Avenir LT Std", sans-serif;
          font-size: 36px;
          line-height: 48px;
          font-weight: 600;
          background: linear-gradient(90deg, #81883a 0%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          display: flex;
          flex-direction: column;
          align : center;
        }
        .journey-cards {
          display: flex;
          justify-content: space-between;
          width: 100%;
          gap: 40px;
          margin-left : 20px;
        }
        @media (max-width: 991px) {
          .journey-section {
            align-items: center;
          }
          .journey-cards {
            flex-direction: column;
            align-items: center;
          }
        }
        @media (max-width: 640px) {
          .journey-section {
            padding: 0 16px;
          }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;
