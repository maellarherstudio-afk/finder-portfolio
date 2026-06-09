"use client";

import { FileItem } from "@/types";

type Props = {
  item: FileItem;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onOpen: () => void;
};

export default function FileIcon({ item, selected, onSelect, onOpen }: Props) {
  const isFolder = item.type === "folder";

  return (
    <div
      className="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer select-none"
      style={{
        width: 96,
        background: selected ? "rgba(0,122,255,0.35)" : "transparent",
        transition: "background 0.1s",
      }}
      onClick={(e) => { e.stopPropagation(); onSelect(e); }}
      onDoubleClick={onOpen}
    >
      <div style={{ fontSize: 52, lineHeight: 1, filter: selected ? "brightness(1.15)" : "none" }}>
        {isFolder ? "📁" : "🎬"}
      </div>
      <span
        className="text-center leading-tight"
        style={{
          color: "#fff",
          fontSize: 12,
          wordBreak: "break-word",
          maxWidth: 88,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.name}
      </span>
      {item.type === "video" && item.duration && (
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{item.duration}</span>
      )}
    </div>
  );
}
