export const PurpleCandySvg = () => (
  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-xl scale-110">
    <defs>
      <radialGradient id="purpleGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#e6e6fa" />
        <stop offset="50%" stopColor="#ba55d3" />
        <stop offset="100%" stopColor="#4b0082" />
      </radialGradient>
      <linearGradient id="wrapperPurple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d7b3fc" opacity="0.9" />
        <stop offset="100%" stopColor="#b58ffc" opacity="0.9" />
      </linearGradient>
    </defs>
    {/* Left wrapper */}
    <path
      d="M 30 50 L 10 30 L 5 39 L 8 43 L 5 46 L 8 50 L 5 53 L 8 57 L 5 61 L 10 70 Z"
      fill="url(#wrapperPurple)"
    />
    {/* Right wrapper */}
    <path
      d="M 70 50 L 90 30 L 95 39 L 92 43 L 95 46 L 92 50 L 95 53 L 92 57 L 95 61 L 90 70 Z"
      fill="url(#wrapperPurple)"
    />
    {/* Center Candy */}
    <ellipse cx="50" cy="50" rx="25" ry="20" fill="url(#purpleGrad)" />
    {/* Highlight */}
    <ellipse
      cx="45"
      cy="42"
      rx="10"
      ry="5"
      fill="#ffffff"
      opacity="0.6"
      transform="rotate(-15 45 42)"
    />
  </svg>
);

export const OrangeCandySvg = () => (
  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-xl scale-110">
    <defs>
      <radialGradient id="orangeGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffdead" />
        <stop offset="50%" stopColor="#ff8c00" />
        <stop offset="100%" stopColor="#ff4500" />
      </radialGradient>
    </defs>
    {/* Swirl candy base */}
    <circle cx="50" cy="50" r="35" fill="url(#orangeGrad)" />
    {/* Swirl lines */}
    <path
      d="M50 15 A35 35 0 0 1 85 50 A35 35 0 0 1 50 85"
      fill="none"
      stroke="#fff"
      strokeWidth="6"
      opacity="0.4"
      strokeLinecap="round"
    />
    <path
      d="M15 50 A35 35 0 0 0 50 85 A35 35 0 0 0 85 50"
      fill="none"
      stroke="#e6e6fa"
      strokeWidth="4"
      opacity="0.5"
      strokeLinecap="round"
    />
    {/* Highlight */}
    <ellipse
      cx="35"
      cy="35"
      rx="8"
      ry="10"
      fill="#ffffff"
      opacity="0.5"
      transform="rotate(-45 35 35)"
    />
    <circle cx="50" cy="50" r="10" fill="#ffffff" opacity="0.2" />
  </svg>
);

export const BlueCandySvg = () => (
  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-xl scale-110">
    <defs>
      <radialGradient id="blueLolly" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#add8e6" />
        <stop offset="50%" stopColor="#00bfff" />
        <stop offset="100%" stopColor="#0000cd" />
      </radialGradient>
    </defs>
    {/* Stick */}
    <rect
      x="46"
      y="50"
      width="8"
      height="45"
      rx="4"
      fill="#f5f5f5"
      stroke="#dcdcdc"
      strokeWidth="1"
    />
    {/* Lollipop Top */}
    <circle cx="50" cy="35" r="28" fill="url(#blueLolly)" />
    {/* Swirl pattern inside lollipop */}
    <path
      d="M50 7 C65 7, 78 20, 78 35 C78 50, 65 63, 50 63"
      fill="none"
      stroke="#ffffff"
      strokeWidth="4"
      opacity="0.6"
      strokeLinecap="round"
    />
    {/* Highlight */}
    <ellipse
      cx="38"
      cy="22"
      rx="6"
      ry="7"
      fill="#ffffff"
      opacity="0.6"
      transform="rotate(-45 38 22)"
    />
  </svg>
);

export const GreenCandySvg = () => (
  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-xl scale-110">
    <defs>
      <radialGradient id="greenGumdrop" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#bcffbc" />
        <stop offset="40%" stopColor="#32cd32" />
        <stop offset="100%" stopColor="#006400" />
      </radialGradient>
    </defs>

    {/* Swirl candy base */}
    <circle cx="50" cy="50" r="35" fill="url(#greenGumdrop)" />
    {/* Ring */}
    <rect x="10" y="48" width="80" height="10" rx="4" fill="url(#greenGumdrop)" />
    {/* Highlight */}
    <ellipse
      cx="30"
      cy="35"
      rx="8"
      ry="10"
      fill="#ffffff"
      opacity="0.5"
      transform="rotate(-45 35 35)"
    />
    <circle cx="50" cy="30" r="6" fill="#ffffff" opacity="0.2" />
  </svg>
);

export const YellowCandySvg = () => (
  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-xl scale-110">
    <defs>
      <radialGradient id="yellowStar" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffe0" />
        <stop offset="40%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#b8860b" />
      </radialGradient>
    </defs>
    {/* Star Candy Shape */}
    <path
      d="M 52 16 L 61.0988 39.4764 L 86.238 40.8752 L 66.7224 56.7836 L 73.1604 81.1248 L 52 67.48 L 30.8397 81.1248 L 37.2776 56.7836 L 17.762 40.8752 L 42.9012 39.4764 L 52 16 Z"
      fill="url(#yellowStar)"
      stroke="#daa520"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Highlight */}
    <path
      d="M52 23 L58 40.2 L72 41"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      opacity="0.6"
      strokeLinecap="round"
    />
    <ellipse cx="50" cy="50" rx="10" ry="10" fill="#fff" opacity="0.2" />
  </svg>
);

export const RedCandySvg = () => (
  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-xl scale-110">
    <defs>
      <radialGradient id="redBean" cx="70%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fb2444ff" />
        <stop offset="100%" stopColor="#c10202ff" />
      </radialGradient>
    </defs>
    {/* Swirl candy base */}
    <path
      fill="url(#redBean)"
      d="M 60 46 C 50 46 39 43 36 32 C 35 22 15 17 13 36 C 12 66 42 74 59 69 C 76 66 74 45 60 46"
    ></path>

    {/* Highlight */}
    <ellipse cx="14" cy="42" rx="3" ry="6" fill="#fff" opacity="0.5" transform="rotate(-5)" />
    <circle cx="30" cy="30" r="2" fill="#ffffff" opacity="0.5" />
    <circle cx="64" cy="52" r="2" fill="#ffffff" opacity="0.5" />
  </svg>
);

export const PinkCandySvg = () => (
  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-xl scale-110">
    <defs>
      <radialGradient id="pinkHeart" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffb6c1" />
        <stop offset="40%" stopColor="#ff69b4" />
        <stop offset="100%" stopColor="#c71585" />
      </radialGradient>
    </defs>
    {/* Heart Candy Shape */}
    <path
      d="M 50 26 C 47 27 42 15 25 15 C 10 15 5 35 15 50 C 25 65 45 85 50 84 C 55 85 75 65 85 50 C 95 35 90 15 75 15 C 59 15 53 27 50 26 Z"
      fill="url(#pinkHeart)"
    />
    {/* Highlight */}
    <ellipse
      cx="25"
      cy="30"
      rx="8"
      ry="12"
      fill="#ffffff"
      opacity="0.4"
      transform="rotate(-30 25 30)"
    />
    <path
      d="M75 30 Q80 40 70 50"
      fill="none"
      stroke="#fff"
      strokeWidth="4"
      opacity="0.3"
      strokeLinecap="round"
    />
  </svg>
);
