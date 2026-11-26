import { useId, type ReactNode } from "react";
import type { ArtId } from "@/lib/catalog";

export type HolidayColor = "pink" | "blue" | "green" | "yellow";

interface HolidayPalette {
  background: string;
  colors: [string, string, string];
  label: string;
}

export const HOLIDAY_PALETTES: Record<HolidayColor, HolidayPalette> = {
  pink: {
    background: "radial-gradient(ellipse at 50% 85%, #c2185b 0%, #7a1030 45%, #3b0a1c 100%)",
    colors: ["#ff4d6d", "#9d174d", "#d946ef"],
    label: "in red, burgundy and magenta colours",
  },
  blue: {
    background: "radial-gradient(ellipse at 50% 85%, #5aa7ff 0%, #2748a8 48%, #1a1450 100%)",
    colors: ["#8ec5ff", "#2f4fd1", "#8b5cf6"],
    label: "in light blue, dark blue and purple colours",
  },
  green: {
    background: "radial-gradient(ellipse at 50% 85%, #d8e84a 0%, #4a9a3c 45%, #0f4a2a 100%)",
    colors: ["#f5e663", "#8fd16b", "#1f7a46"],
    label: "in yellow, light green and dark green colours",
  },
  yellow: {
    background: "radial-gradient(ellipse at 50% 85%, #ffd23f 0%, #f26b1d 48%, #a3151f 100%)",
    colors: ["#ffe066", "#ff8a1f", "#e63946"],
    label: "in yellow, orange and red colours",
  },
};

interface ProductArtProps {
  id: ArtId;
  /** Accessible description. Omit for purely decorative use. */
  label?: string;
  holiday?: HolidayColor;
}

function Frame({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1000 700"
      xmlns="http://www.w3.org/2000/svg"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {children}
    </svg>
  );
}

function Lens({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={25} fill="#101013" stroke="#3b3b42" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={14} fill="#1a2440" />
      <circle cx={cx - 4} cy={cy - 4} r={4} fill="#6f8cff" opacity={0.7} />
    </g>
  );
}

