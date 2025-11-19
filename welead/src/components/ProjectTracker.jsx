import React, { useState, useEffect } from "react";
import "./ProjectTracker.css";
import Navbar from "./Navbar";

export default function ProjectTracker({ user, handleLogout }) {
  const [projects, setProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [addingPhase, setAddingPhase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  // ----------------------------
  // Fetch active projects (backend should exclude archived by default when archived not requested)
  // ----------------------------
  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/projects";
      if (!isAdmin && user?.email) {
        url += `?clientEmail=${encodeURIComponent(user.email)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();

      const formatted = (data || []).map((p) => ({
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

      setProjects(formatted);
    } catch (err) {
      console.error("Error fetching projects:", err);
      alert("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Fetch archived projects explicitly
  // ----------------------------
  const fetchArchivedProjects = async () => {
    try {
      const url = "http://localhost:5000/projects?archived=true";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch archived projects");
      const data = await res.json();
      const formatted = (data || []).map((p) => ({ ...p, id: p._id }));
      setArchivedProjects(formatted);
    } catch (err) {
      console.error("Error fetching archived projects:", err);
      // Archives are optional; do not alert aggressively
    }
  };

  useEffect(() => {
    if (user?.email || isAdmin) {
      fetchProjects();
    }
  }, [isAdmin, user?.email]);

  // ----------------------------
  // Helpers
  // ----------------------------
  const calculateProgress = (phases) => {
    if (!phases || !Array.isArray(phases)) return 0;
    const total = phases.length;
    const completed = phases.filter((p) => p.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const isPhaseUnlocked = (phases, index) => {
    if (!phases || !Array.isArray(phases)) return false;
    if (index === 0) return true;
    return phases[index - 1]?.completed === true;
  };

  // ----------------------------
  // Modal control (open latest copy)
  // ----------------------------
  const openProjectModal = (project) => {
    if (project && project.id) {
      // Use the project object passed (it's from latest list). Set selectedProject and reset editors.
      setSelectedProject(project);
      setEditingPhase(null);
      setAddingPhase(null);
    }
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setEditingPhase(null);
    setAddingPhase(null);
  };

  // ----------------------------
  // Approve / Reject (admin)
  // ----------------------------
  const approveProject = async (projectId) => {
    if (!isAdmin) return;
    try {
      setActionLoading(true);
      const res = await fetch(`http://localhost:5000/projects/${projectId}/approve`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to approve project");
      await fetchProjects();
      // Update selectedProject if open
      if (selectedProject?.id === projectId) {
        const updated = (await (await fetch("http://localhost:5000/projects")).json()).find(p => p._id === projectId);
        if (updated) setSelectedProject({ ...updated, id: updated._id });
      }
      alert("Project approved successfully!");
    } catch (err) {
      console.error("Error approving project:", err);
      alert("Error approving project.");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectProject = async (projectId) => {
    if (!isAdmin) return;
    try {
      setActionLoading(true);
      const res = await fetch(`http://localhost:5000/projects/${projectId}/reject`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to reject project");
      await fetchProjects();
      closeProjectModal();
      alert("Project rejected successfully!");
    } catch (err) {
      console.error("Error rejecting project:", err);
      alert("Error rejecting project.");
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------
  // Local-phase edits (mirror to UI)
  // ----------------------------
  const updatePhaseNotes = (projectId, phaseIndex, notes) => {
    if (!isAdmin) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, notes } : ph)) } : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => ({ ...prev, phases: prev.phases.map((ph, i) => (i === phaseIndex ? { ...ph, notes } : ph)) }));
    }
  };

  const addPhaseDocument = (projectId, phaseIndex, file) => {
    if (!isAdmin) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, documents: [...(ph.documents || []), file.name] } : ph)) }
          : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => ({ ...prev, phases: prev.phases.map((ph, i) => (i === phaseIndex ? { ...ph, documents: [...(ph.documents || []), file.name] } : ph)) }));
    }
  };

  const addPhaseImage = (projectId, phaseIndex, file) => {
    if (!isAdmin) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, images: [...(ph.images || []), file.name] } : ph)) }
          : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => ({ ...prev, phases: prev.phases.map((ph, i) => (i === phaseIndex ? { ...ph, images: [...(ph.images || []), file.name] } : ph)) }));
    }
  };

  const removePhaseDocument = (projectId, phaseIndex, docIndex) => {
    if (!isAdmin) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, documents: ph.documents.filter((_, j) => j !== docIndex) } : ph)) }
          : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => ({ ...prev, phases: prev.phases.map((ph, i) => (i === phaseIndex ? { ...ph, documents: ph.documents.filter((_, j) => j !== docIndex) } : ph)) }));
    }
  };

  const removePhaseImage = (projectId, phaseIndex, imgIndex) => {
    if (!isAdmin) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, images: ph.images.filter((_, j) => j !== imgIndex) } : ph)) }
          : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => ({ ...prev, phases: prev.phases.map((ph, i) => (i === phaseIndex ? { ...ph, images: ph.images.filter((_, j) => j !== imgIndex) } : ph)) }));
    }
  };

  const deletePhaseDetails = (projectId, phaseIndex) => {
    if (!isAdmin) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, notes: "", documents: [], images: [], completed: false } : ph)) }
          : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => ({ ...prev, phases: prev.phases.map((ph, i) => (i === phaseIndex ? { ...ph, notes: "", documents: [], images: [], completed: false } : ph)) }));
    }
  };

  // ----------------------------
  // Submit phase (persist). If last phase complete, confirm archive (B)
  // ----------------------------
  const submitPhaseDetails = async (projectId, phaseIndex) => {
    if (!isAdmin) return;
    if (!selectedProject || selectedProject.id !== projectId) {
      alert("Error: Could not find project data. Please re-open the project.");
      return;
    }
    if (!isPhaseUnlocked(selectedProject.phases, phaseIndex)) {
      return alert("Complete the previous phase first!");
    }

    const phase = selectedProject.phases[phaseIndex];
    if (!phase) return alert("Phase not found.");

    try {
      setActionLoading(true);

      // Submit phase update
      const res = await fetch(`http://localhost:5000/projects/${projectId}/phases/${phaseIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: true,
          notes: phase.notes || "",
          documents: phase.documents || [],
          images: phase.images || []
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Phase update failed");
      }

      // Refresh active projects list
      await fetchProjects();

      // Get the freshest copy of this project
      const allActive = await (await fetch("http://localhost:5000/projects")).json();
      const fresh = (allActive || []).find(p => p._id === projectId);
      const updatedProject = fresh ? { ...fresh, id: fresh._id } : null;

      // Determine progress using server-updated phases
      const phasesToCheck = updatedProject
        ? updatedProject.phases
        : selectedProject.phases.map((ph, i) => (i === phaseIndex ? { ...ph, completed: true } : ph));
      const progress = calculateProgress(phasesToCheck);

      // Only ask to archive if project fully complete
      if (progress === 100) {
        const shouldArchive = window.confirm("All phases are complete. Do you want to archive (mark as Completed)?");
        if (shouldArchive) {
          const archRes = await fetch(`http://localhost:5000/projects/${projectId}/archive`, { method: "PUT" });
          if (!archRes.ok) {
            alert("Phase submitted but archiving failed. You can archive manually from Archives.");
          } else {
            await fetchProjects();
            await fetchArchivedProjects();
            alert("Project archived (Completed).");
            closeProjectModal();
            return;
          }
        } else {
          // Admin declined archive — keep project active
          if (updatedProject) setSelectedProject(updatedProject);
          alert("Phase submitted. Project remains active.");
          return;
        }
      }

      // Not fully complete — update selectedProject to latest server state
      if (updatedProject) {
        setSelectedProject(updatedProject);
      } else {
        const reall = await (await fetch("http://localhost:5000/projects")).json();
        const found = (reall || []).find(p => p._id === projectId);
        if (found) setSelectedProject({ ...found, id: found._id });
      }

      alert(`Phase "${phase.name}" marked as completed!`);
    } catch (err) {
      console.error("Error updating phase:", err);
      alert("Failed to submit phase. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle helpers
  const toggleEditPhase = (phaseIndex) => {
    if (!isAdmin) return;
    setEditingPhase(editingPhase === phaseIndex ? null : phaseIndex);
  };

  const toggleAddPhase = (phaseIndex) => {
    if (!isAdmin) return;
    setAddingPhase(addingPhase === phaseIndex ? null : phaseIndex);
  };

  // Archive drawer toggle (A: top-right button triggers drawer)
  const toggleArchiveDrawer = async () => {
    const newOpen = !archiveOpen;
    setArchiveOpen(newOpen);
    if (newOpen) {
      await fetchArchivedProjects();
    }
  };

  // ----------------------------
  // Render
  // ----------------------------
  if (loading) {
    return (
      <>
        <Navbar user={user} handleLogout={handleLogout} />
        <div className="tracker-container">
          <p>Loading projects...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="tracker-topbar">
        <div className="tracker-title">
          <h2>Project Tracker</h2>
        </div>

        <div className="tracker-actions">
          <button className="archive-toggle-btn" onClick={toggleArchiveDrawer}>
            {archiveOpen ? "Close Completed" : `View Completed (${archivedProjects.length || "—"})`}
          </button>
        </div>
      </div>

      <div className="tracker-container">
        {projects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found.</p>
            {!isAdmin && <p>Submit a project request through the Form page to get started!</p>}
          </div>
        ) : (
          <div className="project-grid">
            {projects
              .filter(p => p && p.status !== "Rejected")
              .map(project => {
                if (!project) return null;
                const progress = calculateProgress(project.phases);
                return (
                  <div key={project.id} className="project-card" onClick={() => openProjectModal(project)}>
                    <div className="card-header">
                      <div>
                        <h3 className="project-name">{project.name || "Unnamed Project"}</h3>
                        <div className="client-info">{project.client}</div>
                      </div>
                      <div className={`status ${progress === 100 ? "finished" : "in-progress"}`}>
                        {project.approved ? (progress === 100 ? "Finished" : "In Progress") : "Pending Approval"}
                      </div>
                    </div>

                    <div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="progress-text">{progress}% Complete</p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="tracker-modal-overlay" onClick={closeProjectModal}>
          <div className="tracker-modal-box left-align" onClick={e => e.stopPropagation()}>
            <button className="tracker-modal-close-btn" onClick={closeProjectModal}>×</button>

            <div className="modal-header">
              <h2>{selectedProject.name}</h2>
              <div className="modal-meta">
                <p><strong>Client:</strong> {selectedProject.client}</p>
                <p><strong>Email:</strong> {selectedProject.clientEmail}</p>
                <p><strong>Status:</strong> {selectedProject.status}</p>
              </div>
            </div>

            {/* Approval buttons for admin */}
            {!selectedProject.approved && isAdmin && (
              <div className="approval-buttons">
                <button onClick={() => approveProject(selectedProject.id)} disabled={actionLoading}>Approve</button>
                <button onClick={() => rejectProject(selectedProject.id)} disabled={actionLoading}>Reject</button>
              </div>
            )}

            <h3>Project Phases</h3>
            <div className="phase-list">
              {selectedProject.phases && selectedProject.phases.map((phase, idx) => (
                <div key={idx} className="phase-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`phase-status ${phase.completed ? "done" : "pending"}`}>{phase.completed ? "✓" : "○"}</span>
                    <span><strong>{phase.name}</strong></span>
                    <span className={`phase-badge ${phase.completed ? "completed" : "pending"}`}>{phase.completed ? "Completed" : "Pending"}</span>
                  </div>

                  {/* Phase details visible to all */}
                  {phase.notes && <p><strong>Notes:</strong> {phase.notes}</p>}
                  {phase.documents && phase.documents.length > 0 && <p><strong>Documents:</strong> {phase.documents.join(", ")}</p>}
                  {phase.images && phase.images.length > 0 && <p><strong>Images:</strong> {phase.images.join(", ")}</p>}

                  {/* Admin controls (linear) */}
                  {isAdmin && (
                    <div className="phase-details">
                      <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
                        <button
                          disabled={!isPhaseUnlocked(selectedProject.phases, idx)}
                          className={!isPhaseUnlocked(selectedProject.phases, idx) ? "disabled" : ""}
                          onClick={() => toggleAddPhase(idx)}
                        >
                          Add Details
                        </button>

                        <button
                          disabled={!isPhaseUnlocked(selectedProject.phases, idx)}
                          className={!isPhaseUnlocked(selectedProject.phases, idx) ? "disabled" : ""}
                          onClick={() => toggleEditPhase(idx)}
                        >
                          Edit
                        </button>

                        <button
                          disabled={!isPhaseUnlocked(selectedProject.phases, idx)}
                          className={!isPhaseUnlocked(selectedProject.phases, idx) ? "disabled" : ""}
                          onClick={() => deletePhaseDetails(selectedProject.id, idx)}
                        >
                          Clear
                        </button>

                        <button
                          disabled={!isPhaseUnlocked(selectedProject.phases, idx) || actionLoading}
                          className={!isPhaseUnlocked(selectedProject.phases, idx) ? "disabled" : ""}
                          onClick={() => submitPhaseDetails(selectedProject.id, idx)}
                        >
                          {actionLoading ? "Submitting..." : "Submit"}
                        </button>
                      </div>

                      {/* Add block */}
                      {addingPhase === idx && (
                        <div className="add-block">
                          <textarea
                            value={phase.notes || ""}
                            onChange={e => updatePhaseNotes(selectedProject.id, idx, e.target.value)}
                            placeholder="Add phase notes..."
                          />
                          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
                            <input type="file" onChange={e => e.target.files[0] && addPhaseDocument(selectedProject.id, idx, e.target.files[0])} />
                            <input type="file" accept="image/*" onChange={e => e.target.files[0] && addPhaseImage(selectedProject.id, idx, e.target.files[0])} />
                          </div>
                          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
                            <button onClick={() => setAddingPhase(null)}>Done</button>
                          </div>
                        </div>
                      )}

                      {/* Edit block */}
                      {editingPhase === idx && (
                        <div className="edit-block">
                          <p>Edit mode enabled — change notes/files then click Submit.</p>
                          <button onClick={() => setEditingPhase(null)}>Close Edit</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ARCHIVE DRAWER */}
      <div className={`archive-drawer ${archiveOpen ? "open" : ""}`}>
        <div className="archive-header">
          <h3>Completed Projects</h3>
          <button className="close-archive" onClick={toggleArchiveDrawer}>Close</button>
        </div>

        <div className="archive-list">
          {archivedProjects.length === 0 ? (
            <p className="muted">No completed projects yet.</p>
          ) : (
            archivedProjects.map((p) => {
              const progress = calculateProgress(p.phases);
              return (
                <div key={p._id} className="archive-item">
                  <h4>{p.name || "Unnamed Project"}</h4>
                  <p><strong>Client:</strong> {p.client}</p>
                  <p className="muted">Progress: {progress}%</p>
                  <p className="muted">Status: {p.status || "Completed"}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
