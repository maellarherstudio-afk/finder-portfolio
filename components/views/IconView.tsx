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

export default function IconView({ items, selectedId, onSelect, onOpen, theme }: Props) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#fff" : "#000";
  const subColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const selBg = isDark ? "rgba(0,102,255,0.35)" : "rgba(0,102,255,0.15)";

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: subColor, fontSize: 13 }}>
        Dossier vide
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 p-4 content-start">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer select-none"
          style={{ width: 96, background: selectedId === item.id ? selBg : "transparent" }}
          onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
          onDoubleClick={() => onOpen(item)}
        >
          <Thumbnail item={item} height={56} borderRadius={5} isDark={isDark} />
          <span
            className="text-center leading-tight"
            style={{
              color: textColor, fontSize: 12,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              overflow: "hidden", maxWidth: 88, wordBreak: "break-word",
            }}
          >
            {item.name}
          </span>
          {item.duration && (
            <span style={{ color: subColor, fontSize: 10 }}>{item.duration}</span>
          )}
        </div>
      ))}
    </div>
  );
}
