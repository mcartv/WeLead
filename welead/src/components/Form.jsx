import React, { useState } from "react";
import "./ClientStyles.css";
import Navbar from "./Navbar";

export default function ServiceRequest({ user, handleLogout }) {
  const [formData, setFormData] = useState({
    serviceType: "Consultation",
    projectLocation: "",
    contactNumber: "",
    budgetRange: "",
    timelinePriority: "",
    priority: "Normal",
    referralSource: "",
    description: "",
    convenienceFee: 0,
  });

  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Convenience fee for ASAP timeline
    if (name === "timelinePriority") {
      updatedData.convenienceFee = value === "ASAP" ? 5000 : 0;
    }

    setFormData(updatedData);
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      client_name: user?.fullName || `${user?.first_name} ${user?.last_name}`,
      email: user?.email,
      service_type: formData.serviceType,
      project_location: formData.projectLocation,
      contact_number: formData.contactNumber,
      budget_range: formData.budgetRange,
      timeline: formData.timelinePriority,
      priority: formData.priority,
      referral_source: formData.referralSource,
      description: formData.description,
      convenience_fee: formData.convenienceFee,
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:5000/add_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Request received. Please wait for further updates.");
        setSuccess(true);
        setShowModal(false);
        setFormData({
          serviceType: "Consultation",
          projectLocation: "",
          contactNumber: "",
          budgetRange: "",
          timelinePriority: "",
          priority: "Normal",
          referralSource: "",
          description: "",
          convenienceFee: 0,
        });
      } else {
        const err = await response.json();
        alert(err.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please check your connection.");
    }
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="admin-review-container">
        <h1>Service Request Form</h1>
        <p>Tell us about your project. Your account details will be used automatically.</p>

        <section className="form-section">
          <form className="service-form-grid" onSubmit={handleOpenModal}>
            {/* SERVICE TYPE */}
            <div className="form-group-dark">
              <label>Service Type</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                <option>Consultation</option>
                <option>Site Visit</option>
                <option>Renovation Project</option>
                <option>New Construction</option>
                <option>Interior Design</option>
                <option>Drafting / 3D Visualization</option>
              </select>
            </div>

            {/* LOCATION */}
            <div className="form-group-dark">
              <label>Project Location</label>
              <input
                type="text"
                name="projectLocation"
                placeholder="City / Municipality (exact address optional)"
                value={formData.projectLocation}
                onChange={handleChange}
                required
              />
            </div>

            {/* CONTACT NUMBER */}
            <div className="form-group-dark">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                placeholder="Enter your number"
                value={formData.contactNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, contactNumber: value });
                }}
                required
              />
            </div>

            {/* BUDGET */}
            <div className="form-group-dark">
              <label>Estimated Budget</label>
              <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} required>
                <option value="">Select a range</option>
                <option>₱500k–₱1M</option>
                <option>₱1M–₱3M</option>
                <option>₱3M–₱6M</option>
                <option>₱6M+</option>
                <option>Not sure yet</option>
              </select>
            </div>

            {/* TIMELINE */}
            <div className="form-group-dark">
              <label>Project Timeline / Priority</label>
              <select name="timelinePriority" value={formData.timelinePriority} onChange={handleChange} required>
                <option value="">Select timeline</option>
                <option value="Flexible">Flexible</option>
                <option value="1–3 months">1–3 months</option>
                <option value="4-6 months">4-6 months</option>
                <option value="ASAP">ASAP (priority service)</option>
              </select>
            </div>

            {/* REFERRAL SOURCE */}
            <div className="form-group-dark">
              <label>How did you hear about us?</label>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                required
              >
                <option value="">Select an option</option>
                <option value="Friend/Family">Friend / Family</option>
                <option value="Social Media">Social Media</option>
                <option value="Search Engine">Search Engine</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Event/Exhibition">Event / Exhibition</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group-dark form-fullwidth-dark">
              <label>Project Description</label>
              <textarea
                name="description"
                rows="5"
                placeholder="Tell us about the project: size, style, number of rooms, goals, special needs, etc."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* SUBMIT */}
            <div className="form-group-dark form-fullwidth-dark btn-container">
              <button className="submit-btn-dark" onClick={handleOpenModal}>
                Submit Request
              </button>
              {success && <p className="success-text-dark">✔ Request submitted successfully!</p>}
            </div>
          </form>
        </section>
      </div>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div className="-cli-modal-overlay">
          <div className="cli-modal-content">
            <h2 className="cli-modal-title">Confirm Your Request</h2>
            <div className="confirmation-list">
              <p><strong>Service Type:</strong> {formData.serviceType}</p>
              <p><strong>Project Location:</strong> {formData.projectLocation}</p>
              <p><strong>Contact Number:</strong> {formData.contactNumber}</p>
              <p><strong>Budget Range:</strong> {formData.budgetRange}</p>
              <p><strong>Timeline:</strong> {formData.timelinePriority}</p>
              {formData.convenienceFee > 0 && (
                <p><strong>Convenience Fee (for urgent inquiry):</strong> ₱{formData.convenienceFee}</p>
              )}
              <p><strong>Description:</strong> {formData.description || "No description added"}</p>
            </div>
            <div className="cli-modal-buttons">
              <button className="cli-cancel-btn" onClick={() => setShowModal(false)}>Review Again</button>
              <button className="cli-submit-btn" onClick={handleSubmit}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}