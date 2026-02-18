import React, { useState } from 'react';
import './PaymentSchedulingForm.css';
import Sidebar from "./Sidebar"; // adjust the path if needed
import Navbar from "./Navbar";


const PaymentSchedulingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    paymentMethod: '',
    referenceNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Optional: validate step 1 fields before proceeding
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleStepClick = (targetStep) => {
    // Allow clicking on step 1 anytime, step 2 only if we are already on step 2
    if (targetStep === 1) {
      setStep(1);
    } else if (targetStep === 2 && step === 2) {
      // Already on step 2 – no action needed, but you could also allow moving forward only after validation
      // For simplicity, we only allow clicking on step 2 when already there (i.e., it's not a forward jump)
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final data:', formData);
    // Send to API
  };

  return (
    <div className="psf-container">
      <h2 className="psf-title">SCHEDULE CONSULTATION</h2>
      <p className="psf-subtitle">PROCESS PAYMENT</p>

      {/* Clickable step indicator */}
      <div className="psf-steps">
        <span
          className={step === 1 ? 'psf-step-active' : 'psf-step-inactive'}
          onClick={() => handleStepClick(1)}
          style={{ cursor: 'pointer' }}
        >
          SCHEDULING
        </span>
        <span className="psf-step-separator">—</span>
        <span
          className={step === 2 ? 'psf-step-active' : 'psf-step-inactive'}
          onClick={() => handleStepClick(2)}
          style={{ cursor: step === 2 ? 'pointer' : 'not-allowed', opacity: step === 2 ? 1 : 0.5 }}
        >
          PAYMENT
        </span>
      </div>

      <form onSubmit={handleSubmit} className="psf-form">
        {/* STEP 1 - Scheduling */}
        {step === 1 && (
          <>
            <div className="psf-field">
              <label className="psf-label">
                CONSULTATION TYPE <span className="psf-required">*</span>
              </label>
              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleChange}
                required
                className="psf-select"
              >
                <option value="">Select Type</option>
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>

            <div className="psf-field">
              <label className="psf-label">
                PREFERRED DATE & TIME <span className="psf-required">*</span>
              </label>
              <div className="psf-row">
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  className="psf-input"
                />
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  className="psf-input"
                />
              </div>
              <p className="psf-hint">mm/dd/yyyy – -- : --</p>
            </div>

            <div className="psf-field">
              <label className="psf-label">
                ADDITIONAL NOTES <span className="psf-optional">(OPTIONAL)</span>
              </label>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requests..."
                className="psf-textarea"
              />
            </div>
          </>
        )}

        {/* STEP 2 - Payment */}
        {step === 2 && (
          <>
            <div className="psf-field">
              <label className="psf-label">
                PAYMENT METHOD <span className="psf-required">*</span>
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="psf-select"
              >
                <option value="">Select Method</option>
                <option value="gcash">GCash</option>
                <option value="bank">Bank Transfer</option>
                <option value="instapay">InstaPay</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="psf-field">
              <label className="psf-label">
                REFERENCE NUMBER <span className="psf-required">*</span>
              </label>
              <input
                type="text"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                required
                placeholder="Enter reference number"
                className="psf-input"
              />
            </div>

            <p className="psf-note">
              YOUR PAYMENT WILL BE VERIFIED WITHIN 24 HOURS.
            </p>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="psf-actions">
          {step === 2 && (
            <button type="button" onClick={handleBack} className="psf-button psf-button-secondary">
              BACK
            </button>
          )}
          {step === 1 ? (
            <button type="button" onClick={handleNext} className="psf-button psf-button-primary">
              NEXT
            </button>
          ) : (
            <button type="submit" className="psf-button psf-button-primary">
              CONFIRM PAYMENT
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentSchedulingForm;