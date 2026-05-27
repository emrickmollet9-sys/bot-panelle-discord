import { useEffect, useState } from 'react';
import { API_URL, getAuthHeaders } from '../api.js';
import BotCard from '../components/BotCard.jsx';
import CommandModal from '../components/CommandModal.jsx';

const Dashboard = ({ user, onLogout }) => {
  const [bots, setBots] = useState([]);
  const [error, setError] = useState('');
  const [editingBot, setEditingBot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeCommandBot, setActiveCommandBot] = useState(null);

  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };

  const fetchBots = async () => {
    try {
      const res = await fetch(`${API_URL}/bots`, { headers });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Impossible de charger les bots.');
        return;
      }
      setBots(data);
    } catch (err) {
      setError('Erreur de connexion au backend.');
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const refresh = () => fetchBots();

  const handleBotAction = async (path, body = {}) => {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Action impossible.');
      }
      refresh();
    } catch (err) {
      setError('Erreur serveur.');
    }
  };

  const handleCreateBot = async () => {
    const name = prompt('Nom du bot ?');
    const token = prompt('Token du bot Discord ?');
    if (!name || !token) return;

    const res = await fetch(`${API_URL}/bots`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, token })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Impossible de créer le bot.');
      return;
    }
    refresh();
  };

  return (
    <div className="page dashboard-page">
      <header className="toolbar">
        <div>
          <h1>Dashboard Discord</h1>
          <span>Bonjour, {user.username}</span>
        </div>
        <div className="toolbar-actions">
          <button onClick={handleCreateBot}>Ajouter un bot</button>
          <button className="secondary" onClick={onLogout}>Se déconnecter</button>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="grid">
        {bots.map((bot) => (
          <BotCard
            key={bot._id}
            bot={bot}
            onRefresh={refresh}
            onStart={() => handleBotAction(`/bots/${bot._id}/start`)}
            onStop={() => handleBotAction(`/bots/${bot._id}/stop`)}
            onPresence={() => {
              const status = prompt('Statut (online, idle, dnd, invisible) :', bot.status) || bot.status;
              const activity = prompt('Activité :', bot.activity) || bot.activity;
              const activityType = prompt('Type d’activité (PLAYING, WATCHING, LISTENING, STREAMING, COMPETING) :', bot.activityType) || bot.activityType;
              if (status && activity && activityType) {
                handleBotAction(`/bots/${bot._id}/presence`, { status, activity, activityType });
              }
            }}
            onEdit={() => {
              setEditingBot(bot);
              setShowModal(true);
            }}
            onManageCommands={() => setActiveCommandBot(bot)}
            onDelete={async () => {
              if (!confirm('Supprimer ce bot définitivement ?')) return;
              await fetch(`${API_URL}/bots/${bot._id}`, {
                method: 'DELETE',
                headers
              });
              refresh();
            }}
          />
        ))}
      </div>

      {showModal && (
        <CommandModal
          bot={editingBot}
          headers={headers}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            refresh();
          }}
        />
      )}

      {activeCommandBot && (
        <CommandModal
          bot={activeCommandBot}
          headers={headers}
          onClose={() => setActiveCommandBot(null)}
          onSaved={() => {
            setActiveCommandBot(null);
            refresh();
          }}
          commandMode
        />
      )}
    </div>
  );
};

export default Dashboard;
