import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PortfolioCards from "./PortfolioCards";
import Navbar from "./Navbar";
import { FaGlobe, FaEnvelope, FaPhone, FaAward, FaCrown, FaStar } from "react-icons/fa";

function Home({ sectionRefs, introRef, user }) {
  const [loading, setLoading] = useState(true);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const heroContentRef = useRef(null);
  const heroImageRef = useRef(null);
  const navigate = useNavigate();

  // INTRO animation
  useEffect(() => {
    if (introRef?.current) {
      introRef.current.classList.remove("fade-out");
      void introRef.current.offsetWidth;
      setTimeout(() => introRef.current.classList.add("fade-out"), 1800);
    }
  }, [introRef]);

  // Fetch featured projects from backend
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/portfolio");
        const data = await res.json();

        if (res.ok && data.portfolio) {
          // Filter only featured projects
          const featured = data.portfolio.filter((p) => p.featured === true);
          setFeaturedProjects(featured);
        }
      } catch (err) {
        console.error("Error fetching featured projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

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
              to bringing your boldest ideas to life with flawless detail and forward-thinking solutions.
              Explore our portfolio and see how we turn concepts into captivating realities.
            </label>
          </div>
        </div>

        <div className="hero-image scroll-parallax" ref={heroImageRef}>
          <img
            src="https://static.kordasarchitects.com/uploads/4-17-3413x1920.jpg"
            alt="Architecture concept"
          />
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="featured-projects">
        <h2 className="section-title">FEATURED PROJECTS</h2>

        <div className="featured-grid">
          {loading ? (
            <p>Loading featured projects...</p>
          ) : featuredProjects.length === 0 ? (
            <p>No featured projects yet.</p>
          ) : (
            featuredProjects.map((project) => (
              <div className="featured-card" key={project._id}>
                <img src={project.img} alt={project.title} />
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section">
        <h2 className="section-title">OUR SERVICES</h2>

        <div className="services-grid">
          <div className="service-card">
            <h3>Architectural Design</h3>
            <p>From concept to completion, we design functional, beautiful, and innovative structures.</p>
          </div>
          <div className="service-card">
            <h3>3D Rendering & Visualization</h3>
            <p>High-quality renders that bring your ideas to life before construction begins.</p>
          </div>
          <div className="service-card">
            <h3>Construction Management</h3>
            <p>End-to-end oversight to ensure your project is delivered on time and within budget.</p>
          </div>
          <div className="service-card">
            <h3>Renovations & Remodeling</h3>
            <p>Transforming existing spaces into modern, functional environments.</p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team-section">
        <h2 className="section-title">MEET THE TEAM</h2>

        <div className="team-grid">
          <div className="team-card">
            <img src="/images/Balela.jpg" alt="Architect" />
            <h3>Fideelance Augustine Balela</h3>
            <p>Project Architect</p>
          </div>

          <div className="team-card">
            <img src="/images/Agapito.jpg" alt="Designer" />
            <h3>Vince Ashlee Agapito</h3>
            <p>Architectural Designer</p>
          </div>

          <div className="team-card">
            <img src="/images/Buenavidez.png" alt="Engineer" />
            <h3>Carl Arthur Buenavidez</h3>
            <p>Structural Engineer</p>
          </div>

          <div className="team-card">
            <img src="/images/Bho.jfif" alt="Quality Control" />
            <h3>Jerry Geoff Bho</h3>
            <p>Quality Control Specialist</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / AWARDS */}
      <section className="social-proof-section">
        <h2 className="section-title">RECOGNITION AND CREDENTIALS</h2>

        <div className="social-proof-row">
          <div className="social-proof-item">
            <FaAward size={32} />
            <span>2024 Design Excellence Award</span>
          </div>
          <div className="social-proof-item">
            <FaCrown size={32} />
            <span>Top Emerging Studio</span>
          </div>
          <div className="social-proof-item">
            <FaStar size={32} />
            <span>Certified Construction Partner</span>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="portfolio active">
        <h2 className="section-title">OUR PORTFOLIO</h2>
        <PortfolioCards onLoaded={handlePortfolioLoaded} />
      </section>

      {/* REVIEWS / TESTIMONIALS */}
      <section id="reviews" className="reviews-section">
        <h2 className="section-title">WHAT OUR CLIENTS SAY</h2>

        <div className="reviews-grid">
          <div className="review-card">
            <img src="/images/De Serra.jfif" alt="AC De Serra" className="review-avatar" />
            <div className="review-content">
              <p>
                "LEADS transformed our ideas into reality. The team’s attention to detail
                and creativity is unmatched. Highly recommended!"
              </p>
              <h4>— Althea Carmela De Serra, CEO of BuildWise</h4>
            </div>
          </div>

          <div className="review-card">
            <img src="/images/Sanico.jfif" alt="Ian Sanico" className="review-avatar" />
            <div className="review-content">
              <p>
                "Professional, reliable, and innovative. The designs exceeded our expectations
                and the process was seamless."
              </p>
              <h4>— Ian George Sanico, Property Developer</h4>
            </div>
          </div>

          <div className="review-card">
            <img src="/images/Galve.jpg" alt="Leo Lawrence Galve" className="review-avatar" />
            <div className="review-content">
              <p>
                "Working with LEADS was an incredible experience. They listened to our vision
                and turned it into a functional, stunning reality."
              </p>
              <h4>— Leo Lawrence Galve, Interior Designer</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <h2 className="section-title">ABOUT US</h2>

        <div className="about-columns">
          <div className="about-left">
            <p>
              The world of architecture is evolving faster than ever, and with it
              comes an increasing demand for spaces that are thoughtful, adaptable,
              and deeply connected to the people who use them. At LEADS, we recognize
              that design today goes beyond aesthetics—it is a multidimensional
              process shaped by culture, sustainability, technology, and the
              aspirations of future generations.
            </p>

            <p>
              No single discipline holds the answer to modern challenges. Architecture
              requires collaboration across engineering, design, construction, and
              environmental fields. By merging diverse skills and perspectives, we
              create solutions that are not only visually striking but also efficient,
              functional, and responsible. Our goal is not to impose form, but to
              shape it with intention—crafting environments that serve people and
              stand resilient over time.
            </p>
          </div>

          <div className="about-right">
            <p>
              LEADS began as a small studio founded in 2024 by a designer with roots
              in a family-run construction company. What started as a single vision
              has grown into a collective effort grounded in creativity, discipline,
              and a commitment to innovation. Each project is approached as a journey:
              from analysis and concept development to planning and execution, every
              step is guided by transparency and close collaboration with our clients.
            </p>

            <p>
              With the introduction of WeLeads—our official portfolio platform—we now
              provide a dedicated space for clients and collaborators to explore our
              work, follow project progress, and connect with our team. As we continue
              to grow, our mission remains clear: to design spaces with purpose,
              refine every detail with care, and build environments that inspire.
            </p>

            <p className="founder-signature">
              — Founder, LEADS Architecture & Design Studio
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Get in Touch with Us</h2>

        <div className="contact-row">
          <a
            href="https://www.youtube.com/watch?v=AcOpiWppO3k"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item clickable"
          >
            <FaGlobe size={28} />
            <span>weleads.co</span>
          </a>

          <div className="contact-item">
            <FaEnvelope size={28} />
            <span>weleads@email.com</span>
          </div>

          <div className="contact-item">
            <FaPhone size={28} />
            <span>+63 912 345 6789</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <h3>LEADS</h3>
            <p>
              Architecture and Design Studio creating spaces that inspire and
              endure.
            </p>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} All rights reserved.</div>
      </footer>
    </>
  );
}

export default Home;
