import React, { useState, useEffect } from "react";
import "./AdminStyles.css";
import Navbar from "./Navbar";

export default function ProjectTracker({ user, handleLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [addingPhase, setAddingPhase] = useState(null);

  const isAdmin = user && user.role === "admin";

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();

        const formattedProjects = data.map((p) => ({
          ...p,
          id: p._id,
          approved: p.approved || false,
          phases:
            p.phases || [
              { name: "Concept Design", completed: false, notes: "", documents: [], images: [] },
              { name: "Design Development", completed: false, notes: "", documents: [], images: [] },
              { name: "Construction Documents", completed: false, notes: "", documents: [], images: [] },
              { name: "Permits", completed: false, notes: "", documents: [], images: [] },
              { name: "Construction", completed: false, notes: "", documents: [], images: [] },
              { name: "Turnover", completed: false, notes: "", documents: [], images: [] },
            ],
        }));

        setProjects(formattedProjects);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  // Helper: calculate progress
  const calculateProgress = (phases) => {
    const total = phases.length;
    const completed = phases.filter((p) => p.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Toggle card expansion
  const toggleProjectView = (id) => {
    setSelectedProject(selectedProject === id ? null : id);
  };

  // Approve / reject project
  const approveProject = (projectId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, approved: true, status: "In Progress" } : p
      )
    );
  };

  const rejectProject = (projectId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, approved: false, status: "Rejected" } : p
      )
    );
  };

  // Phase operations
  const updatePhaseNotes = (projectId, phaseIndex, notes) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            phases: p.phases.map((ph, idx) => (idx === phaseIndex ? { ...ph, notes } : ph)),
          }
          : p
      )
    );
  };

  const addPhaseDocument = (projectId, phaseIndex, file) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            phases: p.phases.map((ph, idx) =>
              idx === phaseIndex ? { ...ph, documents: [...ph.documents, file.name] } : ph
            ),
          }
          : p
      )
    );
  };

  const addPhaseImage = (projectId, phaseIndex, file) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            phases: p.phases.map((ph, idx) =>
              idx === phaseIndex ? { ...ph, images: [...ph.images, file.name] } : ph
            ),
          }
          : p
      )
    );
  };

  const removePhaseDocument = (projectId, phaseIndex, docIndex) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            phases: p.phases.map((ph, idx) =>
              idx === phaseIndex
                ? { ...ph, documents: ph.documents.filter((_, i) => i !== docIndex) }
                : ph
            ),
          }
          : p
      )
    );
  };

  const removePhaseImage = (projectId, phaseIndex, imgIndex) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            phases: p.phases.map((ph, idx) =>
              idx === phaseIndex ? { ...ph, images: ph.images.filter((_, i) => i !== imgIndex) } : ph
            ),
          }
          : p
      )
    );
  };

  const submitPhaseDetails = (projectId, phaseIndex) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            phases: p.phases.map((ph, idx) =>
              idx === phaseIndex ? { ...ph, completed: true } : ph
            ),
          }
          : p
      )
    );
    const project = projects.find((p) => p.id === projectId);
    const phase = project.phases[phaseIndex];
    console.log(`Submitted: ${project.name} - ${phase.name}`, { notes: phase.notes, documents: phase.documents, images: phase.images });
    alert(`Details submitted for ${phase.name}`);
  };

  const editPhase = (phaseIndex) => setEditingPhase(editingPhase === phaseIndex ? null : phaseIndex);
  const addPhase = (phaseIndex) => setAddingPhase(addingPhase === phaseIndex ? null : phaseIndex);
  const deletePhaseDetails = (projectId, phaseIndex) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            phases: p.phases.map((ph, idx) =>
              idx === phaseIndex ? { ...ph, notes: "", documents: [], images: [], completed: false } : ph
            ),
          }
          : p
      )
    );
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="tracker-container">
        <main className="tracker-main">
          <h2>Projects ({isAdmin ? "Admin" : "User"} View)</h2>

          <div className="project-grid">
            {projects.filter((p) => p.status !== "Rejected").map((project) => {
              const progress = calculateProgress(project.phases);
              const isApproved = project.approved;
              const displayStatus = isApproved ? (progress === 100 ? "Finished" : "In Progress") : project.status;

              return (
                <div key={project.id} className="project-card">
                  <div className="card-header" onClick={() => toggleProjectView(project.id)}>
                    <div>
                      <h3>{project.name}</h3>
                      <p className="client-info">{project.client}</p>
                      <p className={`status ${displayStatus.toLowerCase().replace(" ", "-")}`}>{displayStatus}</p>
                    </div>
                    <span className="expand-icon">{selectedProject === project.id ? "−" : "+"}</span>
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>

                  {!isApproved && isAdmin && (
                    <div className="approval-buttons">
                      <button onClick={() => approveProject(project.id)}>Approve</button>
                      <button onClick={() => rejectProject(project.id)}>Reject</button>
                    </div>
                  )}

                  {selectedProject === project.id && (
                    <div className="phase-list">
                      {project.phases.map((phase, idx) => (
                        <div key={idx} className="phase-item">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className={`phase-status ${phase.completed ? "done" : "pending"}`}>{phase.completed ? "✓" : "○"}</span>
                            <span>{phase.name}</span>
                          </div>

                          {isApproved && isAdmin && (
                            <div className="phase-details">
                              {addingPhase === idx ? (
                                <>
                                  <textarea
                                    placeholder="Notes"
                                    value={phase.notes}
                                    onChange={(e) => updatePhaseNotes(project.id, idx, e.target.value)}
                                  />
                                  <div style={{ display: "flex", gap: "0.2rem" }}>
                                    <input type="file" onChange={(e) => e.target.files[0] && addPhaseDocument(project.id, idx, e.target.files[0])} />
                                    <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && addPhaseImage(project.id, idx, e.target.files[0])} />
                                  </div>
                                  <button onClick={() => setAddingPhase(null)}>Done</button>
                                </>
                              ) : editingPhase === idx ? (
                                <>
                                  {phase.notes && <p><strong>Notes:</strong> {phase.notes}</p>}
                                  {phase.documents.length > 0 && <p><strong>Docs:</strong> {phase.documents.join(", ")}</p>}
                                  {phase.images.length > 0 && <p><strong>Imgs:</strong> {phase.images.join(", ")}</p>}
                                  <button onClick={() => setEditingPhase(null)}>Done</button>
                                </>
                              ) : (
                                <>
                                  {phase.notes && <p><strong>Notes:</strong> {phase.notes}</p>}
                                  <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
                                    <button onClick={() => addPhase(idx)}>Add</button>
                                    <button onClick={() => editPhase(idx)}>Edit</button>
                                    <button onClick={() => deletePhaseDetails(project.id, idx)}>Delete</button>
                                    <button onClick={() => submitPhaseDetails(project.id, idx)}>Submit</button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
