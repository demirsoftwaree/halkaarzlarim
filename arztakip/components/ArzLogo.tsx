"use client";
import { useState } from "react";

interface ArzLogoProps {
  logo?: string;
  ticker: string;
  isDone?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE = {
  sm: { outer: "w-9 h-9",  text: "text-[10px]", padding: "p-1"   },
  md: { outer: "w-11 h-11", text: "text-xs",     padding: "p-1.5" },
  lg: { outer: "w-14 h-14", text: "text-sm",     padding: "p-2"   },
};

export default function ArzLogo({ logo, ticker, isDone = false, size = "md" }: ArzLogoProps) {
  const [err, setErr] = useState(false);
  const { outer, text, padding } = SIZE[size];
  const initials = (ticker || "?").slice(0, 2).toUpperCase();

  if (logo && !err) {
    return (
      <div
        className={`${outer} rounded-xl shrink-0 flex items-center justify-center
          bg-white ${padding} ring-1 ring-white/10 shadow-sm overflow-hidden`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={ticker}
          className="w-full h-full object-contain"
          onError={() => setErr(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${outer} rounded-xl shrink-0 flex items-center justify-center font-bold ${text}
        ${isDone
          ? "bg-slate-700/60 text-slate-400 ring-1 ring-white/5"
          : "bg-gradient-to-br from-emerald-500/20 to-slate-700 text-emerald-300 ring-1 ring-emerald-500/20"
        }`}
    >
      {initials}
    </div>
  );
}
