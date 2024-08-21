import React from 'react'
import gpay from "../../images/googlePay.png";
import phonePe from "../../images/phonepeIcon.png";
import bhim from '../../images/bhimIcon.png';
import paytm from '../../images/paytmIcon.png';
import apay from '../../images/amazonPayIcon.png';

const PcIntent = () => {
  return (
            <div className='flex items-center justify-center space-x-5'>

            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={gpay} alt='gpay' />
            GPay</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={phonePe} alt='phonepe' />PhonePe</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={paytm} alt='paytm' />Paytm</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={bhim} alt='bhim' />Bhim</button>            
            <button className='text-[11px] font-bold'><img className='m-auto w-7' src={apay} alt='amazonPay' />Amazon</button>            
            
            </div>
  )
}

export default PcIntent