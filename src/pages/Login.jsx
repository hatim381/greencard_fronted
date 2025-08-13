import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Meta from '../components/Meta';

// Page de connexion utilisant la logique fournie par le hook useUser
const Login = ({ onLogin }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (credentials) => {
    setError('');
    try {
      await onLogin(credentials);
      navigate('/');
    } catch (err) {
      let msg = 'Identifiants incorrects.';
      if (err.response && err.response.data && (err.response.data.error || err.response.data.message)) {
        msg = err.response.data.error || err.response.data.message;
      }
      setError(msg);
    }
  };

  return (
    <main>
      <Meta title="GreenCart – Connexion" />
      <h2 style={{ textAlign: 'center', marginTop: '2em' }}>Connexion</h2>
      <div style={{
        maxWidth: 400,
        margin: '2em auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px #0001',
        padding: '2em'
      }}>
        <LoginForm onSubmit={handleSubmit} error={error} />
      </div>
    </main>
  );
};

export default Login;
