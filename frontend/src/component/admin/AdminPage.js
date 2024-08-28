import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';


const Admin = () => {
  const [upiIds, setUpiIds] = useState([]);
  const [usedUpiIds, setUsedUpiIds] = useState([]);
  const [utrDetails, setUtrDetails] = useState({});
  const [showImage, setShowImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState(null);




  useEffect(() => {
    const fetchUpiIds = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/upi-ids`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUpiIds(data.upiIds);
      } catch (error) {
        console.error('Error fetching UPI IDs:', error);
      }
    };
    // console.log('Webhook Secret:', process.env.REACT_APP_WEBHOOK_SECRET);


    fetchUpiIds();
  }, []);

  useEffect(() => {
    // Fetch used UPI IDs and withdrawals
    const fetchUsedUpiIdsAndWithdrawals = async () => {
      try {
        const [usedUpiIdsResponse, withdrawalsResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/used-upi-ids`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin-withdrawals`)
        ]);

        const usedUpiIdsData = await usedUpiIdsResponse.json();
        const withdrawalsData = await withdrawalsResponse.json();

        setUsedUpiIds(usedUpiIdsData);
        setWithdrawals(withdrawalsData.withdrawals || []);

        // Fetch UTR details for each used UPI ID
        for (const entry of usedUpiIdsData) {
          try {
            const utrResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/utr-details?transactionId=${entry.transactionId}`);
            const utrData = await utrResponse.json();
            setUtrDetails(prevState => ({
              ...prevState,
              [entry.transactionId]: utrData
            }));
          } catch (error) {
            console.error(`Error fetching UTR details for transaction ${entry.transactionId}:`, error);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsedUpiIdsAndWithdrawals();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/events`);
  
    eventSource.onmessage = (event) => {
      const { transactionId, status } = JSON.parse(event.data);
  
      setUsedUpiIds(prevState =>
        prevState.map(entry =>
          entry.transactionId === transactionId
            ? { ...entry, status }
            : entry
        )
      );
    };
  
    return () => {
      eventSource.close();
    };
  }, []);
  


  const handleDeleteSingleUpiId = async () => {
    if (usedUpiIds.length === 0) return;

    const singleUpiId = usedUpiIds[usedUpiIds.length - 1]._id;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/delete-upi-ids`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ upiIds: [singleUpiId] })
      });

      if (!response.ok) {
        throw new Error('Failed to delete UPI ID');
      }

      // Remove the last UPI ID from the state
      setUsedUpiIds(prevState => prevState.slice(0, -1));
    } catch (error) {
      console.error('Error deleting UPI ID:', error);
    }
  };



  const handleValidate = async (transactionId) => {
    try {
      const payload = JSON.stringify({
        transactionId,
        status: 'completed'
      });

      const xSignature = CryptoJS.HmacSHA256(payload, process.env.REACT_APP_WEBHOOK_SECRET).toString(CryptoJS.enc.Hex);

  
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payment-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': xSignature, // Pass the x-signature header
        },
        body: payload,
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert(`Transaction ${transactionId} status updated to completed.`);
        setUsedUpiIds(prevState =>
          prevState.map(entry =>
            entry.transactionId === transactionId
              ? { ...entry, status: 'completed' }
              : entry
          )
        );
      } else {
        alert(`Failed to update status for transaction ${transactionId}.`);
      }
    } catch (error) {
      console.error('Error validating payment status:', error);
    }
  };
  

  const openModal = (transactionId) => {
    setShowImage(utrDetails[transactionId]?.utrImage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setShowImage(null);
    setIsModalOpen(false);
  };


  const handleComplete = async (withdrawalId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/withdrawals/${withdrawalId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update withdrawal status');
      }

      const data = await response.json();
      console.log('Withdrawal status updated:', data.withdrawal);

      // Update state to reflect the status change
      setWithdrawals(prevWithdrawals =>
        prevWithdrawals.map(withdrawal =>
          withdrawal._id === withdrawalId
            ? { ...withdrawal, status: 'completed' }
            : withdrawal
        )
      );
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      setError(error.message || 'Failed to update withdrawal status');
    }
  };
  



  
  return (
    <div>
    {/* UPI IDs Section */}
    <div>
      <h1 className="text-4xl font-bold mb-5">Admin - UPI ID</h1>
      <ul className="ml-5 list-disc">
        {upiIds && upiIds.map((upiId, index) => (
          <li className="m-3 font-medium" key={index}>{upiId}</li>
        ))}
      </ul>
    </div>

    {/* Used UPI IDs Section */}
    <div className="p-5">
      <h1 className="my-10 text-3xl font-bold">Used UPI IDs</h1>
      <div className="ml-2 border-b-4 border-gray-950 pb-4 grid grid-cols-6 font-bold mb-2">
        <div>UPI ID</div>
        <div>Transaction ID</div>
        <div className="ml-1">UTR Number</div>
        <div>Amount</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      {usedUpiIds.map((entry) => (
        <div key={entry._id} className="grid grid-cols-6 gap-1 p-2 border-b border-gray-300">
          <div>{entry.upiId}</div>
          <div>{entry.transactionId}</div>
          <div className="ml-4">{utrDetails[entry.transactionId]?.utrNumber || 'Not entered by user'}</div>
          <div>₹ {entry.amount}</div>
          <div>{entry.status}</div>
          <div>
            <button
              onClick={() => handleValidate(entry.transactionId)}
              className="bg-blue-500 hover:bg-blue-400 text-white py-1 px-2 rounded">
              Validate
            </button>
            <button
              onClick={() => openModal(entry.transactionId)}
              className="bg-green-500 hover:bg-green-400 text-white py-1 px-2 rounded ml-2">
              Show Image
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Modal for displaying UTR Image */}
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg max-w-md mx-auto">
          <img
            src={showImage}
            alt="UTR Image"
            className="w-full h-auto object-cover"
          />
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 hover:bg-red-400 text-white py-1 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    )}

    {/* Withdrawals Section */}
    <div className="p-5">
      <h1 className="my-10 text-3xl font-bold">User Withdrawals</h1>
      <div className="ml-2 border-b-4 border-gray-950 pb-4 grid grid-cols-5 font-bold mb-2">
        <div>Phone Number</div>
        <div>UPI ID</div>
        <div>Amount</div>
        <div>Status</div>
        <div>Requested At</div>
      </div>
      {withdrawals.map((withdrawal) => (
        <div key={withdrawal._id} className="grid grid-cols-5 gap-1 p-2 border-b border-gray-300">
          <div>{withdrawal.phoneNumber}</div>
          <div>{withdrawal.upiId}</div>
          <div>₹ {withdrawal.amount}</div>
          <div>{withdrawal.status}</div>
          <div>{new Date(withdrawal.createdAt).toLocaleString()}</div>
          <button
            onClick={() => handleComplete(withdrawal._id)}
            disabled={withdrawal.status !== 'pending'}
          >
            Mark as Completed
          </button>
        </div>
      ))}
    </div>

    {/* Delete Button */}
    <button
      onClick={handleDeleteSingleUpiId}
      className="mt-5 bg-red-500 text-white py-2 px-4 rounded">
      Delete Bottom UPI ID
    </button>
  </div>
);
};

export default Admin;
