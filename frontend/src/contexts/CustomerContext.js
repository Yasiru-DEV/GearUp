import React, { createContext, useContext, useEffect, useState } from 'react';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const raw = localStorage.getItem('customer');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (customer) localStorage.setItem('customer', JSON.stringify(customer));
      else localStorage.removeItem('customer');
    } catch (e) {
      // ignore storage errors
    }
  }, [customer]);

  const value = { customer, setCustomer };
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider');
  return ctx;
}

export default CustomerContext;
