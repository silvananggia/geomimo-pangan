import React from "react";
import Card from "./Card";
import zppiImage from "../../assets/images/thumb/zppi.png";
import indeksPertanamanImage from "../../assets/images/thumb/indeks_pertanaman.png";
import rawanSawahImage from "../../assets/images/thumb/rawan_sawah.png";

function JourneySection() {
  return (
    <section className="journey-section">
      <h2 className="journey-title">
        <span>Modul & Informasi GEOMIMO Pangan</span>
      </h2>
      <div className="journey-cards">
        <Card
          title="Indeks Pertanaman"
          description="Analisis kondisi pertanaman padi berdasarkan data penginderaan jauh untuk monitoring fase pertumbuhan dan estimasi produktivitas"
          actionText="Pelajari Lebih Lanjut"
          actionHref="/maps"
          image={indeksPertanamanImage}
        />
        <Card
          title="Rawan Banjir dan Kering Lahan Sawah"
          description="Informasi Rawan Banjir dan Kering Lahan Sawah merupakan informasi spasial yang diperoleh dari hasil ekstraksi citra Terra-MODIS"
          actionText="Pelajari Lebih Lanjut"
           actionHref="/info-rawan-sawah"
           image={rawanSawahImage}
        />
        <Card
          title="Zona Potensi Penangkapan Ikan"
          description="Identifikasi area potensial penangkapan ikan berdasarkan analisis data oseanografi dan karakteristik perairan menggunakan teknologi penginderaan jauh"
          actionText="Pelajari Lebih Lanjut"
          actionHref="/info-zppi"
          image={zppiImage}
        />
                <Card
          title="Tuna Finder"
          description="Sistem pelacakan dan prediksi lokasi tuna berdasarkan analisis suhu permukaan laut, klorofil, dan arus laut menggunakan data satelit"
          actionText="Pelajari Lebih Lanjut"
           actionHref="/info-zppi"
            image={zppiImage}
          />        
      </div>
      <style jsx>{`
        .journey-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
          margin: 0 20px 0 20px;
        }
        .journey-title {
          font-family: "Avenir LT Std", sans-serif;
          font-size: 24px;
          line-height: 48px;
          font-weight: 600;
          background: linear-gradient(90deg, #81883a 0%, #32c596 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          display: flex;
          flex-direction: column;
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
