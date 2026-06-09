"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onClose: () => void;
  theme: "dark" | "light";
  title?: string;
};

const FONT = "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif";

export default function ContactForm({ onClose, theme, title = "Contact" }: Props) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:mael.larher.studio@gmail.com?subject=Contact — ${encodeURIComponent(name)}&body=${encodeURIComponent(`De : ${name}\nEmail : ${email}\n\n${message}`)}`;
    window.location.href = mailto;
    setSent(true);
    setTimeout(onClose, 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: 14,
    fontFamily: FONT,
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40"
        style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Form panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          key="contact"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-col"
          style={{
            width: "min(420px, 88vw)",
            padding: "48px 44px",
            background: "rgba(12,10,20,0.92)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          }}
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                Message envoyé.
              </p>
              <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                À bientôt.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Title */}
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "#fff", margin: "0 0 36px", letterSpacing: "-0.02em" }}>
                {title}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Nom</label>
                  <input
                    style={inputStyle}
                    placeholder="Ton nom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={e => (e.target.style.borderBottomColor = "rgba(255,255,255,0.5)")}
                    onBlur={e  => (e.target.style.borderBottomColor = "rgba(255,255,255,0.15)")}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Email</label>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={e => (e.target.style.borderBottomColor = "rgba(255,255,255,0.5)")}
                    onBlur={e  => (e.target.style.borderBottomColor = "rgba(255,255,255,0.15)")}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Message</label>
                  <textarea
                    style={{ ...inputStyle, height: 90, resize: "none", lineHeight: 1.6 }}
                    placeholder="Dis-moi tout..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onFocus={e => (e.target.style.borderBottomColor = "rgba(255,255,255,0.5)")}
                    onBlur={e  => (e.target.style.borderBottomColor = "rgba(255,255,255,0.15)")}
                    required
                  />
                </div>

                <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      fontFamily: FONT, fontWeight: 600, fontSize: 14,
                      color: "#fff", background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8, padding: "10px 24px", cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  >
                    Envoyer →
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
