import React from 'react';
import Transactions from './Transactions';

function Wallet() {
  const balance = 1250.75; // Example balance

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Balance Display */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Balance</h2>
        <p className="text-5xl font-extrabold text-green-600">₹ {balance.toFixed(2)}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Transactions</h3>
        <Transactions />
      </div>
    </div>
  );
}

export default Wallet;
