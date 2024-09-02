import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin`);

        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  return isAdmin;
};

const AdminRoute = ({ children }) => {
  const isAdmin = useAdminAuth();

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;
