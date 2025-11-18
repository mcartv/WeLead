import React, { useState, useEffect } from "react";
import "./AdminStyles.css";
import Navbar from "./Navbar";

export default function ProjectTracker({ user, handleLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [addingPhase, setAddingPhase] = useState(null);

  const isAdmin = user?.role === "admin";

  // Fetch projects from backend
  useEffect(() => {
    if (!isAdmin) return;

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
  }, [isAdmin]);

  const calculateProgress = (phases) => {
    const total = phases.length;
    const completed = phases.filter((p) => p.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Modal open/close
  const openProjectModal = (project) => setSelectedProject(project);
  const closeProjectModal = () => setSelectedProject(null);

  // Approve/reject
  const approveProject = async (projectId) => {
    const res = await fetch(`http://localhost:5000/projects/${projectId}/approve`, { method: "PUT" });
    if (res.ok) {
      setProjects(projects.map(p => p.id === projectId ? { ...p, approved: true, status: "In Progress" } : p));
    }
  };
  const rejectProject = async (projectId) => {
    const res = await fetch(`http://localhost:5000/projects/${projectId}/reject`, { method: "PUT" });
    if (res.ok) {
      setProjects(projects.map(p => p.id === projectId ? { ...p, approved: false, status: "Rejected" } : p));
    }
  };

  // Phase operations
  const updatePhaseNotes = (projectId, phaseIndex, notes) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, phases: p.phases.map((ph, idx) => idx === phaseIndex ? { ...ph, notes } : ph) } : p
    ));
  };

  const addPhaseDocument = (projectId, phaseIndex, file) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, phases: p.phases.map((ph, idx) => idx === phaseIndex ? { ...ph, documents: [...ph.documents, file.name] } : ph) } : p
    ));
  };

  const addPhaseImage = (projectId, phaseIndex, file) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, phases: p.phases.map((ph, idx) => idx === phaseIndex ? { ...ph, images: [...ph.images, file.name] } : ph) } : p
    ));
  };

  const removePhaseDocument = (projectId, phaseIndex, docIndex) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, phases: p.phases.map((ph, idx) => idx === phaseIndex ? { ...ph, documents: ph.documents.filter((_, i) => i !== docIndex) } : ph) } : p
    ));
  };

  const removePhaseImage = (projectId, phaseIndex, imgIndex) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, phases: p.phases.map((ph, idx) => idx === phaseIndex ? { ...ph, images: ph.images.filter((_, i) => i !== imgIndex) } : ph) } : p
    ));
  };

  const submitPhaseDetails = async (projectId, phaseIndex) => {
    const project = projects.find(p => p.id === projectId);
    const phase = project.phases[phaseIndex];

    try {
      const res = await fetch(`http://localhost:5000/projects/${projectId}/phases/${phaseIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: true,
          notes: phase.notes,
          documents: phase.documents,
          images: phase.images
        })
      });

      if (!res.ok) throw new Error("Failed to update phase");

      const updatedProject = await res.json();
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      alert(`Phase "${phase.name}" updated successfully!`);
    } catch (err) {
      console.error(err);
      alert("Error updating phase.");
    }
  };

  const toggleEditPhase = (phaseIndex) => setEditingPhase(editingPhase === phaseIndex ? null : phaseIndex);
  const toggleAddPhase = (phaseIndex) => setAddingPhase(addingPhase === phaseIndex ? null : phaseIndex);
  const deletePhaseDetails = (projectId, phaseIndex) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, phases: p.phases.map((ph, idx) => idx === phaseIndex ? { ...ph, notes: "", documents: [], images: [], completed: false } : ph) } : p
    ));
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="tracker-container">
        <h2>Project Tracker</h2>
        <div className="project-grid">
          {projects.filter(p => p.status !== "Rejected").map(project => {
            const progress = calculateProgress(project.phases);
            return (
              <div key={project.id} className="project-card" onClick={() => openProjectModal(project)}>
                <h3>{project.name}</h3>
                <p>{project.client}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="status">{project.approved ? (progress === 100 ? "Finished" : "In Progress") : project.status}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="tracker-modal-overlay" onClick={closeProjectModal}>
          <div className="tracker-modal-box" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeProjectModal}>x</button>
            <h2>{selectedProject.name}</h2>
            <p><strong>Client:</strong> {selectedProject.client}</p>

            {!selectedProject.approved && isAdmin && (
              <div className="approval-buttons">
                <button onClick={() => approveProject(selectedProject.id)}>Approve</button>
                <button onClick={() => rejectProject(selectedProject.id)}>Reject</button>
              </div>
            )}

            <h3>Phases</h3>
            <div className="phase-list">
              {selectedProject.phases.map((phase, idx) => (
                <div key={idx} className="phase-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`phase-status ${phase.completed ? "done" : "pending"}`}>{phase.completed ? "✓" : "○"}</span>
                    <span>{phase.name}</span>
                  </div>

                  {isAdmin && (
                    <div className="phase-details">
                      {addingPhase === idx ? (
                        <>
                          <textarea
                            value={phase.notes}
                            onChange={e => updatePhaseNotes(selectedProject.id, idx, e.target.value)}
                          />
                          <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
                            <input type="file" onChange={e => e.target.files[0] && addPhaseDocument(selectedProject.id, idx, e.target.files[0])} />
                            <input type="file" accept="image/*" onChange={e => e.target.files[0] && addPhaseImage(selectedProject.id, idx, e.target.files[0])} />
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
                            <button onClick={() => toggleAddPhase(idx)}>Add</button>
                            <button onClick={() => toggleEditPhase(idx)}>Edit</button>
                            <button onClick={() => deletePhaseDetails(selectedProject.id, idx)}>Delete</button>
                            <button onClick={() => submitPhaseDetails(selectedProject.id, idx)}>Submit</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}