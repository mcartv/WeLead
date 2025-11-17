import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "../App.css";

export default function Profile({ user, handleLogout }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        fetch(`http://localhost:5000/users/${user.id}`)
            .then(res => res.json())
            .then(data => {
                setProfile(data.user);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <p className="profile-loading">Loading profile...</p>;
    if (!profile) return <p className="profile-loading">Unable to load profile.</p>;

    return (
        <>
            <Navbar user={user} handleLogout={handleLogout} />

            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar">
                            {profile?.first_name ? profile.first_name[0] : "?"}
                        </div>

                        <div className="profile-info">
                            <h2>{profile?.first_name} {profile?.last_name}</h2>
                            <p className="role">{profile?.role || "Client"}</p>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="profile-details">
                        <div className="detail-row">
                            <label>Email</label>
                            <span>{profile.email}</span>
                        </div>

                        <div className="detail-row">
                            <label>Status</label>
                            <span className={`status ${profile.status}`}>
                                {profile.status === "deactivated" ? "Deactivated" : "Active"}
                            </span>
                        </div>

                        <div className="detail-row">
                            <label>Date Created</label>
                            <span>{new Date(profile.date_created).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* ========================== */}
                {/*   ACTIVITY LOG SECTION     */}
                {/* ========================== */}

                <div className="activity-log-card">
                    <h3 className="activity-title">Activity Log</h3>

                    <div className="activity-list">
                        {/* Static placeholders for now — backend later */}
                        <div className="activity-item">
                            <p><strong>You</strong> logged in.</p>
                            <span className="timestamp">Just now</span>
                        </div>

                        <div className="activity-item">
                            <p>Updated profile information.</p>
                            <span className="timestamp">2 hours ago</span>
                        </div>

                        <div className="activity-item">
                            <p>Password changed.</p>
                            <span className="timestamp">1 day ago</span>
                        </div>

                        <div className="activity-item">
                            <p>User account activated.</p>
                            <span className="timestamp">3 days ago</span>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
