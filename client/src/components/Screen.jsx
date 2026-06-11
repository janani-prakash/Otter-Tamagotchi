import PetSprite from './PetSprite';

export default function Screen({ petState = 'happy', isSleeping = false }) {
  const bg = `${import.meta.env.BASE_URL}sprites/${isSleeping ? 'night' : 'day'}.png`;

  return (
    <div className="screen" style={{ backgroundImage: `url(${bg})` }}>
      <PetSprite state={petState} />
    </div>
  );
}
