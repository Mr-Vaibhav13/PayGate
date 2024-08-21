import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const { token, isAdmin } = await response.json();
        localStorage.setItem('token', token);
        
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/amount');
        }
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  return (
    <form className='mt-10 ml-10' onSubmit={handleLogin}>
      <h2 className='mb-20 text-4xl font-bold'>Login Page</h2>
      <div className='ml-5 flex flex-col space-y-5'>
        <input
          className='border-2 w-[250px] rounded-lg p-2'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='border-2 w-[250px] rounded-lg p-2'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='border w-[90px] p-2 rounded-lg text-white text-sm font-semibold bg-red-600 hover:bg-red-500'
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;
