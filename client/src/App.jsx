import { useState, useEffect, useRef } from 'react';
import Screen from './components/Screen';
import StatPanel from './components/StatPanel';

const SAVE_KEY = 'tamagotchi';

function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) ?? {}; }
  catch { return {}; }
}

function App() {
  const [save]       = useState(loadSave);
  const [hunger,     setHunger]     = useState(save.hunger     ?? 100);
  const [happiness,  setHappiness]  = useState(save.happiness  ?? 100);
  const [energy,     setEnergy]     = useState(save.energy     ?? 100);
  const [isSleeping, setIsSleeping] = useState(save.isSleeping ?? false);
  const [isDead,     setIsDead]     = useState(save.isDead     ?? false);
  const [petName,    setPetName]    = useState(save.petName    ?? '');
  const [isOverrideHappy, setIsOverrideHappy] = useState(false);

  const hungerRef       = useRef(save.hunger     ?? 100);
  const happinessRef    = useRef(save.happiness  ?? 100);
  const energyRef       = useRef(save.energy     ?? 100);
  const isSleepingRef   = useRef(save.isSleeping ?? false);
  const isDeadRef       = useRef(save.isDead     ?? false);
  const neglectTicksRef = useRef(0);
  const overrideTimerRef = useRef(null);

  useEffect(() => { hungerRef.current     = hunger;     }, [hunger]);
  useEffect(() => { happinessRef.current  = happiness;  }, [happiness]);
  useEffect(() => { energyRef.current     = energy;     }, [energy]);
  useEffect(() => { isSleepingRef.current = isSleeping; }, [isSleeping]);
  useEffect(() => { isDeadRef.current     = isDead;     }, [isDead]);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(
      { hunger, happiness, energy, isSleeping, isDead, petName }
    ));
  }, [hunger, happiness, energy, isSleeping, isDead, petName]);

  useEffect(() => () => clearTimeout(overrideTimerRef.current), []);

  useEffect(() => {
    const id = setInterval(() => {
      if (isDeadRef.current) return;

      const sleeping  = isSleepingRef.current;
      const newHunger = Math.max(0, hungerRef.current - 1);
      const newHappy  = Math.max(0, happinessRef.current - 1);
      const newEnergy = sleeping
        ? Math.min(100, energyRef.current + 3)
        : Math.max(0, energyRef.current - 1);

      hungerRef.current    = newHunger;
      happinessRef.current = newHappy;
      energyRef.current    = newEnergy;

      setHunger(newHunger);
      setHappiness(newHappy);
      setEnergy(newEnergy);

      // Auto-wake when fully rested
      if (sleeping && newEnergy >= 100) {
        isSleepingRef.current = false;
        setIsSleeping(false);
      }

      if (newHunger === 0 || newHappy === 0) {
        neglectTicksRef.current += 1;
        if (neglectTicksRef.current >= 3) {
          isDeadRef.current = true;
          setIsDead(true);
        }
      } else {
        neglectTicksRef.current = 0;
      }
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function flashHappy() {
    clearTimeout(overrideTimerRef.current);
    setIsOverrideHappy(true);
    overrideTimerRef.current = setTimeout(() => setIsOverrideHappy(false), 1500);
  }

  function handleFeed() {
    if (isSleepingRef.current) return;
    const next = Math.min(100, hungerRef.current + 30);
    hungerRef.current = next;
    neglectTicksRef.current = 0;
    setHunger(next);
    flashHappy();
  }

  function handlePlay() {
    if (isSleepingRef.current) return;
    const next = Math.min(100, happinessRef.current + 30);
    happinessRef.current = next;
    neglectTicksRef.current = 0;
    setHappiness(next);
    flashHappy();
  }

  function handleSleep() { setIsSleeping(s => !s); }

  function handleRestart() {
    hungerRef.current     = 100;
    happinessRef.current  = 100;
    energyRef.current     = 100;
    isSleepingRef.current = false;
    isDeadRef.current     = false;
    neglectTicksRef.current = 0;
    clearTimeout(overrideTimerRef.current);
    setHunger(100);
    setHappiness(100);
    setEnergy(100);
    setIsSleeping(false);
    setIsDead(false);
    setIsOverrideHappy(false);
    localStorage.removeItem(SAVE_KEY);
  }

  const petState =
    isDead          ? 'dead'   :
    isSleeping      ? 'asleep' :
    isOverrideHappy ? 'happy'  :
    hunger < 50     ? 'mad'    :
    happiness < 50  ? 'sad'    :
    energy < 50     ? 'sleepy' :
                      'happy';

  return (
    <div className="app">
      <Screen petState={petState} isSleeping={isSleeping} />
      <StatPanel
        hunger={hunger}
        happiness={happiness}
        energy={energy}
        isSleeping={isSleeping}
        isDead={isDead}
        petName={petName}
        onNameChange={setPetName}
        onFeed={handleFeed}
        onPlay={handlePlay}
        onSleep={handleSleep}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default App;
