import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <p className="text-lg mb-6">Please choose an option below:</p>
      <div className="space-x-4">
        
      <button
          onClick={() => navigate('/with')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
          Withdrawal
        </button>
        
        <button
          onClick={() => navigate('/amount')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
          Deposit
        </button>
      </div>
    </div>
  );
}

export default Home;
