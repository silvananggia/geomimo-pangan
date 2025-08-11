import React from "react";



function CtaSection() {
  return (
    <section className="cta-section">
      <h2 className="cta-title">Siap Untuk Mencoba GEOMIMO?</h2>
      <p className="cta-description">
        Mulai jelajahi GEOMIMO atau hubungi kami untuk informasi lebih lanjut
      </p>
      <div className="cta-buttons">
        <a href="/kontak" className="cta-button-primary">
          Hubungi Kami
        </a>
        <a href="/katalog-modul" className="cta-button-secondary">
          Jelajahi GEOMIMO
        </a>
      </div>
      <style jsx>{`
        .cta-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 0;
          background-image: url("https://cdn.builder.io/api/v1/image/assets/TEMP/4f5e1d623f818fd5ff76ee12827605d1c549c146?placeholderIfAbsent=true");
          background-size: cover;
          background-position: center;
        }

        .cta-title {
          font-size: 48px;
          font-weight: 700;
          text-align: center;
          background: linear-gradient(90deg, #81883a 62.63%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .cta-description {
          font-family: "Lato", sans-serif;
          font-size: 24px;
          color: #f1f1f1;
          text-align: center;
          margin: 20px 0;
          max-width: 700px;
          padding: 0 20px;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .cta-button-primary {
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          color: #f1f1f1;
          background-color: #32909c;
          text-decoration: none;
        }

        .cta-button-secondary {
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          border: 2px solid #205072;
          color: #202020;
          background-color: #f1f1f1;
          text-decoration: none;
        }

        @media (max-width: 991px) {
          .cta-title {
            font-size: 36px;
          }

          .cta-description {
            font-size: 20px;
          }
        }

        @media (max-width: 640px) {
          .cta-title {
            font-size: 28px;
          }

          .cta-description {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}

export default CtaSection;
