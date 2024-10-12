import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";

const UPIAmount = () => {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    const phoneNumber = sessionStorage.getItem("phoneNumber");

    const randomUpiBtn = async () => {
        if (!amount) {
            alert('Please enter an amount');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upi-qr?amount=${encodeURIComponent(amount)}`);
            const data = await response.json();

            if (response.ok && data.qrCodeUrl) {
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
        <div className='h-screen bg-gray-800 flex flex-col items-center justify-center relative'>
            {/* Profile icon and phone number */}
            
        

            {/* Main content */}
            <div className="flex flex-col items-center">
                <h1 className="text-5xl font-bold mb-6 text-slate-200">Pay via UPI</h1>
                <div className="mb-4">
                    
                    <input
                        className='w-[100%] p-2 mb-6 border border-gray-300 rounded-lg'
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>

                <button
                    onClick={randomUpiBtn}
                    className="px-8 py-4 bg-primary text-white rounded-lg shadow-lg hover:bg-hoverPrimary transition duration-300 font-semibold">
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default UPIAmount;