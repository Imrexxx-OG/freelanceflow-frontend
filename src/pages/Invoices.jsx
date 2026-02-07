import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, paid, pending, overdue
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setError(null);
      const { data } = await api.get('/invoices');
      setInvoices(data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ height: '40px', background: '#e5e7eb', borderRadius: '8px', width: '200px', marginBottom: '0.5rem', animation: 'pulse 2s infinite' }}></div>
            <div style={{ height: '24px', background: '#e5e7eb', borderRadius: '4px', width: '300px', animation: 'pulse 2s infinite' }}></div>
          </div>
          
          <TableSkeleton rows={8} />
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                Invoices
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
                Manage and track your invoices
              </p>
            </div>
            <button
              onClick={() => navigate('/invoices/create')}
              style={{
                padding: '0.875rem 1.75rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              + Create Invoice
            </button>
          </div>

          {error && <ErrorMessage message={error} onRetry={fetchInvoices} />}

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <FilterTab label="All" count={invoices.length} active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterTab label="Paid" count={invoices.filter(i => i.status === 'paid').length} active={filter === 'paid'} onClick={() => setFilter('paid')} color="#10b981" />
            <FilterTab label="Pending" count={invoices.filter(i => i.status === 'pending').length} active={filter === 'pending'} onClick={() => setFilter('pending')} color="#f59e0b" />
            <FilterTab label="Overdue" count={invoices.filter(i => i.status === 'overdue').length} active={filter === 'overdue'} onClick={() => setFilter('overdue')} color="#ef4444" />
          </div>

          {/* Invoices List */}
          {filteredInvoices.length > 0 ? (
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                      <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>INVOICE #</th>
                      <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>CLIENT</th>
                      <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>AMOUNT</th>
                      <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>STATUS</th>
                      <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>DUE DATE</th>
                      <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#1f2937' }}>
                          {invoice.invoiceNumber}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#374151' }}>
                          {invoice.client.name}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#1f2937' }}>
                          {invoice.currency} {invoice.total.toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/invoices/${invoice.id}`);
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              fontSize: '0.875rem',
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              icon="📄"
              title={`No ${filter !== 'all' ? filter : ''} invoices found`.trim()}
              description={
                filter === 'all' 
                  ? 'Create your first invoice to start tracking payments and getting paid faster.' 
                  : `You don't have any ${filter} invoices at the moment.`
              }
              actionLabel={filter === 'all' ? 'Create Your First Invoice' : undefined}
              onAction={filter === 'all' ? () => navigate('/invoices/create') : undefined}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

function FilterTab({ label, count, active, onClick, color = '#667eea' }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.75rem 1.5rem',
        background: active ? color : 'white',
        color: active ? 'white' : '#6b7280',
        border: active ? 'none' : '2px solid #e5e7eb',
        borderRadius: '10px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onMouseEnter={(e) => {
        if (!active) e.target.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        if (!active) e.target.style.borderColor = '#e5e7eb';
      }}
    >
      {label}
      <span style={{
        background: active ? 'rgba(255,255,255,0.3)' : '#f3f4f6',
        color: active ? 'white' : '#374151',
        padding: '0.125rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: '700'
      }}>
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' },
    pending: { background: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24' },
    overdue: { background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171' },
  };

  return (
    <span style={{
      padding: '0.375rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
      ...styles[status]
    }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}