import React from "react";

function Card({ title, description, actionText, actionHref, image }) {
  return (
    <article className="card">
      {image && (
        <div className="card-image-container">
          <img src={image} alt={title} className="card-image" />
        </div>
      )}
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <a href={actionHref} className="card-action">
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
        .card-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
        .card-title {
          font-family: "Avenir LT Std", sans-serif;
          font-size: 20px;
          line-height: 40px;
          font-weight: 600;
          color: #202020;
          margin: 0;
        }
        .card-description {
          font-family: "Lato", sans-serif;
          font-size: 20px;
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
