"use client";

import { FileItem } from "@/types";
import { IconChevronRight } from "../icons/SidebarIcons";
import Thumbnail from "../Thumbnail";

type Props = {
  items: FileItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (item: FileItem) => void;
  theme: "dark" | "light";
};

export default function ListView({ items, selectedId, onSelect, onOpen, theme }: Props) {
  const isDark = theme === "dark";
  const textColor  = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const subColor   = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const borderCol  = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const selBg      = isDark ? "rgba(0,102,255,0.35)"   : "rgba(0,102,255,0.12)";
  const hoverBg    = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const headerCol  = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: subColor, fontSize: 13 }}>
        Dossier vide
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div
        className="flex items-center px-4 py-1 sticky top-0"
        style={{
          borderBottom: `1px solid ${borderCol}`,
          background: isDark ? "rgba(44,44,44,0.95)" : "rgba(248,248,248,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ flex: 1, color: headerCol, fontSize: 11, fontWeight: 600 }}>Nom</span>
        <span style={{ width: 80, color: headerCol, fontSize: 11, fontWeight: 600 }}>Année</span>
        <span style={{ width: 70, color: headerCol, fontSize: 11, fontWeight: 600 }}>Durée</span>
      </div>

      {items.map((item, i) => {
        const active = selectedId === item.id;
        return (
          <div
            key={item.id}
            className="flex items-center px-4 cursor-pointer select-none group"
            style={{
              height: 32,
              background: active ? selBg : "transparent",
              borderBottom: i < items.length - 1 ? `1px solid ${borderCol}` : "none",
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
            onDoubleClick={() => onOpen(item)}
          >
            <div style={{ marginRight: 8 }}>
              <Thumbnail item={item} height={20} borderRadius={3} isDark={isDark} />
            </div>
            <span style={{ flex: 1, color: textColor, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.name}
            </span>
            <span style={{ width: 80, color: subColor, fontSize: 12 }}>{item.year ?? "—"}</span>
            <span style={{ width: 70, color: subColor, fontSize: 12 }}>{item.duration ?? "—"}</span>
            {item.type === "folder" && (
              <IconChevronRight size={10} color={subColor} />
            )}
          </div>
        );
      })}
    </div>
  );
}
