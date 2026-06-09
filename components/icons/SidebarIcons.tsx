"use client";

export const IconFolder = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M1.5 4.5A1 1 0 012.5 3.5h3.086a1 1 0 01.707.293L7.207 4.707A1 1 0 007.914 5H13.5a1 1 0 011 1v6a1 1 0 01-1 1h-11a1 1 0 01-1-1V4.5z" fill={color} fillOpacity={0.85}/>
  </svg>
);

export const IconClock = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <path d="M8 4.5V8l2.5 2" stroke={color} strokeOpacity={0.75} strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
);

export const IconShare = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="6.5" width="13" height="8" rx="1.5" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <path d="M8 1v8M5.5 3.5L8 1l2.5 2.5" stroke={color} strokeOpacity={0.75} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconGrid = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
  </svg>
);

export const IconList = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M2 8h12M2 12h12" stroke={color} strokeOpacity={0.75} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconColumns = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="2.5" width="4" height="11" rx="1" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <rect x="6.5" y="2.5" width="3" height="11" rx="1" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <rect x="10.5" y="2.5" width="4" height="11" rx="1" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
  </svg>
);

export const IconGallery = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="13" height="9" rx="1.5" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <rect x="3" y="12" width="3" height="2.5" rx="0.75" fill={color} fillOpacity={0.6}/>
    <rect x="6.5" y="12" width="3" height="2.5" rx="0.75" fill={color} fillOpacity={0.6}/>
    <rect x="10" y="12" width="3" height="2.5" rx="0.75" fill={color} fillOpacity={0.6}/>
  </svg>
);

export const IconSearch = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <path d="M10 10l3.5 3.5" stroke={color} strokeOpacity={0.75} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconChevronRight = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M4.5 2.5L7.5 6l-3 3.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconSun = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" stroke={color} strokeOpacity={0.75} strokeWidth="1.25"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke={color} strokeOpacity={0.75} strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
);

export const IconMoon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M13.5 9A6 6 0 017 2.5a6 6 0 100 11 6 6 0 006.5-4.5z" stroke={color} strokeOpacity={0.75} strokeWidth="1.25" strokeLinejoin="round"/>
  </svg>
);
