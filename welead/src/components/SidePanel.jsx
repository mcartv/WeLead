import React, { useState, useEffect } from "react";
import "./SidePanel.css";

const SidePanel = ({ project, onClose }) => {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 380); // smooth slide-out
  };

  // ESC key to close
  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, []);

  return (
    <>
      {/* Overlay click closes the panel */}
      <div
        className={`overlay ${closing ? "closing" : ""}`}
        onClick={handleClose}
      ></div>

      <div className={`side-panel ${closing ? "closing" : ""}`}>
        <div className="side-panel-content">
          <div className="side-panel-image">
            <img src={project.image} alt={project.title} />
          </div>

          <div className="side-panel-text">
            <h2>{project.title}</h2>
            <h4>{project.category}</h4>
            <p>{project.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
