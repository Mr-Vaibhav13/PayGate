import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileIntent from './UPI_Intent/MobileIntent';
import PcIntent from './UPI_Intent/PcIntent';

const UPIGateway = () => {
    const amount = localStorage.getItem("amount");
    const vpa = localStorage.getItem("vpa");

    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [transactionId, setTransactionId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('pending');

    const [utrNumber, setUtrNumber] = useState('');
    const [paymentPhoto, setPaymentPhoto] = useState(null);

    const navigate = useNavigate(); // React Router navigate function
    
    const phoneNumber = sessionStorage.getItem('phoneNumber');


    // Fetch QR code and transaction ID
    const fetchQrCode = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upi-qr?amount=${encodeURIComponent(amount)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQrCodeUrl(data.qrCodeUrl);
        setUpiId(data.upiId);
        setTransactionId(data.transactionId); // Store transactionId

        // Store amount and QR code in the database
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/store-payment-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                upiId: data.upiId,
                transactionId: data.transactionId,
                phoneNumber
            }),
        });
    } catch (error) {
        console.error('Error fetching QR code:', error);
    }
};

    
    // Fetch QR code when amount and vpa are available
    useEffect(() => {
        if (amount && vpa) {
            fetchQrCode();
        }

        const intervalId = setInterval(() => {
            if (amount && vpa) {
                fetchQrCode();
            }
        }, 300000);

        return () => clearInterval(intervalId);
    }, [amount, vpa]);


    // Check if the device is mobile
    useEffect(() => {
        const checkIfMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        checkIfMobile();

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    fetchQrCode();
                    return 300;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Format time for display
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };





// --------- SSE ------------

useEffect(() => {
    // Set up SSE connection
    const eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/events`);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received SSE event:', data);

        // Check for completed status and redirect
        if (data.status === 'completed') {
            setPaymentStatus('completed');
            navigate('/payment-success'); // Redirect after payment is completed
        }
    };

    eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
    };

    // Clean up when the component is unmounted
    return () => {
        eventSource.close();
    };
}, [navigate]);





// ------------------- END ------------------


const handleFileChange = (event) => {
    setPaymentPhoto(event.target.files[0]);
};


const handleSubmitUtrInfo = async () => {
    try {
      const utrFormData = new FormData();
      utrFormData.append('transactionId', transactionId);
      utrFormData.append('utrNumber', utrNumber);
      if (paymentPhoto) {
        utrFormData.append('utrImage', paymentPhoto);
      }
  
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/store-utr-info`, {
        method: 'POST',
        body: utrFormData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      navigate("/amount");
    } catch (error) {
      console.error('Error submitting UTR info:', error);
    }
  };
  


    

    return (
        <div className='flex'>
            <div className='border-2 border-black h-[630px] rounded-md mt-10 w-96 mx-10'>
            <div className='h-[150px] border-b-2 bg-blue-700 border-gray-400'>
                <p className='text-center p-5 text-white font-semibold'>UPI gateway</p>
                <p className='text-center pt-5 text-lg font-bold text-white'>ReduxPay</p>
            </div>
            
            <div className='text-center'>
                <p className='font-semibold'>Transaction ID: {transactionId}</p>
            </div>

            <div className='text-center text-4xl font-bold'>₹ {amount}</div>

            <div>
                {qrCodeUrl && !isMobile && (
                    <div className='mt-6 flex-col flex items-center justify-center'>
                        <div className='text-center mt-1'>
                            <p className='text-lg font-semibold'>QR Reset Time: {formatTime(timeLeft)}</p>
                        </div>
                        <p className='text-xs font-semibold'>Scan QR to pay</p>
                        <img className='h-64' src={qrCodeUrl} alt="UPI QR Code" />
                        {upiId && <p className='text-lg font-semibold'>UPI ID: {upiId}</p>} {/* Display UPI ID */}
                    </div>
                )}

                {!isMobile ? 
                    <PcIntent /> :
                    <MobileIntent vpa={vpa} amount={amount} />
                }

            </div>
            </div>

            
            
            <div className='mt-4 flex flex-col items-center justify-center'>
                    <input
                        type='text'
                        placeholder='Enter UTR Number'
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className='p-2 border border-gray-300 rounded mb-2 w-64'
                    />
                    <input
                        type='file'
                        onChange={handleFileChange}
                        className='p-2 border border-gray-300 rounded mb-2 w-64'
                    />
                    <button
                        onClick={handleSubmitUtrInfo}
                        className='bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded'>
                        Submit Payment Info
                    </button>
                </div>
        </div>
    );
};

export default UPIGateway;
