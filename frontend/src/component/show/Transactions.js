import React, { useState, useEffect } from 'react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/trans`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className='text-4xl font-bold mb-5'>Transaction Status</h1>
      <div className="ml-2 grid grid-cols-4 gap-3 font-bold mb-2">
        <div>UPI ID</div>
        <div>Amount</div>
        <div>Date</div>
        <div>Status</div>
      </div>
      {transactions.map((entry, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 p-2 border-b border-gray-300">
          <div>{entry.upiId}</div>
          <div>₹ {entry.amount}</div>
          <div className='text-sm'>{new Date(entry.createdAt).toLocaleString()}</div>
          <div>{entry.status}</div>
        </div>
      ))}
    </div>
  );
};

export default Transactions;
