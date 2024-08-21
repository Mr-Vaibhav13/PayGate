import React from 'react'


import gpay from "../../images/googlePay.png";
import phonePe from "../../images/phonepeIcon.png";
import bhim from '../../images/bhimIcon.png';
import paytm from '../../images/paytmIcon.png';
import apay from '../../images/amazonPayIcon.png';
import upi from "../../images/upiIcon.png";

const MobileIntent = ({vpa,amount}) => {

    const handleApps = () => {
        const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=Merchant%20Name&tr=${Date.now()}&tn=Payment%20for%20Order&am=${encodeURIComponent(amount)}&cu=INR`;
        window.location.href = upiLink;
    };

  return (
     

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
  )
}

export default MobileIntent