"use client";

import { useEffect, useRef, useState } from "react";

export const useAudio = (src: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6;

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [src]);

    const play = async () => {
        if (!audioRef.current) return;

        try {
            await audioRef.current.play();
            setIsPlaying(true);
        } catch (err) {
            console.warn("Autoplay blocked until user interaction");
        }
    };

    const pause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const toggle = () => {
        isPlaying ? pause() : play();
    };

    return { isPlaying, toggle };
};
