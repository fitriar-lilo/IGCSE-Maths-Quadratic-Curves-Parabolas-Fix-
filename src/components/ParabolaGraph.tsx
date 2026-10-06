import React, { useEffect, useState, useRef } from 'react';

export interface Point {
  x: number;
  y: number;
  label?: string;
  color?: string;
  visible?: boolean;
}

export interface LineSpec {
  type: 'horizontal' | 'vertical' | 'linear';
  value?: number; // for y = k or x = h
  m?: number;     // for y = mx + c
  c?: number;
  color?: string;
  dashed?: boolean;
  label?: string;
}

export interface ParabolaGraphProps {
  a?: number;
  b?: number;
  c?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  width?: number;
  height?: number;
  points?: Point[];
  animateCurve?: boolean;
  curveProgress?: number; // 0 to 1
  showRoots?: boolean;
  showVertex?: boolean;
  showYIntercept?: boolean;
  showSymmetry?: boolean;
  additionalLines?: LineSpec[];
  intersectPoints?: Point[];
  curveColor?: string;
  activeFeature?: 'roots' | 'vertex' | 'yIntercept' | 'symmetry' | null;
  speedMultiplier?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export const ParabolaGraph: React.FC<ParabolaGraphProps> = ({
  a = 1,
  b = -2,
  c = -3,
  xMin = -3.5,
  xMax = 5.5,
  yMin = -6.5,
  yMax = 7.5,
  points = [],
  animateCurve = false,
  curveProgress = 1,
  showRoots = false,
  showVertex = false,
  showYIntercept = false,
  showSymmetry = false,
  additionalLines = [],
  intersectPoints = [],
  curveColor = '#38bdf8',
  activeFeature = null,
  speedMultiplier = 1,
  onAnimationComplete,
  className = '',
}) => {
  const svgWidth = 560;
  const svgHeight = 440;
  const padding = { left: 45, right: 35, top: 30, bottom: 40 };

  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  // Coordinate transforms
  const toSvgX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => padding.top + ((yMax - y) / (yMax - yMin)) * plotH;

  const [animProgress, setAnimProgress] = useState(animateCurve ? 0 : curveProgress);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animateCurve) {
      setAnimProgress(curveProgress);
      return;
    }

