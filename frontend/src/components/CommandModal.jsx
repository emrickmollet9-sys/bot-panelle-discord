import { useEffect, useState } from 'react';
import { API_URL } from '../api.js';

const CommandModal = ({ bot, headers, onClose, onSaved, commandMode }) => {
  const [trigger, setTrigger] = useState('');
  const [response, setResponse] = useState('');
  const [description, setDescription] = useState('');
  const [commands, setCommands] = useState([]);
  const [name, setName] = useState('');
  const [prefix, setPrefix] = useState('!');
  const [status, setStatus] = useState('online');
  const [activity, setActivity] = useState('En ligne');
  const [activityType, setActivityType] = useState('PLAYING');
  const [error, setError] = useState('');

  useEffect(() => {
    if (commandMode) {
      fetchCommands();
    }
    if (bot) {
      setName(bot.name || '');
      setPrefix(bot.prefix || '!');
      setStatus(bot.status || 'online');
      setActivity(bot.activity || 'En ligne');
      setActivityType(bot.activityType || 'PLAYING');
    }
  }, [bot]);

  const fetchCommands = async () => {
    try {
      const res = await fetch(`${API_URL}/bots/${bot._id}/commands`, { headers });
      const data = await res.json();
      if (res.ok) {
        setCommands(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addCommand = async () => {
    setError('');
    if (!trigger || !response) {
      setError('Le trigger et la réponse sont requis.');
      return;
    }
    const res = await fetch(`${API_URL}/bots/${bot._id}/commands`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ trigger, response, description })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Impossible d’ajouter la commande.');
      return;
    }
    setTrigger('');
    setResponse('');
    setDescription('');
    fetchCommands();
    onSaved?.();
  };

  const deleteCommand = async (commandId) => {
    await fetch(`${API_URL}/bots/${bot._id}/commands/${commandId}`, {
      method: 'DELETE',
      headers
    });
    fetchCommands();
  };

  const saveBot = async () => {
    setError('');
    if (!name) {
      setError('Le nom du bot est requis.');
      return;
    }
    const res = await fetch(`${API_URL}/bots/${bot._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ name, prefix, status, activity, activityType })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Impossible de sauvegarder le bot.');
      return;
    }
    onSaved?.();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{commandMode ? `Commandes de ${bot.name}` : `Modifier ${bot.name}`}</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>

        {commandMode ? (
          <>
            <div className="modal-content">
              <div className="form-group">
                <label>Trigger</label>
                <input value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="ping" />
              </div>
              <div className="form-group">
                <label>Réponse</label>
                <input value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Pong !" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description optionnelle" />
              </div>
              {error && <div className="alert">{error}</div>}
            </div>
            <div className="modal-actions">
              <button onClick={addCommand}>Ajouter la commande</button>
              <button className="secondary" onClick={onClose}>Fermer</button>
            </div>
            <div className="command-list">
              {commands.map((command) => (
                <div key={command._id} className="command-item">
                  <div>
                    <strong>{bot?.prefix || '!'}{command.trigger}</strong>
                    <p>{command.response}</p>
                  </div>
                  <button className="danger" onClick={() => deleteCommand(command._id)}>Supprimer</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="modal-content">
              <div className="form-group">
                <label>Nom</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Préfixe</label>
                <input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <input value={status} onChange={(e) => setStatus(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Activité</label>
                <input value={activity} onChange={(e) => setActivity(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Type d’activité</label>
                <input value={activityType} onChange={(e) => setActivityType(e.target.value)} />
              </div>
              {error && <div className="alert">{error}</div>}
            </div>
            <div className="modal-actions">
              <button onClick={saveBot}>Sauvegarder</button>
              <button className="secondary" onClick={onClose}>Fermer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommandModal;
