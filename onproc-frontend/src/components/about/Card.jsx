import React from "react";

function Card({ title, description, actionText }) {
  return (
    <article className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <a href="#" className="card-action">
        {actionText}
      </a>
      <style jsx>{`
        .card {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .card-title {
          font-family: "Avenir LT Std", sans-serif;
          font-size: 28px;
          line-height: 40px;
          font-weight: 600;
          color: #202020;
          margin: 0;
        }
        .card-description {
          font-family: "Lato", sans-serif;
          font-size: 24px;
          line-height: 32px;
          font-weight: 500;
          color: #202020;
          margin: 0;
        }
        .card-action {
          font-family: "Lato", sans-serif;
          font-size: 20px;
          line-height: 32px;
          color: #205072;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          text-align: left;
          display: block;
          width: 100%;
          margin-bottom: 40px;
        }
      `}</style>
    </article>
  );
}

export default Card;
