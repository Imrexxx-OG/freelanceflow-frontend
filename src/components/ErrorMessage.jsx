export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      background: '#fee2e2',
      border: '2px solid #f87171',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#991b1b', fontWeight: '600', marginBottom: '0.25rem' }}>
          Something went wrong
        </p>
        <p style={{ color: '#b91c1c', fontSize: '0.95rem' }}>
          {message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.625rem 1.25rem',
            background: '#991b1b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}