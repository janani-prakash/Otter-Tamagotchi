import { useState } from 'react';

const VALID_STATES = ['happy', 'sad', 'mad', 'sleepy', 'asleep'];

export default function PetSprite({ state = 'happy' }) {
  const [imgError, setImgError] = useState(false);

  if (state === 'dead') {
    return <div className="pet-placeholder">💀</div>;
  }

  const safeState = VALID_STATES.includes(state) ? state : 'happy';

  if (imgError) {
    return <div className="pet-placeholder">🥚</div>;
  }

  return (
    <img
      className="pet-sprite"
      src={`${import.meta.env.BASE_URL}sprites/${safeState}.png`}
      alt={safeState}
      onError={() => setImgError(true)}
    />
  );
}
