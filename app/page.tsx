"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Finder from "@/components/Finder";
import BootScreen from "@/components/BootScreen";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="w-full min-h-screen" style={{ position: "relative", overflow: "hidden", background: "#0d0d0d" }}>

      {/* Message mobile — uniquement sur écrans < 768px */}
      <div id="mobile-msg" style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "radial-gradient(ellipse 80% 60% at 20% 50%, #1a1a3e 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 30%, #0d2030 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 60% 80%, #1e1228 0%, transparent 50%), #0d0d0d",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 32px",
      }}>
        {/* Dialog macOS */}
        <div style={{
          background: "rgba(44,44,44,0.97)",
          borderRadius: 14,
          padding: "28px 28px 20px",
          maxWidth: 300,
          width: "100%",
          boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
          textAlign: "center",
        }}>
          <span style={{ fontSize: 52, lineHeight: 1 }}>🚀</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,0.95)", margin: "0 0 8px" }}>
              « finder-portfolio » ne peut pas s&apos;ouvrir
            </p>
            <p style={{ fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
              Ce portfolio a été conçu pour une expérience desktop. Installe-toi devant un ordinateur pour le découvrir.
            </p>
          </div>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)" }} />
          <button style={{
            background: "none", border: "none", cursor: "default",
            color: "#4da3ff", fontSize: 15, fontWeight: 600,
            fontFamily: "inherit", padding: "4px 0",
          }}>
            OK
          </button>
        </div>
      </div>
      {/* Fond permanent — visible pendant le boot ET après */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 80% 60% at 20% 50%, #1a1a3e 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 30%, #0d2030 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 60% 80%, #1e1228 0%, transparent 50%)",
        animation: "bgFloat 12s ease-in-out infinite alternate",
      }} />

      {/* Boot screen — fond transparent, juste le contenu */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <BootScreen onDone={() => setBooted(true)} />
      </div>

      {/* Finder — apparaît sans fondu du fond */}
      <AnimatePresence>
        {booted && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Finder />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
