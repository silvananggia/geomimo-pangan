import React from "react";



function CatalogSection() {
  return (
    <section className="catalog-section">
      
      <div className="catalog-content">
      <h2 className="catalog-title">Katalog Modul GEOMIMO</h2>
        <p className="catalog-description">
          Kami menyediakan katalog modul dari berbagai macam topik penelitian yang
          dilakukan para periset terbaik BRIN
        </p>
        <div className="button-container">
          <a href="/katalog-modul" className="catalog-button">
            Telusuri
          </a>
        </div>
      </div>
      <style jsx>{`
        .catalog-section {
          display: flex;
          flex-direction: column;
          padding: 64px 40px;
          background-color: #32909c;
        }

        .catalog-content {
        
        }

        .catalog-title {
          font-size: 24px;
          font-weight: 10;
          color: #f1f1f1;
          margin: 0;
                    font-size: 48px;
                    
        }

        .catalog-description {
          font-family: "Lato", sans-serif;
          font-size: 16px;
          color: #f1f1f1;
          margin: 10px 0 20px;
          margin: 0;
        }

        .button-container {
          display: flex;
          justify-content: flex-end;
          margin: 20px 0 0 -100px;
        }

        .catalog-button {
          border: 2px solid #205072;
          color: #202020;
          padding: 16px 48px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          background-color: #f1f1f1;
          text-decoration: none;
          display: inline-block;
          min-width: 200px;
          text-align: center;
        }
      `}</style>
    </section>
  );
}

export default CatalogSection;