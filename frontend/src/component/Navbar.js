import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='h-[80px] bg-slate-400'>
      <ul className='flex pt-7 ml-5'>
        <p className='mr-20'>⭐</p>

        <div className='space-x-10 flex mr-10 '>
        <li>
          <Link className='border-2 px-4 py-1 hover:bg-slate-300 bg-slate-50 rounded-md'
          to="/">Signup</Link>
        </li>
        <li>
          <Link className='border-2 px-4 py-1 hover:bg-slate-300 bg-slate-50 rounded-md'
          to="/login">Login</Link>
        </li>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
