import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '8rem',
          fontWeight: 'bold',
          color: '#4f46e5'
        }}>404</h1>
        <h2 style={{
          marginTop: '1rem',
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#1a1a1a'
        }}>Page Not Found</h2>
        <p style={{
          marginTop: '0.5rem',
          color: '#4b5563'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

export default NotFound; 