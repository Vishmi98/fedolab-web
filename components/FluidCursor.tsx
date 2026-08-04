"use client";

import { useEffect, useState } from "react";
import { SmokeyFluidCursor } from "react-smokey-fluid-cursor";

export default function FluidCursor() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ⛔ Prevent SSR mismatch
  if (isMobile === null) return null;

  // 🚫 Disable completely on mobile
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[20] hidden md:block">
      <SmokeyFluidCursor
        config={{
          simResolution: 128,
          densityDissipation: 0.95,
          velocityDissipation: 0.95,
          curl: -2,
          pressureIteration: 6,
          splatRadius: 0.15,
        }}
      />

      <style jsx global>{`
        @keyframes mercuryLight {
          0%   { filter: grayscale(100%) brightness(1.2) contrast(1.4); }
          50%  { filter: grayscale(100%) brightness(1.3) contrast(1.45); }
          100% { filter: grayscale(100%) brightness(1.2) contrast(1.4); }
        }

        canvas {
          pointer-events: none;
          touch-action: none;
          filter: grayscale(100%) brightness(1.2) contrast(1.4);
          mix-blend-mode: screen;
          animation: mercuryLight 20s ease-in-out infinite;
        }

        body::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 60%);
          mix-blend-mode: screen;
          z-index: 20;
          animation: mercuryLight 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}