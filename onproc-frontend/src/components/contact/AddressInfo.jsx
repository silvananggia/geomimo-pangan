"use client";
import * as React from "react";

function AddressInfo() {
  return (
    <section className="address-section">
      <h2 className="address-title">Alamat</h2>
      <h3 className="organization-title">PUSAT RISET GEOINFORMATIKA</h3>

      <div className="address-container">
        <div className="address-columns">
          <div className="address-column">
            <div className="address-content">
              <h4 className="office-title">Biro SDM</h4>
              <p className="office-address">
                Kawasan Sains dan Teknologi Samaun Samadikun
                <br />
                Jl. Sangkuriang, Dago, Kecamatan Coblong,
                <br />
                Kota Bandung 40135
                <br />
                Jawa Barat
              </p>
            </div>
          </div>

          <div className="address-column">
            <div className="address-content">
              <h4 className="office-title">Kantor Riset</h4>
              <p className="office-address">
                Kawasan Sains Teknologi Dr. (H.C) Ir. H. Soekarno
                <br />
                Jl. Raya Bogor No.970, Nanggewer Mekar, Kec. Cibinong, <br />
                Kabupaten Bogor 16915
                <br />
                Jawa Barat
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .address-section {
          margin: 72px 40px;
        }
        @media (max-width: 991px) {
          .address-section {
            margin-top: 40px;
          }
        }
        .address-title {
          color: #202020;
          font-family: "Avenir LT Std", sans-serif;
          font-size: 40px;
          font-weight: 600;
          line-height: 48px;
          letter-spacing: 4px;
          margin: 0;
        }
        .organization-title {
          color: #202020;
          font-family: "Avenir LT Std", sans-serif;
          font-size: 28px;
          font-weight: 600;
          line-height: 40px;
          letter-spacing: 4px;
          margin-top: 32px;
          margin-bottom: 0;
        }
        @media (max-width: 991px) {
          .organization-title {
            max-width: 100%;
          }
        }
        .address-container {
          align-self: stretch;
          margin-top: 16px;
        }
        @media (max-width: 991px) {
          .address-container {
            max-width: 100%;
          }
        }
        .address-columns {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .address-columns {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
        .address-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 50%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          .address-column {
            width: 100%;
          }
        }
        .address-column:last-child {
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .address-column:last-child {
            margin-left: 0;
          }
        }
        .address-content {
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          align-items: stretch;
          font-family: Lato, sans-serif;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0px;
          line-height: 32px;
        }
        @media (max-width: 991px) {
          .address-content {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .office-title {
          color: #81883a;
          align-self: start;
          margin: 0;
          font-size: 24px;
          font-weight: 500;
        }
        .office-address {
          color: #202020;
          margin-top: 8px;
          margin-bottom: 0;
        }
        @media (max-width: 991px) {
          .office-address {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default AddressInfo;
