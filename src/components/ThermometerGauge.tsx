import { useEffect, useState } from "react";

interface ThermometerGaugeProps {
  score?: number; // -100 to +100
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  animated?: boolean;
}

const POSITIONS = [
  { label: "Extrema Esquerda", color: "#8B0000", range: [-100, -80] },
  { label: "Esquerda", color: "#E74C3C", range: [-80, -60] },
  { label: "Centro-Esquerda", color: "#E67E22", range: [-60, -20] },
  { label: "Centro", color: "#F1C40F", range: [-20, 20] },
  { label: "Centro-Direita", color: "#82E0AA", range: [20, 60] },
  { label: "Direita", color: "#2E86C1", range: [60, 80] },
  { label: "Extrema Direita", color: "#1A237E", range: [80, 100] },
];

function getPositionLabel(score: number) {
  for (const pos of POSITIONS) {
    if (score >= pos.range[0] && score <= pos.range[1]) return pos;
  }
  return POSITIONS[3]; // Centro
}

function scoreToAngle(score: number): number {
  // Map -100..+100 to -90..+90 degrees
  return (score / 100) * 90;
}

const sizeMap = { sm: 160, md: 240, lg: 320 };

export default function ThermometerGauge({
  score = 0,
  size = "md",
  showLabels = true,
  animated = true,
}: ThermometerGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const dim = sizeMap[size];
  const cx = dim / 2;
  const cy = dim * 0.52;
  const radius = dim * 0.38;
  const strokeWidth = dim * 0.08;
  const viewH = cy + dim * 0.08;

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(from + (score - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, animated]);

  const position = getPositionLabel(displayScore);
  const needleAngle = scoreToAngle(displayScore);

  // Arc path for the gauge background
  const arcPath = (startAngle: number, endAngle: number) => {
    const startRad = ((startAngle - 180) * Math.PI) / 180;
    const endRad = ((endAngle - 180) * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const segments = POSITIONS.map((pos, i) => {
    const totalRange = 200;
    const segStart = ((pos.range[0] + 100) / totalRange) * 180;
    const segEnd = ((pos.range[1] + 100) / totalRange) * 180;
    return (
      <path
        key={i}
        d={arcPath(segStart, segEnd)}
        fill="none"
        stroke={pos.color}
        strokeWidth={strokeWidth}
        strokeLinecap={i === 0 ? "round" : i === POSITIONS.length - 1 ? "round" : "butt"}
      />
    );
  });

  const needleRad = ((needleAngle - 0) * Math.PI) / 180;
  const needleLen = radius * 0.75;
  const nx = cx + needleLen * Math.cos(Math.PI + (needleAngle * Math.PI) / 180 + Math.PI / 2);
  const ny = cy + needleLen * Math.sin(Math.PI + (needleAngle * Math.PI) / 180 + Math.PI / 2);

  // Needle angle: map -90..+90 to the semicircle
  const needleRotation = needleAngle; // -90 = full left, +90 = full right

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={dim} height={viewH} viewBox={`0 0 ${dim} ${viewH}`}>
        {/* Gauge segments */}
        {segments}

        {/* Needle */}
        <g
          transform={`rotate(${needleRotation}, ${cx}, ${cy})`}
          style={{ transition: animated ? "none" : "transform 0.5s ease" }}
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - radius * 0.75}
            stroke="#FBBF24"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={dim * 0.025} fill="hsl(var(--foreground))" />
      </svg>

      {showLabels && (
        <div className="text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: position.color + "20",
              color: position.color,
              border: `1px solid ${position.color}40`,
            }}
          >
            {position.label}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Score: {Math.round(displayScore)}
          </p>
        </div>
      )}
    </div>
  );
}
