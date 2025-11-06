import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const logoPath = `${process.env.PUBLIC_URL}/gear.jpg`;
  return (
    <div className="landing-hero text-white text-center">
      <div className="container py-5">
        <img src={logoPath} alt="GearUp" width="96" height="96" className="mb-3" />
        <h1 className="display-4 fw-bold">Welcome to GearUp</h1>
        <p className="lead mb-4">A tiny demo shop built for learning — quickly add products, manage your cart and complete checkout.</p>
        <div>
          <Link to="/customer" className="btn btn-lg btn-primary me-2">Get started</Link>
          <Link to="/products" className="btn btn-lg btn-outline-light">Browse products</Link>
        </div>
        <div className="mt-4 text-muted small">This is a simple intern-style UI connected to the GearUp backend.</div>
      </div>
    </div>
  );
}
