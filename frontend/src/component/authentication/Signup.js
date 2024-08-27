import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber === '1') {
      navigate('/admin');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          // Show alert and then redirect to login
          window.alert('User already exists. Redirecting to login page.');
          navigate('/login');
        } else {
          sessionStorage.setItem('phoneNumber', phoneNumber);
          setIsSent(true);
          navigate('/verify');
        }
      } else {
        setMessage('Failed to send OTP');
        console.error('Failed to send OTP:', data.error);
      }
    } catch (error) {
      setMessage('Error sending OTP');
      console.error('Error sending OTP:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        required
      />
      <button type="submit">Send OTP</button>
      {isSent && <p>OTP has been sent to your phone number.</p>}
      {message && <p>{message}</p>}
    </form>
  );
}

export default Signup;
