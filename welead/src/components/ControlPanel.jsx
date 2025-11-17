import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function ControlPanel({ user, handleLogout }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expandedUserId, setExpandedUserId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/users")
            .then((res) => res.json())
            .then((data) => {
                const sortedUsers = data.users.sort(
                    (a, b) => new Date(b.date_created) - new Date(a.date_created)
                );
                setUsers(sortedUsers);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const action = currentStatus === "active" ? "Deactivate" : "Activate";
        if (!window.confirm(`${action} this account?`)) return;

        try {
            const res = await fetch(`http://localhost:5000/users/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: currentStatus === "active" ? "deactivated" : "active" })
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(users.map(u => u._id === id ? data.user : u));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter((u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar user={user} handleLogout={handleLogout} />
            <div className="admin-control-container">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
                />

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <React.Fragment key={u._id}>
                                    <tr>
                                        <td>{u.firstName} {u.lastName}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>{u.status || "active"}</td>
                                        <td>
                                            <button onClick={() => toggleStatus(u._id, u.status || "active")}>
                                                {u.status === "deactivated" ? "Activate" : "Deactivate"}
                                            </button>
                                            <button
                                                style={{ marginLeft: "8px" }}
                                                onClick={() => setExpandedUserId(expandedUserId === u._id ? null : u._id)}
                                            >
                                                {expandedUserId === u._id ? "Hide Profile" : "View Profile"}
                                            </button>
                                        </td>
                                    </tr>

                                    {expandedUserId === u._id && (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="profile-card">
                                                    <div className="profile-header">
                                                        <div className="avatar">{u.firstName?.[0] || "?"}</div>
                                                        <div className="profile-info">
                                                            <h2>{u.firstName} {u.lastName}</h2>
                                                            <p className="role">{u.role || "Client"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="divider" />

                                                    <div className="profile-details">
                                                        <div className="detail-row">
                                                            <label>Email</label>
                                                            <span>{u.email}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <label>Status</label>
                                                            <span className={`status ${u.status || "active"}`}>
                                                                {u.status === "deactivated" ? "Deactivated" : "Active"}
                                                            </span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <label>Date Created</label>
                                                            <span>{new Date(u.date_created).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>

                                                    <div className="divider" />

                                                    {/* Activity Log */}
                                                    <div className="activity-card">
                                                        <h3>Recent Activity</h3>
                                                        <ul className="activity-list">
                                                            {/* Replace with dynamic data later */}
                                                            <li className="activity-item">
                                                                <span className="activity-time">2025-11-17 10:32</span>
                                                                <span className="activity-desc">User logged in</span>
                                                            </li>
                                                            <li className="activity-item">
                                                                <span className="activity-time">2025-11-16 14:21</span>
                                                                <span className="activity-desc">Profile updated</span>
                                                            </li>
                                                            <li className="activity-item">
                                                                <span className="activity-time">2025-11-15 09:08</span>
                                                                <span className="activity-desc">Password changed</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
                {filteredUsers.length === 0 && !loading && <p>No users found.</p>}
            </div>
        </>
    );
}
