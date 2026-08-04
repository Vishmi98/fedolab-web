"use client";

import React, { useState, useRef, MouseEvent } from "react";

interface AwardHeroProps {
  title?: string;
}

const AwardHero: React.FC<AwardHeroProps> = ({ title = "fedolab" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative h-[25vh] md:h-[60vh] w-full overflow-hidden bg-black flex items-center justify-center cursor-none"
    >
      {/* 1. BASE LAYER: Dim Outline */}
      <h1
        className="absolute text-[21vw] font-extrabold uppercase text-transparent leading-none select-none"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}
      >
        {title}
      </h1>

      {/* 2. GLOW LAYER */}
      <h1
        className={`absolute text-[21vw] font-extrabold uppercase text-transparent leading-none select-none transition-opacity duration-1000
          ${!isHovering ? "animate-swipe md:animate-none" : ""}`}
        style={{
          WebkitTextStroke: "1px rgba(255,255,255,0.8)",
          filter: "drop-shadow(0 0 15px rgba(255,255,255,0.6))",
          WebkitMaskImage: isHovering 
            ? `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 80%)`
            : `linear-gradient(90deg, transparent 0%, black 30%, black 70%, transparent 100%)`,
          WebkitMaskSize: isHovering ? "100% 100%" : "300% 100%", // Increased size for smoother movement
          maskImage: isHovering 
            ? `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 80%)`
            : `linear-gradient(90deg, transparent 10%, black 30%, black 50%, transparent 80%)`,
          maskSize: isHovering ? "100% 100%" : "300% 100%",
        }}
      >
        {title}
      </h1>

      <style jsx global>{`
        @keyframes sweep {
          0% { 
            mask-position: 150% 0%; 
            -webkit-mask-position: 150% 0%; 
          }
          100% { 
            mask-position: -150% 0%; 
            -webkit-mask-position: -150% 0%; 
          }
        }
        .animate-swipe {
          /* Changed to 20s for a very slow animation */
          animation: sweep 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default AwardHero;