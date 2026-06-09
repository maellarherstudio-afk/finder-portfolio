"use client";

import { FileItem } from "@/types";
import Thumbnail from "../Thumbnail";

type Props = {
  items: FileItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (item: FileItem) => void;
  theme: "dark" | "light";
};

export default function GalleryView({ items, selectedId, onSelect, onOpen, theme }: Props) {
  const isDark   = theme === "dark";
  const textColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const subColor  = isDark ? "rgba(255,255,255,0.4)"  : "rgba(0,0,0,0.4)";
  const selBg     = isDark ? "rgba(0,102,255,0.35)"   : "rgba(0,102,255,0.15)";
  const cardBg    = isDark ? "rgba(255,255,255,0.06)"  : "rgba(0,0,0,0.05)";
  const borderCol = isDark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)";

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: subColor, fontSize: 13 }}>
        Dossier vide
      </div>
    );
  }

  return (
    <div className="grid p-4 gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
      {items.map((item) => {
        const active = selectedId === item.id;
        return (
          <div
            key={item.id}
            className="flex flex-col rounded-xl overflow-hidden cursor-pointer select-none"
            style={{
              background: active ? selBg : cardBg,
              border: `1px solid ${active ? "rgba(0,102,255,0.5)" : borderCol}`,
              transition: "background 0.1s",
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
            onDoubleClick={() => onOpen(item)}
          >
            {/* Thumbnail area */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 12px 0", background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)" }}>
              <Thumbnail item={item} height={120} borderRadius={4} isDark={isDark} />
            </div>

            {/* Info */}
            <div className="px-3 py-2">
              <p style={{ color: textColor, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.name.replace(".mp4", "")}
              </p>
              {(item.year || item.duration) && (
                <p style={{ color: subColor, fontSize: 11, marginTop: 2 }}>
                  {[item.year, item.duration].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
