import React, { useState, useEffect } from "react";
import "./ProjectTracker.css";
import Navbar from "./Navbar";

export default function ProjectTracker({ user, handleLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [addingPhase, setAddingPhase] = useState(null);
  const [loading, setLoading] = useState(false); // For loading feedback during fetches/updates

  const isAdmin = user?.role === "admin";

  // Reusable fetch function
  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/projects";
      
      // If user is client, only fetch their projects
      if (!isAdmin && user?.email) {
        url += `?clientEmail=${encodeURIComponent(user.email)}`;  // Encode for safety
      }

      const res = await fetch(url);
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
      console.error("Error fetching projects:", err);
      alert("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects from backend - FOR BOTH ADMIN AND CLIENT USERS
  useEffect(() => {
    if (user?.email || isAdmin) {  // Only fetch if user is logged in
      fetchProjects();
    }
  }, [isAdmin, user?.email]);

  const calculateProgress = (phases) => {
    if (!phases || !Array.isArray(phases)) return 0;
    
    const total = phases.length;
    const completed = phases.filter((p) => p.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Modal open/close
  const openProjectModal = (project) => {
    if (project && project.id) {
      setSelectedProject(project);
    }
  };
  
  const closeProjectModal = () => setSelectedProject(null);

  // Approve/reject - ADMIN ONLY (with re-fetch for automatic updates)
  const approveProject = async (projectId) => {
    if (!isAdmin) return;
    
    try {
      const res = await fetch(`http://localhost:5000/projects/${projectId}/approve`, { method: "PUT" });
      if (res.ok) {
        // Re-fetch to ensure UI is up-to-date
        await fetchProjects();
        alert("Project approved successfully!");
      } else {
        throw new Error("Failed to approve project");
      }
    } catch (err) {
      console.error("Error approving project:", err);
      alert("Error approving project.");
    }
  };
  
  const rejectProject = async (projectId) => {
    if (!isAdmin) return;
    
    try {
      const res = await fetch(`http://localhost:5000/projects/${projectId}/reject`, { method: "PUT" });
      if (res.ok) {
        // Re-fetch to ensure UI is up-to-date
        await fetchProjects();
        alert("Project rejected successfully!");
      } else {
        throw new Error("Failed to reject project");
      }
    } catch (err) {
      console.error("Error rejecting project:", err);
      alert("Error rejecting project.");
    }
  };

  // Phase operations - ADMIN ONLY
  const updatePhaseNotes = (projectId, phaseIndex, notes) => {
    if (!isAdmin) return;
    
    setProjects(projects.map(p => {
      if (p.id === projectId && p.phases && p.phases[phaseIndex]) {
        return { 
          ...p, 
          phases: p.phases.map((ph, idx) => 
            idx === phaseIndex ? { ...ph, notes } : ph
          ) 
        };
      }
      return p;
    }));
  };

  const addPhaseDocument = (projectId, phaseIndex, file) => {
    if (!isAdmin) return;
    
    setProjects(projects.map(p => {
      if (p.id === projectId && p.phases && p.phases[phaseIndex]) {
        return { 
          ...p, 
          phases: p.phases.map((ph, idx) => 
            idx === phaseIndex ? { ...ph, documents: [...ph.documents, file.name] } : ph
          ) 
        };
      }
      return p;
    }));
  };

  const addPhaseImage = (projectId, phaseIndex, file) => {
    if (!isAdmin) return;
    
    setProjects(projects.map(p => {
      if (p.id === projectId && p.phases && p.phases[phaseIndex]) {
        return { 
          ...p, 
          phases: p.phases.map((ph, idx) => 
            idx === phaseIndex ? { ...ph, images: [...ph.images, file.name] } : ph
          ) 
        };
      }
      return p;
    }));
  };

  const removePhaseDocument = (projectId, phaseIndex, docIndex) => {
    if (!isAdmin) return;
    
    setProjects(projects.map(p => {
      if (p.id === projectId && p.phases && p.phases[phaseIndex]) {
        return { 
          ...p, 
          phases: p.phases.map((ph, idx) => 
            idx === phaseIndex ? { 
              ...ph, 
              documents: ph.documents.filter((_, i) => i !== docIndex) 
            } : ph
          ) 
        };
      }
      return p;
    }));
  };

  const removePhaseImage = (projectId, phaseIndex, imgIndex) => {
    if (!isAdmin) return;
    
    setProjects(projects.map(p => {
      if (p.id === projectId && p.phases && p.phases[phaseIndex]) {
        return { 
          ...p, 
          phases: p.phases.map((ph, idx) => 
            idx === phaseIndex ? { 
              ...ph, 
              images: ph.images.filter((_, i) => i !== imgIndex) 
            } : ph
          ) 
        };
      }
      return p;
    }));
  };

  const submitPhaseDetails = async (projectId, phaseIndex) => {
    if (!isAdmin) return;
    
    // Use selectedProject directly (safer than finding from projects array)
    if (!selectedProject || selectedProject.id !== projectId) {
      console.error("❌ Project not found or ID mismatch:", projectId, selectedProject?.id);
      alert("Error: Project not found. Please refresh and try again.");
      return;
    }

    const phase = selectedProject.phases && selectedProject.phases[phaseIndex];
    
    if (!phase) {
      console.error("❌ Phase not found at index:", phaseIndex);
      alert("Error: Phase not found.");
      return;
    }

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

      // Re-fetch to ensure UI is up-to-date (instead of just updating local state)
      await fetchProjects();
      alert(`Phase "${phase.name}" updated successfully!`);
    } catch (err) {
      console.error("Error updating phase:", err);
      alert("Error updating phase. Please try again.");
    }
  };

  const toggleEditPhase = (phaseIndex) => {
    if (!isAdmin) return;
    setEditingPhase(editingPhase === phaseIndex ? null : phaseIndex);
  };
  
  const toggleAddPhase = (phaseIndex) => {
    if (!isAdmin) return;
    setAddingPhase(addingPhase === phaseIndex ? null : phaseIndex);
  };
  
  const deletePhaseDetails = (projectId, phaseIndex) => {
    if (!isAdmin) return;
    
    setProjects(projects.map(p => {
      if (p.id === projectId && p.phases && p.phases[phaseIndex]) {
        return { 
          ...p, 
          phases: p.phases.map((ph, idx) => 
            idx === phaseIndex ? { 
              ...ph, 
              notes: "", 
              documents: [], 
              images: [], 
              completed: false 
            } : ph
          ) 
        };
      }
      return p;
    }));
  };

  // Show loading state if fetching
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

      <div className="tracker-container">
        <h2>Project Tracker</h2>
        <p className="user-info">Welcome, {user?.name || user?.email} ({user?.role})</p>
        
        {projects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found.</p>
            {!isAdmin && (
              <p>Submit a project request through the Form page to get started!</p>
            )}
          </div>
        ) : (
          <div className="project-grid">
            {projects.filter(p => p && p.status !== "Rejected").map(project => {
              if (!project) return null;
              
              const progress = calculateProgress(project.phases);
              return (
                <div key={project.id} className="project-card" onClick={() => openProjectModal(project)}>
                  <h3>{project.name || "Unnamed Project"}</h3>
                  <p><strong>Client:</strong> {project.client}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="progress-text">{progress}% Complete</p>
                  <p className="status">{project.approved ? (progress === 100 ? "Finished" : "In Progress") : "Pending Approval"}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="tracker-modal-overlay" onClick={closeProjectModal}>
          <div className="tracker-modal-box" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeProjectModal}>×</button>
            <h2>{selectedProject.name}</h2>
            <p><strong>Client:</strong> {selectedProject.client}</p>
            <p><strong>Email:</strong> {selectedProject.clientEmail}</p>
            <p><strong>Status:</strong> {selectedProject.status}</p>

            {/* Only show approval buttons for admin users */}
            {!selectedProject.approved && isAdmin && (
              <div className="approval-buttons">
                <button onClick={() => approveProject(selectedProject.id)}>Approve</button>
                <button onClick={() => rejectProject(selectedProject.id)}>Reject</button>
              </div>
            )}

            <h3>Project Phases</h3>
            <div className="phase-list">
              {selectedProject.phases && selectedProject.phases.map((phase, idx) => (
                <div key={idx} className="phase-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`phase-status ${phase.completed ? "done" : "pending"}`}>
                      {phase.completed ? "✓" : "○"}
                    </span>
                    <span><strong>{phase.name}</strong></span>
                    <span className={`phase-badge ${phase.completed ? "completed" : "pending"}`}>
                      {phase.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  {/* Show phase details to all users */}
                  {phase.notes && <p><strong>Notes:</strong> {phase.notes}</p>}
                  {phase.documents && phase.documents.length > 0 && (
                    <p><strong>Documents:</strong> {phase.documents.join(", ")}</p>
                  )}
                  {phase.images && phase.images.length > 0 && (
                    <p><strong>Images:</strong> {phase.images.join(", ")}</p>
                  )}

                  {/* Only show edit controls for admin users */}
                  {isAdmin && (
                    <div className="phase-details">
                      {addingPhase === idx ? (
                        <>
                          <textarea
                            value={phase.notes || ""}
                            onChange={e => updatePhaseNotes(selectedProject.id, idx, e.target.value)}
                            placeholder="Add phase notes..."
                          />
                          <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
                            <input type="file" onChange={e => e.target.files[0] && addPhaseDocument(selectedProject.id, idx, e.target.files[0])} />
                            <input type="file" accept="image/*" onChange={e => e.target.files[0] && addPhaseImage(selectedProject.id, idx, e.target.files[0])} />
                          </div>
                          <button onClick={() => setAddingPhase(null)}>Done</button>
                        </>
                      ) : editingPhase === idx ? (
                        <>
                          <button onClick={() => setEditingPhase(null)}>Close Edit</button>
                        </>
                      ) : (
                        <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
                          <button onClick={() => toggleAddPhase(idx)}>Add Details</button>
                          <button onClick={() => toggleEditPhase(idx)}>Edit</button>
                          <button onClick={() => deletePhaseDetails(selectedProject.id, idx)}>Clear</button>
                          <button onClick={() => submitPhaseDetails(selectedProject.id, idx)}>Submit</button>
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
    </>
  );
}
