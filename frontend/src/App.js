import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import UPIAmount from "./component/UPIAmount";
import UPIGateway from "./component/UPIGateway";
import Login from './component/authentication/Login';
import Signup from './component/authentication/Signup';
import Navbar from './component/authentication/Navbar'; 
import AdminPage from './component/admin/AdminPage';
import AdminRoute from './component/admin/AdminRoute';
import Transactions from './component/Transactions';

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
        <Route path="/trans" element={<Transactions />} />
      
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        } />

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
