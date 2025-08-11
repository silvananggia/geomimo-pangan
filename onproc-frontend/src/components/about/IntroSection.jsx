import React from "react";

function IntroSection() {
  return (
    <section className="intro-section">
      <div className="intro-content">
        <h1 className="intro-title">Tentang Kami</h1>
        <p className="intro-description">
          Misi kami adalah menjadikan geoinformatika sebagai jembatan yang
          menghubungkan Sains, Bumi, dan Antariksa untuk Masa Depan
        </p>
      </div>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c49a09b0b2c61d0160989ce5be964e646c734b5e?placeholderIfAbsent=true" alt="Group Image" className="intro-image" />
      <style jsx>{`
        .intro-section {
          display: flex;
          align-items: center;
          gap: 40px;
          width: 100%;
          background-color: #32909c;
        }
          
        .intro-content {
          color: #f1f1f1;
          font-family: "Avenir LT Std", sans-serif;
          margin-left: 20px;
          flex: 1;
        }
        .intro-title {
          font-size: 36px;
          margin: 0 0 16px 0;
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
        }
      `}</style>
    </section>
  );
}

export default IntroSection;
