import React, { useState } from "react";
import "./Planner.css";

const Planner = ({ user }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Initial Design Review",
      phase: "Design",
      progress: 80,
      status: "In Progress",
      dueDate: "2023-10-15",
      client: "Client A",
      approval: "Approved",
      deliverables: ["design_plan.pdf", "sketches.jpg"],
    },
    {
      id: 2,
      name: "Approval Meeting",
      phase: "Approval",
      progress: 50,
      status: "Pending",
      dueDate: "2023-10-20",
      client: "Client A",
      approval: "Pending",
      deliverables: [],
    },
    {
      id: 3,
      name: "Foundation Construction",
      phase: "Construction",
      progress: 0,
      status: "Not Started",
      dueDate: "2023-11-01",
      client: "Client A",
      approval: "Pending",
      deliverables: [],
    },
  ]);

  const [requests, setRequests] = useState([
    {
      id: 1,
      taskId: 1,
      request: "Extend review date by 1 week",
      status: "Pending",
      requestedBy: "Client A",
      comments: "",
    },
  ]);

  const [notifications] = useState([
    { id: 1, message: "Milestone 'Initial Design Review' updated to 80% complete.", date: "2023-10-10" },
    { id: 2, message: "Reminder: Approval Meeting scheduled for 2023-10-20.", date: "2023-10-09" },
  ]);

  const [newRequest, setNewRequest] = useState({ taskId: "", request: "" });

  const submitRequest = (e) => {
    e.preventDefault();
    if (!newRequest.taskId || !newRequest.request.trim()) return;

    // Ensure taskId is stored as a number for consistency
    const taskId = parseInt(newRequest.taskId, 10);

    setRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        taskId,
        request: newRequest.request,
        status: "Pending",
        requestedBy: user?.name || "Client A",
        comments: "",
      },
    ]);
    setNewRequest({ taskId: "", request: "" });
  };

  const handleFileUpload = (taskId, files) => {
    const fileNames = Array.from(files).map((file) => file.name);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, deliverables: [...t.deliverables, ...fileNames] } : t
      )
    );
  };

  const phases = ["Design", "Approval", "Construction"];
  const tasksByPhase = phases.reduce((acc, phase) => {
    acc[phase] = tasks.filter((t) => t.phase === phase);
    return acc;
  }, {});

  return (
    <div
      style={{
        marginTop: "120px",
        color: "#333",
        fontSize: "14px",
        maxWidth: "800px",
        margin: "120px auto 0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "10px", fontWeight: "normal" }}>
        📅 Client View → Planner / Scheduler
      </h1>
      <p style={{ marginBottom: "20px", fontSize: "12px", color: "#666" }}>
        Track personal project timeline and send requests to admin.
      </p>

      {/* Timeline / Phases View */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "15px", fontWeight: "normal" }}>📈 Timeline / Phases View</h2>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
          See current progress (Design → Approval → Construction).
        </p>
        {phases.map((phase) => (
          <div key={phase} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ marginBottom: "10px", fontSize: "16px" }}>{phase} Phase</h3>
            {tasksByPhase[phase].length === 0 ? (
              <p style={{ fontSize: "12px", color: "#666" }}>No milestones in this phase.</p>
            ) : (
              tasksByPhase[phase].map((t) => (
                <div
                  key={t.id}
                  style={{
                    marginBottom: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{t.name}</strong>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Due: {t.dueDate} | Status: {t.status} | Approval: {t.approval}
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      Progress: {t.progress}%
                      <div
                        style={{
                          width: "100%",
                          height: "4px",
                          background: "#f0f0f0",
                          marginTop: "2px",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${t.progress}%`,
                            background: "#333",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {/* Deliverables Section */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #e0e0e0" }}>
        <h2 style={{ marginBottom: "10px", fontWeight: "normal" }}>📦 Deliverables Section</h2>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
          Upload files and see accepted ones.
        </p>
        {tasks.map((t) => (
          <div key={t.id} style={{ marginBottom: "10px" }}>
            <h4>{t.name}</h4>
            <div style={{ marginBottom: "5px" }}>
              <strong>Accepted Deliverables:</strong>
              {t.deliverables.length === 0 ? (
                <span style={{ fontSize: "12px", color: "#666" }}> None</span>
              ) : (
                t.deliverables.map((d, idx) => (
                  <a
                    key={idx}
                    href={`#${d}`}
                    style={{ fontSize: "12px", color: "#007bff", marginRight: "5px" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {d}
                  </a>
                ))
              )}
            </div>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(t.id, e.target.files)}
              style={{ fontSize: "12px" }}
            />
            <p style={{ fontSize: "10px", color: "#666" }}>Upload new files for this milestone.</p>
          </div>
        ))}
      </div>

      {/* Request Adjustments Form */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #e0e0e0" }}>
        <h2 style={{ marginBottom: "10px", fontWeight: "normal" }}>💬 Request Adjustments Form</h2>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
          Ask for extensions or approval changes.
        </p>
        <form onSubmit={submitRequest} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <select
            value={newRequest.taskId}
            onChange={(e) => setNewRequest({ ...newRequest, taskId: e.target.value })}
            required
            style={{ padding: "5px", fontSize: "12px" }}
          >
            <option value="">Select Milestone</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Describe your request (e.g., extend date by 1 week or change approval status)..."
            value={newRequest.request}
            onChange={(e) => setNewRequest({ ...newRequest, request: e.target.value })}
            required
            style={{ padding: "5px", fontSize: "12px", resize: "vertical", minHeight: "60px" }}
          />
          <button type="submit" style={{ padding: "5px 10px", fontSize: "12px", alignSelf: "flex-start" }}>
            Submit Request
          </button>
        </form>
      </div>

      {/* Approval Status Tracker */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #e0e0e0" }}>
        <h2 style={{ marginBottom: "10px", fontWeight: "normal" }}>📑 Approval Status Tracker</h2>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
          See what’s approved or still pending.
        </p>
        {requests.map((r) => {
          const task = tasks.find((t) => t.id === r.taskId);
          return (
            <div key={r.id} style={{ marginBottom: "5px", padding: "5px", border: "1px solid #e0e0e0" }}>
              <div style={{ fontSize: "12px" }}>
                <strong>Milestone:</strong> {task ? task.name : "Unknown"}
              </div>
              <div style={{ fontSize: "12px" }}>
                <strong>Request:</strong> {r.request}
              </div>
              <div style={{ fontSize: "12px" }}>
                <strong>Status:</strong> {r.status}
              </div>
              {r.comments && (
                <div style={{ fontSize: "12px" }}>
                  <strong>Comments:</strong> {r.comments}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notifications */}
      <div style={{ padding: "10px", border: "1px solid #e0e0e0" }}>
        <h2 style={{ marginBottom: "10px", fontWeight: "normal" }}>🕓 Notifications</h2>
        {notifications.map((n) => (
          <div key={n.id} style={{ marginBottom: "5px", padding: "5px", border: "1px solid #e0e0e0" }}>
            <p style={{ margin: "0", fontSize: "12px" }}>{n.message}</p>
            <small style={{ fontSize: "10px", color: "#666" }}>{n.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
