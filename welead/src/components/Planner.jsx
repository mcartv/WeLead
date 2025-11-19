import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./ClientStyles.css";

const Planner = ({ user }) => {
  // Tasks array only for timeline / deliverables
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Initial Design Review",
      phase: "Design",
      progress: 80,
      status: "In Progress",
      dueDate: "2023-10-15",
      deliverables: ["design_plan.pdf", "sketches.jpg"],
    },
    {
      id: 2,
      name: "Approval Meeting",
      phase: "Approval",
      progress: 50,
      status: "Pending",
      dueDate: "2023-10-20",
      deliverables: [],
    },
    {
      id: 3,
      name: "Foundation Construction",
      phase: "Construction",
      progress: 0,
      status: "Not Started",
      dueDate: "2023-11-01",
      deliverables: [],
    },
  ]);

  const [requests, setRequests] = useState([]);
  const [notifications] = useState([
    { id: 1, message: "Milestone 'Initial Design Review' updated to 80% complete.", date: "2023-10-10" },
    { id: 2, message: "Reminder: Approval Meeting scheduled for 2023-10-20.", date: "2023-10-09" },
  ]);

  const [newRequest, setNewRequest] = useState({ milestone: "", request: "" });

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!newRequest.milestone || !newRequest.request.trim()) return;

    const payload = {
      milestone: newRequest.milestone, // selected milestone name
      request: newRequest.request,
      requestedBy: user?.name || "Anonymous",
    };

    try {
      const res = await fetch("http://localhost:5000/client_requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to submit request:", err);
        return;
      }

      const data = await res.json();
      setRequests((prev) => [...prev, data.request]);
      setNewRequest({ milestone: "", request: "" });
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/client_requests");
        if (!res.ok) throw new Error("Failed to fetch requests");

        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setRequests([]);
      }
    };

    // Initial fetch
    fetchRequests();

    // Poll every 5 seconds
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const tasksWithStatus = tasks.map((task) => {
    const matchingRequest = requests.find(r => r.milestone === task.name);
    return matchingRequest
      ? { ...task, status: matchingRequest.status, comments: matchingRequest.comments }
      : task;
  });

  const handleFileUpload = (taskId, files) => {
    const fileNames = Array.from(files).map((file) => file.name);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, deliverables: [...t.deliverables, ...fileNames] } : t))
    );
  };

  const phases = ["Design", "Approval", "Construction"];
  const tasksByPhase = phases.reduce((acc, phase) => {
    acc[phase] = tasks.filter((t) => t.phase === phase);
    return acc;
  }, {});

  return (
    <>
      <Navbar user={user} />

      <div className="planner-container">
        <h1>📅 Planner / Scheduler</h1>

        {/* Timeline / Phases */}
        <div className="planner-grid">
          <div className="planner-card">
            <h2>📈 Timeline / Phases</h2>
            {phases.map((phase) => (
              <div className="client-phase-section" key={phase}>
                <h3>{phase} Phase</h3>
                {tasksByPhase[phase].length === 0 ? (
                  <p>No milestones in this phase.</p>
                ) : (
                  tasksByPhase[phase].map((t) => (
                    <div className="task-item" key={t.id}>
                      <div className="task-info">
                        <h4>{t.name}</h4>
                        <p>Due: {t.dueDate} | Status: {t.status} | Approval: {t.approval}</p>
                        <div>
                          Progress: {t.progress}%
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${t.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>

          {/* Deliverables */}
          <div className="planner-card">
            <h2>📦 Deliverables</h2>
            {tasks.map((t) => (
              <div key={t.id} className="client-phase-section">
                <h4>{t.name}</h4>
                <p>
                  <strong>Accepted:</strong> {t.deliverables.length ? t.deliverables.join(", ") : "None"}
                </p>
                <input type="file" multiple onChange={(e) => handleFileUpload(t.id, e.target.files)} />
              </div>
            ))}
          </div>

          {/* Request Form */}
          <div className="planner-card">
            <h2>💬 Request Adjustments</h2>
            <form className="planner-form" onSubmit={submitRequest}>
              <select
                value={newRequest.milestone}
                onChange={(e) => setNewRequest({ ...newRequest, milestone: e.target.value })}
                required
              >
                <option value="">Select Milestone</option>
                <option value="Initial Design Review">Initial Design Review</option>
                <option value="Approval Meeting">Approval Meeting</option>
                <option value="Foundation Construction">Foundation Construction</option>
                <option value="Site Inspection">Site Inspection</option>
                <option value="Final Handover">Final Handover</option>
              </select>
              <textarea
                value={newRequest.request}
                onChange={(e) => setNewRequest({ ...newRequest, request: e.target.value })}
                placeholder="Describe your request..."
                required
              />
              <button type="submit">Submit Request</button>
            </form>
          </div>

          {/* Approval Tracker */}
          <div className="planner-card">
            <h2>📑 Approval Status</h2>
            {requests.map((r) => (
              <div className="task-item" key={r._id || r.id}>
                <div className="task-info">
                  <p><strong>Milestone:</strong> {r.milestone}</p>
                  <p><strong>Request:</strong> {r.request}</p>
                  <p><strong>Status:</strong> {r.status}</p>
                  {r.status === "Scheduled" && r.scheduled_date && (
                    <p><strong>Scheduled Date:</strong> {new Date(r.scheduled_date).toLocaleDateString()}</p>
                  )}
                  {r.comments && <p><strong>Comments:</strong> {r.comments}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="notif-planner-card">
            <h2>🕓 Notifications</h2>
            {notifications.map((n) => (
              <div key={n.id} className="task-item">
                <p>{n.message}</p>
                <small>{n.date}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Planner;
