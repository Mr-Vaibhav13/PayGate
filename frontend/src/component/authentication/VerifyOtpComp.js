import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifyOtpComp() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const navigate = useNavigate();

  // Retrieve phone number from sessionStorage
  const phoneNumber = sessionStorage.getItem('phoneNumber');

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login'); // If no phone number, redirect to login
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          navigate('/'); // Redirect to home page after countdown ends
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [navigate, phoneNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        navigate('/home'); // Example: redirect to another page on success
      } else {
        setMessage('Invalid OTP');
      }
    } catch (error) {
      setMessage('Error verifying OTP');
      console.error('Error verifying OTP:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
        required
      />
      <button type="submit">Verify OTP</button>
      {message && <p>{message}</p>}
      <p>Time left: {formatTime(timeLeft)}</p>
    </form>
  );
}

export default VerifyOtpComp;
