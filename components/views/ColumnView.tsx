"use client";

import { useEffect, useRef } from "react";
import { FileItem } from "@/types";
import { IconChevronRight } from "../icons/SidebarIcons";
import Thumbnail from "../Thumbnail";

type Props = {
  root: FileItem;
  columnPath: string[];       // IDs of selected item per column
  onSelectInColumn: (colIndex: number, item: FileItem) => void;
  onOpenFile: (item: FileItem) => void;
  theme: "dark" | "light";
};

function findItem(id: string, node: FileItem): FileItem | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findItem(id, child);
    if (found) return found;
  }
  return null;
}

export default function ColumnView({ root, columnPath, onSelectInColumn, onOpenFile, theme }: Props) {
  const isDark    = theme === "dark";
  const textColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const subColor  = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const borderCol = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const selBg     = isDark ? "#0a64d6"                : "#0a64d6";
  const hoverBg   = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  const scrollRef = useRef<HTMLDivElement>(null);

  // Build columns: column 0 = root children, column N = children of selected item in col N-1
  const columns: FileItem[][] = [root.children ?? []];
  for (const id of columnPath) {
    const item = findItem(id, root);
    if (item?.type === "folder" && item.children) {
      columns.push(item.children);
    } else {
      break;
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 99999, behavior: "smooth" });
  }, [columnPath.length]);

  // Scroll selected item into view when columnPath changes
  const lastSelectedId = columnPath[columnPath.length - 1];
  useEffect(() => {
    if (!lastSelectedId) return;
    // Use requestAnimationFrame to ensure DOM is painted before scrolling
    const raf = requestAnimationFrame(() => {
      const itemEl = document.querySelector(`[data-id="${lastSelectedId}"]`) as HTMLElement | null;
      itemEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [lastSelectedId]);

  return (
    <div ref={scrollRef} className="flex flex-row h-full overflow-x-auto overflow-y-hidden">
      {columns.map((colItems, colIndex) => {
        const selectedIdInCol = columnPath[colIndex] ?? null;

        return (
          <div
            key={colIndex}
            className="flex flex-col shrink-0 overflow-y-auto overflow-x-hidden h-full"
            style={{
              width: colIndex === columns.length - 1 ? 320 : 220,
              borderRight: `1px solid ${borderCol}`,
            }}
          >
            {colItems.map((item) => {
              const active   = selectedIdInCol === item.id;
              const isCurrent = active && colIndex === columnPath.length - 1;
              const isParent  = active && colIndex < columnPath.length - 1;
              return (
                <div
                  key={item.id}
                  data-id={item.id}
                  className="flex items-center px-3 select-none"
                  style={{
                    height: item.type === "video" ? 38 : 30,
                    flexShrink: 0,
                    cursor: item.type === "video" ? "pointer" : "default",
                    background: isCurrent ? selBg : isParent ? "rgba(255,255,255,0.08)" : "transparent",
                    borderRadius: active ? 6 : 0,
                    margin: "1px 4px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectInColumn(colIndex, item);
                    if (item.type !== "folder") onOpenFile(item);
                  }}
                >
                  <div style={{ marginRight: 7 }}>
                    <Thumbnail item={item} height={item.type === "video" ? 28 : 20} borderRadius={3} isDark={true} />
                  </div>
                  <span
                    style={{
                      flex: 1,
                      color: isCurrent ? "#fff" : isParent ? "rgba(255,255,255,0.55)" : textColor,
                      fontSize: 10,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name.replace(".mp4", "")}
                  </span>
                  {item.type === "folder" && (
                    <IconChevronRight size={10} color={active ? "rgba(255,255,255,0.7)" : subColor} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Empty right space */}
      <div className="flex-1" />
    </div>
  );
}
