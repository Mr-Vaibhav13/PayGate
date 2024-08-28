import React, { useState, useEffect } from 'react';

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [modalError, setModalError] = useState('');

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
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/events`);

    eventSource.onmessage = (event) => {
      const updatedTransaction = JSON.parse(event.data);

      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.transactionId === updatedTransaction.transactionId
            ? { ...transaction, status: updatedTransaction.status }
            : transaction
        )
      );
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleCancle = () =>{
    setIsModalOpen(false)
    setWithdrawAmount('');
    setUpiId('');
    setModalError('');
  }

  const totalAmount = transactions
    .filter(transaction => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  
  const handleConfirm = () => {
    const totalAmountCheck = transactions
    .filter(transaction => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

    if (parseFloat(withdrawAmount) > totalAmountCheck) {
      setModalError('Entered amount exceeds available balance.');
      return;
    }
    
    // Proceed with withdrawal logic here
    // Example:
    // withdrawMoney(withdrawAmount, upiId);

    setIsModalOpen(false);
    setWithdrawAmount('');
    setUpiId('');
    setModalError('');
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-9 flex justify-between">
        <p className="font-bold">BALANCE: <span className='text-4xl text-green-600 ml-4'>₹{totalAmount}</span></p>
        
        {totalAmount > 0 && (
          <button
            className='p-2 bg-green-500 hover:bg-green-400 px-5 text-white rounded-lg'
            onClick={() => setIsModalOpen(true)}
          >
            Withdraw Money
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPI ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.upiId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.transactionId}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹ {transaction.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.createdAt).toLocaleDateString('en-GB')} {new Date(transaction.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded shadow-lg relative mx-4">
            <button
              onClick={handleCancle}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-400 text-white rounded-full p-2"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">Withdraw Money</h3>
            
            {modalError && <p className="text-red-500">{modalError}</p>}
            <div className="mb-4">
              <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                id="withdrawAmount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mt-1 p-1 block w-full border border-gray-300 rounded-md shadow-sm"
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">UPI ID</label>
              <input
                id="upiId"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-1 p-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              onClick={handleConfirm}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
