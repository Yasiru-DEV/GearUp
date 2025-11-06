import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';

// Protect routes by checking context customer
export default function ProtectedRoute({ children }) {

  const { customer } = useCustomer();

  if (!customer || !(customer._id || customer.id)) {
    return <Navigate to="/customer" replace state={{ message: 'Please add customer first' }} />;
  }

  return children;
}
