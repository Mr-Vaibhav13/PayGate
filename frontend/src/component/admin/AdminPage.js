import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';


const Admin = () => {
  const [upiIds, setUpiIds] = useState([]);
  const [usedUpiIds, setUsedUpiIds] = useState([]);
  const [utrDetails, setUtrDetails] = useState({});
  const [showImage, setShowImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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
    const fetchUsedUpiIds = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/used-upi-ids`);
        const data = await response.json();
        setUsedUpiIds(data);
        
        for (const entry of data) {
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
        console.error('Error fetching used UPI IDs:', error);
      }
    };

    

    fetchUsedUpiIds();
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

  
  return (
    <div>
      <div>
        <h1 className='text-4xl font-bold mb-5'>Admin - UPI ID</h1>
        <ul className='ml-5 list-disc'>
          {upiIds && upiIds.map((upiId, index) => (
            <li className='m-3 font-medium' key={index}>{upiId}</li>
          ))}
        </ul>
      </div>

      <div className='p-5'>
        <h1 className='my-10 text-3xl font-bold'>Used UPI IDs</h1>
        <div className="ml-2 border-b-4 border-gray-950 pb-4 grid grid-cols-6 font-bold mb-2">
          <div>UPI ID</div>
          <div>Transaction ID</div>
          <div className='ml-1'>UTR Number</div>
          <div>Amount</div>
          {/* <div>Date</div> */}
          <div>Status</div>
          <div>Actions</div> {/* New column for actions */}
        </div>
        {usedUpiIds.map((entry) => (
          <div key={entry._id} className="grid grid-cols-6 gap-1 p-2 border-b border-gray-300">
            <div>{entry.upiId}</div>
            <div>{entry.transactionId}</div>
            <div className='ml-4'>{utrDetails[entry.transactionId]?.utrNumber || 'Not entered by user'}</div>
            <div>₹ {entry.amount}</div>
            {/* <div className='text-sm'>{new Date(entry.createdAt).toLocaleString()}</div> */}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-lg relative max-w-lg mx-4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-400 text-white rounded-full p-2">
              &times;
            </button>
            <h3 className="text-2xl font-bold">Uploaded UTR Image:</h3>
            {showImage && (
              <img src={`${process.env.REACT_APP_BACKEND_URL}/${showImage}`} alt="UTR Image" className="mt-3 max-w-full"/>
            )}
          </div>
        </div>
      )}


      <button
        onClick={handleDeleteSingleUpiId}
        className="mt-5 bg-red-500 text-white py-2 px-4 rounded">
        Delete Bottom UPI ID
      </button>
    </div>
  );
};

export default Admin;
