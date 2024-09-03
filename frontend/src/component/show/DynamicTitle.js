import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if the current path is /admin and update the page title
    if (location.pathname === '/admin') {
      document.title = 'Admin';
    } 
    else if (location.pathname === '/with') {
      document.title = 'Gateway-Withdraw';
    }

    else if (location.pathname === '/amount') {
        document.title = 'Gateway-Amount';
      }

      else {
        document.title = 'Gateway';
      }
  }, [location.pathname]); // Update the title whenever the route changes

  return null; // This component does not render anything
};

export default DynamicTitle;
