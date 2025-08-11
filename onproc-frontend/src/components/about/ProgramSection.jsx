import React from "react";

function ProgramSection() {
  return (
    <section className="program-section">
      <h2 className="program-title">
        <span>Program GEOMIMO</span>
      </h2>
      <p className="program-description">
        GEOMIMO merupakan sebuah sistem yang dibangun sebagai hasil kerjasama
        antara Pusat Riset Geoinformatika dan Pusat Riset Sains Data dan
        Informasi , yang berada dibawah naungan Organisasi Riset Elektronika dan
        Informatika, BRIN. Kami terdiri atas peneliti dan perekayasa yang
        bertujuan untuk memanfaatkan teknologi penginderaan jauh untuk menangani
        permasalahan kompleks di bidang kebumian dengan data yang besar.
      </p>
      <p className="program-links">
        <span>Pelajari lebih lanjut tentang</span>
        <a href="https://brin.go.id/orei/pusat-riset-geoinformatika/page/beranda-2" className="program-link">
          Pusat Riset Geoinformatika
        </a>
        <span>dan</span>
        <a href="https://brin.go.id/orei/pusat-riset-sains-data-dan-informasi/page/selamat-datang-4" className="program-link">
          Pusat Riset Sains Data dan Informasi
        </a>
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
          font-size: 36px;
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
          font-size: 24px;
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
