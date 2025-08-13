import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import Meta from '../components/Meta';

// Page d'inscription utilisant le hook useUser via la prop onRegister
const Register = ({ onRegister }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setError('');
    try {
      await onRegister(data);
      navigate('/');
    } catch (err) {
      let msg = 'Erreur lors de l’inscription';
      if (err.response && err.response.data && err.response.data.error) {
        msg = err.response.data.error;
      }
      setError(msg);
    }
  };

  return (
    <main>
      <Meta title="GreenCart – Inscription" />
      <h2 style={{ textAlign: 'center', marginTop: '2em' }}>Créer un compte</h2>
      <div style={{ maxWidth: 400, margin: '2em auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '2em' }}>
        <RegisterForm onSubmit={handleSubmit} error={error} />
      </div>
    </main>
  );
};

export default Register;
