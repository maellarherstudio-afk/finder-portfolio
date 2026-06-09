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
      <style>{`
        @media (min-width: 768px) { #mobile-msg { display: none !important; } }
      `}</style>
      <div id="mobile-msg" style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "radial-gradient(ellipse 80% 60% at 20% 50%, #1a1a3e 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 30%, #0d2030 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 60% 80%, #1e1228 0%, transparent 50%), #0d0d0d",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 32px", textAlign: "center", gap: 24,
      }}>
        <span style={{ fontSize: 48 }}>🚀</span>
        <p style={{
          fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
          fontWeight: 700, fontSize: 18, color: "rgba(255,255,255,0.9)",
          lineHeight: 1.5, margin: 0,
        }}>
          Malheureusement... ce site n&apos;aime pas trop les mobiles.<br />
          Installez-vous confortablement devant un ordinateur pour découvrir mon portfolio&nbsp;!
        </p>
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
