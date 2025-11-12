import React, { useEffect, useState, useCallback } from 'react';
import { useCustomer } from '../contexts/CustomerContext';
import { getOrdersByCustomer } from '../api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProfilePage() {
  const { customer, setCustomer } = useCustomer();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadOrders = useCallback(async () => {
    setErr(null);
    if (!customer) return setErr('Please save customer first.');
    setLoading(true);
    try {
      const data = await getOrdersByCustomer(customer._id || customer.id);
      setOrders(data || []);
      // if an orderId passed via location.state, select it
      const orderId = location?.state?.orderId;
      if (orderId) {
        const ord = data.find(o => String(o._id) === String(orderId));
        if (ord) setSelectedOrder(ord);
      }
    } catch (e) {
      console.error(e);
      setErr('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [customer, location]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleLogout = () => {
    setCustomer(null);
    navigate('/');
  };

  const showOrder = (order) => setSelectedOrder(order);

  return (
    <div className="container py-4">
      <h3>Profile</h3>
      {err && <div className="alert alert-danger">{err}</div>}

      {customer && (
        <div className="card mb-3">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title">{customer.name}</h5>
              <div className="text-muted">{customer.email}</div>
              <div>{customer.phone}</div>
            </div>
            <div>
              <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/products')}>Browse products</button>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-5">
          <h5>Your Orders</h5>
          {loading ? <div>Loading...</div> : (
            orders && orders.length ? (
              <ul className="list-group">
                {orders.map(o => (
                  <li key={o._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div><strong>#{o._id}</strong></div>
                      <div className="text-muted">{new Date(o.createdAt).toLocaleString()}</div>
                      <div className="small">Total: Rs. {o.totalAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-primary" onClick={() => showOrder(o)}>View</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No orders yet.</div>
            )
          )}
        </div>

        <div className="col-md-7">
          <h5>Order details</h5>
          {selectedOrder ? (
            <div className="card">
              <div className="card-body">
                <h6>Order #{selectedOrder._id}</h6>
                <div className="mb-2">Status: <strong>{selectedOrder.status}</strong></div>
                <div className="mb-2">Total: Rs. {selectedOrder.totalAmount.toFixed(2)}</div>
                <div className="mb-2">Delivery:</div>
                <div className="mb-2 small text-muted">{(selectedOrder.delivery && (selectedOrder.delivery.line1 || selectedOrder.delivery.address || ''))}</div>
                <h6>Items</h6>
                <ul className="list-group mb-2">
                  {selectedOrder.items.map(it => (
                    <li key={it._id || it.product} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div><strong>{it.name}</strong></div>
                        <div className="text-muted">{it.qty} × Rs. {it.price}</div>
                      </div>
                      <div>Rs. {(it.qty * it.price).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>Select an order to see details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
