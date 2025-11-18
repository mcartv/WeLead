import React, { useState, useEffect } from "react";
import "../App.css";

function PortfolioCards({ showBackToLogin }) {
  const [openCard, setOpenCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch portfolio items from backend
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/portfolio");
      const data = await res.json();
      setCards(data.portfolio || []);
      setFiltered(data.portfolio || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFiltered(cards);
    } else {
      setFiltered(cards.filter((c) => c.category === category));
    }
  };

  return (
    <div className="portfolio-container">
      {/* Category Filter */}
      <div className="portfolio-filter">
        {["All", "Commercial", "Residential", "Subdivision", "Renovation"].map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "active" : ""}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="empty-state">There's no portfolio uploaded yet.</div>
      )}

      {/* Portfolio Grid */}
      <div className={`portfolio-grid ${openCard ? "blurred" : ""}`}>
        {filtered.map((card) => (
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

      {/* Modal: image left, details right */}
      {openCard && (
        <div className="modal-overlay" onClick={() => setOpenCard(null)}>
          <div className="modal-content modal-flex" onClick={(e) => e.stopPropagation()}>
            <div className="modal-left">
              <img src={openCard.img} alt={openCard.title} />
            </div>
            <div className="modal-right">
              <h2>{openCard.title}</h2>
              <p><strong>Category:</strong> {openCard.category}</p>
              <p><strong>Description:</strong></p>
              <p  className="modal-desc">{openCard.desc}</p>
            </div>
            <button className="modal-close" onClick={() => setOpenCard(null)}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioCards;