    setAnimProgress(0);
    const duration = 3500 / Math.max(speedMultiplier, 0.2); // Slow, 3.5 seconds
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Gentle cubic easeInOut
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setAnimProgress(eased);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        if (onAnimationComplete) onAnimationComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animateCurve, a, b, c, speedMultiplier]);

  // Generate grid ticks
  const xTicks: number[] = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    xTicks.push(x);
  }

  const yTicks: number[] = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    yTicks.push(y);
  }

  // Calculate curve points
  const numSteps = 160;
  const stepSize = (xMax - xMin) / numSteps;
  const fullPoints: [number, number][] = [];
  for (let i = 0; i <= numSteps; i++) {
    const xVal = xMin + i * stepSize;
    const yVal = a * xVal * xVal + b * xVal + c;
    fullPoints.push([toSvgX(xVal), toSvgY(yVal)]);
  }

  // Path data for the curve
  const pathData = fullPoints.reduce((acc, [px, py], idx) => {
    return idx === 0 ? `M ${px.toFixed(2)} ${py.toFixed(2)}` : `${acc} L ${px.toFixed(2)} ${py.toFixed(2)}`;
  }, '');

  // Calculate Key Quadratic Features
  // Vertex
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);
  const isMin = a > 0;

  // Roots
  const disc = b * b - 4 * a * c;
  const roots: number[] = [];
  if (disc >= 0 && a !== 0) {
    const r1 = (-b - Math.sqrt(disc)) / (2 * a);
    const r2 = (-b + Math.sqrt(disc)) / (2 * a);
    roots.push(Math.min(r1, r2), Math.max(r1, r2));
  }

  // Y-intercept
  const yIntX = 0;
  const yIntY = c;

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  return (
    <div className={`relative w-full max-w-[560px] mx-auto select-none ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-visible backdrop-blur-md"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="gridSub" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
          {/* Arrow markers */}
          <marker id="arrow-axis" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
          </marker>
          {/* Glow filter */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-coral" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Clip path for curve animation */}
          <clipPath id="curve-clip">
            <rect
              x={padding.left - 5}
              y={padding.top - 5}
              width={(plotW + 10) * animProgress}
              height={plotH + 10}
            />
          </clipPath>
        </defs>

        {/* Background Subgrid */}
        <rect x={padding.left} y={padding.top} width={plotW} height={plotH} fill="url(#gridSub)" />

        {/* Major Grid Lines */}
        {xTicks.map((x) => (
          <line
            key={`grid-x-${x}`}
            x1={toSvgX(x)}
            y1={padding.top}
            x2={toSvgX(x)}
            y2={padding.top + plotH}
            stroke={x === 0 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(255, 255, 255, 0.08)'}
            strokeWidth={x === 0 ? 1.5 : 0.75}
          />
        ))}
        {yTicks.map((y) => (
          <line
            key={`grid-y-${y}`}
            x1={padding.left}
            y1={toSvgY(y)}
            x2={padding.left + plotW}
            y2={toSvgY(y)}
            stroke={y === 0 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(255, 255, 255, 0.08)'}
            strokeWidth={y === 0 ? 1.5 : 0.75}
          />
        ))}

        {/* Axes */}
        {/* X-axis */}
        <line
          x1={padding.left - 10}
          y1={originY}
          x2={padding.left + plotW + 15}
          y2={originY}
          stroke="#cbd5e1"
          strokeWidth="2"
          markerEnd="url(#arrow-axis)"
        />
        {/* Y-axis */}
        <line
          x1={originX}
          y1={padding.top + plotH + 10}
          x2={originX}
          y2={padding.top - 15}
          stroke="#cbd5e1"
          strokeWidth="2"
          markerEnd="url(#arrow-axis)"
        />

        {/* Axis Labels */}
        <text
          x={padding.left + plotW + 24}
          y={originY + 4}
          fill="#38bdf8"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Poppins"
        >
          x
        </text>
        <text
          x={originX - 4}
          y={padding.top - 20}
          fill="#38bdf8"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Poppins"
        >
          y
        </text>

        {/* Tick numbers */}
        {xTicks
          .filter((x) => x !== 0)
          .map((x) => (
            <text
              key={`tick-x-${x}`}
              x={toSvgX(x)}
              y={originY + 16}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
            >
              {x}
            </text>
          ))}
        {yTicks
          .filter((y) => y !== 0)
          .map((y) => (
            <text
              key={`tick-y-${y}`}
              x={originX - 10}
              y={toSvgY(y) + 4}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
            >
              {y}
            </text>
          ))}
        <text
          x={originX - 10}
          y={originY + 14}
          textAnchor="end"
          fill="#64748b"
          fontSize="11"
          fontFamily="JetBrains Mono, monospace"
        >
          0
        </text>

        {/* Additional lines (e.g. y = k or y = mx + c) */}
        {additionalLines.map((line, idx) => {
          if (line.type === 'horizontal' && line.value !== undefined) {
            const ly = toSvgY(line.value);
            return (
              <g key={`add-line-${idx}`}>
                <line
                  x1={padding.left}
                  y1={ly}
                  x2={padding.left + plotW}
                  y2={ly}
                  stroke={line.color || '#ec4899'}
                  strokeWidth="2.5"
                  strokeDasharray={line.dashed ? '6,4' : undefined}
                />
                {line.label && (
                  <rect
                    x={padding.left + 8}
                    y={ly - 22}
                    width={line.label.length * 8 + 16}
                    height="18"
                    rx="4"
                    fill="#1e1b4b"
                    stroke={line.color || '#ec4899'}
                    strokeWidth="1"
                  />
                )}
                {line.label && (
                  <text
                    x={padding.left + 16}
                    y={ly - 9}
                    fill={line.color || '#f472b6'}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {line.label}
                  </text>
                )}
              </g>
            );
          }
          if (line.type === 'linear' && line.m !== undefined && line.c !== undefined) {
            const x1 = xMin;
            const y1 = line.m * x1 + line.c;
            const x2 = xMax;
            const y2 = line.m * x2 + line.c;
            return (
              <g key={`add-linear-${idx}`}>
                <line
                  x1={toSvgX(x1)}
                  y1={toSvgY(y1)}
                  x2={toSvgX(x2)}
                  y2={toSvgY(y2)}
                  stroke={line.color || '#ec4899'}
                  strokeWidth="2.5"
                  strokeDasharray={line.dashed ? '6,4' : undefined}
                />
                {line.label && (
                  <text
                    x={toSvgX(2)}
                    y={toSvgY(line.m * 2 + line.c) - 10}
                    fill={line.color || '#f472b6'}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {line.label}
                  </text>
                )}
              </g>
            );
          }
          return null;
        })}

        {/* Line of Symmetry (Purple dashed) */}
        {(showSymmetry || activeFeature === 'symmetry') && (
          <g className="transition-opacity duration-500">
            <line
              x1={toSvgX(vertexX)}
              y1={padding.top}
              x2={toSvgX(vertexX)}
              y2={padding.top + plotH}
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="6,5"
            />
            <rect
              x={toSvgX(vertexX) - 34}
              y={padding.top + 6}
              width="68"
              height="22"
              rx="6"
              fill="#3b0764"
              stroke="#c084fc"
              strokeWidth="1"
            />
            <text
              x={toSvgX(vertexX)}
              y={padding.top + 21}
              textAnchor="middle"
              fill="#e9d5ff"
              fontSize="11"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              x = {vertexX % 1 === 0 ? vertexX : vertexX.toFixed(1)}
            </text>
          </g>
        )}

        {/* The Parabola Curve */}
        <g clipPath="url(#curve-clip)">
          <path
            d={pathData}
            fill="none"
            stroke={curveColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow-cyan)"
          />
        </g>

        {/* Turning Point (Vertex) - Gold / Yellow */}
        {(showVertex || activeFeature === 'vertex') && (
          <g className="transition-all duration-300">
            {/* Pulsing ring */}
            <circle
              cx={toSvgX(vertexX)}
              cy={toSvgY(vertexY)}
              r="14"
              fill="rgba(245, 158, 11, 0.25)"
              className="animate-ping"
            />
            <circle
              cx={toSvgX(vertexX)}
              cy={toSvgY(vertexY)}
              r="7"
              fill="#fbbf24"
              stroke="#78350f"
              strokeWidth="2.5"
              filter="url(#glow-gold)"
            />
            {/* Label box */}
            <rect
              x={toSvgX(vertexX) - 45}
              y={isMin ? toSvgY(vertexY) + 12 : toSvgY(vertexY) - 34}
              width="90"
              height="22"
              rx="6"
              fill="#451a03"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text
              x={toSvgX(vertexX)}
              y={isMin ? toSvgY(vertexY) + 27 : toSvgY(vertexY) - 19}
              textAnchor="middle"
              fill="#fef3c7"
              fontSize="11"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              ({vertexX % 1 === 0 ? vertexX : vertexX.toFixed(1)}, {vertexY % 1 === 0 ? vertexY : vertexY.toFixed(1)})
            </text>
          </g>
        )}

        {/* Roots (Coral / Red) */}
        {(showRoots || activeFeature === 'roots') &&
          roots.map((r, idx) => (
            <g key={`root-${idx}`}>
              <circle
                cx={toSvgX(r)}
                cy={toSvgY(0)}
                r="12"
                fill="rgba(244, 63, 94, 0.2)"
                className="animate-pulse"
              />
              <circle
                cx={toSvgX(r)}
                cy={toSvgY(0)}
                r="6.5"
                fill="#f43f5e"
                stroke="#881337"
                strokeWidth="2"
                filter="url(#glow-coral)"
              />
              <rect
                x={toSvgX(r) - 32}
                y={toSvgY(0) - (isMin ? 30 : -10)}
                width="64"
                height="20"
                rx="5"
                fill="#4c0519"
                stroke="#fb7185"
                strokeWidth="1"
              />
              <text
                x={toSvgX(r)}
                y={toSvgY(0) - (isMin ? 16 : -24)}
                textAnchor="middle"
                fill="#ffe4e6"
                fontSize="11"
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
              >
                ({r % 1 === 0 ? r : r.toFixed(1)}, 0)
              </text>
            </g>
          ))}

        {/* Y-intercept (Green) */}
        {(showYIntercept || activeFeature === 'yIntercept') && (
          <g>
            <circle
              cx={toSvgX(yIntX)}
              cy={toSvgY(yIntY)}
              r="12"
              fill="rgba(16, 185, 129, 0.25)"
              className="animate-pulse"
            />
            <circle
              cx={toSvgX(yIntX)}
              cy={toSvgY(yIntY)}
              r="6"
              fill="#10b981"
              stroke="#064e3b"
              strokeWidth="2"
            />
            <rect
              x={toSvgX(yIntX) + 12}
              y={toSvgY(yIntY) - 10}
              width="60"
              height="20"
              rx="5"
              fill="#064e3b"
              stroke="#34d399"
              strokeWidth="1"
            />
            <text
              x={toSvgX(yIntX) + 42}
              y={toSvgY(yIntY) + 4}
              textAnchor="middle"
              fill="#d1fae5"
              fontSize="11"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              (0, {yIntY})
            </text>
          </g>
        )}

        {/* Intersection Points (e.g. for solving equations) */}
        {intersectPoints.map((pt, idx) => (
          <g key={`intersect-${idx}`}>
            {/* Dotted drop line to x-axis */}
            <line
              x1={toSvgX(pt.x)}
              y1={toSvgY(pt.y)}
              x2={toSvgX(pt.x)}
              y2={originY}
              stroke="#ec4899"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Dot at intersection */}
            <circle
              cx={toSvgX(pt.x)}
              cy={toSvgY(pt.y)}
              r="6.5"
              fill="#ec4899"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Dot on x-axis */}
            <circle
              cx={toSvgX(pt.x)}
              cy={originY}
              r="5"
              fill="#ec4899"
            />
            <rect
              x={toSvgX(pt.x) - 24}
              y={originY + 20}
              width="48"
              height="20"
              rx="4"
              fill="#831843"
              stroke="#f472b6"
              strokeWidth="1"
            />
            <text
              x={toSvgX(pt.x)}
              y={originY + 34}
              textAnchor="middle"
              fill="#fdf2f8"
              fontSize="11"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              x = {pt.x % 1 === 0 ? pt.x : pt.x.toFixed(1)}
            </text>
          </g>
        ))}

        {/* User plotted points (from Table of Values) */}
        {points
          .filter((p) => p.visible !== false)
          .map((p, idx) => (
            <g key={`pt-${idx}`} className="transition-transform duration-300">
              <circle
                cx={toSvgX(p.x)}
                cy={toSvgY(p.y)}
                r="7"
                fill={p.color || '#38bdf8'}
                stroke="#ffffff"
                strokeWidth="2"
                filter="url(#glow-cyan)"
              />
              <text
                x={toSvgX(p.x)}
                y={toSvgY(p.y) - 10}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="10"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                ({p.x}, {p.y})
              </text>
            </g>
          ))}
      </svg>
    </div>
  );
};
