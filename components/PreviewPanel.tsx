"use client";

import { FileItem } from "@/types";

type Props = {
  item: FileItem | null;
  onPlay: (item: FileItem) => void;
};

const RATIO_LABELS: Record<string, string> = {
  "9/16": "9:16 — Vertical",
  "16/9": "16:9 — Paysage",
  "4/5":  "4:5 — Portrait",
  "1/1":  "1:1 — Carré",
};

export default function PreviewPanel({ item, onPlay }: Props) {
  const borderCol = "rgba(255,255,255,0.07)";

  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        borderLeft: `1px solid ${borderCol}`,
        background: "rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px 16px",
        gap: 12,
        overflowY: "auto",
      }}
    >
      {item ? (
        <>
          {/* Thumbnail */}
          {item.youtubeId && (
            <div
              style={{
                width: "100%",
                aspectRatio: item.ratio ?? "16/9",
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => onPlay(item)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
                onError={e => { (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`; }}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Play overlay */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.25)",
                  opacity: 0,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 2l9 5-9 5V2z" fill="#000" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 12,
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.4,
            margin: 0,
            wordBreak: "break-word",
          }}>
            {item.name.replace(".mp4", "")}
          </p>

          {/* Metadata */}
          <div style={{
            width: "100%",
            borderTop: `1px solid ${borderCol}`,
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}>
            {item.ratio && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Format</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                  {RATIO_LABELS[item.ratio] ?? item.ratio}
                </span>
              </div>
            )}
            {item.year && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Année</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{item.year}</span>
              </div>
            )}
            {item.duration && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Durée</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{item.duration}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textAlign: "center", marginTop: 40 }}>
          Sélectionnez une vidéo
        </p>
      )}
    </div>
  );
}
