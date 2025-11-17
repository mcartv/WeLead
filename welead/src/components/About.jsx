import React from "react";
import "./About.css";

export default function About() {
  return (
    <main className="about-container">
      
      <section className="about-header">
        <h1 className="about-title">LEADS</h1>
        <h2 className="about-subtitle">LE Architecture and Design Studio</h2>
        <div className="about-line"></div>
        <p className="about-intro">
          A design and construction firm focused on balancing creativity and practicality —
          bringing innovative architectural solutions to residential, commercial, and subdivision projects.
        </p>
      </section>

      {/* STORY */}
      <section className="about-section">
        <h3>Our Story</h3>
        <p>
          Established in 2024, LEADS was founded by an architect who decided to leave
          the family-owned business to pursue an independent vision. The goal was to
          create a firm that redefines traditional design practices — one that pushes
          creativity while respecting financial boundaries. This philosophy has guided
          LEADS in building thoughtful and functional spaces that reflect each client’s story.
        </p>
      </section>

      {/* WORKFLOW */}
      <section className="about-section">
        <h3>How We Work</h3>
        <p>
          Every project begins with understanding our client — their goals, limitations,
          and site conditions. We conduct site visits, analyze the context, and begin with
          schematic planning before moving into detailed design development and execution.
        </p>
        <p>
          Our workflow ensures transparency and communication through regular updates,
          reports, and progress billing — whether the project involves only design services
          or full-scale design and construction.
        </p>
      </section>

      {/* CHALLENGES */}
      <section className="about-section">
        <h3>Challenges We Face</h3>
        <p>
          As a growing firm, LEADS faces challenges in attracting large-scale clients
          and building a strong online presence. Relying mainly on referrals and social
          media limits visibility. Communicating updates and sharing portfolios through
          messaging apps and drives also fails to fully represent the professionalism and
          quality we stand for.
        </p>
      </section>

      {/* DIGITAL SOLUTION */}
      <section className="about-section">
        <h3>Our Digital Solution</h3>
        <p>
          To overcome these barriers, LEADS is launching a professional company website —
          a centralized digital platform for clients to explore our portfolio, book
          consultations, and learn more about our services through an FAQ section.
        </p>
        <p>
          The website embodies our design philosophy — simplicity, clarity, and purpose.
          It strengthens our credibility, enhances communication, and expands our reach
          to new opportunities.
        </p>
      </section>

      {/* MISSION */}
      <section className="about-section mission">
        <h3>Our Mission</h3>
        <p>
          LEADS aims to innovate with every project — providing creative, sustainable,
          and practical design solutions that meet client needs while maintaining artistic
          integrity. We believe that great design should not only inspire but also
          improve everyday living.
        </p>
      </section>
    </main>
  );
}
