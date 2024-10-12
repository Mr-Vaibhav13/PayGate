import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';


const Admin = () => {
  const [upiIds, setUpiIds] = useState([]);
  const [usedUpiIds, setUsedUpiIds] = useState([]);
  const [utrDetails, setUtrDetails] = useState({});
  const [showImage, setShowImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [upiToEdit, setUpiToEdit] = useState(null);
  const [newUpiId, setNewUpiId] = useState(''); // State to hold the new UPI ID




  useEffect(() => {
    const fetchUpiIds = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/upi-ids`);
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
      const { transactionId, status, newWithdrawal } = JSON.parse(event.data);

      if (transactionId) {
        // Update UPI ID status
        setUsedUpiIds(prevState =>
          prevState.map(entry =>
            entry.transactionId === transactionId
              ? { ...entry, status }
              : entry
          )
        );
      }

      if (newWithdrawal) {
        // Add the new withdrawal to the state
        setWithdrawals(prevState => [newWithdrawal, ...prevState]);
      }
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
    const image = utrDetails[transactionId]?.utrImage;
    console.log('Fetched Image data:', image); // Logs the fetched image data
  
    const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/`; // Adjust base URL
    const imageUrl = `${baseUrl}${image}`; // Construct full URL if necessary
    setShowImage(imageUrl);
  
    // No need to log immediately here; use useEffect to check the updated state
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
          }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update withdrawal status');
      }
  
      const data = await response.json();
      alert(`Withdraw status updated to completed`);

      const updatedWithdrawalsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin-withdrawals`);
    const updatedWithdrawalsData = await updatedWithdrawalsResponse.json();
    setWithdrawals(updatedWithdrawalsData.withdrawals || []);
      // Optionally refresh the list of withdrawals or update the UI
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
    }
  };

  const handleLoad = () =>{
    window.location.reload();
  }
  



  // Function to handle opening the edit modal
  const openEditModal = (upiId) => {
    setUpiToEdit(upiId);
    setNewUpiId(upiId); // Set the current UPI ID as the initial value
    setIsEditModalOpen(true);
  };

  // Function to handle editing UPI ID
  const handleEditUpiId = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/edit-upi-id`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldUpiId: upiToEdit, newUpiId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update UPI ID');
      }

      // Update the state with the new UPI ID
      setUpiIds(prevState => prevState.map(upi => (upi === upiToEdit ? newUpiId : upi)));
      setIsEditModalOpen(false);
      setUpiToEdit(null);
      setNewUpiId(''); // Clear the input field
    } catch (error) {
      console.error('Error editing UPI ID:', error);
    }
  };

  return (
    <div>
    {/* UPI IDs Section */}
    <div>
      <div className='flex justify-between'>
      <h1 className="text-4xl font-bold mb-5">Admin - UPI ID</h1>
      <button className='mr-10 text-lg bg-yellow-600 hover:bg-yellow-500 rounded-lg px-5 mt-2 font-bold text-white' onClick={handleLoad}>Load page</button>
      </div>

      
    {/* Button to open the edit modal */}
    
      <ul className="ml-5 list-disc">
        {upiIds && upiIds.map((upiId, index) => (
          <li className="m-3 mr-56 font-medium flex justify-between items-center" key={index}>
            <span>{upiId}</span>
            <button
              onClick={() => openEditModal(upiId)} // Open edit modal for the specific UPI ID
              className="bg-orange-500 hover:bg-orange-400 text-white py-1 px-10 rounded">
              Edit
            </button>
          </li>
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
    {/* Delete Button */}
    <button
      onClick={handleDeleteSingleUpiId}
      className="mt-5 bg-red-500 text-white py-2 px-4 rounded">
      Delete Bottom UPI ID
    </button>

    {/* Withdrawals Section */}
    <div className="p-5">
      <h1 className="my-10 text-3xl font-bold">User Withdrawals</h1>
      <div className="ml-2 border-b-4 border-gray-950 pb-4 grid grid-cols-6 font-bold mb-2">
        <div>Phone Number</div>
        <div>UPI ID</div>
        <div>Amount</div>
        <div>RequestedAt</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      {withdrawals.map((withdrawal) => (
        <div key={withdrawal._id} className="grid grid-cols-6 gap-1 p-2 border-b border-gray-300">
          <div>{withdrawal.phoneNumber}</div>
          <div>{withdrawal.upiId}</div>
          <div>₹ {withdrawal.amount}</div>
          <div>{new Date(withdrawal.createdAt).toLocaleString()}</div>
          <div className='ml-3'>{withdrawal.status}</div>
          <button className='cursor-pointer	bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg'
            onClick={() => handleComplete(withdrawal._id)}
            disabled={withdrawal.status !== 'pending'}
          >
            Mark Completed
          </button>
        </div>
        
      ))}
    </div>


    {/* Edit Modal for UPI IDs */}
    {isEditModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Edit UPI ID</h2>
          <div className="mb-4">
            <span className="font-medium">Current UPI ID:</span>
            <span className="ml-2">{upiToEdit}</span>
          </div>
          <input
            type="text"
            value={newUpiId}
            onChange={(e) => setNewUpiId(e.target.value)} // Update the new UPI ID state
            className="border border-gray-300 p-2 rounded mb-4 w-full"
            placeholder="Enter new UPI ID"
          />
          <button
            onClick={handleEditUpiId} // Call the edit function on click
            className="bg-green-500 hover:bg-green-400 text-white py-1 px-4 rounded">
            Submit
          </button>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="mt-4 bg-red-500 hover:bg-red-400 text-white py-1 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default Admin;