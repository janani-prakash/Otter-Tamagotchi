export default function StatBar({ label, value, color }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="stat-group">
      <span className="stat-label">{label}</span>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
