export function CardSkeleton() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      animation: 'pulse 2s infinite'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#e5e7eb',
        marginBottom: '1rem'
      }}></div>
      <div style={{
        height: '20px',
        background: '#e5e7eb',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        width: '70%'
      }}></div>
      <div style={{
        height: '16px',
        background: '#e5e7eb',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        width: '90%'
      }}></div>
      <div style={{
        height: '16px',
        background: '#e5e7eb',
        borderRadius: '4px',
        width: '60%'
      }}></div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem 0',
          borderBottom: i < rows - 1 ? '1px solid #f3f4f6' : 'none',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ flex: 1, height: '20px', background: '#e5e7eb', borderRadius: '4px' }}></div>
          <div style={{ flex: 1, height: '20px', background: '#e5e7eb', borderRadius: '4px' }}></div>
          <div style={{ flex: 1, height: '20px', background: '#e5e7eb', borderRadius: '4px' }}></div>
          <div style={{ flex: 1, height: '20px', background: '#e5e7eb', borderRadius: '4px' }}></div>
        </div>
      ))}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      animation: 'pulse 2s infinite'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        background: '#e5e7eb',
        marginBottom: '1rem'
      }}></div>
      <div style={{
        height: '16px',
        background: '#e5e7eb',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        width: '60%'
      }}></div>
      <div style={{
        height: '32px',
        background: '#e5e7eb',
        borderRadius: '4px',
        width: '80%'
      }}></div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}