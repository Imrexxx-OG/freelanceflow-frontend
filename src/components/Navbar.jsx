import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ 
      background: 'white', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
          
          {/* Logo & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <h1 style={{ 
                fontSize: '1.75rem', 
                fontWeight: 'bold', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                FreelanceFlow
              </h1>
            </Link>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                Dashboard
              </NavLink>
              <NavLink to="/clients" isActive={isActive('/clients')}>
                Clients
              </NavLink>
              <NavLink to="/invoices" isActive={isActive('/invoices')}>
                Invoices
              </NavLink>
            </div>
          </div>

          {/* User Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '9999px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#374151', fontWeight: '500', fontSize: '0.95rem' }}>
                {user?.name}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white', 
                padding: '0.625rem 1.5rem', 
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
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
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, isActive, children }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        color: isActive ? '#667eea' : '#6b7280',
        padding: '0.625rem 1rem',
        borderRadius: '8px',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s ease',
        background: isActive ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 'transparent',
        fontSize: '0.95rem'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.color = '#667eea';
          e.target.style.background = 'rgba(102, 126, 234, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.color = '#6b7280';
          e.target.style.background = 'transparent';
        }
      }}
    >
      {children}
    </Link>
  );
}