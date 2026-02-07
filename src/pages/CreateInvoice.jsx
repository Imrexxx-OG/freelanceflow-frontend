import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import ErrorMessage from '../components/ErrorMessage';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    clientId: '',
    currency: 'USD',
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0 }]
  });

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch clients with error handling
  const fetchClients = async () => {
    try {
      setError(null);
      const { data } = await api.get('/clients');
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.response?.data?.message || 'Failed to load clients');
    }
  };

  // Add/remove/update line items
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'description' ? value : Number(value);
    setFormData({ ...formData, items: newItems });
  };

  // Calculate total amount
  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  // Submit invoice with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/invoices', formData);
      navigate('/invoices');
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Create Invoice
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
              Fill in the details below to create a new invoice
            </p>
          </div>

          {/* Display error messages */}
          {error && <ErrorMessage message={error} onRetry={handleSubmit} />}

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                Basic Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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

                <div>
                  <label style={{ display: 'block', color: '#374151', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Line Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  + Add Item
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        required
                        placeholder="e.g., Website Design"
                        style={{ width: '100%', padding: '0.625rem', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        required
                        min="1"
                        style={{ width: '100%', padding: '0.625rem', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Rate</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        style={{ width: '100%', padding: '0.625rem', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        style={{ padding: '0.625rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{ marginTop: '0.75rem', textAlign: 'right', color: '#6b7280', fontSize: '0.95rem' }}>
                    Amount: <span style={{ fontWeight: '700', color: '#1f2937' }}>{formData.currency} {(item.quantity * item.rate).toFixed(2)}</span>
                  </div>
                </div>
              ))}

              <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1rem', textAlign: 'right' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  Total: {formData.currency} {calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate('/invoices')}
                style={{ padding: '0.875rem 1.75rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.875rem 1.75rem',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
