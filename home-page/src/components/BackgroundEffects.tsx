export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 select-none bg-midnight">
      {/* Immersive Retro Horizon Sunset Blend */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] rounded-full bg-gradient-to-t from-pink-500/15 via-purple-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-cyan-400/8 blur-3xl" />
      <div className="absolute top-[-10%] right-[-10%] w-[45%] aspect-square rounded-full bg-purple-500/8 blur-3xl" />

      {/* 3D Perspective Retro Grid System */}
      <div className="absolute bottom-0 left-0 right-0 h-[45vh] overflow-hidden opacity-35" style={{ perspective: "150px" }}>
        <div 
          className="w-[200%] h-[400%] absolute left-[-50%] top-0 wireframe-grid animate-grid-scroll" 
          style={{ 
            transform: "rotateX(75deg)", 
            transformOrigin: "top center",
            maskImage: "linear-gradient(to bottom, transparent, black 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 80%)",
          }}
        />
      </div>

      {/* Cyber Grid Horizon Line */}
      <div className="absolute bottom-[45vh] left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/70 to-transparent shadow-pink-glow-md opacity-40" />

      {/* Floating Retro Geometric Outlines & Star Particle System */}
      <div className="absolute top-[10%] left-[8%] w-12 h-12 border border-cyan-400/25 rounded-lg rotate-12 animate-float-slow" style={{ animationDelay: "0s" }} />
      <div className="absolute top-[35%] right-[10%] w-16 h-16 border border-pink-500/20 rotate-45 animate-float-slow" style={{ animationDelay: "-2s" }} />
      <div className="absolute bottom-[35%] left-[15%] w-10 h-10 border border-purple-500/25 rotate-12 animate-float-slow" style={{ animationDelay: "-4s" }} />

      {/* Floating Sparkles & Light Orbs */}
      <div className="absolute top-[15%] left-[25%] w-1.5 h-1.5 rounded-full bg-white/40 shadow-inner animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[45%] left-[65%] w-1 h-1 rounded-full bg-cyan-400 shadow-cyan-glow-md animate-pulse" style={{ animationDelay: "0.2s" }} />
      <div className="absolute bottom-[45%] right-[25%] w-2 h-2 rounded-full bg-pink-500 shadow-pink-glow-md animate-pulse" style={{ animationDelay: "2.5s" }} />
      <div className="absolute top-[8%] right-[30%] w-1 h-1 rounded-full bg-purple-500 shadow-purple-glow-md animate-pulse" style={{ animationDelay: "1.8s" }} />
    </div>
  );
}
