import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { "aria-hidden": true, focusable: "false", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function AppleLogoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden focusable="false" fill="currentColor" {...props}>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} {...base} {...props}>
      <circle cx="7.5" cy="7.5" r="5.6" />
      <path d="M11.8 11.8L16.4 16.4" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 17 18" width={15} height={16} {...base} {...props}>
      <path d="M2.4 5.4h12.2l.9 11H1.5z" />
      <path d="M5.5 5.4V4.6a3 3 0 0 1 6 0v.8" />
    </svg>
  );
}

export function MenuIcon({ open, ...props }: IconProps & { open: boolean }) {
  return (
    <svg viewBox="0 0 18 18" width={18} height={18} {...base} {...props}>
      {open ? <path d="M3 3l12 12M15 3L3 15" /> : <path d="M2 5.5h14M2 12.5h14" />}
    </svg>
  );
}

export function ChevronIcon({ open, ...props }: IconProps & { open: boolean }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width={14}
      height={14}
      {...base}
      {...props}
      className={open ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"}
    >
      <path d="M4.5 7.5L9 12l4.5-4.5" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden focusable="false" fill="currentColor" {...props}>
      <path d="M4 2.6v10.8a.6.6 0 0 0 .9.5l8.7-5.4a.6.6 0 0 0 0-1L4.9 2.1a.6.6 0 0 0-.9.5z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden focusable="false" fill="currentColor" {...props}>
      <rect x="3" y="2" width="3.4" height="12" rx="1" />
      <rect x="9.6" y="2" width="3.4" height="12" rx="1" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={36} height={36} {...base} strokeWidth={1.5} {...props}>
      <path d="M14 10l8 8-8 8" />
    </svg>
  );
}
