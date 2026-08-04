"use client";

import { useEffect, useState } from "react";

export default function BrandLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += 1;
      setProgress(value);

      if (value >= 100) clearInterval(interval);
    }, 25); // ✅ smooth (2.5s total)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black z-[10020]">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[3px] border-white/20 border-t-white animate-spin" />

        <div className="z-10 flex flex-col items-center gap-2 text-white">
          <span className="font-semibold tracking-[0.35em]">
            FEDOLAB
          </span>
          <span className="text-xs opacity-70">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
