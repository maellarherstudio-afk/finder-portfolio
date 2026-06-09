"use client";

import { useState } from "react";
import { IconClock, IconFolder, IconShare } from "./icons/SidebarIcons";

const FAVORITES = [
  { id: "root",      label: "Portfolio",  Icon: IconFolder },
  { id: "ad",        label: "Ad",         Icon: IconShare  },
  { id: "organique", label: "Organique",  Icon: IconClock  },
];

type Theme = "dark" | "light";

type Props = {
  currentId: string;
  onNavigate: (id: string) => void;
  onContact: () => void;
  theme: Theme;
};

export default function Sidebar({ currentId, onNavigate, onContact, theme }: Props) {
  const [ctaHover, setCtaHover] = useState(false);
  const isDark = theme === "dark";
  const bg       = isDark ? "rgba(38,38,38,0.98)"  : "rgba(236,236,236,0.98)";
  const border   = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const label    = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";
  const textBase = isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.72)";
  const textSel  = isDark ? "#fff" : "#000";
  const selBg    = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const iconCol  = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)";
  const footCol  = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";

  return (
    <aside
      className="flex flex-col py-3 select-none shrink-0"
      style={{ width: 236, background: bg, borderRight: `1px solid ${border}` }}
    >
      <div className="px-3 mb-1">
        <p className="uppercase tracking-widest mb-1 px-2" style={{ color: label, fontSize: 10, fontWeight: 600 }}>
          Favoris
        </p>
        {FAVORITES.map(({ id, label: lbl, Icon }) => {
          const active = currentId === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left"
              style={{
                color: active ? textSel : textBase,
                background: active ? selBg : "transparent",
                fontSize: 13,
                border: "none",
                cursor: "pointer",
              }}
            >
              <Icon size={15} color={active ? (isDark ? "#6eb0ff" : "#1a6ef5") : iconCol} />
              {lbl}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="px-3 pb-3 pt-2" style={{ borderTop: `1px solid ${border}` }}>
        <a
          href="#"
          onClick={e => { e.preventDefault(); onContact(); }}
          className="flex items-center gap-2 px-2 py-2 rounded-lg"
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            textDecoration: "none", display: "flex",
            background: isDark
              ? ctaHover
                ? "linear-gradient(135deg, rgba(40,40,90,0.95) 0%, rgba(50,28,65,0.95) 100%)"
                : "linear-gradient(135deg, rgba(26,26,62,0.8) 0%, rgba(30,18,40,0.8) 100%)"
              : ctaHover
                ? "linear-gradient(135deg, rgba(200,210,255,0.4) 0%, rgba(230,200,255,0.35) 100%)"
                : "linear-gradient(135deg, rgba(180,190,240,0.25) 0%, rgba(210,180,240,0.2) 100%)",
            border: `1px solid ${isDark
              ? ctaHover ? "rgba(150,140,230,0.5)" : "rgba(120,110,200,0.3)"
              : ctaHover ? "rgba(120,90,200,0.35)"  : "rgba(120,90,200,0.2)"}`,
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0,
            background: isDark ? "rgba(100,90,200,0.25)" : "rgba(120,90,200,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="12" height="8" rx="1.5" stroke={isDark ? "rgba(180,170,255,0.85)" : "rgba(100,70,180,0.85)"} strokeWidth="1.2"/>
              <path d="M1 4.5l6 4 6-4" stroke={isDark ? "rgba(180,170,255,0.85)" : "rgba(100,70,180,0.85)"} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, color: isDark ? "rgba(190,185,255,0.9)" : "rgba(90,60,160,0.9)", whiteSpace: "nowrap" }}>
            mael.larher.studio@gmail.com
          </span>
        </a>
      </div>
    </aside>
  );
}
