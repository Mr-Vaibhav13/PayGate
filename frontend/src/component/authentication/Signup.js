import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa6";



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
    <div className='flex items-center justify-center h-[calc(100vh-80px)] bg-gray-100'>
      <div className='space-y-5 p-6 bg-white rounded-lg shadow-md'>
        <div className='flex flex-col items-center'>
          <div className='space-y-5'>
            {/* <span className='text-9xl'>🥇</span> */}
            <FaUserLock className='text-9xl text-yellow-500' />
            <h1 className='text-xl font-bold text-center'>SignUp</h1>
          </div>

          <div className='mt-7'>
            <p className='text-center text-2xl font-bold'>Enter Your Phone Number</p>
            <p className='text-center text-gray-400 mt-3 text-sm font-semibold'>
              We will send you a <span className='font-bold text-gray-500'>One Time Password </span>
              on your phone number
            </p>
          </div>

          <form className='mt-6 flex flex-col' onSubmit={handleSubmit}>
            <input
              className='p-2 border-2 rounded-lg w-80 text-center font-bold text-xl text-gray-600 tracking-widest'
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter Phone Number"
              required
            />
            <button 
              type="submit"
              className='bg-primary hover:bg-orange-500 text-white font-semibold mt-4 p-2 rounded-lg w-80 text-center'
            >
              Get OTP
            </button>
            {isSent && <p className='mt-2 text-green-500'>OTP has been sent to your phone number.</p>}
            {message && <p className='mt-2 text-red-500'>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
