"use client";
import React from "react";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import Banner from "../layouts/Banner";
import DisclaimerSection from "./DisclaimerSection";
import Footer from "../layouts/Footer";

function PernyataanPenafian() {
  return (
    <main className="disclaimer-page">
      <Header />
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          {
            label: "Pernyataan Penafian",
            url: "/pernyataan-penafian",
            active: true,
          },
        ]}
      />
      <Banner
        title="Pernyataan Penafian"
        subtitle="Update terbaru: April 2025"
        description="Dengan mengakses dan menggunakan data yang disediakan di GEOMIMO, Anda menyetujui dan menerima ketentuan dalam pernyataan penafian ini. Silakan baca dengan seksama."
      />

      <nav className="disclaimer-navigation">
        <div className="navigation-row">
          <a href="#hak-cipta" className="navigation-link">
            Hak Cipta dan Kepemilikan
          </a>
          <a href="#perubahan" className="navigation-link">
            Perubahan Disclaimer
          </a>
        </div>
        <div className="navigation-row">
          <a href="#akurasi" className="navigation-link">
            Akurasi dan Keandalan Data
          </a>
          <a href="#kontak" className="navigation-link">
            Kontak
          </a>
        </div>
        <a href="#penggunaan" className="navigation-link navigation-link-wide">
          Penggunaan Data
        </a>
      </nav>

      <DisclaimerSection
        id="hak-cipta"
        title="1. Hak Cipta dan Kepemilikan"
        content={[
          "Semua data, informasi, dan konten yang disajikan di [Nama Sumber Data/Situs Web] dilindungi oleh undang-undang hak cipta dan hak kekayaan intelektual lainnya.",
          "Anda tidak diperbolehkan untuk menyalin, mendistribusikan, mengubah, atau membuat karya turunan dari data tersebut tanpa izin tertulis terlebih dahulu dari GEOMIMO.",
          "Semua merek dagang, logo, dan nama produk yang tercantum di GEOMIMO adalah milik pemiliknya masing-masing.",
        ]}
      />

      <DisclaimerSection
        id="akurasi"
        title="2. Akurasi dan Keandalan Data"
        content={[
          "GEOMIMO berusaha untuk menyajikan data yang akurat dan terkini. Namun, kami tidak menjamin bahwa data tersebut sepenuhnya bebas dari kesalahan atau ketidaktepatan.",
          "Data yang disediakan di GEOMIMO semata-mata untuk tujuan informasi umum dan tidak dimaksudkan sebagai saran profesional atau nasihat hukum.",
          "GEOMIMO tidak bertanggung jawab atas kerugian atau kerusakan yang timbul akibat penggunaan data yang disajikan di sini.",
        ]}
      />

      <DisclaimerSection
        id="penggunaan"
        title="3. Penggunaan Data"
        content={[
          "Anda bertanggung jawab atas penggunaan data yang disajikan di GEOMIMO.",
          "Anda tidak diperbolehkan untuk menggunakan data untuk tujuan yang melanggar hukum atau etika.",
          "Anda tidak diperbolehkan untuk menggunakan data untuk tujuan komersial tanpa izin tertulis dari GEOMIMO.",
        ]}
      />

      <DisclaimerSection
        id="perubahan"
        title="4. Perubahan Disclaimer"
        content={[
          "GEOMIMO berhak untuk mengubah atau memperbarui disclaimer ini sewaktu-waktu tanpa pemberitahuan sebelumnya.",
          "Anda bertanggung jawab untuk memeriksa disclaimer ini secara berkala untuk mengetahui perubahan yang mungkin terjadi.",
        ]}
      />

      <DisclaimerSection
        id="kontak"
        title="Kontak"
        content={[
          <span key="contact">
            Jika Anda memiliki pertanyaan atau kekhawatiran tentang disclaimer
            ini atau penggunaan data di GEOMIMO, silakan hubungi kami melalui{" "}
            <a href="mailto:prgi@brin.go.id" className="email-link">
              prgi@brin.go.id
            </a>
          </span>,
        ]}
      />

      <Footer />

      <style jsx>{`
        .disclaimer-page {
          background-color: #ffffff;
          flex-direction: column;
          overflow: hidden;
          align-items: center;
          width: 100%;
        }

        .disclaimer-navigation {
          margin-top: 88px;
          width: 100%;
          font-family: Lato, sans-serif;
          font-size: 24px;
          color: #205072;
          font-weight: 500;
          letter-spacing: 0px;
          line-height: 32px;
          padding:0 40px;
        }

        .navigation-row {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .navigation-link {
          align-self: stretch;
          width: 680px;
          background-color: #f1f1f1;
          border: 1px solid #202020;
          min-width: 240px;
          margin-top: auto;
          margin-bottom: auto;
          padding: 11px 48px;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
          font-size: 24px;
        }

        .navigation-link-wide {
          align-self: stretch;
          width: 680px;
          background-color: #f1f1f1;
          border: 1px solid #202020;
          min-height: 54px;
          max-width: 100%;
          padding: 11px 48px;
          display: flex;
          align-items: center;
        }

        .email-link {
          text-decoration: underline;
          color: #205072;
        }

        @media (max-width: 991px) {
          .disclaimer-navigation {
            max-width: 100%;
            margin-top: 40px;
          }

          .navigation-row {
            max-width: 100%;
          }

          .navigation-link {
            max-width: 100%;
            padding-left: 20px;
            padding-right: 20px;
          }

          .navigation-link-wide {
            max-width: 100%;
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </main>
  );
}

export default PernyataanPenafian;
