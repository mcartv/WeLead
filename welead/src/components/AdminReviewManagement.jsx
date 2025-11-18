import React, { useState, useMemo } from "react";
import "./AdminStyles.css";
import Navbar from "./Navbar";

const AdminReviewManagement = React.memo(({ user, handleLogout }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Urban Residence Tower",
      client: "ACME Corp.",
      status: "active",
      timeline: "2025-12-31",
      phases: [
        { name: "Design", completed: true, notes: "Initial sketches done", documents: ["design.pdf"], images: ["design.png"] },
        { name: "Approval", completed: false, notes: "", documents: [], images: [] },
        { name: "Construction", completed: false, notes: "", documents: [], images: [] },
      ],
    },
    {
      id: 2,
      name: "City Mall Renovation",
      client: "MegaMall Inc.",
      status: "active",
      timeline: "2026-03-15",
      phases: [
        { name: "Design", completed: true, notes: "Layouts approved", documents: ["layouts.pdf"], images: [] },
        { name: "Approval", completed: false, notes: "", documents: [], images: [] },
        { name: "Construction", completed: false, notes: "", documents: [], images: [] },
      ],
    },
  ]);

  const [requests, setRequests] = useState([
    { id: 101, taskId: 1, request: "Change facade color", requestedBy: "John Doe", status: "Pending", comments: "" },
    { id: 102, taskId: 2, request: "Add more elevators", requestedBy: "Jane Smith", status: "Pending", comments: "" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Project approvals due this week", date: "2025-11-18" },
    { id: 2, message: "New client request submitted", date: "2025-11-17" },
  ]);

  const [newNotification, setNewNotification] = useState({ message: "" });

  const phases = useMemo(() => ["Design", "Approval", "Construction"], []);

  const tasksByPhase = useMemo(() => {
    const acc = {};
    tasks.forEach((project) => {
      project.phases.forEach((phase) => {
        if (!acc[phase.name]) acc[phase.name] = [];
        acc[phase.name].push({
          ...phase,
          projectName: project.name,
          client: project.client,
          dueDate: project.timeline,
        });
      });
    });
    return acc;
  }, [tasks]);

  const approveRequest = (id) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));
  const denyRequest = (id) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r)));
  const rescheduleRequest = (id) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rescheduled" } : r)));
  const addComment = (id, comment) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, comments: comment } : r)));

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
        <div className="dashboard-grid">
          {/* ---------------- Left Column: Project Overview ---------------- */}
          <div className="left-column">
            <div className="section project-overview">
              <h2>Project Overview</h2>
              {phases.map((phase) => (
                <div key={phase} className="phase-section">
                  <h3>{phase} Phase</h3>
                  {tasksByPhase[phase]?.length > 0 ? (
                    tasksByPhase[phase].map((task, idx) => (
                      <div key={idx} className="task-card">
                        <h4>{task.projectName}</h4>
                        <p>
                          <strong>Client:</strong> {task.client || "N/A"}
                        </p>
                        <p>
                          <strong>Due:</strong> {task.dueDate || "No due date"}
                        </p>
                        <p>
                          <strong>Completed:</strong> {task.completed ? "Yes" : "No"}
                        </p>
                        {task.notes && (
                          <p>
                            <strong>Notes:</strong> {task.notes}
                          </p>
                        )}
                        {task.documents?.length > 0 && (
                          <div>
                            <strong>Documents:</strong>
                            <ul>
                              {task.documents.map((doc, i) => (
                                <li key={i}>
                                  <a href={`#${doc}`} target="_blank" rel="noreferrer">
                                    {doc}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No tasks in this phase.</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- Right Column: Notifications & Requests ---------------- */}
          <div className="right-column">
            {/* Notifications */}
            <div className="section notifications-comments">
              <h2>Notifications</h2>
              <form onSubmit={addNotification} className="add-notification-form">
                <input
                  type="text"
                  placeholder="New notification message..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  required
                />
                <button type="submit">Add</button>
              </form>
              <div className="notification-list">
                {notifications.map((n) => (
                  <div key={n.id} className="notification-item">
                    <p>{n.message}</p>
                    <small>{n.date}</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Requests */}
            <div className="section client-requests">
              <h2>Client Requests</h2>
              {requests.length === 0 ? (
                <p>No requests.</p>
              ) : (
                requests.map((r) => (
                  <div key={r.id} className="request-card">
                    <p>
                      <strong>Project:</strong> {tasks.find((t) => t.id === r.taskId)?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Request:</strong> {r.request}
                    </p>
                    <p>
                      <strong>Requested By:</strong> {r.requestedBy}
                    </p>
                    <p>
                      <strong>Status:</strong> {r.status}
                    </p>
                    {r.status === "Pending" && (
                      <div className="request-actions">
                        <button onClick={() => approveRequest(r.id)}>✅ Approve</button>
                        <button onClick={() => denyRequest(r.id)}>❌ Reject</button>
                        <button onClick={() => rescheduleRequest(r.id)}>🕓 Reschedule</button>
                      </div>
                    )}
                    <textarea
                      value={r.comments}
                      onChange={(e) => addComment(r.id, e.target.value)}
                      placeholder="Leave a comment..."
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ---------------- Planner Overview ---------------- */}
        <div className="section planner-overview">
          <h2>Planner Overview</h2>
          <div className="calendar-view">
            {tasks.map((t) => (
              <div key={t.id} className="calendar-item">
                <p>
                  <strong>{t.name}</strong> - Due: {t.timeline} - Status: {t.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});

export default AdminReviewManagement;
