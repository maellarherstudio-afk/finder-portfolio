"use client";

import { FileItem } from "@/types";
import { IconChevronRight } from "../icons/SidebarIcons";
import Thumbnail from "../Thumbnail";

type Result = { item: FileItem; path: string };

function searchAll(query: string, node: FileItem, pathParts: string[] = []): Result[] {
  const results: Result[] = [];
  const currentPath = [...pathParts, node.name];

  if (node.id !== "root") {
    const match = node.name.toLowerCase().includes(query.toLowerCase())
      || (node.client ?? "").toLowerCase().includes(query.toLowerCase())
      || (node.year ?? "").toLowerCase().includes(query.toLowerCase());
    if (match) {
      results.push({ item: node, path: pathParts.join(" › ") });
    }
  }

  for (const child of node.children ?? []) {
    results.push(...searchAll(query, child, currentPath));
  }

  return results;
}

type Props = {
  query: string;
  root: FileItem;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (item: FileItem) => void;
  theme: "dark" | "light";
};

export default function SearchView({ query, root, selectedId, onSelect, onOpen, theme }: Props) {
  const isDark    = theme === "dark";
  const textColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const subColor  = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const borderCol = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const selBg     = isDark ? "rgba(0,102,255,0.35)"   : "rgba(0,102,255,0.12)";
  const headerBg  = isDark ? "rgba(44,44,44,0.95)"    : "rgba(248,248,248,0.95)";

  if (!query.trim()) return (
    <div className="flex items-center justify-center h-full" style={{ color: subColor, fontSize: 13 }}>
      Commence à taper pour rechercher…
    </div>
  );

  const results = searchAll(query, root);

  if (!results.length) return (
    <div className="flex items-center justify-center h-full" style={{ color: subColor, fontSize: 13 }}>
      Aucun résultat pour « {query} »
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex items-center px-4 py-1 sticky top-0"
        style={{ borderBottom: `1px solid ${borderCol}`, background: headerBg, backdropFilter: "blur(8px)" }}
      >
        <span style={{ flex: 1, color: subColor, fontSize: 11, fontWeight: 600 }}>Nom</span>
        <span style={{ width: 160, color: subColor, fontSize: 11, fontWeight: 600 }}>Emplacement</span>
        <span style={{ width: 60, color: subColor, fontSize: 11, fontWeight: 600 }}>Durée</span>
      </div>

      {results.map(({ item, path }, i) => (
        <div
          key={item.id}
          className="flex items-center px-4 cursor-pointer select-none"
          style={{
            height: 32,
            background: selectedId === item.id ? selBg : "transparent",
            borderBottom: i < results.length - 1 ? `1px solid ${borderCol}` : "none",
          }}
          onClick={(e) => { e.stopPropagation(); onOpen(item); }}
        >
          <div style={{ marginRight: 8 }}>
            <Thumbnail item={item} height={20} borderRadius={3} isDark={true} />
          </div>
          <span style={{ flex: 1, color: textColor, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.name.replace(".mp4", "")}
          </span>
          <span style={{ width: 160, color: subColor, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {path || "Portfolio"}
          </span>
          <span style={{ width: 60, color: subColor, fontSize: 12 }}>
            {item.duration ?? "—"}
          </span>
          {item.type === "folder" && <IconChevronRight size={10} color={subColor} />}
        </div>
      ))}

      <div className="px-4 py-2" style={{ borderTop: `1px solid ${borderCol}` }}>
        <span style={{ color: subColor, fontSize: 11 }}>
          {results.length} résultat{results.length > 1 ? "s" : ""} pour « {query} »
        </span>
      </div>
    </div>
  );
}
