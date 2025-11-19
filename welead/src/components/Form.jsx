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

      <div className="client-admin-review-container-light">
        <h1>Service Request Form</h1>
        <section className="form-section-light">
          <form className="client-service-form-grid-light" onSubmit={handleOpenModal}>
            <div className="client-form-group-light">
              <label>Construction Type</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Subdivision</option>
                <option>Renovation Project</option>
                <option>Interior Design</option>
              </select>
            </div>

            <div className="client-form-group-light">
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

            <div className="client-form-group-light">
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

            <div className="client-form-group-light">
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

            <div className="client-form-group-light">
              <label>Project Timeline / Priority</label>
              <select name="timelinePriority" value={formData.timelinePriority} onChange={handleChange} required>
                <option value="">Select timeline</option>
                <option value="Flexible">Flexible</option>
                <option value="1–3 months">1–3 months</option>
                <option value="4-6 months">4-6 months</option>
                <option value="ASAP">ASAP (priority service)</option>
              </select>
            </div>

            <div className="client-form-group-light">
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

            <div className="client-form-group-light client-form-fullwidth-light">
              <label>Project Description</label>
              <textarea
                name="description"
                rows="5"
                placeholder="Tell us about the project: size, style, number of rooms, goals, special needs, etc."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="client-form-group-light client-form-fullwidth-light client-btn-container-light">
              <button className="client-submit-btn-light" onClick={handleOpenModal}>
                Submit Request
              </button>
              {success && <p className="client-success-text-light">✔ Request submitted successfully!</p>}
            </div>
          </form>
        </section>
      </div>

      {showModal && (
        <div className="client-modal-overlay-light">
          <div className="client-modal-content-light">
            <h2 className="client-modal-title-light">Confirm Your Request</h2>
            <div className="client-confirmation-list-light">
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
            <div className="client-modal-buttons-light">
              <button className="client-cancel-btn-light" onClick={() => setShowModal(false)}>Review Again</button>
              <button className="client-submit-btn-light" onClick={handleSubmit}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}