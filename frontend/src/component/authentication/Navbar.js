import React from 'react';
import { Link } from 'react-router-dom';
import { DiZend } from "react-icons/di";


const Navbar = () => {
  return (
    <div className='h-[80px] flex items-center bg-orange-700'>
      <ul className='flex '>
        <p className='ml-5 text-4xl flex'><DiZend className='text-slate-200' /></p>

        <div className='space-x-10 m-auto flex mr-10 ml-36'>
        <li>
          <Link className='px-6 py-2 hover:bg-yellow-300 font-semibold bg-yellow-200 text-gray-700 rounded-md'
          to="/">Signup</Link>
        </li>
        <li>
          <Link className='px-6 py-2 hover:bg-yellow-300 font-semibold bg-yellow-200 text-gray-700 rounded-md'
          to="/login">Login</Link>
        </li>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
