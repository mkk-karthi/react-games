# 🎯 Bullseye Archery

A modern, fast-paced **archery target shooting game** built using **React + TypeScript** with **Vite** and styled with **Tailwind CSS**.  
The game features a vibrant hand-drawn outdoor aesthetic, fully interactive SVG bow-and-arrow aiming mechanics, real-time procedural audio synthesis, and full responsiveness.

---

## 🚀 Features

- 🎨 **Vibrant Outdoor Aesthetic**: Animated sky gradient, drifting clouds, flapping birds, and green hills styled with Tailwind CSS.
- 🎵 **Synthesized Audio**: Real-time synthesized audio for 'Draw', 'Release', 'Hit', 'Bullseye', and 'Game End' using the Web Audio API (no external media dependencies).
- 🎬 **Dynamic Animations**: Recurve bow aiming sways, realistic arrow flight rotation along its Bezier trajectory, target shake, and gold ripple effects for bullseyes.
- 📱 **Mobile First**: Intuitive touch controls and a portrait orientation overlay recommending landscape mode for mobile devices.
- 📊 **Progress Persistence**: Persistent leaderboard tracking top 10 player scores saved to `localStorage`.
- 📈 **Dynamic Difficulty**: 1/3 distance aiming guide helper and subtle random angle jitter for realistic shooting imprecision.
- ⚡ **High Performance**: Ref-based state updates and SVG rendering for smooth 60fps gameplay.

---

## 🛠️ Tech Stack

- ⚛️ **React 19** (TypeScript)
- 🎨 **Tailwind CSS** (Utility-class styling & custom animations config)
- ⚡ **Vite** (Build tool)
- 🔊 **Web Audio API** (Sound synthesis)
- 🎞️ **CSS Keyframes** (Advanced animations)

---

## 🎮 Controls

### Desktop

- 🖱️ Click & Drag string backward – Aim & draw bow
- 📦 Release – Fire arrow
- ⏸️ P – Pause / Resume game

### Mobile

- 👆 Touch & Drag string backward – Aim & draw bow
- 📲 Release – Fire arrow

---

## 📸 Screenshot

<p align="center">
<img src="https://raw.githubusercontent.com/mkk-karthi/react-games/master/bullseye-archery/screenshot.png" alt="Bullseye Archery - React Games (screenshot)">
</p>

---

## 🧑💻 Getting Started

### Prerequisites

- Node.js & npm installed

### Installation

### Clone the repository

```bash
git clone https://github.com/mkk-karthi/react-games.git
cd react-games/bullseye-archery
```

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will run at `http://localhost:3000`.

---

## 👨💻 Created By

**Karthikeyan M**
[GitHub](https://github.com/mkk-karthi) • [LinkedIn](https://www.linkedin.com/in/karthikeyan-developer-mkk)