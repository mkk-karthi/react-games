# Woodland Chess 🪵♟️

Woodland Chess is a beautiful, modern, high-fidelity 3D chess game built using **React**, **TypeScript**, **Tailwind CSS**, and **chess.js**. It features a custom woodland aesthetic with rich textures, smooth gradients, premium typography, micro-interactions, realistic piece slide & capture animations, sound effects, and robust chess logic.

---

## ✨ Features

- **🌲 Custom Woodland Theme**: Rich design tokens matching a curated wood-and-forest color palette.
- **🛡️ Rigid Chess Rules**: Complete chess rule enforcement (including check, checkmate, stalemate, castling, en passant, and draw detection) powered by `chess.js`.
- **🦾 VS Computer (AI Mode)**: Play against a local chess engine with responsive moves.
- **👥 Local Multiplayer**: Pass-and-play local multiplayer mode.
- **✨ Tactile 3D Micro-animations**:
  - **3D Piece Lift & Arc**: Pieces physically lift and scale up during move transits with deep drop shadows.
  - **Piece Floating & Settle**: Selected pieces float gently above the board and land with an elastic bounce.
  - **Wood Splinter Capture Burst**: Capturing a piece displays a shower of wooden splinters flying in random directions.
  - **Coin Beating Fly-off**: Captured pieces pop up and spin off-screen dynamically.
  - **Board Grid Shake**: The board grid vibrates briefly upon captures, simulating a heavy wood landing.
  - **King Check Glow**: The King's square pulses with a warm red-orange amber warning glow when in check.
  - **Victory Confetti**: Colorful paper showers down from the viewport when checkmate is achieved.
- **🔊 Premium Web Audio Synthesizer**: Custom synthesized organic tones bypassing network assets for start, move, capture taps, check alerts, castling shifts, promotion sparkles, error buzzes, selections, undos, and victory/draw chords.
- **📊 Local Scores & Persistence**: Auto-saving win/loss/draw records to `localStorage`.
- **♿ Accessibility (Aria-ready)**: Screen-reader-friendly landmark tags, ARIA roles, labels, and status announcements.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 19, TypeScript 5.7, Tailwind CSS 3.4
- **State Management**: Pure React state, refs, and custom modular hooks.
- **Build Tool**: Vite 7
- **CSS System**: Vanilla CSS Variables (collapsing 141 colors down to 34 scalable design tokens in `src/styles.css`) + Tailwind utility classes.
- **Testing**: Vitest + React Testing Library (128 unit/integration tests with 100% pass rate).

---

## 📁 Repository Structure

```
src/
  ├── main.tsx             # Application entry point
  ├── App.tsx              # Application shell (wires layout, hooks & components)
  ├── App.css              # Custom layout, gradients, and animation structures
  ├── styles.css           # Token base variables (Wood and Forest palettes)
  ├── types/
  │   └── chess.ts         # Shared typescript type interfaces
  ├── utils/
  │   ├── chess.ts         # Board/Piece names, board indexes, and rank/file helpers
  │   └── board.ts         # Square and translation calculation styles
  ├── hooks/
  │   ├── useAudio.ts      # Web Audio synthesiser and sound effect controls
  │   ├── useScores.ts     # Game score tracking and localStorage persistence
  │   └── useChessGame.ts  # Central chess game loop & computer-move timers
  └── components/
      ├── Board/
      │   ├── SvgDefs.tsx  # Deduplicated SVG color stops for 3D wood texture
      │   └── Board.tsx    # 8x8 grid rendering, piece placement, and coordinate rules
      ├── panels/
      │   ├── ControlPanel.tsx # Undo, reset, mode toggles, sound, and move logs
      │   └── InfoPanel.tsx    # Score boards and captured pieces tray
      └── overlays/
          ├── StartOverlay.tsx    # Dialog modal for choosing game mode
          └── GameOverOverlay.tsx # Dialog modal showing match results
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository and navigate into the folder:
   ```bash
   git clone <repository-url>
   cd chess
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the Vite development server on `http://localhost:3000`:
```bash
npm run dev
```

### Running Tests

Run the complete test suite containing 128 tests:
```bash
npm run test
```

To run tests in interactive watch mode:
```bash
npm run test:watch
```

To generate a test coverage report:
```bash
npm run test:coverage
```

### Production Build

To build and compile a minified production bundle (using Vite + TypeScript compile checks):
```bash
npm run build
```

To preview the built app locally:
```bash
npm run preview
```

---

## 🎨 Palette Design Tokens

The styling relies on a unified 34-variable system under `src/styles.css`:

```css
/* Custom Wood Steps */
--color-wood-50:  #fff7d8;  /* Pale cream (White pieces) */
--color-wood-100: #ffe09d;  /* Warm honey */
--color-wood-200: #f0c47b;  /* Golden tan */
--color-wood-300: #d9ad62;  /* Amber */
--color-wood-350: #c18840;  /* Mid-amber grain */
--color-wood-400: #b97838;  /* Wood amber */
--color-wood-450: #8a4a20;  /* Mid-dark wood */
--color-wood-500: #7a3f1a;  /* Dark wood */
--color-wood-600: #4c210d;  /* Very dark wood */
--color-wood-700: #3f1e0b;  /* Near black-brown */
--color-wood-800: #2f180c;  /* Deep brown */
--color-wood-900: #140905;  /* Near black */

/* Custom Forest Steps */
--color-forest-400: #3f7c48; /* Accent light */
--color-forest-500: #24542d; /* Accent dark */
--color-forest-600: #1f4b29; /* Accent deep */
```

---

## 📄 License

This project is licensed under the MIT License.
