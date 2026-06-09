"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileItem } from "@/types";
import portfolio from "@/data/portfolio.json";

import Sidebar from "./Sidebar";
import TrafficLights from "./TrafficLights";
import QuickLook from "./QuickLook";
import ContactForm from "./ContactForm";
import AboutWindow from "./AboutWindow";
import IconView from "./views/IconView";
import ListView from "./views/ListView";
import ColumnView from "./views/ColumnView";
import GalleryView from "./views/GalleryView";
import SearchView from "./views/SearchView";

import {
  IconGrid, IconList, IconColumns, IconGallery, IconSearch,
} from "./icons/SidebarIcons";

type ViewMode = "icons" | "list" | "columns" | "gallery";

const root = portfolio.root as FileItem;

function findItem(id: string, node: FileItem): FileItem | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const f = findItem(id, child);
    if (f) return f;
  }
  return null;
}

// Returns the list of IDs from root's children down to the target (inclusive)
function buildIdPath(id: string, node: FileItem, path: string[] = []): string[] | null {
  for (const child of node.children ?? []) {
    if (child.id === id) return [...path, child.id];
    const result = buildIdPath(id, child, [...path, child.id]);
    if (result) return result;
  }
  return null;
}

function findParent(id: string, node: FileItem): FileItem | null {
  for (const child of node.children ?? []) {
    if (child.id === id) return node;
    const f = findParent(id, child);
    if (f) return f;
  }
  return null;
}

function buildBreadcrumb(id: string, node: FileItem, path: { id: string; name: string }[] = []): { id: string; name: string }[] | null {
  const cur = [...path, { id: node.id, name: node.name }];
  if (node.id === id) return cur;
  for (const child of node.children ?? []) {
    const r = buildBreadcrumb(id, child, cur);
    if (r) return r;
  }
  return null;
}

const VIEW_MODES: { mode: ViewMode; Icon: typeof IconGrid; label: string }[] = [
  { mode: "icons",   Icon: IconGrid,    label: "Par icônes"           },
  { mode: "list",    Icon: IconList,    label: "Par liste"            },
  { mode: "columns", Icon: IconColumns, label: "Par colonnes"         },
  { mode: "gallery", Icon: IconGallery, label: "Par galerie d'icônes" },
];

