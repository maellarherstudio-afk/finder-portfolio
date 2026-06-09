"use client";

import { FileItem } from "@/types";

function MacFolder({ size = 20 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/folder.png"
      alt="folder"
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}

// Returns CSS aspect-ratio string from FileItem ratio field
function getAspectRatio(ratio?: string) {
  return ratio ?? "16/9";
}

type Props = {
  item: FileItem;
  height: number;       // fixed height in px — width adapts to ratio
  borderRadius?: number;
  isDark?: boolean;
};

export default function Thumbnail({ item, height, borderRadius = 4, isDark = true }: Props) {
  const aspectRatio = getAspectRatio(item.ratio);

  if (item.type === "folder") return <MacFolder size={height} />;
  if (item.type === "about")  return <span style={{ fontSize: height * 0.8 }}>📄</span>;

  return (
    <div
      style={{
        height,
        aspectRatio,
        borderRadius,
        overflow: "hidden",
        flexShrink: 0,
        background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {item.youtubeId ? (
        <img
          src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span style={{ fontSize: height * 0.5 }}>🎬</span>
      )}
    </div>
  );
}
