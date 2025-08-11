"use client";
import * as React from "react";

function ContactInfo() {
  return (
    <section className="contact-section">
      <h2 className="contact-title">Narahubung</h2>
      <p className="contact-description">
        Pusat Riset Geoinformatika dapat dihubungi pada:
      </p>

      <table className="contact-table">
        <tbody>
          <tr className="contact-row">
            <td className="contact-label">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e6c06fbc5429916217fb4729741478c97be74853?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" className="contact-icon" alt="Email icon" />
              <span className="contact-type">Email</span>
            </td>
            <td className="contact-value">
              <a href="mailto:prgi@brin.go.id">prgi@brin.go.id</a>
            </td>
          </tr>
          <tr className="contact-row">
            <td className="contact-label">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9fcaae393d6529925345f037d28a2489f123abec?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e" className="contact-icon" alt="Phone icon" />
              <span className="contact-type">Telepon/WhatsApp</span>
            </td>
            <td className="contact-value">
              <a href="tel:+6281110646794">+62 811-1064-6794</a>
            </td>
          </tr>
        </tbody>
      </table>

      <style jsx>{`
        .contact-section {
          display: flex;
          margin-top: 88px;
          width: 100%;
          padding: 0 40px;
          flex-direction: column;
          align-items: start;
        }
        @media (max-width: 991px) {
          .contact-section {
            max-width: 100%;
            padding: 0 20px;
            margin-top: 40px;
          }
        }
        .contact-title {
          color: #202020;
          font-family: "Avenir LT Std", sans-serif;
          font-size: 40px;
          font-weight: 600;
          line-height: 48px;
          letter-spacing: 4px;
          margin: 0;
        }
        .contact-description {
          color: #202020;
          font-family: Lato, sans-serif;
          font-size: 24px;
          font-weight: 500;
          line-height: 32px;
          letter-spacing: 0px;
          margin-top: 32px;
          margin-bottom: 0;
        }
        @media (max-width: 991px) {
          .contact-description {
            max-width: 100%;
          }
        }
        .contact-table {
          width: 620px;
          max-width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 16px;
        }
        .contact-row {
          font-family: Lato, sans-serif;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0px;
          line-height: 32px;
        }
        .contact-label {
          background-color: rgba(241, 241, 241, 1);
          border: 1px solid rgba(32, 32, 32, 1);
          display: flex;
          padding: 11px 16px;
          align-items: center;
          gap: 16px;
          color: #202020;
          white-space: nowrap;
        }
        @media (max-width: 991px) {
          .contact-label {
            white-space: initial;
          }
        }
        .contact-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 24px;
          flex-shrink: 0;
        }
        .contact-type {
          flex-basis: auto;
        }
        .contact-value {
          background-color: rgba(241, 241, 241, 1);
          border: 1px solid rgba(32, 32, 32, 1);
          padding: 11px 16px;
        }
        .contact-value a {
          color: #205072;
          text-decoration: underline;
        }
        @media (max-width: 991px) {
          .contact-value {
            padding-right: 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default ContactInfo;
