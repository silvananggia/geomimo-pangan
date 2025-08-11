import React from "react";


function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">GEOMIMO</h1>
        <p className="hero-description">
          GEOMIMO menyediakan berbagai data satelit penginderaan jauh dan
          geospasial (multi-input) kemudian diolah dan dianalisis secara otomatis
          untuk menghasilkan berbagai informasi (multi-output)
        </p>
        <a href="/katalog-modul" className="hero-button">
          Mulai Jelajahi GEOMIMO
        </a>
      </div>
      <div className="hero-background"></div>
      <style jsx>{`
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 200px;
          position: relative;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background-image: url("https://cdn.builder.io/api/v1/image/assets/TEMP/cd6846bc90e376537ad687564e5f05e67e492aa2?placeholderIfAbsent=true");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          width: 1080px;
          height: 100%;
          z-index: 1;
        }

        .hero-title {
          font-size: 88px;
          font-weight: 700;
          letter-spacing: 28.16px;
          background: linear-gradient(90deg, #205072 0%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          margin-top: -100px;
        }

        .hero-description {
          font-family: "Lato", sans-serif;
          font-size: 24px;
          color: #7c7c7c;
          text-align: center;
          margin: 10px 0;
          max-width: 1080px;
          
        }

        .hero-button {
          font-family: "Lato", sans-serif;
          color: #f1f1f1;
          padding: 20px 40px;
          border-radius: 8px;
          font-size: 20px;
          cursor: pointer;
          background-color: #205072;
          text-decoration: none;
          display: inline-block;
        }

        @media (max-width: 991px) {
          .hero-section {
            padding: 200px 0;
            background-attachment: scroll;
          }
          .hero-title {
            font-size: 64px;
          }
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 150px 0;
          }
          .hero-title {
            font-size: 48px;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;