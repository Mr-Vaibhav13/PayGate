import React, { useState, useEffect } from 'react';

const UPIAmount = () => {
    const [amount, setAmount] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    
    useEffect(() => {
        if (paymentLink) {
            // Perform redirection when paymentLink state changes
            window.location.href = paymentLink;
        }
    }, [paymentLink]);

    const randomUpiBtn = async () => {
        if (!amount) {
            alert('Please enter an amount');
            return;
        }

        try {
            // Fetch the QR code URL from the backend
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upi-qr?amount=${encodeURIComponent(amount)}`);
            const data = await response.json();

            if (response.ok) {
                // Set the payment link to the returned URL
                setPaymentLink(`${window.location.origin}/gate?upiLink=${encodeURIComponent(data.qrCodeUrl)}`);
                localStorage.setItem('amount', amount);
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
                <button onClick={randomUpiBtn}
                className='bg-slate-300 hover:bg-slate-50 p-2 rounded-lg'
                >Pay Now</button>
            </div>

            
        </div>
    );
};

export default UPIAmount;
