# Tamagotchi Desktop Widget

A always-on-top Tamagotchi desktop pet built with Electron + React. Sits in the corner of your screen while you work and needs your attention to stay alive.

---

## Running in development

```bash
cd client
npm install
npm run start
```

This starts the Vite dev server and opens the Electron window. The widget is always-on-top so it stays visible while you use other apps.

## Building a standalone .exe

```bash
cd client
npm install
npm run build:app
```

Output: `client/release/Tamagotchi*.exe` — double-click to launch, no terminal or Node installation required.

---

## Gameplay

Your pet has three stats that drain over time. Neglect them and it dies.

| Stat | Drains when | Restored by |
|------|-------------|-------------|
| Hunger | Always | 🍗 Feed (+30) |
| Happiness | Always | 🎾 Play (+30) |
| Energy | Awake | 💤 Sleep |

**Stat thresholds**
- Hunger below 50 → pet shows `mad` sprite
- Happiness below 50 → pet shows `sad` sprite
- Energy below 50 → pet shows `sleepy` sprite

**Sleep**
- Put your pet to sleep with 💤 — energy recharges at 3×/tick while sleeping
- Pet wakes automatically when energy reaches 100
- Feed and Play are disabled while sleeping

**Death**
- If hunger or happiness stays at 0 for 3 consecutive ticks (~15 seconds), the pet dies
- Feed or play before all three ticks elapse to avoid death
- Press 🔄 to restart with full stats

**Progress is saved** — stats, sleep state, and pet name persist across app restarts via `localStorage`.

---

## Sprite states

| Sprite | Condition |
|--------|-----------|
| `happy.png` | Default — all stats healthy |
| `sad.png` | Happiness < 50 |
| `mad.png` | Hunger < 50 |
| `sleepy.png` | Energy < 50 (tired but awake) |
| `asleep.png` | Sleeping |
| 💀 | Dead |

Background switches between `day.png` (awake) and `night.png` (sleeping).

---

## Project structure

```
client/
├── electron/
│   └── main.js          # Electron main process — window config, dev/prod loading
├── public/
│   └── sprites/         # All PNG assets (pet states + backgrounds)
├── src/
│   ├── App.jsx           # All game state, loop, and action handlers
│   ├── components/
│   │   ├── Screen.jsx        # Pet display area with day/night background
│   │   ├── PetSprite.jsx     # Loads sprite PNG, handles dead/error states
│   │   ├── StatPanel.jsx     # Right panel — name, bars, buttons
│   │   ├── StatBar.jsx       # Individual stat bar (label + pill fill)
│   │   └── ActionButtons.jsx # Feed / Play / Sleep / Restart buttons
│   └── index.css         # All layout and component styles
├── vite.config.js
└── package.json
```

## Adding sprites

Drop a new `.png` into `public/sprites/` and add the state name to `VALID_STATES` in `src/components/PetSprite.jsx`. Wire it up in the `petState` derivation in `src/App.jsx`.
