import React, { useState, useEffect } from 'react';

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [modalError, setModalError] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const storedPhoneNumber = sessionStorage.getItem('phoneNumber');
        if (!storedPhoneNumber) {
          throw new Error('Phone number not found in session storage');
        }
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-total-amount?phoneNumber=${encodeURIComponent(storedPhoneNumber)}`);
        const data = await response.json();
        setTotalAmount(data.totalAmount || 0);
      } catch (error) {
        console.error('Error fetching total amount:', error);
      }
    };

    fetchTotalAmount();
  }, []);

  const updateTotalAmount = async (newAmount) => {
    try {
      const storedPhoneNumber = sessionStorage.getItem('phoneNumber');
      if (!storedPhoneNumber) {
        throw new Error('Phone number not found in session storage');
      }

      // Update frontend state
      setTotalAmount(newAmount);

      // Send update to backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update-total-amount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ phoneNumber: storedPhoneNumber, totalAmount: newAmount })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error('Failed to update total amount');
      }
    } catch (error) {
      console.error('Error updating total amount:', error);
    }
  };

  // Example function to handle changes
  const handleAmountChange = (e) => {
    const totalAmountTrans = transactions
    .filter(transaction => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalAmountWith = withdrawals
    .filter(withdrawal => withdrawal.status === 'completed')
    .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    const totalAmount = totalAmountTrans-totalAmountWith;
    updateTotalAmount(totalAmount);
  };



  
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

    const fetchWithdrawals = async () => {
      try {
        const phoneNumber = sessionStorage.getItem('phoneNumber');
        if (!phoneNumber) {
          setError('No phone number found');
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/withdrawals/phoneNumber?phoneNumber=${phoneNumber}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch withdrawals');
        }

        const data = await response.json();
        setWithdrawals(data.withdrawals);
        

      } catch (error) {
        console.error('Error fetching withdrawals:', error);
        setError(error.message || 'Failed to fetch withdrawals');
      }
    };

    fetchTransactions();
    fetchWithdrawals();
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

  const handleCancel = () => {
    setIsModalOpen(false);
    setWithdrawAmount('');
    setUpiId('');
    setModalError('');
  };

  const totalAmountTrans = transactions
    .filter(transaction => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalAmountWith = withdrawals
    .filter(withdrawal => withdrawal.status === 'completed')
    .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    const totalAmountVal = totalAmountTrans-totalAmountWith;
  

    const handleConfirm = async () => {
      try {
        // Validation
        if (!withdrawAmount || !upiId) {
          setModalError('Please fill in all fields.');
          return;
        }
        
        const phoneNumber = sessionStorage.getItem('phoneNumber');
        if (!phoneNumber) {
          setModalError('Phone number not found.');
          return;
        }

        const totalAmountTrans = transactions
        .filter(transaction => transaction.status === 'completed')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    
        const totalAmountWith = withdrawals
        .filter(withdrawal => withdrawal.status === 'completed')
        .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    
        const totalAmountCurr = totalAmountTrans-totalAmountWith;

        if (parseFloat(withdrawAmount) > totalAmountCurr) {
          setModalError('Insufficient balance.');
          return;
        }
    
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/withdrawals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            phoneNumber,
            amount: parseFloat(withdrawAmount),
            upiId
          })
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create withdrawal request');
        }
    
        // Clear modal
        setIsModalOpen(false);
        setWithdrawAmount('');
        setUpiId('');
        setModalError('');
    
        // Refresh transactions or handle other UI updates if needed
        // e.g., fetchTransactions();
      } catch (error) {
        setModalError(error.message || 'Failed to create withdrawal request');
      }
    };

    useEffect(() => {
      handleAmountChange(); // Call handleAmountChange after transactions and withdrawals are fetched
    }, [transactions, withdrawals]);
  

    return (
      <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
          {error && <p className="text-red-500">{error}</p>}
          <div className="mb-9 flex justify-between">
              <p className="font-bold">BALANCE: <span className='text-4xl text-green-600 ml-4'>₹{totalAmount}</span></p>
              
              {totalAmountVal > 0 && (
                  <button
                      className='p-2 bg-green-500 hover:bg-green-400 px-5 text-white rounded-lg'
                      onClick={() => setIsModalOpen(true)}
                  >
                      Withdraw Money
                  </button>
              )}
          </div>
          <div className="overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Completed Transactions</h2>
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
                      {transactions
                          .map(transaction => (
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

              <h2 className="text-xl font-bold mb-4 mt-8">Withdrawal Transactions</h2>
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
                      {withdrawals.map(withdrawal => (
                          <tr key={withdrawal._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{withdrawal.upiId}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{withdrawal.transactionId}</td>
                              <td className="px-6 py-4 whitespace-nowrap">₹ {withdrawal.amount}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{withdrawal.status}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  {new Date(withdrawal.createdAt).toLocaleDateString('en-GB')} {new Date(withdrawal.createdAt).toLocaleTimeString()}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {isModalOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white w-[500px] p-10 rounded shadow-lg relative mx-4">
                      <button
                          onClick={handleCancel}
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