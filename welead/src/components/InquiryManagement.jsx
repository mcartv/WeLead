  import React, { useState } from 'react';
import './Inquiry.css'; // Import the new CSS file

const InquiryManagement = ({ user }) => {
  // Dummy data for inquiries and metrics
  const [data, setData] = useState({
    inquiries: [
      {
        _id: '1',
        clientName: 'John Doe',
        email: 'john@example.com',
        serviceType: 'Residential',
        budget: 50000,
        timeline: '1-3 months',
        location: 'Manila',
        contact: '09123456789',
        description: 'Need a modern home design.',
        referralSource: 'Facebook',
        convenienceFee: true,
        urgency: 'high',
        status: 'pending',
        dateSubmitted: new Date('2023-10-01'),
      },
      {
        _id: '2',
        clientName: 'Jane Smith',
        email: 'jane@example.com',
        serviceType: 'Commercial',
        budget: 100000,
        timeline: '3-6 months',
        location: 'Cebu',
        contact: '09876543210',
        description: 'Office renovation.',
        referralSource: 'Referral',
        convenienceFee: false,
        urgency: 'medium',
        status: 'approved',
        dateSubmitted: new Date('2023-09-15'),
      },
      {
        _id: '3',
        clientName: 'Bob Johnson',
        email: 'bob@example.com',
        serviceType: 'Subdivision',
        budget: 200000,
        timeline: '6-12 months',
        location: 'Davao',
        contact: '09112233445',
        description: 'Large-scale project.',
        referralSource: 'Website',
        convenienceFee: true,
        urgency: 'low',
        status: 'converted',
        dateSubmitted: new Date('2023-08-20'),
      },
    ],
    metrics: { total: 3, pending: 1, approved: 1, converted: 1 },
  });

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  // Handlers remain the same, but update state locally (no API calls)
  const handleApprove = (id) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(inq => inq._id === id ? { ...inq, status: 'approved' } : inq),
      metrics: { ...prev.metrics, approved: prev.metrics.approved + 1, pending: prev.metrics.pending - 1 }
    }));
  };

  const handleConvert = (id) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(inq => inq._id === id ? { ...inq, status: 'converted' } : inq),
      metrics: { ...prev.metrics, converted: prev.metrics.converted + 1, approved: prev.metrics.approved - 1 }
    }));
  };

  const handleReject = (id) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(inq => inq._id === id ? { ...inq, status: 'rejected', rejectionReason } : inq)
    }));
    setRejectionReason('');
  };

  const handleMessage = (id) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(inq => inq._id === id ? { ...inq, response } : inq)
    }));
    setResponse('');
  };

  const handleSchedule = (id) => {
    alert('Consultation scheduled.');
    setScheduleDate('');
  };

  const handleAddFee = (id) => {
    alert('Convenience fee added.');
  };

  return (
    <div className="inquiry-container shift-right"> {/* Added shift-right class */}
      <h1 className="inquiry-title">Admin Inquiry Management</h1>
      
      {/* Inquiry Dashboard */}
      <div className="inquiry-dashboard">
        <div className="metric-card">
          <h2>Total Inquiries</h2>
          <p>{data.metrics.total}</p>
        </div>
        <div className="metric-card pending">
          <h2>Pending</h2>
          <p>{data.metrics.pending}</p>
        </div>
        <div className="metric-card approved">
          <h2>Approved</h2>
          <p>{data.metrics.approved}</p>
        </div>
        <div className="metric-card converted">
          <h2>Converted</h2>
          <p>{data.metrics.converted}</p>
        </div>
      </div>
      
      {/* Inquiry List Table */}
      <div className="inquiry-table-container">
        <table className="inquiry-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Email</th>
              <th>Service Type</th>
              <th>Budget</th>
              <th>Timeline</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.inquiries.map((inq) => (
              <tr key={inq._id} className="inquiry-row" onClick={() => setSelectedInquiry(inq)}>
                <td>{inq.clientName}</td>
                <td>{inq.email}</td>
                <td>{inq.serviceType}</td>
                <td>PHP {inq.budget}</td>
                <td>{inq.timeline}</td>
                <td>{inq.status}</td>
                <td>{new Date(inq.dateSubmitted).toLocaleDateString()}</td>
                <td>
                  {inq.status === 'pending' && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleApprove(inq._id); }} className="action-btn approve">Approve</button>
                      <button onClick={(e) => { e.stopPropagation(); const reason = prompt('Rejection reason:'); if (reason) { setRejectionReason(reason); handleReject(inq._id); } }} className="action-btn reject">Reject</button>
                    </>
                  )}
                  {inq.status === 'approved' && (
                    <button onClick={(e) => { e.stopPropagation(); handleConvert(inq._id); }} className="action-btn convert">Convert</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="inquiry-modal-overlay">
          <div className="inquiry-modal">
            <h2>Inquiry Details</h2>
            <p><strong>Location:</strong> {selectedInquiry.location}</p>
            <p><strong>Contact:</strong> {selectedInquiry.contact}</p>
            <p><strong>Description:</strong> {selectedInquiry.description}</p>
            <p><strong>Referral Source:</strong> {selectedInquiry.referralSource}</p>
            <p><strong>Convenience Fee:</strong> {selectedInquiry.convenienceFee ? 'Yes' : 'No'}</p>
            <p><strong>Urgency:</strong> {selectedInquiry.urgency}</p>
            
            {/* Messaging */}
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Send a reply..."
              className="inquiry-textarea"
            />
            <button onClick={() => handleMessage(selectedInquiry._id)} className="modal-btn">Send Message</button>
            
            {/* Schedule Consultation */}
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="inquiry-input"
            />
            <button onClick={() => handleSchedule(selectedInquiry._id)} className="modal-btn schedule">Schedule Consultation</button>
            
            {/* Fee Handling */}
            {selectedInquiry.convenienceFee && (
              <button onClick={() => handleAddFee(selectedInquiry._id)} className="modal-btn fee">Add Convenience Fee</button>
            )}
            
            <button onClick={() => setSelectedInquiry(null)} className="modal-btn close">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;