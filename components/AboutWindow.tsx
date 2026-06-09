"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  content: string;
  onClose: () => void;
};

const FONT = "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif";

export default function AboutWindow({ content, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const [title, ...body] = content.split("\n\n");

  return (
    <AnimatePresence>
      <motion.div
        key="about-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40"
        style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          key="about-window"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-col"
          style={{
            width: "min(480px, 88vw)",
            padding: "48px 44px",
            background: "rgba(12,10,20,0.92)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          }}
        >
          <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "#fff", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
            {title}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", maxHeight: "55vh" }}>
            {body.map((para, i) => (
              <p key={i} style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                {para}
              </p>
            ))}
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop: 36, alignSelf: "flex-start",
              fontFamily: FONT, fontSize: 13,
              color: "rgba(255,255,255,0.3)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            Fermer
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
