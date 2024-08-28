import React, { useState, useEffect } from 'react';

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const phoneNumber = sessionStorage.getItem('phoneNumber');
        if (!phoneNumber) {
          setError('No phone number found');
          return;
        }
  
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-transactions?phoneNumber=${phoneNumber}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch transactions');
        }
  
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError(error.message || 'Failed to fetch transactions');
      }
    };
  
    fetchTransactions();
  
    // Set up event listener for transaction updates
    const eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/events`);
    eventSource.onmessage = (event) => {
      const { transactionId, status } = JSON.parse(event.data);
  
      setTransactions(prevState =>
        prevState.map(transaction =>
          transaction.transactionId === transactionId
            ? { ...transaction, status }
            : transaction
        )
      );
    };
  
    return () => {
      eventSource.close();
    };
  }, []);
  
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPI ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.upiId}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹ {transaction.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
