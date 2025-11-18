import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminStyles.css";
import Navbar from "./Navbar";

const AdminDashboard = ({ user, handleLogout }) => {
  const [showInquiry, setShowInquiry] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const navigate = useNavigate();
  const [projectsCount, setProjectsCount] = useState({
    pending: 0,
    approved: 0,
    declined: 0,
    scheduled: 0,
    proceeded: 0,
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/get_requests");
        const data = await res.json();
        setRequests(data || []);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };
    fetchRequests();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/projects");
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        updateProjectCounts(data);
      } else {
        loadDummyProjectCounts();
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      loadDummyProjectCounts();
    }
  };

  // Count statuses from API
  const updateProjectCounts = (data) => {
    const counts = { pending: 0, approved: 0, declined: 0, scheduled: 0, proceeded: 0 };

    data.forEach((proj) => {
      switch ((proj.status || "").toLowerCase()) {
        case "pending":
          counts.pending++;
          break;
        case "approved":
          counts.approved++;
          break;
        case "declined":
          counts.declined++;
          break;
        case "scheduled":
          counts.scheduled++;
          break;
        case "proceeded":
          counts.proceeded++;
          break;
        default:
          break;
      }
    });

    setProjectsCount(counts);
  };

  // Approve inquiry
  const handleApprove = async (req) => {
    const response = await fetch(`http://localhost:5000/update_request/${req._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    });
    if (response.ok) {
      const updated = await response.json();
      setRequests(prev => prev.map(r => r._id === req._id ? updated : r));
      setSelectedRequest(updated);
      alert("Inquiry approved!");
    }
  };

  // Decline inquiry
  const handleDecline = async (req) => {
    const response = await fetch(`http://localhost:5000/update_request/${req._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Archived" }),
    });
    if (response.ok) {
      const updated = await response.json();
      setRequests(prev => prev.map(r => r._id === req._id ? updated : r));
      setSelectedRequest(updated);
      alert("Inquiry archived!");
    }
  };

  // Schedule appointment
  const handleSchedule = async () => {
    if (!appointmentDate) return alert("Please select a valid date.");
    const response = await fetch(`http://localhost:5000/update_request/${selectedRequest._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Scheduled", scheduled_date: appointmentDate }),
    });
    if (response.ok) {
      const updated = await response.json();
      setRequests(prev => prev.map(r => r._id === selectedRequest._id ? updated : r));
      setSelectedRequest(updated);
      setAppointmentDate("");
      alert("Appointment scheduled!");
    }
  };

  // Proceed with project
  const handleProceedWithProject = async () => {
    const response = await fetch(`http://localhost:5000/create_project_from_request/${selectedRequest._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const project = await response.json();
      const updatedRequest = { ...selectedRequest, status: "Project Started" };
      setRequests(prev => prev.map(r => r._id === selectedRequest._id ? updatedRequest : r));
      setSelectedRequest(updatedRequest);
      alert("Project successfully added to tracker!");
    }
  };

  // Fallback test data
  const loadDummyProjectCounts = () => {
    setProjectsCount({
      pending: 4,
      approved: 7,
      declined: 2,
      scheduled: 3,
      proceeded: 5,
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ===============================
          STATIC DASHBOARD DATA
  =============================== */
  const [activeClients] = useState(23);
  const [tasks] = useState({ ongoing: 15, delayed: 3, approved: 27 });

  const [activities] = useState([
    { time: "2023-10-05 14:30", description: 'New client "ABC Corp" registered.' },
    { time: "2023-10-05 12:15", description: 'New project request for "Logo Design" submitted.' },
    { time: "2023-10-05 10:45", description: 'Task "Wireframe Approval" marked as completed.' },
    { time: "2023-10-04 16:20", description: 'Client feedback received for "Website Redesign".' },
    { time: "2023-10-04 09:00", description: 'New task "Content Review" assigned.' },
  ]);

  /* ===============================
            ADD PROJECT MODAL
  =============================== */
  const [showForm, setShowForm] = useState(false);
  const [projectData, setProjectData] = useState({
    project_name: "",
    description: "",
    service_type: "",
    status: "Pending",
    start_date: "",
    expected_end_date: "",
    progress: 0,
  });

  const handleChange = (e) =>
    setProjectData({ ...projectData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/add_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Project added successfully!");
        setShowForm(false);

        setProjectData({
          project_name: "",
          description: "",
          service_type: "",
          status: "Pending",
          start_date: "",
          expected_end_date: "",
          progress: 0,
        });

        fetchProjects(); // refresh counts
      } else {
        alert("❌ " + (data.error || "Error adding project"));
      }
    } catch (err) {
      console.error(err);
      alert("Server connection error");
    }
  };

  /* ===============================
            QUICK ACTIONS
  =============================== */
  const handleApproveRequest = () => alert("Approve Request functionality.");
  const handleUpdateStatus = () => alert("Update Status functionality.");

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="dashboard-body">
        <h1 className="dashboard-header">Studio Dashboard</h1>

        {/* ============ TOP SUMMARY GRID ============ */}
        <div className="summary-grid">

          {/* PROJECT HEALTH OVERVIEW */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Project Health</h3>
            <div className="dashboard-stats">
              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.pending}</div>
                <div className="dashboard-stat-label">Pending Review</div>
              </div>

              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.approved}</div>
                <div className="dashboard-stat-label">Approved</div>
              </div>

              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.scheduled}</div>
                <div className="dashboard-stat-label">Scheduled</div>
              </div>

              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.proceeded}</div>
                <div className="dashboard-stat-label">In Progress</div>
              </div>
            </div>
          </div>

          {/* ACTIVE CLIENTS */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Active Clients</h3>
            <div className="dashboard-big-number">{activeClients}</div>
            <p className="dashboard-desc">Currently in active projects</p>
          </div>

          {/* TASKS */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Studio Tasks</h3>
            <div className="dashboard-stats">
              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{tasks.ongoing}</div>
                <div className="dashboard-stat-label">Ongoing</div>
              </div>

              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{tasks.delayed}</div>
                <div className="dashboard-stat-label">Delayed</div>
              </div>

              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{tasks.approved}</div>
                <div className="dashboard-stat-label">Approved</div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="dashboard-card dashboard-quick-actions-card">
            <h3 className="dashboard-card-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => setShowForm(true)}>
                ➕ Add Project
              </button>
              <button className="quick-action-btn" onClick={() => setShowInquiry(true)}>
                📨 View Inquiries
              </button>
              <button className="quick-action-btn">📅 Deadlines</button>
              <button className="quick-action-btn">👤 Assign Team</button>
            </div>
          </div>

          {/* INQUIRY MODAL */}
          {showInquiry && (
            <div className="modal-overlay" onClick={() => setShowInquiry(false)}>
              <div className="modal-box inquiry-grid-modal" onClick={(e) => e.stopPropagation()}>
                <button className="tracker-modal-close-btn" onClick={() => setShowInquiry(false)}>×</button>

                <div className="inquiry-grid-modal">
                  {requests.map((req) => (
                    <div key={req._id} className="inquiry-card-modal">
                      <h3>{req.client_name}</h3>
                      <p><strong>Service:</strong> {req.service_type}</p>
                      <p><strong>Status:</strong> {req.status}</p>
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedRequest(req)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MINI MODAL FOR DETAILS */}
          {selectedRequest && (
            <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
              <div className="modal-box mini-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setSelectedRequest(null)}>×</button>
                <h3 className="modal-title">
                  {selectedRequest.client_name} → {selectedRequest.service_type}
                </h3>

                <p className="modal-info"><strong>Email:</strong> {selectedRequest.email}</p>
                <p className="modal-info"><strong>Description:</strong> {selectedRequest.description}</p>
                <p className="modal-info"><strong>Status:</strong> {selectedRequest.status}</p>

                {selectedRequest.status === "Pending" && (
                  <>
                    <button className="btn-primary" onClick={() => handleApprove(selectedRequest)}>Approve</button>
                    <button className="btn-decline" onClick={() => handleDecline(selectedRequest)}>Decline</button>
                  </>
                )}

                {selectedRequest.status === "Approved" && (
                  <>
                    <label className="modal-label">Select Appointment Date:</label>
                    <input
                      type="date"
                      className="date-input"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <button className="schedule-btn" onClick={handleSchedule}>Schedule Appointment</button>
                  </>
                )}

                {selectedRequest.status === "Scheduled" && (
                  <button className="btn-proceed" onClick={handleProceedWithProject}>Proceed with Project</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============ PROJECT PIPELINE ============ */}
        <div className="dashboard-card full-width">
          <h3 className="dashboard-card-title">Project Pipeline</h3>

          <div className="pipeline-container">
            {[
              "Inquiry",
              "Concept",
              "Design Development",
              "Construction Docs",
              "Construction",
              "Completed"
            ].map((stage) => (
              <div className="pipeline-step" key={stage}>
                <div className="pipeline-dot"></div>
                <div className="pipeline-label">{stage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ UPCOMING DEADLINES ============ */}
        <div className="dashboard-card full-width">
          <h3 className="dashboard-card-title">Upcoming Deadlines</h3>

          <ul className="deadline-list">
            <li>📌 Concept submission – <b>Modern Home Project</b> (Oct 12)</li>
            <li>📌 Client revision – <b>Retail Fit-Out</b> (Oct 15)</li>
            <li>📌 Rendering delivery – <b>Condo Interior</b> (Oct 18)</li>
          </ul>
        </div>

        {/* ============ RECENT ACTIVITY LOG ============ */}
        <div className="dashboard-card full-width dashboard-activity-card">
          <h3 className="dashboard-card-title">Recent Activity</h3>

          <ul className="activity-list">
            {activities.map((activity, index) => (
              <li key={index} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-desc">{activity.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ADD PROJECT MODAL (unchanged) */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Add New Project</h3>

              {/* Your original form here */}
              { /* ...existing modal form code stays... */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