function Laptop({ uid, screen, lid, base }: { uid: string; screen: ReactNode; lid: string; base: [string, string] }) {
  return (
    <g>
      <rect x={235} y={262} width={530} height={345} rx={18} fill={lid} />
      <rect x={249} y={276} width={502} height={317} rx={7} fill="#000" />
      <clipPath id={`${uid}-screen`}>
        <rect x={249} y={276} width={502} height={317} rx={7} />
      </clipPath>
      <g clipPath={`url(#${uid}-screen)`}>{screen}</g>
      <circle cx={500} cy={269} r={2.5} fill="#2b2b2f" />
      <linearGradient id={`${uid}-base`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={base[0]} />
        <stop offset="1" stopColor={base[1]} />
      </linearGradient>
      <path d="M172 607h656l-18 30a14 14 0 0 1-12 7H202a14 14 0 0 1-12-7z" fill={`url(#${uid}-base)`} />
      <path d="M440 607h120a14 14 0 0 1-12 12h-96a14 14 0 0 1-12-12z" fill="#000" opacity={0.28} />
    </g>
  );
}

function HolidayArt({ color, label }: { color: HolidayColor; label?: string }) {
  const uid = useId().replace(/:/g, "");
  const [a, b, c] = HOLIDAY_PALETTES[color].colors;
  return (
    <Frame label={label}>
      <defs>
        <radialGradient id={`${uid}-orb`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="0.35" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </radialGradient>
        <linearGradient id={`${uid}-card`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <g className="art-float art-float-2">
        <rect x={150} y={330} width={130} height={250} rx={26} fill={`url(#${uid}-card)`} transform="rotate(-14 215 455)" />
        <rect x={166} y={346} width={98} height={218} rx={16} fill="#000" opacity={0.35} transform="rotate(-14 215 455)" />
      </g>
      <g className="art-float">
        <rect x={720} y={350} width={150} height={170} rx={34} fill={`url(#${uid}-card)`} transform="rotate(12 795 435)" />
        <rect x={738} y={368} width={114} height={134} rx={22} fill="#000" opacity={0.35} transform="rotate(12 795 435)" />
      </g>
      <g className="art-float art-float-3">
        <rect x={760} y={540} width={170} height={110} rx={26} fill={b} opacity={0.9} transform="rotate(-8 845 595)" />
        <circle cx={150} cy={620} r={44} fill={c} opacity={0.9} />
      </g>
      <g className="art-float art-float-3">
        <circle cx={500} cy={500} r={168} fill={`url(#${uid}-orb)`} />
        <rect x={483} y={332} width={34} height={336} fill="#fff" opacity={0.92} />
        <path d="M500 345c-48-72-132-70-124-24 8 44 84 40 124 24zM500 345c48-72 132-70 124-24-8 44-84 40-124 24z" fill="#fff" />
        <path d="M500 345c-30-26-80-30-90-8 10 18 62 18 90 8zM500 345c30-26 80-30 90-8-10 18-62 18-90 8z" fill="#000" opacity={0.08} />
        <circle cx={500} cy={346} r={20} fill="#fff" stroke="#000" strokeOpacity={0.08} strokeWidth={2} />
        <path d="M486 360c-20 40-40 70-56 96M514 360c20 40 40 70 56 96" stroke="#fff" strokeWidth={16} strokeLinecap="round" fill="none" />
      </g>
    </Frame>
  );
}

function Iphone18ProArt({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Frame label={label}>
      <defs>
        <linearGradient id={`${uid}-pro`} x1="0" x2="1">
          <stop offset="0" stopColor="#3a3a40" />
          <stop offset="0.5" stopColor="#8a8a94" />
          <stop offset="1" stopColor="#3a3a40" />
        </linearGradient>
        <linearGradient id={`${uid}-body`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4a4a52" />
          <stop offset="0.5" stopColor="#1f1f23" />
          <stop offset="1" stopColor="#0d0d0f" />
        </linearGradient>
      </defs>
      <text x={500} y={640} textAnchor="middle" fontSize={430} fontWeight={800} fill={`url(#${uid}-pro)`} opacity={0.35} fontFamily="'SF Pro Display', Helvetica, Arial, sans-serif" letterSpacing={-8}>
        PRO
      </text>
      <g transform="rotate(-7 500 700)">
        <rect x={382} y={262} width={236} height={470} rx={48} fill={`url(#${uid}-body)`} stroke="#5b5b63" strokeWidth={3} />
        <rect x={402} y={282} width={124} height={124} rx={32} fill="#17171a" stroke="#4a4a52" strokeWidth={2} />
        <Lens cx={436} cy={318} />
        <Lens cx={436} cy={372} />
        <Lens cx={492} cy={345} />
        <circle cx={560} cy={300} r={9} fill="#e8e0c8" />
        <circle cx={560} cy={338} r={6} fill="#0b0b0d" />
        <circle cx={500} cy={540} r={26} fill="none" stroke="#9a9aa4" strokeOpacity={0.55} strokeWidth={4} />
        <path d="M392 330c0-40 20-60 20-60" stroke="#fff" strokeOpacity={0.25} strokeWidth={3} fill="none" />
      </g>
    </Frame>
  );
}

function IphoneDuoArt({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  const icons = ["#ff453a", "#ff9f0a", "#32d74b", "#0a84ff", "#bf5af2", "#64d2ff", "#ffd60a", "#30d158", "#ff375f", "#5e5ce6", "#ac8e68", "#8e8e93"];
  return (
    <Frame label={label}>
      <defs>
        <linearGradient id={`${uid}-photo`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffb86b" />
          <stop offset="0.55" stopColor="#ff6b8b" />
          <stop offset="1" stopColor="#5b5bd6" />
        </linearGradient>
        <linearGradient id={`${uid}-frame`} x1="0" x2="1">
          <stop offset="0" stopColor="#f7f6f2" />
          <stop offset="1" stopColor="#d8d6cf" />
        </linearGradient>
      </defs>
      <rect x={215} y={330} width={570} height={360} rx={44} fill={`url(#${uid}-frame)`} stroke="#c3c1ba" strokeWidth={2} />
      <rect x={230} y={345} width={265} height={330} rx={32} fill="#0c0c0f" />
      <rect x={505} y={345} width={265} height={330} rx={32} fill="#0c0c0f" />
      <rect x={242} y={357} width={241} height={306} rx={22} fill={`url(#${uid}-photo)`} />
      <circle cx={380} cy={470} r={34} fill="#fff" opacity={0.85} />
      <path d="M242 600c60-70 120-60 241 20v43H242z" fill="#2c2c6b" opacity={0.7} />
      <rect x={517} y={357} width={241} height={306} rx={22} fill="#1b1b1f" />
      {icons.map((fill, i) => (
        <rect key={fill + i} x={537 + (i % 3) * 68} y={385 + Math.floor(i / 3) * 68} width={52} height={52} rx={13} fill={fill} />
      ))}
      <rect x={494} y={345} width={12} height={330} fill="#bdbbb3" />
    </Frame>
  );
}

function HomeviewArt({ label }: { label?: string }) {
  return (
    <Frame label={label}>
      <path d="M470 585h60l14 80H456z" fill="#c9c9ce" />
      <ellipse cx={500} cy={672} rx={120} ry={16} fill="#b5b5bb" />
      <rect x={290} y={290} width={420} height={300} rx={30} fill="#f6f6f8" stroke="#c7c7cc" strokeWidth={2} />
      <rect x={308} y={308} width={384} height={264} rx={16} fill="#111114" />
      <rect x={326} y={326} width={168} height={110} rx={14} fill="#2c2c34" />
      <text x={410} y={398} textAnchor="middle" fill="#fff" fontSize={52} fontWeight={300} fontFamily="'SF Pro Display', Helvetica, Arial, sans-serif">9:41</text>
      <rect x={506} y={326} width={168} height={52} rx={14} fill="#ff9f0a" />
      <rect x={506} y={386} width={80} height={50} rx={14} fill="#0a84ff" />
      <rect x={594} y={386} width={80} height={50} rx={14} fill="#30d158" />
      <rect x={326} y={448} width={348} height={108} rx={14} fill="#1e1e24" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={376 + i * 82} cy={502} r={26} fill={["#ffd60a", "#64d2ff", "#bf5af2", "#ff453a"][i]} opacity={0.9} />
      ))}
    </Frame>
  );
}

function IpadArt({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Frame label={label}>
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ff9bd2" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect x={250} y={320} width={500} height={370} rx={34} fill="#c9d8e8" stroke="#aebfd1" strokeWidth={2} />
      <rect x={268} y={338} width={464} height={334} rx={18} fill="#0b0b0d" />
      <rect x={278} y={348} width={444} height={314} rx={10} fill={`url(#${uid}-wall)`} />
      <circle cx={400} cy={470} r={90} fill="#fff" opacity={0.28} />
      <circle cx={610} cy={560} r={70} fill="#fff" opacity={0.2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={340 + i * 66} y={610} width={46} height={46} rx={12} fill="#fff" opacity={0.75} />
      ))}
      <circle cx={259} cy={505} r={3} fill="#6b7a8c" />
    </Frame>
  );
}

function WatchArt({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Frame label={label}>
      <defs>
        <linearGradient id={`${uid}-band`} x1="0" x2="1">
          <stop offset="0" stopColor="#2a2a2e" />
          <stop offset="0.5" stopColor="#47474d" />
          <stop offset="1" stopColor="#222226" />
        </linearGradient>
        <linearGradient id={`${uid}-case`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f2cfc2" />
          <stop offset="1" stopColor="#b98b7c" />
        </linearGradient>
      </defs>
      <path d="M418 300l16-86c3-14 14-22 28-22h76c14 0 25 8 28 22l16 86z" fill={`url(#${uid}-band)`} />
      <path d="M418 600l16 86c3 14 14 22 28 22h76c14 0 25-8 28-22l16-86z" fill={`url(#${uid}-band)`} />
      <rect x={385} y={290} width={230} height={320} rx={70} fill={`url(#${uid}-case)`} />
      <rect x={398} y={303} width={204} height={294} rx={58} fill="#000" />
      <rect x={612} y={380} width={14} height={60} rx={7} fill="#c99f90" />
      <text x={420} y={372} fill="#ff453a" fontSize={30} fontWeight={600} fontFamily="'SF Pro Display', Helvetica, Arial, sans-serif">72</text>
      <text x={466} y={372} fill="#ff6b61" fontSize={16} fontFamily="'SF Pro Text', Helvetica, Arial, sans-serif">BPM</text>
      <polyline
        points="414,470 450,470 462,430 480,520 498,410 516,500 530,470 586,470"
        fill="none"
        stroke="#ff453a"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={500} cy={545} r={10} fill="#ff453a" opacity={0.85} />
    </Frame>
  );
}

function MacbookProledArt({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Frame label={label}>
      <defs>
        <pattern id={`${uid}-stripes`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <rect width="14" height="14" fill="#101018" />
          <rect width="14" height="3" fill="#ff3d9a" />
          <rect y="4" width="14" height="2" fill="#7c4dff" />
          <rect y="7" width="14" height="4" fill="#22d3ee" />
          <rect y="12" width="14" height="2" fill="#ffd60a" />
        </pattern>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#7c4dff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      <Laptop
        uid={uid}
        lid="#26262a"
        base={["#3a3a40", "#1b1b1e"]}
        screen={
          <>
            <rect x={249} y={276} width={502} height={317} fill={`url(#${uid}-glow)`} />
            <text x={500} y={500} textAnchor="middle" fontSize={230} fontWeight={800} fill={`url(#${uid}-stripes)`} fontFamily="'SF Pro Display', Helvetica, Arial, sans-serif" letterSpacing={-6}>
              Pro
            </text>
          </>
        }
      />
    </Frame>
  );
}

function MacbookM6Art({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Frame label={label}>
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="0.55" stopColor="#6d28d9" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <Laptop
        uid={uid}
        lid="#c7c8cc"
        base={["#dcdde0", "#a5a6ab"]}
        screen={
          <>
            <rect x={249} y={276} width={502} height={317} fill={`url(#${uid}-wall)`} />
            <path d="M249 520c110-90 210 30 330-40s130-30 172-10v123H249z" fill="#fb923c" opacity={0.55} />
            <path d="M249 560c120-60 200 20 330-20s120 0 172 10v43H249z" fill="#1e1b4b" opacity={0.5} />
            <rect x={249} y={276} width={502} height={22} fill="#000" opacity={0.25} />
          </>
        }
      />
    </Frame>
  );
}

function AirpodsArt({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Frame label={label}>
      <defs>
        <linearGradient id={`${uid}-pod`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d9de" />
        </linearGradient>
      </defs>
      <rect x={395} y={470} width={210} height={190} rx={70} fill={`url(#${uid}-pod)`} stroke="#c6c6cc" strokeWidth={2} />
      <path d="M395 545h210" stroke="#bdbdc4" strokeWidth={3} />
      <circle cx={500} cy={600} r={7} fill="#34c759" />
      {[
        { x: 305, r: -14 },
        { x: 695, r: 14 },
      ].map(({ x, r }) => (
        <g key={x} transform={`rotate(${r} ${x} 400)`}>
          <rect x={x - 17} y={380} width={34} height={160} rx={17} fill={`url(#${uid}-pod)`} stroke="#c6c6cc" strokeWidth={2} />
          <circle cx={x} cy={360} r={52} fill={`url(#${uid}-pod)`} stroke="#c6c6cc" strokeWidth={2} />
          <circle cx={x} cy={372} r={22} fill="#8d8d95" opacity={0.55} />
        </g>
      ))}
    </Frame>
  );
}

function VisionArt({ label }: { label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <Frame label={label}>
      <defs>
        <linearGradient id={`${uid}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#3a3d4a" />
          <stop offset="0.5" stopColor="#0f1017" />
          <stop offset="1" stopColor="#3a3d4a" />
        </linearGradient>
      </defs>
      <path d="M300 440c-90 10-120 50-120 80M700 440c90 10 120 50 120 80" stroke="#d6d6da" strokeWidth={26} strokeLinecap="round" fill="none" />
      <rect x={290} y={380} width={420} height={200} rx={100} fill={`url(#${uid}-glass)`} stroke="#c8c8ce" strokeWidth={6} />
      <path d="M340 440c60-24 260-24 320 0" stroke="#fff" strokeOpacity={0.2} strokeWidth={4} fill="none" />
      <rect x={440} y={575} width={120} height={36} rx={18} fill="#d6d6da" />
    </Frame>
  );
}

function TvArt({ label }: { label?: string }) {
  return (
    <Frame label={label}>
      <rect x={340} y={470} width={320} height={110} rx={28} fill="#1c1c1f" stroke="#3a3a3f" strokeWidth={2} />
      <circle cx={500} cy={525} r={5} fill="#34c759" />
      <rect x={440} y={290} width={120} height={170} rx={30} fill="#c9c9ce" />
      <circle cx={500} cy={340} r={30} fill="#aeaeb4" />
    </Frame>
  );
}

function AirtagArt({ label }: { label?: string }) {
  return (
    <Frame label={label}>
      {[
        [370, 400],
        [630, 400],
        [370, 560],
        [630, 560],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={72} fill="#f4f4f6" stroke="#c9c9ce" strokeWidth={4} />
          <circle cx={cx} cy={cy} r={34} fill="#d7d7dc" />
          <circle cx={cx} cy={cy} r={12} fill="#f4f4f6" />
        </g>
      ))}
    </Frame>
  );
}

function ChargerArt({ label }: { label?: string }) {
  return (
    <Frame label={label}>
      <path d="M500 640c-60 40-220 20-250-60" stroke="#e6e6ea" strokeWidth={14} strokeLinecap="round" fill="none" />
      <circle cx={500} cy={470} r={130} fill="#f6f6f8" stroke="#c9c9ce" strokeWidth={3} />
      <circle cx={500} cy={470} r={96} fill="#e9e9ee" />
      <circle cx={500} cy={470} r={60} fill="none" stroke="#c4c4ca" strokeWidth={3} />
    </Frame>
  );
}

export function ProductArt({ id, label, holiday = "pink" }: ProductArtProps) {
  switch (id) {
    case "holiday":
      return <HolidayArt color={holiday} label={label} />;
    case "iphone-18-pro":
      return <Iphone18ProArt label={label} />;
    case "iphone-duo":
      return <IphoneDuoArt label={label} />;
    case "homeview":
      return <HomeviewArt label={label} />;
    case "ipad":
      return <IpadArt label={label} />;
    case "watch":
      return <WatchArt label={label} />;
    case "macbook-proled":
      return <MacbookProledArt label={label} />;
    case "macbook-m6":
      return <MacbookM6Art label={label} />;
    case "airpods":
      return <AirpodsArt label={label} />;
    case "vision":
      return <VisionArt label={label} />;
    case "tv":
      return <TvArt label={label} />;
    case "airtag":
      return <AirtagArt label={label} />;
    case "charger":
      return <ChargerArt label={label} />;
  }
}
