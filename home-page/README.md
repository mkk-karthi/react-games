# 🎮 MKK Games Universe (React Games Collection)

A modern, immersive retro-futuristic arcade portal featuring a collection of fun browser games built with **React** and styled using **Tailwind CSS**.

🌐 **Live Demo:** [games.mkkcreation.com](https://games.mkkcreation.com/)

---

## 🌌 Theme: Neon Arcade Universe
The portal has been redesigned into a **Neon Arcade Universe**—a high-fidelity Synthwave, retro-arcade experience inspired by Tron Legacy and 80s arcade cabinets:
- **Atmospheric Visual Depth**: Deep midnight backgrounds with neon purple, pink, cyan, and indigo glow highlights.
- **Interactive Retro Horizon**: Ambient lighting and perspective scrolling wireframe grids.
- **Holographic CRT Scanlines**: Subtle CRT display effects on selected components to deliver a nostalgic screen feel.
- **Glassmorphism Cabinets**: Premium blurred frosted glass panels with glowing interactive states.
- **Responsive Layout**: Pixel-perfect look on mobile, tablet, and widescreen layouts.

---

## 🕹️ Available Games
The collection contains multiple browser-based games (with progress and scores stored locally using `localStorage` where applicable):

- ♔ **Chess** (NEW Launch!) – The ultimate command board. Devise checkmate tactics and capture opposing pieces.
- 🎯 **Bullseye Archery** (NEW!) – Pull, aim, adjust for wind, and launch your arrows directly into the bullseye.
- 🐍 **Snake** – Consume pixel bits, grow your digital tail, and survive high-speed crashes.
- 🧩 **Puzzle (Tetris)** – Align dropping bricks to clean layers in a speed-drop block stacker.
- 🧠 **Memory Match** – Flip and match cards to clear the board and test your speed.
- 🔢 **2048** – Combine matching number tiles to reach the legendary 2048 tile.
- 🧱 **Block Breaker** – Reflect the ball and break grid structures using drop power-ups.
- 🍬 **Candy Crush** – Match rows of colorful sweets to generate multipliers and clear levels.
- 🐦 **Flappy Bird** – Bounce through gap hazards in a reflex-demanding high-speed flap test.
- ❌ **Tic Tac Toe** – The classic grid battle of Xs and Os against a local player.

---

## ⚙️ Key Technical Features
- **Centralized Design System**: Zero hardcoded hex colors are used in component files. The color variables are globally configured inside `@theme` in `src/index.css` and mapped to default Tailwind CSS palette values (`var(--color-pink-500)`, `var(--color-cyan-400)`, etc.).
- **Recently Played History**: Intercepts play clicks to save browser-history game lists to `localStorage`, rendering a dynamic **RECENTLY PLAYED** shelf on the home screen.
- **Optimized for Production**: Responsive image loading, standard SVG icons from `lucide-react`, and high-efficiency CSS animations.

---

## 🛠️ Development & Commands
To run the project locally or build for production:

```bash
# Install dependencies
npm install

# Run the dev server locally
npm run dev

# Build the production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 👤 Credits
Designed & Developed by **Karthikeyan M** (https://mkkcreation.com).  
Redesigned & Polished by **Antigravity** (DeepMind Agentic Coding Team).
