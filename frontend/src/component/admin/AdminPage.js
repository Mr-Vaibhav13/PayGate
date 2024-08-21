import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [upiIds, setUpiIds] = useState([]);
  const [usedUpiIds, setUsedUpiIds] = useState([]);

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

    fetchUpiIds();
  }, []);

  useEffect(() => {
    const fetchUsedUpiIds = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/used-upi-ids`);
        const data = await response.json();
        setUsedUpiIds(data);
      } catch (error) {
        console.error('Error fetching used UPI IDs:', error);
      }
    };

    fetchUsedUpiIds();
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


  return (
    <div>
      <div>
        <h1 className='text-4xl font-bold mb-5'>Admin - UPI ID</h1>
        <ul className='ml-5 list-disc'>
          {upiIds.map((upiId, index) => (
            <li className='m-3 font-medium' key={index}>{upiId}</li>
          ))}
        </ul>
      </div>

      <div className='p-5'>
        <h1 className='my-10 text-3xl font-bold'>Used UPI IDs</h1>
        <div className="ml-2 grid grid-cols-4 gap-3 font-bold mb-2">
          <div>UPI ID</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Status</div>
        </div>
        {usedUpiIds.map((entry, index) => (
          <div key={entry._id} className="grid grid-cols-4 gap-4 p-2 border-b border-gray-300">
            <div>{entry.upiId}</div>
            <div>₹ {entry.amount}</div>
            <div className='text-sm'>{new Date(entry.createdAt).toLocaleString()}</div>
            <div>{entry.status}</div>
            
          </div>
        ))}
      </div>

      <button
        onClick={handleDeleteSingleUpiId}
        className="mt-5 bg-red-500 text-white py-2 px-4 rounded">
        Delete Bottom UPI ID
      </button>
    </div>
  );
};

export default Admin;
