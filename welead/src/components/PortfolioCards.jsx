import React, { useState, useEffect } from "react";
import "../App.css";

function PortfolioCards({ showBackToLogin }) {
  const [openCard, setOpenCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch portfolio items from backend
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/portfolio");
      const data = await res.json();
      console.log("Fetched portfolio:", data);
      setCards(data.portfolio || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchProjects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="portfolio-container">
      {/* Loading Spinner */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      )}

      {/* Portfolio Grid */}
      {!loading && cards.length === 0 && (
        <div className="empty-state">
          There's no portfolio uploaded yet.
        </div>
      )}

      <div className={`portfolio-grid ${openCard ? "blurred" : ""}`}>
        {cards.map((card) => (
          <div
            className="portfolio-card"
            key={card._id}
            onClick={() => setOpenCard(card)}
          >
            <img src={card.img} alt={card.title} />
            <div className="card-overlay">
              <h3>{card.title}</h3>
              <span>{card.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openCard && (
        <div className="modal-overlay" onClick={() => setOpenCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image">
              <img src={openCard.img} alt={openCard.title} />
            </div>
            <div className="modal-text">
              <h2>{openCard.title}</h2>
              <h4>{openCard.category}</h4>
              <p>{openCard.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Back to Login */}
      {showBackToLogin && (
        <button
          className="back-login-btn"
          onClick={() => (window.location.href = "/")}
        >
          Back to Login
        </button>
      )}
    </div>
  );
}

export default PortfolioCards;
