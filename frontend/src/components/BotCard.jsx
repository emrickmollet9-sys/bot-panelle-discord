const BotCard = ({ bot, onStart, onStop, onPresence, onEdit, onManageCommands, onDelete }) => {
  return (
    <div className="bot-card">
      <div className="bot-card-header">
        <div>
          <h2>{bot.name}</h2>
          <span className={`status ${bot.isRunning ? 'online' : 'offline'}`}>{bot.isRunning ? 'En ligne' : 'Arrêté'}</span>
        </div>
        <strong>{bot.prefix}</strong>
      </div>

      <div className="bot-card-body">
        <p><strong>Statut :</strong> {bot.status}</p>
        <p><strong>Activité :</strong> {bot.activityType} {bot.activity}</p>
      </div>

      <div className="bot-card-actions">
        <button onClick={onStart}>Démarrer</button>
        <button onClick={onStop} className="secondary">Arrêter</button>
        <button onClick={onPresence} className="secondary">Présence</button>
        <button onClick={onManageCommands} className="secondary">Commandes</button>
        <button onClick={onEdit} className="secondary">Modifier</button>
        <button onClick={onDelete} className="danger">Supprimer</button>
      </div>
    </div>
  );
};

export default BotCard;
