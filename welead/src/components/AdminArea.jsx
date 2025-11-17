import React, { useEffect, useState } from 'react';

function AdminArea() {
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));  // Or pass via props/context

  useEffect(() => {
    if (user) {
      fetch('http://127.0.0.1:5000/admin-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })
        .then(res => res.json())
        .then(data => setMessage(data.message || data.error))
        .catch(() => setMessage('Error accessing admin area.'));
    }
  }, [user]);

  return <div><h2>Admin Area</h2><p>{message}</p></div>;
}

export default AdminArea;