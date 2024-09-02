import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UPIAmount = () => {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    const randomUpiBtn = async () => {
        if (!amount) {
            alert('Please enter an amount');
            return;
        }

        try {
            // Fetch the QR code URL from the backend
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upi-qr?amount=${encodeURIComponent(amount)}`);
            const data = await response.json();

            if (response.ok && data.qrCodeUrl) {
                // Navigate to the UPIGateway component with the necessary data
                navigate('/gate', {
                    state: {
                        amount
                    }
                });
            } else {
                console.error('Error generating payment link:', data.error);
            }
        } catch (error) {
            console.error('Error generating payment link:', error);
        }
    };

    return (
        <div className='flex-col p-2'>
            <h1>Pay via UPI</h1>
            <div>
                <label>Amount:</label>
                <input
                    className='w-[100%] p-2 mb-6 border border-black'
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                />
            </div>

            <div>
                <button 
                    onClick={randomUpiBtn}
                    className='bg-slate-300 hover:bg-slate-50 p-2 rounded-lg'
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default UPIAmount;
