import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          // Store phone number in sessionStorage
          sessionStorage.setItem('phoneNumber', phoneNumber);
          setMessage('OTP has been sent to your phone number.');
          // Redirect to OTP verification page
          navigate('/verify');
        } else {
          setMessage('User does not exist.');
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
    <div>
      <h2>Login with OTP</h2>
      <form onSubmit={handleSendOtp}>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default Login;
