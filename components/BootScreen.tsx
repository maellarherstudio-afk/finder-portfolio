"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onDone: () => void };

export default function BootScreen({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(true);

  useEffect(() => {
    // Simulate boot progress
    const steps = [
      { target: 30,  delay: 100,  duration: 400  },
      { target: 60,  delay: 500,  duration: 500  },
      { target: 85,  delay: 1000, duration: 400  },
      { target: 100, delay: 1400, duration: 300  },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach(({ target, delay }) => {
      timers.push(setTimeout(() => setProgress(target), delay));
    });

    // Fade out after done
    timers.push(setTimeout(() => setVisible(false), 2000));
    timers.push(setTimeout(() => onDone(), 2500));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "transparent" }}
        >
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p style={{
              fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#fff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}>
              Maël Larher Studio
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-10"
            style={{ width: 260 }}
          >
            <div
              style={{
                width: "100%", height: 4,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 2, overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ height: "100%", background: "rgba(255,255,255,0.75)", borderRadius: 2 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
