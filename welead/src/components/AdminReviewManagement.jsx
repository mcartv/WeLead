import React, { useState, useEffect, useMemo } from "react";
import "./AdminStyles.css";
import Navbar from "./Navbar";

const AdminReviewManagement = React.memo(({ user, handleLogout }) => {
  const [tasks, setTasks] = useState([]); // Projects from DB
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({ message: "" });
  const [loading, setLoading] = useState(true);

  // Memoized phases
  const phases = useMemo(() => ["Design", "Approval", "Construction"], []);

  // Fetch projects, requests, notifications
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/projects");
        const data = await res.json();
        // Only active projects
        const activeProjects = (data || []).filter((p) => p.status === "active");
        setTasks(activeProjects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Memoize tasks by phase dynamically from project phases
  const tasksByPhase = useMemo(() => {
    const acc = {};
    tasks.forEach((project) => {
      project.phases.forEach((phase) => {
        if (!acc[phase.name]) acc[phase.name] = [];
        acc[phase.name].push({ ...phase, projectName: project.name, client: project.client, dueDate: project.timeline });
      });
    });
    return acc;
  }, [tasks]);

  // Request handlers
  const approveRequest = (id) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));
  const denyRequest = (id) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r)));
  const rescheduleRequest = (id) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rescheduled" } : r)));
  const addComment = (id, comment) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, comments: comment } : r)));

  const addNotification = (e) => {
    e.preventDefault();
    if (!newNotification.message.trim()) return;
    setNotifications((prev) => [
      ...prev,
      { ...newNotification, id: Date.now(), date: new Date().toISOString().split("T")[0] },
    ]);
    setNewNotification({ message: "" });
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="admin-review-container">
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="dashboard-grid">
            {/* Left Column: Project Overview */}
            <div className="left-column">
              <div className="section project-overview">
                <h2>Project Overview</h2>
                <p>All active projects with phase tracking.</p>
                {phases.map((phase) => (
                  <div key={phase} className="phase-section">
                    <h3>{phase} Phase</h3>
                    {Object.keys(tasksByPhase).length === 0 ? (
                      <p>No active projects.</p>
                    ) : (
                      Object.entries(tasksByPhase).map(([phaseName, phaseTasks]) => (
                        <div key={phaseName} className="phase-section">
                          <h3>{phaseName} Phase</h3>
                          {phaseTasks.length === 0 ? (
                            <p>No tasks in this phase.</p>
                          ) : (
                            phaseTasks.map((t, idx) => (
                              <div key={idx} className="task-item">
                                <div className="task-info">
                                  <h4>{t.projectName}</h4>
                                  <p>Client: {t.client || "N/A"}</p>
                                  <p>Due: {t.dueDate || "No due date"}</p>
                                  <p>Completed: {t.completed ? "Yes" : "No"}</p>
                                  <p>Notes: {t.notes || "None"}</p>
                                  {t.documents?.length > 0 && (
                                    <div>
                                      <h5>Documents:</h5>
                                      {t.documents.map((doc, i) => <a key={i} href={`#${doc}`} target="_blank">{doc}</a>)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Notifications & Requests */}
            <div className="right-column">
              {/* Notifications */}
              <div className="section notifications-comments">
                <h2>Notifications & Comments</h2>
                <form onSubmit={addNotification} className="add-notification-form">
                  <input
                    type="text"
                    placeholder="New notification message..."
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    required
                  />
                  <button type="submit">Add Notification</button>
                </form>
                {notifications.map((n) => (
                  <div key={n.id} className="notification-item">
                    <p>{n.message}</p>
                    <small>{n.date}</small>
                  </div>
                ))}
              </div>

              {/* Client Requests */}
              <div className="section client-requests">
                <h2>Client Requests</h2>
                {requests.length === 0 ? (
                  <p>No requests.</p>
                ) : (
                  requests.map((r) => (
                    <div key={r.id} className="request-item">
                      <p><strong>Milestone:</strong> {tasks.find((t) => t.id === r.taskId)?.name || "Unknown"}</p>
                      <p><strong>Request Details:</strong> {r.request}</p>
                      <p><strong>Requested By:</strong> {r.requestedBy}</p>
                      <p><strong>Status:</strong> {r.status}</p>
                      {r.status === "Pending" && (
                        <div className="request-actions">
                          <button onClick={() => approveRequest(r.id)}>✅ Approve</button>
                          <button onClick={() => denyRequest(r.id)}>❌ Reject</button>
                          <button onClick={() => rescheduleRequest(r.id)}>🕓 Reschedule</button>
                        </div>
                      )}
                      <div>
                        <h5>Comments:</h5>
                        <textarea
                          value={r.comments}
                          onChange={(e) => addComment(r.id, e.target.value)}
                          placeholder="Leave feedback or comments..."
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Planner Overview */}
        <div className="section planner-overview">
          <h2>Planner Overview</h2>
          <div className="calendar-view">
            {tasks.map((t) => (
              <div key={t.id} className="calendar-item">
                <p><strong>{t.name}</strong> - Due: {t.dueDate} - Status: {t.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});

export default AdminReviewManagement;
