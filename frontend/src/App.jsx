import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('botPanelToken');
    const username = localStorage.getItem('botPanelUser');
    if (token && username) {
      setUser({ username });
    }
  }, []);

  const handleLogin = ({ token, user }) => {
    localStorage.setItem('botPanelToken', token);
    localStorage.setItem('botPanelUser', user.username);
    setUser(user);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('botPanelToken');
    localStorage.removeItem('botPanelUser');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="/*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
