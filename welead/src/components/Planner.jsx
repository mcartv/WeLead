import React, { useState } from "react";
import Navbar from "./Navbar";
import "./Planner.css";

const Planner = ({ user }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Riverfront Residence",
      client: {
        name: "Smith Family",
        email: "smith.family@email.com",
        phone: "(555) 123-4567",
      },
      type: "Residential",
      status: "Design Development",
      progress: 65,
      timeline: { start: "2024-01-15", end: "2024-06-30" },
      team: ["Maria Rodriguez", "James Chen"],
      budget: { total: 125000, spent: 78500 },
      deliverables: ["Floor Plans", "3D Renderings", "Material Board"],
      milestones: [
        { name: "Schematic Design", completed: true, due: "2024-02-15" },
        { name: "Design Development", completed: false, due: "2024-04-30" },
        { name: "Construction Documents", completed: false, due: "2024-06-15" },
      ],
    },
    {
      id: 2,
      name: "Downtown Coffee Hub",
      client: {
        name: "Brew & Co",
        email: "contact@brewco.com",
        phone: "(555) 987-6543",
      },
      type: "Commercial",
      status: "Schematic Design",
      progress: 35,
      timeline: { start: "2024-02-01", end: "2024-08-15" },
      team: ["Sarah Johnson"],
      budget: { total: 85000, spent: 25500 },
      deliverables: ["Concept Sketches", "Site Analysis"],
      milestones: [
        { name: "Schematic Design", completed: true, due: "2024-03-01" },
        { name: "Design Development", completed: false, due: "2024-05-15" },
        { name: "Construction Documents", completed: false, due: "2024-07-30" },
      ],
    },
    {
      id: 3,
      name: "Meadowbrook Subdivision",
      client: {
        name: "Greenfield Developers",
        email: "info@greenfield.com",
        phone: "(555) 555-1234",
      },
      type: "Subdivision",
      status: "Construction Docs",
      progress: 80,
      timeline: { start: "2023-09-01", end: "2024-04-30" },
      team: ["Maria Rodriguez", "David Lee"],
      budget: { total: 450000, spent: 360000 },
      deliverables: ["Site Plan", "Utility Layout", "Phase 1 Plots"],
      milestones: [
        { name: "Schematic Design", completed: true, due: "2023-10-15" },
        { name: "Design Development", completed: true, due: "2023-12-20" },
        { name: "Construction Documents", completed: false, due: "2024-03-30" },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const statuses = ["Schematic Design", "Design Development", "Construction Docs", "Completed"];
  const types = ["Residential", "Commercial", "Subdivision"];

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(
    (p) =>
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || p.status === filterStatus) &&
      (filterType === "all" || p.type === filterType)
  );

  // Dashboard stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status !== "Completed").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget.total, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.budget.spent, 0);

  const openProjectModal = (project) => setSelectedProject(project);
  const closeProjectModal = () => setSelectedProject(null);

  return (
    <div className="planner-page">
      <Navbar user={user} />

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-label">Total Projects</span>
          <span className="stat-value">{totalProjects}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active</span>
          <span className="stat-value">{activeProjects}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedProjects}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Budget Utilization</span>
          <span className="stat-value">
            ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="planner-header">
        <h1>Studio Projects</h1>
        <div className="planner-controls">
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button className="btn-primary">+ New Project</button>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => openProjectModal(project)}
          >
            {/* Client and Type */}
            <div className="card-client-type">
              <span className="client-name">{project.client.name}</span>
              <span className={`project-type-badge ${project.type.toLowerCase()}`}>
                {project.type}
              </span>
            </div>

            {/* Project Name */}
            <h3 className="project-name">{project.name}</h3>

            {/* Status */}
            <div className="card-status">
              <span className="status-label">STATUS</span>
              <span className={`status-badge ${project.status.replace(/\s/g, "-").toLowerCase()}`}>
                {project.status}
              </span>
            </div>

            {/* Progress */}
            <div className="card-progress">
              <span className="progress-label">PROGRESS</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{project.progress}%</span>
            </div>

            {/* Timeline */}
            <div className="card-timeline">
              <span className="timeline-label">TIMELINE</span>
              <span>{project.timeline.start} → {project.timeline.end}</span>
            </div>

            {/* Team */}
            <div className="card-team">
              <span className="team-label">TEAM</span>
              <span>{project.team.join(", ")}</span>
            </div>

            {/* Budget */}
            <div className="card-budget">
              <span className="budget-label">BUDGET</span>
              <span>${project.budget.spent.toLocaleString()} / ${project.budget.total.toLocaleString()}</span>
            </div>

            {/* Deliverables (simplified) */}
            <div className="card-deliverables">
              <span className="deliverables-label">DELIVERABLES</span>
              <span>{project.deliverables.slice(0, 2).join(" • ")}
                {project.deliverables.length > 2 && " • ..."}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeProjectModal}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedProject.name}</h2>
                <span className="modal-client">
                  {selectedProject.client.name} • {selectedProject.type}
                </span>
              </div>
              <button className="close-btn" onClick={closeProjectModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Client Information</h4>
                <p><strong>Email:</strong> {selectedProject.client.email}</p>
                <p><strong>Phone:</strong> {selectedProject.client.phone}</p>
              </div>

              <div className="modal-section">
                <h4>Project Details</h4>
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Progress:</strong> {selectedProject.progress}%</p>
                <p><strong>Timeline:</strong> {selectedProject.timeline.start} → {selectedProject.timeline.end}</p>
                <p><strong>Team:</strong> {selectedProject.team.join(", ")}</p>
              </div>

              <div className="modal-section">
                <h4>Budget</h4>
                <p><strong>Total:</strong> ${selectedProject.budget.total.toLocaleString()}</p>
                <p><strong>Spent:</strong> ${selectedProject.budget.spent.toLocaleString()}</p>
                <p><strong>Remaining:</strong> ${(selectedProject.budget.total - selectedProject.budget.spent).toLocaleString()}</p>
              </div>

              <div className="modal-section">
                <h4>Deliverables</h4>
                <ul className="deliverables-list">
                  {selectedProject.deliverables.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4>Milestones</h4>
                <div className="milestones">
                  {selectedProject.milestones.map((ms, idx) => (
                    <div key={idx} className="milestone-item">
                      <span className={`milestone-status ${ms.completed ? "completed" : "pending"}`}>
                        {ms.completed ? "✓" : "○"}
                      </span>
                      <span className="milestone-name">{ms.name}</span>
                      <span className="milestone-due">Due: {ms.due}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;