import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [upiId, setUpiId] = useState('');
  const [password, setPassword] = useState('');
  const [phNumber, setPhNumber] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, website, upiId, phNumber, password }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Signup successful');
        navigate('/login');
      } else {
        alert(result.message);
        if (result.message === 'Email already in use') {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <form className='mt-10 ml-10' onSubmit={handleSignup}>
      <h2 className='mb-20 text-4xl font-bold'>Signup Page</h2>
      <div className='grid grid-rows-3 grid-cols-2 gap-4 p-4'>
      
      <input className='border-2 w-[250px] rounded-lg p-2'
        type="text"
        placeholder="Company Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input className='border-2 w-[250px] rounded-lg p-2'
        type="email"
        placeholder="Company Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input className='border-2 w-[250px] rounded-lg p-2'
        type="number"
        placeholder="Company Phone No."
        value={phNumber}
        onChange={(e) => setPhNumber(e.target.value)}
      />

      <input className='border-2 w-[250px] rounded-lg p-2'
        type="text"
        placeholder="Company Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <input className='border-2 w-[250px] rounded-lg p-2'
        type="text"
        placeholder="Company UPI Id"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />

      <input className='border-2 w-[250px] rounded-lg p-2'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className='border w-[90px] p-2 rounded-lg text-white text-sm font-semibold bg-red-600 hover:bg-red-500'
      type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default Signup;