export default function Finder() {
  const theme = "dark" as const;
  const [viewMode,  setViewMode] = useState<ViewMode>("columns");
  const [showMenu,  setShowMenu] = useState(false);
  const [currentId, setCurrentId] = useState("root");
  const [selected,  setSelected]  = useState<string | null>(null);
  const [quickLook, setQuickLook] = useState<FileItem | null>(null);
  const [columnPath,   setColumnPath]   = useState<string[]>([]);
  const [showContact,  setShowContact]  = useState(false);
  const [closing,      setClosing]      = useState(false);
  const [searching,    setSearching]    = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [aboutItem,    setAboutItem]    = useState<FileItem | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [history,      setHistory]      = useState<string[]>(["root"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);

  // ── Click outside to close view menu ──────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Navigation helpers ─────────────────────────────────────────
  const navigate = useCallback((id: string) => {
    setCurrentId(id);
    setSelected(null);
    setColumnPath([]);
    const next = history.slice(0, historyIndex + 1).concat(id);
    setHistory(next);
    setHistoryIndex(next.length - 1);
  }, [history, historyIndex]);

  const goBack = () => {
    if (historyIndex > 0) {
      const i = historyIndex - 1;
      setHistoryIndex(i); setCurrentId(history[i]); setSelected(null); setColumnPath([]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const i = historyIndex + 1;
      setHistoryIndex(i); setCurrentId(history[i]); setSelected(null); setColumnPath([]);
    }
  };

  const handleOpen = (item: FileItem) => {
    if (item.type === "folder") navigate(item.id);
    else if (item.type === "about") setAboutItem(item);
    else setQuickLook(item);
  };

  const handleOpenFromSearch = (item: FileItem) => {
    setSearching(false);
    setSearchQuery("");

    if (item.type === "folder") {
      const path = buildIdPath(item.id, root) ?? [];
      setColumnPath(path);
      setCurrentId(item.id);
      setSelected(item.id);
    } else {
      // For a video: set columnPath to show its parent folder, then open QuickLook
      const parent = findParent(item.id, root);
      const parentPath = parent ? (buildIdPath(parent.id, root) ?? []) : [];
      setColumnPath([...parentPath, item.id]);
      setCurrentId(parent?.id ?? "root");
      setSelected(item.id);
      setQuickLook(item);
    }
  };

  const handleColumnSelect = (colIndex: number, item: FileItem) => {
    const newPath = columnPath.slice(0, colIndex).concat(item.id);
    setColumnPath(newPath);
    setSelected(item.id);
    if (item.type === "folder") setCurrentId(item.id);
  };

  // ── Keyboard navigation ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (quickLook) return;

      if (e.key === "f" && e.metaKey) {
        e.preventDefault();
        setSearching(true);
        setTimeout(() => searchRef.current?.focus(), 50);
        return;
      }

      if (e.key === "Escape" && searching) {
        e.preventDefault();
        setSearching(false);
        setSearchQuery("");
        return;
      }
      if (e.target instanceof HTMLInputElement) return;

      // ── Space: QuickLook on selected item ──
      if (e.key === " ") {
        e.preventDefault();
        const selId = viewMode === "columns"
          ? columnPath[columnPath.length - 1] ?? null
          : selected;
        if (!selId) return;
        const item = findItem(selId, root);
        if (item?.type === "video") setQuickLook(item);
        else if (item?.type === "about") setAboutItem(item);
        else if (item?.type === "folder") {
          const first = item.children?.find(c => c.type === "video");
          if (first) setQuickLook(first);
        }
        return;
      }

      // ── Enter: open selected ──
      if (e.key === "Enter") {
        const selId = viewMode === "columns"
          ? columnPath[columnPath.length - 1] ?? null
          : selected;
        if (!selId) return;
        const item = findItem(selId, root);
        if (item) handleOpen(item);
        return;
      }

      // ── ⌘↑: go to parent folder ──
      if (e.key === "ArrowUp" && e.metaKey) {
        e.preventDefault();
        const parent = findParent(currentId, root);
        if (parent) navigate(parent.id);
        return;
      }

      // ── Arrow keys: navigate items ──
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();

        if (viewMode === "columns") {
          handleColumnArrow(e.key);
        } else {
          handleFlatArrow(e.key);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selected, columnPath, currentId, quickLook, history, historyIndex]);

  // Flat views (icons, list, gallery) arrow nav
  const handleFlatArrow = (key: string) => {
    const folder = findItem(currentId, root);
    const items  = folder?.children ?? [];
    if (!items.length) return;

    if (key === "ArrowLeft" || key === "ArrowUp") {
      const idx = selected ? items.findIndex(i => i.id === selected) : 0;
      const next = Math.max(0, idx - 1);
      setSelected(items[next].id);
    } else if (key === "ArrowRight" || key === "ArrowDown") {
      const idx = selected ? items.findIndex(i => i.id === selected) : -1;
      const next = Math.min(items.length - 1, idx + 1);
      setSelected(items[next].id);
    }
  };

  // Column view arrow nav
  const handleColumnArrow = (key: string) => {
    if (key === "ArrowUp" || key === "ArrowDown") {
      // Move within current column
      const activeColIndex = columnPath.length === 0 ? 0 : columnPath.length - 1;
      const parentId = activeColIndex === 0 ? "root" : columnPath[activeColIndex - 1];
      // For col 0, items are root.children. For col N, items are children of columnPath[N-1]
      const colParentId = columnPath.length === 0 ? "root" : (columnPath[columnPath.length - 2] ?? "root");

      // Determine which column is "active" (last one with selection)
      // Items in the rightmost visible column
      let colItems: FileItem[] = [];
      if (columnPath.length === 0) {
        colItems = root.children ?? [];
      } else {
        const lastSelected = columnPath[columnPath.length - 1];
        const lastItem = findItem(lastSelected, root);
        if (lastItem?.type === "folder") {
          // We're navigating in the column AFTER the last selected folder
          colItems = lastItem.children ?? [];
        } else {
          // Navigate in the column containing the last selected item
          const parentOfLast = findItem(columnPath[columnPath.length - 2] ?? "root", root);
          colItems = parentOfLast?.children ?? root.children ?? [];
        }
      }

      // Actually, simpler: navigate within the column that contains the current selection
      // Current selection = columnPath[last]
      // That item lives in the column whose parent is columnPath[last-1] or root
      const currentSelId = columnPath[columnPath.length - 1] ?? null;
      const parentFolder = columnPath.length <= 1
        ? root
        : (findItem(columnPath[columnPath.length - 2], root) ?? root);
      const siblings = parentFolder.children ?? [];

      if (!siblings.length) return;

      const idx = currentSelId ? siblings.findIndex(i => i.id === currentSelId) : -1;
      const next = key === "ArrowUp"
        ? Math.max(0, idx === -1 ? 0 : idx - 1)
        : Math.min(siblings.length - 1, idx + 1);

      const nextItem = siblings[next];
      const newPath  = columnPath.slice(0, -1).concat(nextItem.id);
      setColumnPath(newPath.length ? newPath : [nextItem.id]);
      setSelected(nextItem.id);
      if (nextItem.type === "folder") setCurrentId(nextItem.id);

    } else if (key === "ArrowRight") {
      // Enter selected folder
      const selId = columnPath[columnPath.length - 1];
      if (!selId) {
        // Nothing selected: select first item in root
        const first = root.children?.[0];
        if (first) { setColumnPath([first.id]); setSelected(first.id); }
        return;
      }
      const item = findItem(selId, root);
      if (item?.type === "folder" && (item.children?.length ?? 0) > 0) {
        const first = item.children![0];
        setColumnPath([...columnPath, first.id]);
        setSelected(first.id);
        if (first.type === "folder") setCurrentId(first.id);
      } else if (item?.type === "video") {
        setQuickLook(item);
      }

    } else if (key === "ArrowLeft") {
      // Go back one column
      if (columnPath.length <= 1) {
        setColumnPath([]);
        setSelected(null);
      } else {
        const newPath = columnPath.slice(0, -1);
        setColumnPath(newPath);
        setSelected(newPath[newPath.length - 1]);
        const parent = findItem(newPath[newPath.length - 1], root);
        if (parent?.type === "folder") setCurrentId(parent.id);
      }
    }
  };

  // ── Derived state ──────────────────────────────────────────────
  const currentFolder = findItem(currentId, root) ?? root;
  const items         = currentFolder.children ?? [];
  const breadcrumb    = buildBreadcrumb(currentId, root) ?? [{ id: "root", name: "Portfolio" }];

  // Siblings for QuickLook navigation: videos in the same folder as the open video
  // Dynamic page title
  useEffect(() => {
    const name = breadcrumb[breadcrumb.length - 1]?.name ?? "Portfolio";
    document.title = name === "Portfolio" ? "Maël Larher Studio" : `${name} — Maël Larher Studio`;
  }, [breadcrumb]);

  const quickLookSiblings = (() => {
    if (!quickLook) return [];
    const parent = findParent(quickLook.id, root);
    return parent?.children?.filter(c => c.type === "video") ?? [];
  })();

  // ── Theme tokens ───────────────────────────────────────────────
  const isDark     = theme === "dark";
  const winBg      = isDark ? "#2a2a2a"                : "#f6f6f6";
  const toolbarBg  = isDark ? "rgba(46,46,46,0.98)"   : "rgba(235,235,235,0.98)";
  const toolBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";
  const mainBg     = isDark ? "#2a2a2a"                : "#ffffff";
  const textColor  = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const subColor   = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
  const btnBg      = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";
  const menuBg     = isDark ? "#333"                   : "#fff";
  const menuBorder = isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.1)";
  const menuText   = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const menuSel    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  const CurrentViewIcon = VIEW_MODES.find(v => v.mode === viewMode)?.Icon ?? IconGrid;

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div
        className="flex flex-col overflow-hidden"
        style={{
          position: "relative", zIndex: 1,
          width: "min(1200px, 96vw)", height: "min(720px, 94vh)",
          background: winBg, borderRadius: 12,
          boxShadow: isDark
            ? "0 28px 80px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(255,255,255,0.08)"
            : "0 28px 80px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.12)",
          transformOrigin: "50% 50%",
          transition: closing
            ? "transform 0.35s cubic-bezier(0.4,0,1,1), opacity 0.35s ease"
            : "transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease",
          transform: closing ? "scale(0.85) translateY(40px)" : "scale(1)",
          opacity: closing ? 0 : 1,
          pointerEvents: closing ? "none" : "auto",
          animation: "finderEntry 0.6s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* ── Toolbar ───────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 shrink-0 px-3"
          style={{ height: 52, background: toolbarBg, borderBottom: `1px solid ${toolBorder}` }}
        >
          <TrafficLights onRedClick={() => { setClosing(true); setTimeout(() => setShowContact(true), 400); }} />

          <div className="flex items-center rounded-lg overflow-hidden" style={{ background: btnBg, marginLeft: 4 }}>
            {[goBack, goForward].map((fn, i) => (
              <button
                key={i} onClick={fn}
                disabled={i === 0 ? historyIndex === 0 : historyIndex >= history.length - 1}
                className="flex items-center justify-center"
                style={{
                  width: 30, height: 28, fontSize: 18, fontWeight: 300,
                  color: (i === 0 ? historyIndex === 0 : historyIndex >= history.length - 1) ? subColor : textColor,
                  background: "transparent", border: "none", cursor: "pointer",
                  borderRight: i === 0 ? `1px solid ${toolBorder}` : "none",
                }}
              >
                {i === 0 ? "‹" : "›"}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center gap-1 px-2 overflow-hidden">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.id} className="flex items-center gap-1 shrink-0">
                {i > 0 && <span style={{ color: subColor, fontSize: 12 }}>›</span>}
                <button
                  onClick={() => navigate(crumb.id)}
                  style={{
                    color: i === breadcrumb.length - 1 ? textColor : subColor,
                    fontWeight: i === breadcrumb.length - 1 ? 600 : 400,
                    fontSize: 14, background: "transparent", border: "none",
                    cursor: i === breadcrumb.length - 1 ? "default" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowMenu(v => !v)}
                className="flex items-center gap-1.5 rounded-lg px-2"
                style={{ height: 28, background: btnBg, border: "none", cursor: "pointer" }}
              >
                <CurrentViewIcon size={15} color={textColor} />
                <span style={{ color: subColor, fontSize: 11 }}>▾</span>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50"
                    style={{ minWidth: 190, background: menuBg, border: `1px solid ${menuBorder}`, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                  >
                    {VIEW_MODES.map(({ mode, Icon, label }) => (
                      <button
                        key={mode}
                        onClick={() => { setViewMode(mode); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left"
                        style={{ color: menuText, fontSize: 13, background: "transparent", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = menuSel)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <Icon size={14} color={menuText} />
                        <span style={{ flex: 1 }}>{label}</span>
                        {viewMode === mode && <span style={{ color: subColor }}>✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {searching ? (
              <div className="flex items-center gap-2 rounded-lg px-2" style={{ height: 28, background: btnBg, minWidth: 180 }}>
                <IconSearch size={13} color={subColor} />
                <input
                  ref={searchRef}
                  autoFocus
                  value={searchQuery}
                  onChange={e => {
                    const v = e.target.value;
                    setSearchQuery(v);
                    if (!v) setSearching(false);
                  }}
                  placeholder="Rechercher..."
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: textColor, fontSize: 13, width: "100%", fontFamily: "inherit",
                  }}
                  onKeyDown={e => { if (e.key === "Escape") { setSearching(false); setSearchQuery(""); } }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearching(false); setSearchQuery(""); }}
                    style={{ background: "none", border: "none", color: subColor, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearching(true)}
                className="flex items-center justify-center rounded-lg"
                style={{ width: 32, height: 28, background: btnBg, border: "none", cursor: "pointer" }}
              >
                <IconSearch size={14} color={subColor} />
              </button>
            )}
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar currentId={currentId} onNavigate={navigate} onContact={() => setShowContact(true)} theme={theme} />

          <main
            className="flex-1 overflow-auto"
            style={{ background: mainBg }}
            onClick={() => { setSelected(null); setColumnPath([]); }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={searching ? "search-" + searchQuery : currentId + viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="h-full"
              >
                {searching && (
                  <SearchView query={searchQuery} root={root} selectedId={selected} onSelect={setSelected} onOpen={handleOpenFromSearch} theme={theme} />
                )}
                {!searching && viewMode === "icons" && (
                  <IconView items={items} selectedId={selected} onSelect={setSelected} onOpen={handleOpen} theme={theme} />
                )}
                {!searching && viewMode === "list" && (
                  <ListView items={items} selectedId={selected} onSelect={setSelected} onOpen={handleOpen} theme={theme} />
                )}
                {!searching && viewMode === "columns" && (
                  <ColumnView root={root} columnPath={columnPath} onSelectInColumn={handleColumnSelect} onOpenFile={handleOpen} theme={theme} />
                )}
                {!searching && viewMode === "gallery" && (
                  <GalleryView items={items} selectedId={selected} onSelect={setSelected} onOpen={handleOpen} theme={theme} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* ── Status bar ────────────────────────────────────── */}
        <div
          className="flex items-center px-4 shrink-0"
          style={{ height: 26, borderTop: `1px solid ${toolBorder}`, background: toolbarBg }}
        >
          <span style={{ color: subColor, fontSize: 11 }}>
            {items.length} élément{items.length !== 1 ? "s" : ""}
            {(() => {
              const selId = viewMode === "columns" ? columnPath[columnPath.length - 1] : selected;
              const sel = selId ? findItem(selId, root) : null;
              if (!sel) return null;
              const parts = [sel.type === "folder" ? "Dossier" : sel.type === "about" ? "Texte" : "Vidéo", sel.year, sel.duration, sel.client].filter(Boolean);
              return <span style={{ marginLeft: 16 }}>— {parts.join(" · ")}</span>;
            })()}
          </span>
          <span style={{ marginLeft: "auto", color: subColor, fontSize: 11 }}>
            ⌘F · Rechercher &nbsp;·&nbsp; Espace · Aperçu &nbsp;·&nbsp; ↑↓ · Naviguer
          </span>
        </div>
      </div>

      {showContact && <ContactForm onClose={() => { setShowContact(false); setClosing(false); }} theme={theme} title="Avant de partir..." />}
      {aboutItem && <AboutWindow content={aboutItem.content ?? ""} onClose={() => setAboutItem(null)} />}

      <QuickLook
        item={quickLook}
        siblings={quickLookSiblings}
        onClose={() => {
          if (quickLook) {
            setSelected(quickLook.id);
            const parent = findParent(quickLook.id, root);
            if (parent) {
              const parentPath = findParent(parent.id, root);
              const newPath = parentPath && parentPath.id !== "root"
                ? [parentPath.id, parent.id, quickLook.id]
                : parent.id === "root"
                ? [quickLook.id]
                : [parent.id, quickLook.id];
              setColumnPath(newPath);
            }
          }
          setQuickLook(null);
        }}
        onNavigate={(item) => {
          setQuickLook(item);
          // Sync column selection with the previewed video
          setSelected(item.id);
          const parent = findParent(item.id, root);
          if (parent) {
            const parentPath = findParent(parent.id, root);
            const newPath = parentPath && parentPath.id !== "root"
              ? [parentPath.id, parent.id, item.id]
              : parent.id === "root"
              ? [item.id]
              : [parent.id, item.id];
            setColumnPath(newPath);
          }
        }}
      />
    </div>
  );
}
