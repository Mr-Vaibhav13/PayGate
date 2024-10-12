import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";

function Home() {
  const navigate = useNavigate();
  const phoneNumber = sessionStorage.getItem("phoneNumber");

  const handleLogout = () => {
    // Add your logout logic here, e.g., clearing session storage and redirecting
    sessionStorage.clear();
    navigate('/'); // Redirect to the login page after logout
  };

  return (
    <div className='h-screen bg-gray-800 flex flex-col items-center justify-center relative'>
      {/* Profile icon and phone number */}
      <div className='absolute top-4 right-4 flex items-center space-x-4 group'>
        <div className='cursor-pointer flex items-center space-x-2'>
          <CgProfile className='text-5xl text-slate-300' />
          <p className='text-sm text-slate-300'>
            Phone Number: <span className='text-base font-semibold'>{phoneNumber}</span>
          </p>
        </div>

        {/* Dropdown Menu */}
        <div className='absolute top-12 right-0 bg-gray-700 text-slate-300 rounded-lg shadow-lg w-40 invisible group-hover:visible'>
          <button
            onClick={handleLogout}
            className='block w-full px-4 py-2 text-left hover:bg-gray-600 rounded-lg'>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-6 text-slate-200">Digital Wallet</h1>
        <p className="text-xl mb-8 text-slate-300">Select the action you'd like to perform:</p>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/with')}
            className="px-8 py-4 bg-secondary text-white rounded-lg shadow-lg hover:bg-hoverSecondary transition duration-300 font-semibold">
            Withdrawal
          </button>
          <button
            onClick={() => navigate('/amount')}
            className="px-8 py-4 bg-primary text-white rounded-lg shadow-lg hover:bg-hoverPrimary transition duration-300 font-semibold">
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
