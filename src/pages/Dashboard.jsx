import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { StatCardSkeleton, TableSkeleton } from '../components/SkeletonLoader';

export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const { data } = await api.get('/analytics/dashboard');
      setAnalytics(data);
      setTimeout(() => setLoading(false), 500);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ height: '40px', background: '#e5e7eb', borderRadius: '8px', width: '300px', marginBottom: '0.5rem', animation: 'pulse 2s infinite' }}></div>
              <div style={{ height: '24px', background: '#e5e7eb', borderRadius: '4px', width: '400px', animation: 'pulse 2s infinite' }}></div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            
            <TableSkeleton rows={5} />
          </div>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </>
    );
  }

  const { summary, recentInvoices } = analytics || {};

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Welcome back! 👋
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Here's what's happening with your business today
            </p>
          </div>

          {error && <ErrorMessage message={error} onRetry={fetchAnalytics} />}

          {/* Onboarding Banner for New Users */}
          {summary && summary.totalClients === 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '2.5rem',
              marginBottom: '2rem',
              color: 'white',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                  🎉 Welcome to FreelanceFlow!
                </h2>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', opacity: 0.95, lineHeight: '1.6' }}>
                  Let's get you started! First, add a client to your dashboard. Once you have clients, you'll be able to create invoices and track payments.
                </p>
                <button
                  onClick={() => navigate('/clients')}
                  style={{
                    padding: '0.875rem 1.75rem',
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Add Your First Client →
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <StatCard
              title="Total Clients"
              value={summary?.totalClients || 0}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              trend="+12%"
            />
            <StatCard
              title="Total Earned"
              value={`$${summary?.totalEarned?.toFixed(2) || '0.00'}`}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              trend="+23%"
            />
            <StatCard
              title="Pending Amount"
              value={`$${summary?.totalPending?.toFixed(2) || '0.00'}`}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              trend="-8%"
            />
            <StatCard
              title="Total Invoices"
              value={summary?.totalInvoices || 0}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              trend="+5%"
            />
          </div>

          {/* Recent Invoices */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
                Recent Invoices
              </h2>
              <button 
                onClick={() => navigate('/invoices')}
                style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                View All
              </button>
            </div>

            {recentInvoices && recentInvoices.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#374151' }}>Invoice #</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#374151' }}>Client</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#374151' }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#374151' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600', color: '#374151' }}>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => navigate(`/invoices/${invoice.id}`)}>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{invoice.invoiceNumber}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{invoice.client.name}</td>
                        <td style={{ padding: '1rem', fontWeight: '600' }}>{invoice.currency} {invoice.total.toFixed(2)}</td>
                        <td style={{ padding: '1rem' }}>
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon="📄"
                title="No invoices yet"
                description="Create your first invoice to start tracking payments and managing your freelance business."
                actionLabel={summary?.totalClients > 0 ? "Create Your First Invoice" : undefined}
                onAction={summary?.totalClients > 0 ? () => navigate('/invoices/create') : undefined}
              />
            )}
          </div>
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

function StatCard({ title, value, gradient, trend }) {
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '16px', 
      padding: '1.5rem', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '12px', 
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {title[0]}
        </div>
        {trend && (
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600',
            color: trend.startsWith('+') ? '#10b981' : '#ef4444',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            background: trend.startsWith('+') ? '#d1fae5' : '#fee2e2'
          }}>
            {trend}
          </span>
        )}
      </div>
      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{value}</p>
    </div>
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