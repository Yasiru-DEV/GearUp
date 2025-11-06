import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';
import { getCartByCustomer } from '../api';

export default function Navbar() {
  const { customer } = useCustomer();
  const [count, setCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      if (!customer) return setCount(0);
      try {
        const cart = await getCartByCustomer(customer._id || customer.id);
        const qty = (cart?.items || []).reduce((s, i) => s + (i.qty || 0), 0);
        setCount(qty);
      } catch (e) {
        setCount(0);
      }
    };
    load();
    // also attempt to refresh when the route changes (simple heuristic)
  }, [customer, location]);

  const logoPath = `${process.env.PUBLIC_URL}/gear.jpg`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoPath} alt="GearUp" width="40" height="40" className="me-2" />
          <span className="fw-bold">GearUp</span>
        </Link>

        <div className="d-flex align-items-center">
          <Link to="/products" className="me-3 text-decoration-none">Products</Link>
          {customer ? (
            <>
              <Link to="/profile" className="me-3 text-decoration-none">My Profile</Link>
              <span className="me-3 text-muted small d-none d-md-inline">{customer.name}</span>
              <Link to="/cart" className="btn btn-outline-secondary btn-sm me-2 position-relative" title="Cart">
                🛒
                {count > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize:'0.6rem'}}>
                    {count}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link to="/customer" className="btn btn-outline-primary btn-sm">Add customer</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
