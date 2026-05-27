import { useState } from 'react';
import { API_URL } from '../api.js';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Échec de la connexion');
        return;
      }

      onLogin(data);
    } catch (err) {
      setError('Impossible de joindre le serveur');
    }
  };

  return (
    <div className="page login-page">
      <div className="card">
        <h1>Connexion admin</h1>
        <form onSubmit={submit}>
          <label>
            Nom d’utilisateur
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </label>
          <label>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          {error && <div className="alert">{error}</div>}
          <button type="submit">Se connecter</button>
        </form>
        <p className="hint">Utilisez un compte admin JWT pour accéder au panneau.</p>
      </div>
    </div>
  );
};

export default Login;
