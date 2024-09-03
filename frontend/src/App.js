import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import UPIAmount from "./component/UPIAmount";
import UPIGateway from "./component/UPIGateway";
import Login from './component/authentication/Login';
import Signup from './component/authentication/Signup';
import Navbar from './component/authentication/Navbar'; 
import AdminPage from './component/admin/AdminPage';
// import AdminRoute from './component/admin/AdminRoute';
import Transactions from './component/show/Transactions';
import Success from './component/show/Success';
import VerifyOtpComp from './component/authentication/VerifyOtpComp';
import Home from './component/show/Home';
import Wallet from './component/show/Wallet';
import DynamicTitle from './component/show/DynamicTitle';
const App = () => {
  const location = useLocation();

  const showNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <div>
      {showNavbar && <Navbar />}
      <DynamicTitle />

      <Routes>
        <Route path="/amount" element={<UPIAmount />} />
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOtpComp />} />
        <Route path="/gate" element={<UPIGateway />} />
        <Route path="/trans" element={<Transactions />} />
        <Route path="/payment-success" element={<Success />} />
        <Route path="/home" element={<Home />} />
        <Route path="/with" element={<Wallet />} />
      
      
        <Route path="/admin" 
        element={<AdminPage />} />

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
