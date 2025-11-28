import React, { useState } from 'react';
import { Flame } from 'lucide-react';

interface ForgeButtonProps {
  onClick: () => void;
  clickPower: number;
}

export function ForgeButton({ onClick, clickPower }: ForgeButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        className="relative w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 hover:from-orange-400 hover:via-red-400 hover:to-purple-500 shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent rounded-full animate-pulse" />

        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <Flame size={64} className="text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
          <span className="text-white font-bold text-lg mt-2 drop-shadow-lg">
            FORGE
          </span>
        </div>
      </button>

      <div className="text-center">
        <div className="text-sm text-slate-400">Click Power</div>
        <div className="text-2xl font-bold text-yellow-400">
          +{Math.floor(clickPower)} Sparks
        </div>
      </div>
    </div>
  );
}
