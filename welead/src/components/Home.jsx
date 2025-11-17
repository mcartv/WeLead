import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PortfolioCards from "./PortfolioCards";
import Navbar from "./Navbar";

function Home({ sectionRefs, introRef, user }) {
  const [loading, setLoading] = useState(true);
  const heroContentRef = useRef(null);
  const heroImageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (introRef?.current) {
      introRef.current.classList.remove("fade-out");
      void introRef.current.offsetWidth;
      setTimeout(() => introRef.current.classList.add("fade-out"), 1800);
    }
  }, [introRef]);

  const handlePortfolioLoaded = () => setLoading(false);

  return (
    <>
      {/* INTRO ANIMATION */}
      <div className="intro" ref={introRef}>
        <h1 className="intro-text">LEADS</h1>
      </div>

      {/* NAVBAR */}
      <Navbar user={user} />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content" ref={heroContentRef}>
          <h1 className="hero-title">
            BUILDING THE FUTURE WITH <br />
            <span>PRECISION AND VISION</span>
          </h1>
          <div className="hero-divider"></div>
          <div className="hero-sub-container">
            <label className="hero-sub">
              <span>Your vision, perfected.</span> We are an architecture and design studio dedicated
              to bringing your boldest ideas to life with flawless detail and
              forward-thinking solutions. Explore our portfolio and see how we turn
              concepts into captivating realities.
            </label>
          </div>
        </div>

        <div className="hero-image scroll-parallax" ref={heroImageRef}>
          <img src="https://static.kordasarchitects.com/uploads/4-17-3413x1920.jpg" alt="Architecture concept" />
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="portfolio active">
        <h2 className="section-title">Our Portfolio</h2>
        <PortfolioCards onLoaded={handlePortfolioLoaded} />
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <h2 className="section-title">About Us</h2>
        <p>
          LEADS is an architecture studio specializing in modern structures,
          urban development, and visionary design that adapts to the needs of
          people and space.
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Get in Touch</h2>
        <p>Email: info@leadsstudio.com</p>
        <p>Phone: +63 912 345 6789</p>
      </section>
    </>
  );
}

export default Home;