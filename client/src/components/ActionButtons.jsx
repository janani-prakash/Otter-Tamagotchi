export default function ActionButtons({ onFeed, onPlay, onSleep, onRestart, isSleeping, isDead }) {
  if (isDead) {
    return (
      <div className="action-buttons">
        <button className="action-btn restart-btn" onClick={onRestart}>🔄</button>
      </div>
    );
  }

  return (
    <div className="action-buttons">
      <button className="action-btn" onClick={onFeed} disabled={isSleeping}>🍗</button>
      <button className="action-btn" onClick={onPlay} disabled={isSleeping}>🎾</button>
      <button className="action-btn" onClick={onSleep}>{isSleeping ? '☀️' : '💤'}</button>
    </div>
  );
}
