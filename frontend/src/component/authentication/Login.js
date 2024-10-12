import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";


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
    <div className='flex items-center justify-center h-[calc(100vh-80px)] bg-gray-100'>
      <div className='space-y-5 p-6 bg-white rounded-lg shadow-md'>
      <div className='flex flex-col items-center'>
          <div className='space-y-5'>
            <span className='text-9xl text-yellow-500'><FaUser /></span>
            <h1 className='text-xl font-bold text-center'>Login</h1>
          </div>
          <div className='mt-7'>
            <p className='text-center text-2xl font-bold'>Enter Registered Phone Number</p>
            <p className='text-center text-gray-400 mt-3 text-sm font-semibold'>
              We will send you a <span className='font-bold text-gray-500'>One Time Password </span>
              on your phone number
            </p>
          </div>
    
    <div>
      
      <form className='mt-6 flex flex-col' onSubmit={handleSendOtp}>
        <input className='p-2 border-2 rounded-lg w-80 text-center font-bold text-xl text-gray-600 tracking-widest'
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Phone Number"
          required
        />
        <button className='bg-orange-600 hover:bg-orange-500 text-white font-semibold mt-4 p-2 rounded-lg w-80 text-center' 
        type="submit">Send OTP</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
    </div>
    </div>
    </div>
  );
}

export default Login;
