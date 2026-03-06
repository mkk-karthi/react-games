# 🍭 Minimal Candy Crush 🍬

A highly-polished, addictive, and infinitely playable Candy Crush clone built with React and Tailwind CSS.

## ✨ Features

- **Infinite Dynamic Levels**: Play forever! The game proceduraly generates endless levels. The required moves slowly max out to force strategic play, while the score requirements grow exponentially harder every time you win.
- **Match-3 Physics Engine**: True gravity-based mechanics, animated tile falling, and reactive match cascading.
- **Special Candies**: Creating matches larger than 3 spawns striped candies or color bombs.
- **Micro-Animations & Visual Polish**: Fully custom CSS SVG animations, shaking, exploding confetti, bouncing, interactive hover states, scalable modals, and soft falling atmospheric background elements.
- **Responsive Layout**: Designed mathematically using pure viewport (`vw`/`vh`) values to remain fully fluid across all screen sizes (mobile phones, tablets, and massive desktop displays) ensuring the grid never clips or overflows.
- **Touch Gestures Built-in**: Full mobile swipe capability—you can play perfectly on mobile screens by physically swiping right/left/up/down. (Also supports standard desktop click-to-swap mechanics).
- **Sound System**: Satisfying popping, matching, swapping, and level completion audio cues (muteable).
- **Zero-Dependency Core**: 100% custom SVG drawing and internal math array management without pulling in 10 different massive canvas libraries.

## 🛠️ Tech Stack

- ⚛️ **React 19** (TypeScript)
- 🎨 **Tailwind CSS v4** (CSS Variables & @theme)
- ⚡ **Vite** (Build tool)
- 🔊 **Web Audio API** (Sound synthesis)
- 🎞️ **CSS Keyframes** (Advanced animations)

---

## 📸 Screenshot

<p align="center">
<img src="https://raw.githubusercontent.com/mkk-karthi/react-games/master/candy-crush/public/Screenshot.png" alt="Candy Crush - React Games (screenshot)">
</p>

---

## 🚀 Getting Started

### Prerequisites

You need Node.js (version 18+) installed.

### Clone the repository

```bash
git clone https://github.com/mkk-karthi/react-games.git
cd react-games/candy-crush
```

### Install dependencies

```bash
npm install
```

### Running Locally

Fire up the Vite development server mapping everything to port 3000:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

To create a highly optimized production bundle:

```bash
npm run build
```

---

## 👨‍💻 Created By

**Karthikeyan M**
[GitHub](https://github.com/mkk-karthi) • [LinkedIn](https://www.linkedin.com/in/karthikeyan-developer-mkk)
