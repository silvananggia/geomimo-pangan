import React from "react";




function Footer() {
  const footerLinks = [
    "Daftar GEOMIMO",
    "Kontak",
    "Katalog GEOMIMO",
    "Modul Katalog",
    "Data Inderaja",
    "Pernyataan Penafian",
    "Tentang Kami",
    "Badan Riset dan Inovasi Nasional (BRIN)",
    "Organisasi Riset Elektronika dan Informatika (OREI)",
    "Pusat Riset Geoinformatika (PRGI)",
  ];

  return (
    <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-branding">
                <div className="footer-logo-container">
                  <div className="footer-logo"></div>
                </div>
                <div className="social-links">
                  <a href="#" aria-label="Social media link">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/ce0454a415e8afd2583561c002798923bfc3269e?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
                      alt="Social media icon"
                      className="social-icon"
                    />
                  </a>
                  <a href="#" aria-label="Social media link">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/f9e638389420ecce69e573f715c8c8bb9cd33ba1?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
                      alt="Social media icon"
                      className="social-icon"
                    />
                  </a>
                  <a href="#" aria-label="Social media link">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/2abae9326e7082350e1e3c20c7a12e850b7538d8?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
                      alt="Social media icon"
                      className="social-icon"
                    />
                  </a>
                </div>
              </div>
              <nav className="footer-navigation">
                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Daftar GEOMIMO</h3>
                  <a href="/kontak" className="footer-link">
                    Kontak
                  </a>
                </div>
                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Katalog GEOMIMO</h3>
                  <div className="footer-sub-links">
                    <div className="footer-sub-link-container">
                      <a href="/katalog-modul" className="footer-link">
                        Modul Katalog
                      </a>
                    </div>
                  </div>
                </div>
                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Data Inderaja</h3>
                  <a href="/penafian" className="footer-link">
                    Pernyataan Penafian
                  </a>
                </div>
                <div className="footer-nav-column">
                  <h3 className="footer-nav-title">Tentang Kami</h3>
                  <div className="footer-sub-links">
                    <a href="https://brin.go.id" className="footer-link">
                      Badan Riset dan Inovasi Nasional (BRIN)
                    </a>
                    <a href="https://brin.go.id/orei" className="footer-link">
                      Organisasi Riset Elektronika dan Informatika (OREI)
                    </a>
                    <a href="https://brin.go.id/orei/pusat-riset-geoinformatika/page/beranda-2" className="footer-link">
                      Pusat Riset Geoinformatika (PRGI)
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </div>
      <style jsx>{`
        .footer {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 64px 40px;
          color: #f1f1f1;
          background-color: #202020;
        }


        @media (max-width: 991px) {
          .site-footer {
            max-width: 100%;
          }
        }
        .footer-container {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        }
        @media (max-width: 991px) {
          .footer-container {
            max-width: 100%;
            padding: 71px 20px;
          }
        }
        .footer-content {
          width: 100%;
        }
        @media (max-width: 991px) {
          .footer-content {
            max-width: 100%;
          }
        }
        .footer-branding {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 40px 100px;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        @media (max-width: 991px) {
          .footer-branding {
            max-width: 100%;
          }
        }
        .footer-logo-container {
          align-self: stretch;
          display: flex;
          margin: auto 0;
          padding: 23px 45px;
          flex-direction: column;
          align-items: stretch;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 20px;
          color: rgba(0, 0, 0, 1);
          font-weight: 400;
          justify-content: center;
          width: 240px;
        }
        @media (max-width: 991px) {
          .footer-logo-container {
            padding: 23px 20px;
          }
        }
        .footer-logo {
          align-self: stretch;
          min-height: 35px;
          padding: 6px 4px;
          gap: 6px;
        }
        .social-links {
          align-self: stretch;
          display: flex;
          margin: auto 0;
          align-items: center;
          gap: 24px;
          justify-content: flex-start;
        }
        .social-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 40px;
          align-self: stretch;
          margin: auto 0;
          flex-shrink: 0;
        }
        .footer-navigation {
          display: flex;
          margin-top: 68px;
          width: 100%;
          align-items: flex-start;
          color: #f1f1f1;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        @media (max-width: 991px) {
          .footer-navigation {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .footer-nav-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          font-family:
            "Avenir LT Std",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 4px;
          justify-content: flex-start;
          flex-grow: 1;
          flex-shrink: 1;
          width: 190px;
        }
        .footer-nav-title {
          align-self: stretch;
          width: 100%;
          padding: 4px;
          gap: 6px;
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }
        .footer-link {
          align-self: flex-start;
          margin-top: 16px;
          padding: 4px;
          gap: 6px;
          white-space: nowrap;
          color: #f1f1f1;
          text-decoration: none;
          font-family:
            Lato,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0;
        }
        @media (max-width: 991px) {
          .footer-link {
            white-space: initial;
          }
        }
        .footer-sub-links {
          margin-top: 8px;
          width: 100%;
          max-width: 100%;
          font-family:
            Lato,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .footer-sub-link-container {
          width: 100%;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
