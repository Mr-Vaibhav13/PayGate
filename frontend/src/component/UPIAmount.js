import React, { useEffect, useState } from 'react';

const UPIAmount = () => {
    const [amount, setAmount] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    const [copySuccess, setCopySuccess] = useState('')
    const [upiId, setUpiId] = useState('');


    const fetchUpiId = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-upi-id`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you use JWT for authentication
                }
            });
            const data = await response.json();
            setUpiId(data.upiId);
            localStorage.setItem('vpa', data.upiId);
        } catch (error) {
            console.error('Error fetching UPI ID:', error);
        }
    };

    useEffect(() => {
        fetchUpiId(); // Fetch UPI ID when the component mounts
    }, []);
    

    const generatePaymentLink = async () => {
        if (!upiId) {
            alert('UPI ID not available');
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upi-qr?amount=${encodeURIComponent(amount)}&vpa=${encodeURIComponent(upiId)}`);
            const data = await response.json();
            setPaymentLink(`${window.location.origin}/gate?upiLink=${encodeURIComponent(data.upiLink)}`);
            localStorage.setItem('amount', amount);
        } catch (error) {
            console.error('Error generating payment link:', error);
        }
    };
    
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(paymentLink).then(() => {
            setCopySuccess('Link copied!');
        })
    };


    const handleLogout = () => {
         // Remove JWT token from local storage
        window.location.href = '/login'; // Redirect to login page or home page
    };
   
    
    // localStorage.setItem("amount", amount)
    // localStorage.setItem("vpa", "vaib@upi")

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
                <button onClick={generatePaymentLink}
                className='bg-slate-300 hover:bg-slate-50 p-2 rounded-lg'
                >Pay Now</button>
            </div>

            {paymentLink && amount!=="" &&(
                <div className='mt-4'>
                    <p className='text-xl font-bold'>http://localhost:3000/gate?upiLink</p>

                    <div className='space-x-5'>
                        <button className='my-6'><a href={paymentLink} className='border-2 bg-orange-400 p-2 rounded-lg hover:bg-orange-200'>Click this to redirect</a></button>
                        
                        <button
                            onClick={copyToClipboard}
                            className='border-2 bg-orange-400 p-2 rounded-lg hover:bg-orange-200'>
                            Copy Link
                        </button>
                        {copySuccess && <p className='text-green-500 mt-2'>{copySuccess}</p>}


                    
                    </div>
                </div>
            )}

        <button onClick={handleLogout}>Logout</button>

        
        </div>
    );
};

export default UPIAmount;
