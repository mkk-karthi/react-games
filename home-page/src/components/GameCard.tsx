import { Play } from "lucide-react";

interface GameCardProps {
  name: string;
  image: string;
  link: string;
  category: string;
  description: string;
  isNew?: boolean;
  onPlay?: () => void;
}

export default function GameCard({
  name,
  image,
  link,
  category,
  description,
  isNew,
  onPlay,
}: GameCardProps) {
  const isComingSoon = link === "#";

  return (
    <div className="group relative flex flex-col h-full rounded-xl md:rounded-2xl cyber-card p-3 md:p-4 overflow-hidden border border-purple-500/20 hover:border-pink-500/70 shadow-lg">
      
      {/* Arcade Corner Highlights */}
      <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-cyan-400 shadow-cyan-glow-sm rounded-full z-20" />
      <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-pink-500 shadow-pink-glow-sm rounded-full z-20" />
      <div className="absolute bottom-1.5 left-1.5 w-1 h-1 bg-pink-500 shadow-pink-glow-sm rounded-full z-20" />
      <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-cyan-400 shadow-cyan-glow-sm rounded-full z-20" />

      {/* Cyber screen reflection highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent pointer-events-none z-10" />

      {/* Cabinet Frame Image Container (1:1 Aspect Ratio) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg md:rounded-xl border border-purple-500/20 bg-midnight">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Neon Purple/Indigo Screen tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-purple-500/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* Category Pill */}
        <span className="absolute top-2 md:top-2.5 left-2 md:left-2.5 px-1.5 md:px-2.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-midnight/80 border border-cyan-400/40 shadow-pill-cyan">
          {category}
        </span>

        {/* New Badge */}
        {isNew && (
          <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 px-1.5 md:px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-pink-500 bg-midnight/90 border border-pink-500/50 shadow-pill-pink animate-pulse z-10">
            NEW
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-grow pt-3 md:pt-4 relative z-10 justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm md:text-base font-bold tracking-wide text-white uppercase group-hover:text-cyan-400 transition-colors duration-300">
            {name}
          </h3>
          
          {/* Game Description */}
          <p className="mt-1 md:mt-2 text-[10px] md:text-xs text-white/50 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* CTA Play Button (Arcade Button Appearance) */}
        <div className="mt-3 md:mt-4 pt-0.5 md:pt-1">
          {isComingSoon ? (
            <div className="w-full text-center px-2 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/20 border border-white/5 bg-white/[0.01]">
              UNDER DEV
            </div>
          ) : (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              onClick={onPlay}
              className="relative flex items-center justify-center gap-1 md:gap-1.5 w-full px-2 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest text-white overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-neon-pink bg-gradient-to-r from-pink-500 to-purple-500 border-t border-white/20 border-b border-black/40 shadow-btn-pink active:scale-[0.98] arcade-btn-pulse"
            >
              {/* Button Light Sweep Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
              
              <Play className="w-2.5 md:w-3.5 h-2.5 md:h-3.5 fill-current text-white animate-pulse" />
              <span>PLAY NOW</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
