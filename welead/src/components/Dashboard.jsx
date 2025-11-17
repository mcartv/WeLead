import React, { useState, useEffect } from 'react';
import './AdminStyles.css';
import Navbar from "./Navbar";

const AdminDashboard = ({ user, handleLogout }) => {
  // -------- Dynamic project counts --------
  const [projectsCount, setProjectsCount] = useState({
    pending: 0,
    approved: 0,
    declined: 0,
    scheduled: 0,
    proceeded: 0,
  });

  const fetchInquiries = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/inquiries/statuses");
      const data = await res.json();

      if (res.ok && data.inquiries) {
        const counts = { pending: 0, approved: 0, declined: 0, scheduled: 0, started: 0 };

        data.inquiries.forEach((inq) => {
          switch ((inq.status || '').toLowerCase()) {
            case "pending": counts.pending += 1; break;
            case "approved": counts.approved += 1; break;
            case "declined": counts.declined += 1; break;
            case "scheduled": counts.scheduled += 1; break;
            case "started": counts.started += 1; break;
            default: break;
          }
        });

        setProjectsCount(counts);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // -------- Static dashboard data --------
  const [activeClients, setActiveClients] = useState(0);

  const fetchActiveClients = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/active_clients");
      const data = await res.json();
      if (res.ok) setActiveClients(data.activeClients); // this now reflects only clients
    } catch (err) {
      console.error("Error fetching active clients:", err);
    }
  };

  useEffect(() => {
    fetchActiveClients();
  }, []);

  const [tasks, setTasks] = useState({ ongoing: 0, delayed: 0, approved: 0 });

  const fetchTasksOverview = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/tasks_overview");
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks overview:", err);
    }
  };

  useEffect(() => {
    fetchTasksOverview();
  }, []);

  const [activities] = useState([
    { time: '2023-10-05 14:30', description: 'New client "ABC Corp" registered.' },
    { time: '2023-10-05 12:15', description: 'New project request for "Logo Design" submitted.' },
    { time: '2023-10-05 10:45', description: 'Task "Wireframe Approval" updated to completed.' },
    { time: '2023-10-04 16:20', description: 'Client feedback received for project "Website Redesign".' },
    { time: '2023-10-04 09:00', description: 'New task "Content Review" assigned.' },
  ]);

  // -------- Modal for adding new project --------
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

  const handleChange = (e) => setProjectData({ ...projectData, [e.target.name]: e.target.value });

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
        fetchInquiries(); // refresh counts
      }
      else {
        alert("❌ " + (data.error || "Error adding project"));
      }
    } catch (err) {
      console.error(err);
      alert("Server connection error");
    }
  };

  // -------- Dummy handlers --------
  const handleApproveRequest = () => alert('Approve Request functionality.');
  const handleUpdateStatus = () => alert('Update Status functionality.');

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="dashboard-body">
        <h1 className="dashboard-header">Admin Dashboard</h1>

        <div className="dashboard-grid">
          {/* Total Projects */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Total Inquiries</h3>
            <div className="dashboard-stats">
              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.pending}</div>
                <div className="dashboard-stat-label">Pending</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.approved}</div>
                <div className="dashboard-stat-label">Approved</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.declined}</div>
                <div className="dashboard-stat-label">Declined</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.scheduled}</div>
                <div className="dashboard-stat-label">Scheduled</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-number">{projectsCount.started}</div>
                <div className="dashboard-stat-label">Started</div>
              </div>
            </div>
          </div>

          {/* Active Clients */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Active Clients</h3>
            <div className="dashboard-client-number">{activeClients}</div>
            <span className="dashboard-client-desc">Clients currently engaged in projects.</span>
          </div>

          {/* Tasks Overview */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Tasks Overview</h3>
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

          {/* Quick Actions */}
          <div className="dashboard-card dashboard-quick-actions-card">
            <h3 className="dashboard-card-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={handleApproveRequest}>Approve Request</button>
              <button className="quick-action-btn" onClick={() => setShowForm(true)}>Add New Project</button>
              <button className="quick-action-btn" onClick={handleUpdateStatus}>Update Status</button>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="dashboard-card dashboard-activity-card">
            <h3 className="dashboard-card-title">Recent Activity Log</h3>
            <ul className="activity-list">
              {activities.map((activity, index) => (
                <li key={index} className="activity-item">
                  <span className="activity-time">{activity.time}</span>
                  <span className="activity-desc">{activity.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal for Adding Project */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Add New Project</h3>
              <form className="modal-form">
                <label>Project Name</label>
                <input type="text" name="project_name" value={projectData.project_name} onChange={handleChange} />

                <label>Description</label>
                <textarea name="description" value={projectData.description} onChange={handleChange}></textarea>

                <label>Service Type</label>
                <input type="text" name="service_type" value={projectData.service_type} onChange={handleChange} />

                <label>Status</label>
                <select name="status" value={projectData.status} onChange={handleChange}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>

                <label>Start Date</label>
                <input type="date" name="start_date" value={projectData.start_date} onChange={handleChange} />

                <label>Expected End Date</label>
                <input type="date" name="expected_end_date" value={projectData.expected_end_date} onChange={handleChange} />

                <div className="modal-buttons">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
