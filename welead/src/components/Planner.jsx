import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Planner.css";

const Planner = ({ user }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Riverfront Residence",
      client: "Smith Family",
      type: "Residential",
      status: "Design Development",
      progress: 65,
      phase: "DD",
      timeline: {
        start: "2024-01-15",
        end: "2024-06-30",
        milestones: [
          { name: "Schematic Design", date: "2024-02-28", completed: true },
          { name: "Design Development", date: "2024-04-15", completed: false },
          { name: "Construction Docs", date: "2024-05-30", completed: false },
          { name: "Permitting", date: "2024-06-30", completed: false }
        ]
      },
      team: [
        { id: 1, name: "Maria Rodriguez", role: "Lead Architect", avatar: "👩‍💼" },
        { id: 2, name: "James Chen", role: "Designer", avatar: "👨‍🎨" }
      ],
      deliverables: [
        { name: "Floor Plans", status: "In Progress", due: "2024-03-15" },
        { name: "3D Renderings", status: "Not Started", due: "2024-03-30" },
        { name: "Material Board", status: "Completed", due: "2024-02-20" }
      ],
      budget: { total: 125000, spent: 78500, remaining: 46500 },
      lastUpdated: "2024-02-18"
    },
    {
      id: 2,
      name: "Downtown Coffee Hub",
      client: "Brew & Co",
      type: "Commercial",
      status: "Schematic Design",
      progress: 35,
      phase: "SD",
      timeline: {
        start: "2024-02-01",
        end: "2024-08-15",
        milestones: [
          { name: "Schematic Design", date: "2024-03-20", completed: false },
          { name: "Client Approval", date: "2024-04-05", completed: false },
          { name: "Design Development", date: "2024-06-15", completed: false }
        ]
      },
      team: [
        { id: 3, name: "Sarah Johnson", role: "Project Architect", avatar: "👩‍💼" }
      ],
      deliverables: [
        { name: "Concept Sketches", status: "In Progress", due: "2024-02-28" },
        { name: "Site Analysis", status: "Completed", due: "2024-02-15" }
      ],
      budget: { total: 85000, spent: 25500, remaining: 59500 },
      lastUpdated: "2024-02-16"
    }
  ]);

  const [activeView, setActiveView] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Project phases in architectural workflow
  const projectPhases = [
    { id: "pd", name: "Pre-Design", color: "#8B9DC3", order: 1 },
    { id: "sd", name: "Schematic Design", color: "#3B5998", order: 2 },
    { id: "dd", name: "Design Development", color: "#FF6B35", order: 3 },
    { id: "cd", name: "Construction Docs", color: "#004E89", order: 4 },
    { id: "ca", name: "Construction Admin", color: "#00A896", order: 5 },
    { id: "completed", name: "Completed", color: "#28A745", order: 6 }
  ];

  const projectTypes = ["Residential", "Commercial", "Hospitality", "Institutional", "Mixed-Use"];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    const matchesType = filterType === "all" || project.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Dashboard metrics
  const dashboardMetrics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status !== "Completed").length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget.total, 0),
    averageProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  const updateProjectProgress = (projectId, newProgress) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, progress: newProgress } : p
    ));
  };

  return (
    <>
      <Navbar user={user} />
      
      <div className="architecture-planner">
        {/* Header */}
        <div className="planner-header">
          <div className="header-left">
            <h1>Studio Projects</h1>
            <p>Managing {projects.length} active design projects</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search projects or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="btn-primary">
              + New Project
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🏗️</div>
            <div className="metric-info">
              <h3>{dashboardMetrics.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-info">
              <h3>{dashboardMetrics.activeProjects}</h3>
              <p>Active Projects</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-info">
              <h3>${(dashboardMetrics.totalBudget / 1000).toFixed(0)}K</h3>
              <p>Total Budget</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-info">
              <h3>{dashboardMetrics.averageProgress}%</h3>
              <p>Average Progress</p>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="view-controls">
          <div className="view-tabs">
            <button 
              className={`tab-btn ${activeView === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveView("dashboard")}
            >
              📊 Dashboard
            </button>
            <button 
              className={`tab-btn ${activeView === "timeline" ? "active" : ""}`}
              onClick={() => setActiveView("timeline")}
            >
              📅 Timeline
            </button>
            <button 
              className={`tab-btn ${activeView === "phases" ? "active" : ""}`}
              onClick={() => setActiveView("phases")}
            >
              🏛️ Phases
            </button>
          </div>
          
          <div className="filters">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {projectPhases.map(phase => (
                <option key={phase.id} value={phase.name}>{phase.name}</option>
              ))}
            </select>
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="planner-content">
          {activeView === "dashboard" && (
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => openProjectDetails(project)}
                >
                  <div className="project-header">
                    <div className="project-type">{project.type}</div>
                    <div className="project-phase" style={{ 
                      backgroundColor: projectPhases.find(p => p.name === project.status)?.color 
                    }}>
                      {project.status}
                    </div>
                  </div>
                  
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-client">Client: {project.client}</p>
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{project.progress}% Complete</span>
                  </div>
                  
                  <div className="project-timeline">
                    <div className="timeline-info">
                      <span>Start: {project.timeline.start}</span>
                      <span>End: {project.timeline.end}</span>
                    </div>
                  </div>
                  
                  <div className="project-team">
                    <div className="team-avatars">
                      {project.team.map(member => (
                        <span key={member.id} className="avatar" title={`${member.name} - ${member.role}`}>
                          {member.avatar}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-budget">
                    <div className="budget-bar">
                      <div 
                        className="budget-spent"
                        style={{ width: `${(project.budget.spent / project.budget.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="budget-text">
                      Budget: ${project.budget.spent.toLocaleString()} / ${project.budget.total.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="project-deliverables">
                    <span className="deliverables-count">
                      {project.deliverables.filter(d => d.status === "Completed").length}/
                      {project.deliverables.length} deliverables
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === "timeline" && (
            <div className="timeline-view">
              <h3>Project Timeline</h3>
              <div className="gantt-chart">
                {projects.map(project => (
                  <div key={project.id} className="gantt-row">
                    <div className="gantt-project-info">
                      <strong>{project.name}</strong>
                      <span>{project.client}</span>
                    </div>
                    <div className="gantt-bar-container">
                      <div 
                        className="gantt-bar"
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: projectPhases.find(p => p.name === project.status)?.color
                        }}
                      >
                        <span className="gantt-milestones">
                          {project.timeline.milestones.map((milestone, index) => (
                            <div
                              key={index}
                              className={`milestone-marker ${milestone.completed ? 'completed' : ''}`}
                              title={milestone.name}
                            ></div>
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "phases" && (
            <div className="phases-view">
              {projectPhases.map(phase => {
                const phaseProjects = projects.filter(p => p.status === phase.name);
                return (
                  <div key={phase.id} className="phase-column">
                    <div 
                      className="phase-header"
                      style={{ borderLeftColor: phase.color }}
                    >
                      <h4>{phase.name}</h4>
                      <span className="project-count">{phaseProjects.length}</span>
                    </div>
                    <div className="phase-projects">
                      {phaseProjects.map(project => (
                        <div 
                          key={project.id} 
                          className="phase-project-card"
                          onClick={() => openProjectDetails(project)}
                        >
                          <h5>{project.name}</h5>
                          <p>{project.client}</p>
                          <div className="phase-progress">
                            <div className="mini-progress-bar">
                              <div 
                                className="mini-progress-fill"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Detail Modal */}
        {isProjectModalOpen && selectedProject && (
          <div className="modal-overlay" onClick={closeProjectModal}>
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <h2>{selectedProject.name}</h2>
                  <p className="client-name">{selectedProject.client} • {selectedProject.type}</p>
                </div>
                <button className="close-btn" onClick={closeProjectModal}>×</button>
              </div>
              
              <div className="modal-content">
                <div className="modal-section">
                  <h3>Project Overview</h3>
                  <div className="overview-grid">
                    <div className="overview-item">
                      <label>Status</label>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: projectPhases.find(p => p.name === selectedProject.status)?.color 
                        }}
                      >
                        {selectedProject.status}
                      </span>
                    </div>
                    <div className="overview-item">
                      <label>Progress</label>
                      <div className="progress-control">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedProject.progress}
                          onChange={(e) => updateProjectProgress(selectedProject.id, parseInt(e.target.value))}
                        />
                        <span>{selectedProject.progress}%</span>
                      </div>
                    </div>
                    <div className="overview-item">
                      <label>Timeline</label>
                      <span>{selectedProject.timeline.start} to {selectedProject.timeline.end}</span>
                    </div>
                    <div className="overview-item">
                      <label>Budget</label>
                      <span>${selectedProject.budget.spent.toLocaleString()} / ${selectedProject.budget.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-columns">
                  <div className="modal-column">
                    <h3>Milestones</h3>
                    <div className="milestones-list">
                      {selectedProject.timeline.milestones.map((milestone, index) => (
                        <div key={index} className="milestone-item">
                          <div className={`milestone-checkbox ${milestone.completed ? 'completed' : ''}`}>
                            {milestone.completed ? '✓' : ''}
                          </div>
                          <div className="milestone-info">
                            <strong>{milestone.name}</strong>
                            <span>{milestone.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3>Team</h3>
                    <div className="team-list">
                      {selectedProject.team.map(member => (
                        <div key={member.id} className="team-member">
                          <span className="avatar">{member.avatar}</span>
                          <div className="member-info">
                            <strong>{member.name}</strong>
                            <span>{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-column">
                    <h3>Deliverables</h3>
                    <div className="deliverables-list">
                      {selectedProject.deliverables.map((deliverable, index) => (
                        <div key={index} className="deliverable-item">
                          <span className="deliverable-name">{deliverable.name}</span>
                          <span className={`deliverable-status ${deliverable.status.toLowerCase().replace(' ', '-')}`}>
                            {deliverable.status}
                          </span>
                          <span className="deliverable-due">{deliverable.due}</span>
                        </div>
                      ))}
                    </div>

                    <h3>Recent Activity</h3>
                    <div className="activity-feed">
                      <div className="activity-item">
                        <span className="activity-icon">📝</span>
                        <div className="activity-content">
                          <p>Floor plans updated</p>
                          <span className="activity-time">2 hours ago</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <span className="activity-icon">💬</span>
                        <div className="activity-content">
                          <p>Client feedback received</p>
                          <span className="activity-time">1 day ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Planner;