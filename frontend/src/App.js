import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import UPIAmount from "./component/UPIAmount";
import UPIGateway from "./component/UPIGateway";
import Login from './component/Login';
import Signup from './component/Signup';
import Navbar from './component/Navbar'; // Import the Navbar component

const App = () => {
  const location = useLocation();

  
  const showNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/amount" element={<UPIAmount />} />
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gate" element={<UPIGateway />} />
      </Routes>
    </div>
  );
};

function MainApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default MainApp;
