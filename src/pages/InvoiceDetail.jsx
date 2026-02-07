import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import ErrorMessage from '../components/ErrorMessage';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('USD');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setError(null);
      const { data } = await api.get(`/invoices/${id}`);
      setInvoice(data);
      setPaymentCurrency(data.currency);
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError(err.response?.data?.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/invoices/${id}/payments`, {
        amount: parseFloat(paymentAmount),
        currency: paymentCurrency
      });
      setShowPaymentModal(false);
      setPaymentAmount('');
      fetchInvoice(); // Refresh to get updated status
    } catch (err) {
      console.error('Error adding payment:', err);
      alert('Failed to add payment');
    }
  };

  const getTotalPaid = () => {
    if (!invoice?.payments) return 0;
    return invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getAmountDue = () => {
    if (!invoice) return 0;
    return invoice.total - getTotalPaid();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', border: '4px solid #667eea', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p style={{ color: '#6b7280', fontWeight: '500' }}>Loading invoice...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <ErrorMessage message={error} onRetry={fetchInvoice} />
          </div>
        </div>
      </>
    );
  }

  if (!invoice) return null;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => navigate('/invoices')}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'white',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1rem',
                fontSize: '0.95rem'
              }}
            >
              ← Back to Invoices
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between',     alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {invoice.invoiceNumber}
                </h1>
                <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
                  Invoice for {invoice.client.name}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => generateInvoicePDF(invoice)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(245, 87, 108, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  📄 Download PDF
                </button>
                <StatusBadge status={invoice.status} large />
              </div>
            </div>            
          </div>

          {/* Invoice Details */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>CLIENT</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>{invoice.client.name}</p>
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{invoice.client.email}</p>
                {invoice.client.phone && <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{invoice.client.phone}</p>}
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>DUE DATE</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937' }}>
                  {new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>CREATED</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937' }}>
                  {new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', borderTop: '2px solid #f3f4f6', paddingTop: '1.5rem' }}>
              Items
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>DESCRIPTION</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>QTY</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>RATE</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem 0', color: '#374151' }}>{item.description}</td>
                    <td style={{ padding: '1rem 0', textAlign: 'center', color: '#374151' }}>{item.quantity}</td>
                    <td style={{ padding: '1rem 0', textAlign: 'right', color: '#374151' }}>{invoice.currency} {item.rate.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>{invoice.currency} {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.125rem', color: '#6b7280' }}>Subtotal</span>
                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>{invoice.currency} {invoice.total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.125rem', color: '#6b7280' }}>Paid</span>
                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#10b981' }}>-{invoice.currency} {getTotalPaid().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '2px solid #e5e7eb' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Amount Due</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>{invoice.currency} {getAmountDue().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                Payment History
              </h2>
              {invoice.status !== 'paid' && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  + Add Payment
                </button>
              )}
            </div>

            {invoice.payments && invoice.payments.length > 0 ? (
              <div>
                {invoice.payments.map((payment) => (
                  <div key={payment.id} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {payment.currency} {payment.amount.toFixed(2)}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(payment.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ padding: '0.375rem 0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600' }}>
                      Paid
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                <p style={{ color: '#6b7280', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                  No payments recorded yet
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
                  Record payments as they come in to track your cash flow
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '400px',
              animation: 'slideIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
              Record Payment
            </h2>
            <form onSubmit={handleAddPayment}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Amount *
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                  max={getAmountDue()}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Amount due: {invoice.currency} {getAmountDue().toFixed(2)}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Currency
                </label>
                <select
                  value={paymentCurrency}
                  onChange={(e) => setPaymentCurrency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}

function StatusBadge({ status, large }) {
  const styles = {
    paid: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' },
    pending: { background: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24' },
    overdue: { background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171' },
  };

  return (
    <span style={{
      padding: large ? '0.75rem 1.5rem' : '0.375rem 0.75rem',
      borderRadius: '9999px',
      fontSize: large ? '1rem' : '0.875rem',
      fontWeight: '600',
      ...styles[status]
    }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}