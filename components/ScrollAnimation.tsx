"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

export default function ScrollLine() {
  const ref = useRef(null);

  // Track scroll progress relative to this container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  // Smooth out the scroll progress
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={ref} className="absolute inset-0 z-0 pointer-events-none">
      <svg
        viewBox="0 0 100 1000" // Adjust viewbox based on your page length/width
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <motion.path
          d="M50 0 Q 100 250 50 500 T 50 1000"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength,
            opacity: pathLength, // fades in as it’s drawn
          }}
        />
      </svg>
    </div>
  );
}