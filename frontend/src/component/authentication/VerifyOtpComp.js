import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMessage } from "react-icons/md";


function VerifyOtpComp() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(150);
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
    <div className='bg-gray-100'>
    <form onSubmit={handleSubmit} className='flex flex-col justify-center m-auto h-[100vh] items-center w-screen'>
      
      <div className='border-2 p-20 rounded-lg bg-white shadow-md'>
      <div className='flex flex-col space-y-3'>
        <span className='text-center text-9xl m-auto text-yellow-500'><MdMessage /></span>
      <button type="submit" className='text-2xl font-bold pb-6'>OTP Verification</button>

      <div className='mt-7'>
            <p className='text-center text font-semibold pb-2'>Enter the code from the sms we sent to <span className='font-bold text-primary'>{phoneNumber}</span></p>
            <p className='text-center text-yellow-500 mt-3 text-base font-bold'>
            {formatTime(timeLeft)}
            </p>
          </div>

      <input className='p-2 border-2 rounded-lg w-80 text-center font-bold text-xl text-gray-600 tracking-widest'
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
        required
      />

      <button type='submit' className='bg-orange-600 hover:bg-orange-500  text-white font-semibold py-2 rounded-md '>Submit</button>
      {message && <p className='text-center font-bold text-red-600'>{message}</p>}
      </div>
      </div>  
    </form>
    </div>
  );
}

export default VerifyOtpComp;
