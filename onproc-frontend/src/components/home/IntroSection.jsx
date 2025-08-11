import React from "react";
import sawahImage from "../../assets/images/banner/sawah.png";

function IntroSection() {
  return (
    <section className="intro-section">
      <div className="intro-content">
        <h1 className="intro-title">
          Geomimo Ketahanan Pangan
        </h1>
        <div className="intro-tagline">
          Peta, Data, dan Analisis Geospasial untuk Ketahanan Pangan Indonesia
        </div>
        <p className="intro-description">
          Platform informasi geografis untuk membantu pengambilan keputusan di sektor pangan.
        </p>
      </div>
      <img src={sawahImage} alt="Group Image" className="intro-image" />
      <style jsx>{`
        .intro-section {
          display: flex;
          align-items: center;
          gap: 40px;
          width: 100%;
          background-color:rgb(46, 83, 37);
        }
        .intro-content {
          color: #f1f1f1;
          font-family: "Avenir LT Std", sans-serif;
          margin-left: 20px;
          flex: 1;
        }
        .intro-title {
          font-size: 44px;
          margin: 0 0 8px 0;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .highlight {
          color: #ffeb3b;
          background: linear-gradient(90deg, #ffeb3b 60%, #fffde4 100%);
          padding: 0 8px;
          border-radius: 6px;
        }
        .intro-tagline {
          font-size: 20px;
          font-weight: 600;
          color: #b6e388;
          margin-bottom: 16px;
          border-left: 4px solid #ffeb3b;
          padding-left: 12px;
        }
        .intro-description {
          font-family: "Lato", sans-serif;
          font-size: 16px;
          margin: 0;
        }
        .intro-image {
          width: auto;
          height: 350px;
          margin-left: auto;
        }
        @media (max-width: 991px) {
          .intro-section {
            flex-direction: column;
          }
          .intro-image {
            width: 100%;
            height: auto;
            margin-left: 0;
          }
        }
        @media (max-width: 640px) {
          .intro-section {
            padding: 40px 16px;
          }
          .intro-title {
            font-size: 32px;
          }
          .intro-tagline {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}

export default IntroSection;
