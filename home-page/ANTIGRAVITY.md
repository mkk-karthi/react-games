# 🌌 Antigravity Design & Engineering System

This document captures the visual redesign, technical implementation, and code standards introduced by **Antigravity** (Google DeepMind's Advanced Agentic Coding Assistant) for the **MKK Games Universe** portal.

---

## 🎨 Theme Architecture: Neon Arcade Universe
The portal's visual language was transitioned to a **Synthwave/Tron-inspired Neon Arcade Universe** designed to feel retro, premium, and highly engaging.

### 1. Global Color Registry
All colors are configured inside the `@theme` directive in [src/index.css](file:///src/index.css) to maximize style integrity and avoid hardcoded values inside component code.

#### 🌌 Primary Ambient Backdrops (Custom Hex Values)
- `--color-midnight`: `#05081A` (Deep Midnight background space)
- `--color-cyber-bg`: `#0A0C1E` (Cyber Card frosted backdrop)
- `--color-scanline-dark`: `#121010` (Dark boundary component overlay)

#### ⚡ Glowing Color Highlights (Tailwind Palette Map)
To maintain alignment with standard Tailwind styles, the glow attributes are mapped directly to standard Tailwind palette variables:
- `--color-text-primary`: `var(--color-gray-100)`
- `--color-neon-purple` / `--color-purple-500`: `var(--color-purple-500)` (#A855F7)
- `--color-neon-pink` / `--color-pink-500`: `var(--color-pink-500)` (#EC4899)
- `--color-neon-cyan` / `--color-cyan-400`: `var(--color-cyan-400)` (#22D3EE)
- `--color-neon-indigo` / `--color-indigo-500`: `var(--color-indigo-500)` (#6366F1)
- `--color-digital-green` / `--color-emerald-500`: `var(--color-emerald-500)` (#10B981)
- `--color-digital-yellow` / `--color-amber-400`: `var(--color-amber-400)` (#FBBF24)

---

## 🛠️ Strict Engineering Guidelines

### 🚫 The "No Hex Colors in Code" Standard
No inline hex colors (`#AABBCC`) are permitted inside the TSX/JSX codebase or general CSS blocks. 
- All custom background values, text attributes, or card borders must reference the registered Tailwind classes (e.g. `bg-midnight`, `from-midnight/80`, `text-cyan-400`).
- If custom alpha transparency is required in CSS configurations, utilize the standard CSS `color-mix()` rule blending a theme variable and `transparent`, for example:
  ```css
  box-shadow: 0 4px 10px color-mix(in srgb, var(--color-pink-500) 30%, transparent);
  ```

### 🖼️ 1:1 Aspect Ratio Cabinet Frames
All game cabinets display thumbnails strictly constrained to a **1:1 aspect ratio**. In [GameCard.tsx](file:///src/components/GameCard.tsx), this is governed by the Tailwind class `aspect-square` surrounding the frame.

---

## ⚡ Dynamic Portal Enhancements

### 🆕 Pulse "NEW" Badges
- Pulse badges are applied dynamically to game objects (such as Chess and Bullseye Archery) set with `isNew: true`.
- They appear as a glowing pill with an active `animate-pulse` state in both the Spotlight section and individual cabinet cards.

### 🕒 Click-Triggered "Recently Played" Shelf
- Located inside [App.tsx](file:///src/App.tsx), a custom hook intercepts click events on **"PLAY NOW"** CTA buttons.
- The clicked game ID is added to the top of the history list (with duplicates filtered out) and synced to browser storage under `mkk_recently_played_history` (supporting a queue length of up to `5`).
- The portal reads the list on initialization, rendering a **"RECENTLY PLAYED"** cabinet catalog section directly underneath the Spotlight banner when history records are present.

---

## 🚀 Adding New Arcade Cabinets
To add a new browser game to the catalog:

1. Copy the game thumbnail image to the [src/assets](file:///src/assets) directory.
2. Import the image at the top of [src/App.tsx](file:///src/App.tsx).
3. Append a new `Game` object to the `GAMES_LIST` array:
   ```typescript
   {
     id: "unique-game-id",
     name: "Game Title",
     image: importedThumbnailName,
     link: "target-game-folder-name",
     category: "Arcade" | "Puzzle" | "Strategy" | "Classic" | "Action",
     description: "Short game overview matching the retro styling.",
     isNew: true // Optional: triggers the pulsing NEW badge
   }
   ```
4. Run `npm run build` to confirm the asset builds and checks out perfectly.
