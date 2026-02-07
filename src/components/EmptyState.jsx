export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '16px', 
      padding: '4rem 2rem', 
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
        {icon}
      </div>
      <h3 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        color: '#1f2937', 
        marginBottom: '0.75rem' 
      }}>
        {title}
      </h3>
      <p style={{ 
        color: '#6b7280', 
        fontSize: '1.05rem', 
        marginBottom: '2rem',
        maxWidth: '500px',
        margin: '0 auto 2rem'
      }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
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
          {actionLabel}
        </button>
      )}
    </div>
  );
}