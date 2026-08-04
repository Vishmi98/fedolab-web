"use client";

import { motion } from "framer-motion";

import { useAudio } from "@/hooks/useAudio";


const bars = [0, 1, 2, 3];

export default function MusicToggle() {
    const { isPlaying, toggle } = useAudio(
        "/background-minimal-piano-165603.mp3"
    );

    return (
        <div className="fixed bottom-4 md:bottom-8 right-5 md:right-8 z-[100]">
            <button
                onClick={toggle}
                aria-label="Toggle music"
                className="
          w-12 h-12 rounded-full
          bg-gradient-to-b from-blue-800 to-blue-950
          flex items-center justify-center
          shadow-lg
        "
            >
                {/* Outer ring */}
                <div className="absolute inset-1 rounded-full border border-white/40" />

                {/* Bars */}
                <div className="relative flex items-end gap-[3px] h-5">
                    {bars.map((i) => (
                        <motion.span
                            key={i}
                            className="w-[3px] bg-white rounded-sm"
                            animate={
                                isPlaying
                                    ? {
                                        height: ["6px", "18px", "8px"],
                                    }
                                    : {
                                        height: "6px",
                                    }
                            }
                            transition={{
                                duration: 0.8,
                                repeat: isPlaying ? Infinity : 0,
                                ease: "easeInOut",
                                delay: i * 0.5,
                            }}
                        />
                    ))}
                </div>
            </button>
        </div>
    );
}
