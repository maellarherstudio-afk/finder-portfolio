"use client";

type Props = {
  onRedClick?: () => void;
};

export default function TrafficLights({ onRedClick }: Props) {
  return (
    <div className="flex items-center gap-2 px-4" style={{ minWidth: 60 }}>
      <div
        onClick={onRedClick}
        className="w-3 h-3 rounded-full flex items-center justify-center"
        style={{ background: "#FF5F57", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)", cursor: onRedClick ? "pointer" : "default" }}
      >
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M1 1l4 4M5 1L1 5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#FFBD2E", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)" }}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M1 3h4" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#28C840", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)" }}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M1 5L5 1M3.5 1H5v1.5M1 3.5V5h1.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
