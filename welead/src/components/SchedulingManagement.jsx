import React, { useState } from "react";
import "./Scheduling.css";

const SchedulingManagement = () => {
  // Sample booking data – in a real app, this would come from your backend
  const [bookings, setBookings] = useState([
    {
      id: 1,
      inquiryId: 2, // links to an inquiry
      clientName: "Jane Smith",
      projectName: "Downtown Coffee Hub",
      date: "2025-03-12",
      time: "14:30",
      status: "confirmed", // pending, confirmed, rescheduled, completed
      notes: "Review site analysis",
      createdAt: "2025-03-01",
    },
    {
      id: 2,
      inquiryId: 1,
      clientName: "John Doe",
      projectName: "Riverfront Residence",
      date: "2025-03-10",
      time: "10:00",
      status: "pending",
      notes: "Discuss final material selections",
      createdAt: "2025-03-02",
    },
    {
      id: 3,
      inquiryId: 3,
      clientName: "Robert Green",
      projectName: "Meadowbrook Subdivision",
      date: "2025-03-15",
      time: "09:30",
      status: "rescheduled",
      notes: "New date after client request",
      createdAt: "2025-02-28",
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
    reason: "",
  });

  // Stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const rescheduledBookings = bookings.filter(b => b.status === "rescheduled").length;

  // Handlers
  const handleApprove = (id) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: "confirmed" } : b))
    );
  };

  const handleReschedule = (id) => {
    if (!rescheduleData.date || !rescheduleData.time) {
      alert("Please select a new date and time.");
      return;
    }
    setBookings(prev =>
      prev.map(b =>
        b.id === id
          ? {
              ...b,
              date: rescheduleData.date,
              time: rescheduleData.time,
              status: "rescheduled",
              notes: rescheduleData.reason || b.notes,
            }
          : b
      )
    );
    setRescheduleData({ date: "", time: "", reason: "" });
    setSelectedBooking(null);
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setRescheduleData({
      date: booking.date,
      time: booking.time,
      reason: "",
    });
  };

  return (
    <div className="scheduling-container">
      <h1 className="scheduling-title">Consultation Bookings</h1>

      {/* Stats Cards */}
      <div className="scheduling-stats">
        <div className="stat-card">
          <span className="stat-label">Total Bookings</span>
          <span className="stat-value">{totalBookings}</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pendingBookings}</span>
        </div>
        <div className="stat-card confirmed">
          <span className="stat-label">Confirmed</span>
          <span className="stat-value">{confirmedBookings}</span>
        </div>
        <div className="stat-card rescheduled">
          <span className="stat-label">Rescheduled</span>
          <span className="stat-value">{rescheduledBookings}</span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="scheduling-table-container">
        <table className="scheduling-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.clientName}</td>
                <td>{booking.projectName}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>{booking.notes}</td>
                <td>
                  {booking.status === "pending" && (
                    <button
                      className="action-btn approve"
                      onClick={() => handleApprove(booking.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    className="action-btn reschedule"
                    onClick={() => openRescheduleModal(booking)}
                  >
                    Reschedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="reschedule-modal" onClick={e => e.stopPropagation()}>
            <h2>Reschedule Consultation</h2>
            <p>
              <strong>Client:</strong> {selectedBooking.clientName}
            </p>
            <p>
              <strong>Project:</strong> {selectedBooking.projectName}
            </p>

            <div className="form-group">
              <label>New Date</label>
              <input
                type="date"
                value={rescheduleData.date}
                onChange={e =>
                  setRescheduleData({ ...rescheduleData, date: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>New Time</label>
              <input
                type="time"
                value={rescheduleData.time}
                onChange={e =>
                  setRescheduleData({ ...rescheduleData, time: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Reason (optional)</label>
              <textarea
                value={rescheduleData.reason}
                onChange={e =>
                  setRescheduleData({ ...rescheduleData, reason: e.target.value })
                }
                placeholder="Why is this being rescheduled?"
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => handleReschedule(selectedBooking.id)}    
              >
                Confirm Reschedule
              </button>
              <button
                className="btn-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingManagement;