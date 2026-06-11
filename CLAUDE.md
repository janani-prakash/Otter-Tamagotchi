# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron desktop widget (372×237px, non-resizable, always-on-top) that renders a fully functional Tamagotchi pet app via React + Vite. All source lives under `client/`.

## Commands

All commands run from `client/`:

```bash
# Install dependencies
npm install

# Start full app (Vite dev server + Electron window)
npm run start

# Start only the Vite dev server (browser at http://localhost:3000)
npm run dev

# Start only the Electron window (requires dev server already running)
npm run electron

# Production build
npm run build
```

No test runner is configured.

## Architecture

The app is split into two processes:

- **Main process** (`electron/main.js`): Creates a 372×237 `BrowserWindow` (`useContentSize: true`, always-on-top, no menu bar). Loads `http://localhost:3000`.
- **Renderer process** (`src/`): A React 18 SPA served by Vite on port 3000 (strict). Entry is `src/main.jsx` → `src/App.jsx`.

`npm run start` uses `concurrently` + `wait-on` to launch both together.

## Layout

```
┌──────────────────────────────────────────────┐
│  [Screen 237×237px]      │  [StatPanel]      │
│  background: day/night   │  .stat-content    │
│  pet sprite centered     │  ├─ name input    │
│                          │  ├─ hunger bar    │
│                          │  ├─ happy bar     │
│                          │  ├─ energy bar    │
│                          │  └─ action btns   │
└──────────────────────────────────────────────┘
          237px                  ~135px
                   372px total
```

- `.app`: flex row, `padding: 0 50px 0 0`, background `#c8d8bc`
- `.screen`: 237×237, background image (`day.png` / `night.png`) switches on sleep
- `.stat-panel`: fixed 237px height, `padding: 0 0 0 8px`, `border-left`
- **`.stat-content`**: wraps the name input, bars, and buttons — adjust its `padding` to control spacing inside the panel
- `src/index.css` fixes body to 372×237 with `overflow: hidden`

## Game Logic (`src/App.jsx`)

All state lives in `App.jsx`. The interval reads from refs (not state) to avoid stale closures — every stat has a parallel `useRef` kept in sync via `useEffect`.

**State:**
```js
hunger, happiness, energy   // 0–100
isSleeping                  // bool
isDead                      // bool
petName                     // string, persisted
isOverrideHappy             // bool, temporary flash
```

**Game loop:** `setInterval` every 5 seconds:
- Hunger: −1/tick
- Happiness: −1/tick
- Energy: −1/tick awake, +3/tick sleeping
- Auto-wakes when energy reaches 100
- Death: 3 consecutive ticks with hunger === 0 OR happiness === 0

**Derived `petState`** (priority order, not stored):
```
dead > sleepy > overrideHappy > mad (hunger<50) > sad (happiness<50) > happy
```

**Actions:**
- Feed (+30 hunger, flash happy, resets neglect counter) — disabled while sleeping
- Play (+30 happiness, flash happy, resets neglect counter) — disabled while sleeping
- Sleep (toggle `isSleeping`)
- Restart (resets all stats to 100, clears `localStorage`)

**Persistence:** All stats + `isDead` + `petName` written to `localStorage` key `"tamagotchi"` on every state change. Loaded via lazy `useState` initializer on mount.

## Sprites & Assets (`public/sprites/`)

| File | Used for |
|------|----------|
| `happy.png` | Default / idle |
| `sad.png` | Happiness < 50 |
| `mad.png` | Hunger < 50 |
| `sleepy.png` | Pet is sleeping |
| `day.png` | Screen background when awake |
| `night.png` | Screen background when sleeping |

`PetSprite.jsx` handles `'dead'` state as a 💀 emoji (no image file needed). Falls back to 🥚 emoji on any image load error.

## Component Tree

```
App.jsx                  — state, game loop, all handlers
├─ Screen.jsx            — applies day/night bg class, renders PetSprite
│  └─ PetSprite.jsx      — loads /sprites/{state}.png, dead/error fallbacks
└─ StatPanel.jsx         — pure presentational, forwards props
   ├─ (pet-name-input)
   ├─ StatBar.jsx × 3    — label + pill bar, color via inline style
   └─ ActionButtons.jsx  — Feed/Play/Sleep buttons; shows Restart when dead
```
