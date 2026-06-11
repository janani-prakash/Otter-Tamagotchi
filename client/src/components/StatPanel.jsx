import StatBar from './StatBar';
import ActionButtons from './ActionButtons';

export default function StatPanel({ hunger, happiness, energy, isSleeping, isDead, petName, onNameChange, onFeed, onPlay, onSleep, onRestart }) {
  return (
    <div className="stat-panel">
      <div className="stat-content">
        <div className="bars-group">
          <input
            className="pet-name-input"
            value={petName}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Name..."
            maxLength={10}
          />
          <StatBar label="Hunger" value={hunger}    color="#e07b54" />
          <StatBar label="Happy"  value={happiness} color="#f2c14e" />
          <StatBar label="Energy" value={energy}    color="#6aabcc" />
        </div>
        <ActionButtons
          onFeed={onFeed}
          onPlay={onPlay}
          onSleep={onSleep}
          onRestart={onRestart}
          isSleeping={isSleeping}
          isDead={isDead}
        />
      </div>
    </div>
  );
}
