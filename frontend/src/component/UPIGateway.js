import React, { useEffect, useState } from 'react'
import gpay from "../images/googlePay.png"
import phonePe from "../images/phonepeIcon.png"
import bhim from '../images/bhimIcon.png'
import paytm from '../images/paytmIcon.png'
import apay from '../images/amazonPayIcon.png'
import upi from "../images/upiIcon.png"

const UPIGateway = () => {


    const amount = localStorage.getItem("amount")
    const vpa = localStorage.getItem("vpa")
    
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); 

    
    const fetchQrCode = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/upi-qr?amount=${encodeURIComponent(amount)}&vpa=${encodeURIComponent(vpa)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setQrCodeUrl(data.qrCodeUrl);
        } catch (error) {
            console.error('Error fetching QR code:', error);
        }
    };
    
    
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


    const handleApps = () => {
        
        const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=Merchant%20Name&tr=${Date.now()}&tn=Payment%20for%20Order&am=${encodeURIComponent(amount)}&cu=INR`;
        window.location.href = upiLink;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    


  return (
    <div className='border-2 border-black h-[630px] rounded-md mt-10 
    w-96 m-auto'>

        <div className='h-[150px] border-b-2 bg-blue-700 border-gray-400'>
        <p className='text-center p-5 text-white font-semibold'>UPI gateway</p>
        <p className='text-center pt-5 text-lg font-bold text-white'>ReduxPay </p>
        </div>

        <div className='text-center m-4 text-4xl font-bold'>₹ {amount}</div>

        <div>
            {qrCodeUrl && !isMobile && (
                <div className='mt-6 flex-col flex items-center justify-center'>
                    <div className='text-center mt-1'>
                        <p className='text-lg font-semibold'>QR Reset Time: {formatTime(timeLeft)}</p>
                    </div>
                    <p className='text-xs font-semibold'>Scan QR to pay</p>
                    <img className='h-64' src={qrCodeUrl} alt="UPI QR Code" />
                    
                    
                </div>
            )}

            {
            !isMobile ? 
            <div className='flex items-center justify-center space-x-5'>

            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={gpay} alt='gpay' />
            GPay</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={phonePe} alt='phonepe' />PhonePe</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={paytm} alt='paytm' />Paytm</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={bhim} alt='bhim' />Bhim</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={apay} alt='amazonPay' />Amazon</button>            
            
            </div> : 

            <div>

                <p className='my-3 ml-1 text-gray-500 text-sm font-bold'>UPI Apps</p>
            
            
            <div className='grid grid-cols-2 gap-y-3 grid-rows-3 gap-2 px-1'>

            <div onClick={handleApps} className='h-12 flex border-2 border-gray-200 ml-1 p-2 rounded-lg w-44'>
            <button className='text-[11px]'>
                <img className='m-auto w-7' src={gpay} alt='gpay' /></button>            
            <p className='m-auto font-medium'>Google pay</p>
            </div>

            <div onClick={handleApps} className='h-12 flex border-2 border-gray-200 p-2 rounded-lg w-44'>
            <button className='text-[11px]' onClick={handleApps}>
                <img className='m-auto w-7' src={phonePe} alt='phonepe' /></button>            
            <p className='m-auto font-medium'>PhonePe</p>
            </div>

            <div onClick={handleApps} className='h-12 flex border-2 border-gray-200 ml-1 p-2 rounded-lg w-44'>
            <button className='text-[11px]' onClick={handleApps}>
                <img className='m-auto w-7 h-3' src={paytm} alt='paytm' /></button>            
            <p className='m-auto font-medium'>Paytm</p>
            </div>

            <div onClick={handleApps} className='h-12 flex border-2 border-gray-200 p-2 rounded-lg w-44'>
            <button className='text-[11px]' onClick={handleApps}>
                <img className='m-auto w-7' src={bhim} alt='bhim' /></button>            
            <p className='m-auto font-medium'>Bhim</p>
            </div>

            <div onClick={handleApps} className='h-12 flex border-2 border-gray-200 ml-1 p-2 rounded-lg w-44'>
            <button className='text-[11px]' onClick={handleApps}>
                <img className='m-auto w-7' src={apay} alt='apay' /></button>            
            <p className='m-auto font-medium'>Amazon</p>
            </div>

            <div onClick={handleApps} className='h-12 flex border-2 border-gray-200 p-2 rounded-lg w-44'>
            <button className='text-[11px]' onClick={handleApps}>
                <img className='m-auto w-7' src={upi} alt='upi' /></button>            
            <p className='m-auto font-medium'>Others </p>
            </div>

            </div>


            
            </div>
            }

        </div>

    </div>
  )
}

export default UPIGateway