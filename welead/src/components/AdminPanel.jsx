import React, { useState, useEffect } from "react";
import "./AdminStyles.css";
import Navbar from "./Navbar";

export default function AdminPanel({ user, handleLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/get_requests")
      .then(res => res.json())
      .then(data => {
        setRequests(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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

  // Decline/archive inquiry
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
      // Optionally update inquiry status
      const updatedRequest = { ...selectedRequest, status: "Project Started" };
      setRequests(prev => prev.map(r => r._id === selectedRequest._id ? updatedRequest : r));
      setSelectedRequest(updatedRequest);
      alert("Project successfully added to tracker!");
    }
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="admin-container">
        {loading && <p>Loading requests...</p>}
        {!loading && requests.length === 0 && <p>No inquiries yet.</p>}
        
        {/* <div className="admin-header">
          <h1>Inquiry</h1>
        </div> */}

        <div className="inquiry-grid">
          {requests.map(req => (
            <div key={req._id} className="inquiry-card">
              <h3>{req.client_name}</h3>
              <p><strong>Service:</strong> {req.service_type}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <button onClick={() => setSelectedRequest(req)} className="btn-secondary">
                View Details
              </button>
            </div>
          ))}
        </div>

        {selectedRequest && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2 className="modal-title">
                {selectedRequest.client_name} → {selectedRequest.service_type}
              </h2>

              <p className="modal-info"><strong>Email:</strong> {selectedRequest.email}</p>
              <p className="modal-info"><strong>Description:</strong> {selectedRequest.description}</p>
              <p className="modal-info"><strong>Status:</strong> {selectedRequest.status}</p>

              {/* Pending: Approve or Decline */}
              {selectedRequest.status === "Pending" && (
                <>
                  <button className="btn-primary" onClick={() => handleApprove(selectedRequest)}>
                    Approve
                  </button>
                  <button className="btn-decline" onClick={() => handleDecline(selectedRequest)}>
                    Decline
                  </button>
                </>
              )}

              {/* Approved: Schedule appointment */}
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
                  <button className="btn schedule-btn" onClick={handleSchedule}>
                    Schedule Appointment
                  </button>
                </>
              )}

              {/* Scheduled: Proceed with project */}
              {selectedRequest.status === "Scheduled" && (
                <button className="btn-proceed" onClick={handleProceedWithProject}>
                  Proceed with Project
                </button>
              )}

              <button className="close-btn" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
