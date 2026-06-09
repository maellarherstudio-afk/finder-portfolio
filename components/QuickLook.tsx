"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileItem } from "@/types";

type Props = {
  item: FileItem | null;
  siblings: FileItem[];
  onClose: () => void;
  onNavigate: (item: FileItem) => void;
};

const RATIO_CONFIG: Record<string, { aspectRatio: string; maxH: string; maxW: string }> = {
  "16/9": { aspectRatio: "16/9", maxH: "80vh", maxW: "min(880px, 90vw)" },
  "1/1":  { aspectRatio: "1/1",  maxH: "80vh", maxW: "min(640px, 80vw)" },
  "4/5":  { aspectRatio: "4/5",  maxH: "85vh", maxW: "min(560px, 70vw)" },
  "9/16": { aspectRatio: "9/16", maxH: "88vh", maxW: "min(420px, 55vw)" },
};

const HIDE_DELAY = 500;

export default function QuickLook({ item, siblings, onClose, onNavigate }: Props) {
  const videos      = siblings.filter(s => s.type === "video");
  const currentIdx  = item ? videos.findIndex(v => v.id === item.id) : -1;
  const hasPrev     = currentIdx > 0;
  const hasNext     = currentIdx < videos.length - 1;
  // true = mouse active → overlay transparent → YouTube voit la souris → contrôles visibles
  // false = inactif → overlay opaque aux events → YouTube ne voit plus la souris → contrôles cachés
  const [mouseActive, setMouseActive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") { e.preventDefault(); onClose(); }
      if (e.key === "ArrowRight" && hasNext) onNavigate(videos[currentIdx + 1]);
      if (e.key === "ArrowLeft"  && hasPrev) onNavigate(videos[currentIdx - 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (item) {
      setMouseActive(true);
      scheduleHide();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  const scheduleHide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMouseActive(false), HIDE_DELAY);
  }, []);

  const handleMouseMove = useCallback(() => {
    setMouseActive(true);
    scheduleHide();
  }, [scheduleHide]);

  const ratio  = item?.ratio ?? "16/9";
  const config = RATIO_CONFIG[ratio];

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              key="quicklook"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col pointer-events-auto"
              style={{
                width: config.maxW,
                maxHeight: `calc(${config.maxH} + 44px + 36px)`,
                background: "#1a1a1a",
                borderRadius: 12,
                boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              {/* Title bar — toujours visible */}
              <div
                className="flex items-center justify-between px-4 shrink-0"
                style={{
                  height: 44,
                  background: "rgba(255,255,255,0.05)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div onClick={onClose} className="w-3 h-3 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "#FF5F57" }}>
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M1 1l4 4M5 1L1 5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  </div>
                  <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#FFBD2E" }}>
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M1 3h4" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  </div>
                  <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#28C840" }}>
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M1 5L5 1M3.5 1H5v1.5M1 3.5V5h1.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>
                    {item.name.replace(".mp4", "")}
                  </span>
                  {videos.length > 1 && (
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 1 }}>
                      {currentIdx + 1} / {videos.length}
                    </span>
                  )}
                </div>

                {/* Prev / Next */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => hasPrev && onNavigate(videos[currentIdx - 1])}
                    style={{
                      width: 24, height: 24, borderRadius: 6, border: "none", cursor: hasPrev ? "pointer" : "default",
                      background: "transparent", color: hasPrev ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >‹</button>
                  <button
                    onClick={() => hasNext && onNavigate(videos[currentIdx + 1])}
                    style={{
                      width: 24, height: 24, borderRadius: 6, border: "none", cursor: hasNext ? "pointer" : "default",
                      background: "transparent", color: hasNext ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >›</button>
                </div>
              </div>

              {/* Zone vidéo + overlay souris */}
              <div
                style={{ position: "relative", background: "#000", aspectRatio: config.aspectRatio, maxHeight: config.maxH, width: "100%" }}
                onMouseMove={handleMouseMove}
              >
                <AnimatePresence mode="wait">
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
                    {item.youtubeId ? (
                      <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&modestbranding=1&rel=0`} style={{ width: "100%", height: "100%", border: "none", display: "block" }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                    ) : item.vimeoId ? (
                      <iframe src={`https://player.vimeo.com/video/${item.vimeoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`} style={{ width: "100%", height: "100%", border: "none", display: "block" }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Vidéo non disponible</div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Overlay transparent qui bloque la souris vers l'iframe quand inactif */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    pointerEvents: mouseActive ? "none" : "auto",
                    cursor: mouseActive ? "default" : "none",
                  }}
                  onMouseMove={handleMouseMove}
                />
              </div>

              {/* Meta bar — toujours visible */}
              <div
                className="flex items-center gap-4 px-4 shrink-0"
                style={{ height: 36, borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                {item.year     && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{item.year}</span>}
                {item.client   && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Client — {item.client}</span>}
                {item.duration && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{item.duration}</span>}
                <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
                  Espace · Fermer
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
