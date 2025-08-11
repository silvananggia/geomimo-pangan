import React from "react";


function FeaturesSection() {
  const features = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/aa69db0c234e855b632de3ccbc89822ed00e274d?placeholderIfAbsent=true",
      title: "Inklusif",
      description:
        "GEOMIMO dirancang sebagai platform yang inklusif dan dapat diakses oleh publik luas, mencerminkan komitmen kami terhadap keterbukaan data dan kolaborasi lintas sektor.",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/a3f812a6f66fe09fefd43217474f433212d8b003?placeholderIfAbsent=true",
      title: "Fleksibel",
      description:
        "Data geospasial GEOMIMO memiliki skala waktu yang bervariasi, mulai dari harian, bulanan hingga tahunan. Fleksibilitas ini sangat penting untuk analisis tren jangka pendek dan panjang.",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/04f37908087fdd84acb7394d57aadf90cfe13916?placeholderIfAbsent=true",
      title: "Aplikatif",
      description:
        "GEOMIMO menyediakan integrasi modul riset yang dapat diterapkan secara langsung, memungkinkan pengguna untuk mendapatkan output yang bersifat aplikatif, tanpa harus memahami algoritma teknis secara mendalam.",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/715d568cfccfaca8dedc2715286c6a22fde4406b?placeholderIfAbsent=true",
      title: "Portabel",
      description:
        "GEOMIMO memungkinkan pengguna untuk mengunduh hasil dari penerapan modul ke dalam data lokal. Memberikan keleluasaan untuk analisis lanjutan atau integrasi ke dalam sistem masing-masing pengguna.",
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">
        <span className="title-part1">GEOMIMO</span>{" "}
        <span className="title-part2">Hadir Untuk Mendukung Perkembangan Riset Penginderaan Jauh</span>
      </h2>
      
      <div className="features-container">
        {features.map((feature, index) => (
          <article key={index} className="feature-card">
            <img
              src={feature.image}
              alt={`Feature ${index + 1}`}
              className="feature-image"
            />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </article>
        ))}
      </div>
      <style jsx>{`
        .features-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 0;
        }

        .features-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .title-part1 {
        
          font-weight: bold;
          font-size: 36px;
                    font-size: 40px;
          text-align: center;
          background: linear-gradient(90deg, #32909c 0%, #81883a 35.48%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
       
        }

        .title-part2 {
          color: #202020;
          font-size: 24px;
          font-weight: normal;
        }

        .features-container {
          display: flex;
          gap: 72px;
          margin-top: 40px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 240px;
        }

        .feature-image {
          width: auto;
          height: auto;
          max-width: 100%;
        }

        .feature-title {
          font-size: 24px;
          font-weight: 600;
          color: #202020;
          margin: 10px 0;
          text-align: center;
        }

        .feature-description {
          font-family: "Lato", sans-serif;
          font-size: 16px;
          color: #7c7c7c;
          text-align: center;
          margin: 0;
        }

        @media (max-width: 991px) {
          .features-container {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 640px) {
          .features-container {
            gap: 40px;
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturesSection;
