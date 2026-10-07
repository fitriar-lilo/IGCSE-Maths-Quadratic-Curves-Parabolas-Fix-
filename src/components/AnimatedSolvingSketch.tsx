import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MathView } from './MathView';
import { Point, LineSpec } from './ParabolaGraph';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  Crosshair,
  Pencil,
  CheckCircle2,
  HelpCircle,
  Zap,
  Eye,
  Maximize2
} from 'lucide-react';

export interface AnimatedSolvingSketchProps {
  equation: string;
  component1: string;
  component2: string;
  curveA: number;
  curveB: number;
  curveC: number;
  line: LineSpec;
  mValue: number;
  dValue: number;
  intersections: Point[];
  explanationLaTeX: string;
}

export const AnimatedSolvingSketch: React.FC<AnimatedSolvingSketchProps> = ({
  equation,
  component1,
  component2,
  curveA,
  curveB,
  curveC,
  line,
  mValue,
  dValue,
  intersections,
  explanationLaTeX,
}) => {
  // 1 = Break into components, 2 = Sketch parabola, 3 = Sketch line, 4 = Show intersection & solutions
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [curveProgress, setCurveProgress] = useState<number>(1);
  const [lineProgress, setLineProgress] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Linear line sketch visualization toggles - defaults to clear, clean line
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [showGuidePoints, setShowGuidePoints] = useState<boolean>(false);
  const [showGradientTriangle, setShowGradientTriangle] = useState<boolean>(false);

  const animRef = useRef<number | null>(null);

  // Graph dimensions
  const svgWidth = 560;
  const svgHeight = 440;
  const padding = { left: 45, right: 35, top: 30, bottom: 40 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  const xMin = -3.5;
  const xMax = 5.5;
  const yMin = -6.5;
  const yMax = 7.5;

  const toSvgX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => padding.top + ((yMax - y) / (yMax - yMin)) * plotH;
  const originX = toSvgX(0);
  const originY = toSvgY(0);

  // Effective linear parameters
  const effectiveM = line.type === 'horizontal' ? 0 : (line.m ?? mValue);
  const effectiveD = line.type === 'horizontal' ? (line.value ?? dValue) : (line.c ?? dValue);

  // Generate full curve points
  const numSteps = 160;
  const stepSize = (xMax - xMin) / numSteps;
  const allCurvePoints: [number, number, number][] = []; // [svgX, svgY, mathX]
  for (let i = 0; i <= numSteps; i++) {
    const xVal = xMin + i * stepSize;
    const yVal = curveA * xVal * xVal + curveB * xVal + curveC;
    allCurvePoints.push([toSvgX(xVal), toSvgY(yVal), xVal]);
  }

  // Linear points
  const getLineY = (x: number) => effectiveM * x + effectiveD;

  const lineStartSvgX = toSvgX(xMin);
  const lineStartSvgY = toSvgY(getLineY(xMin));
  const lineEndSvgX = toSvgX(xMax);
  const lineEndSvgY = toSvgY(getLineY(xMax));

  // Geometry for ruler
  const deltaX = lineEndSvgX - lineStartSvgX;
  const deltaY = lineEndSvgY - lineStartSvgY;
  const rulerLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const rulerAngleDeg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  // 3 Guide Points for sketching the linear line
  const linearGuidePoints = useMemo(() => {
    let xCoords: number[] = [];
    if (line.type === 'horizontal') {
      xCoords = [-2, 0, 4];
    } else if (effectiveM === 1) {
      xCoords = [0, 2, 4];
    } else if (effectiveM === -1) {
      xCoords = [0, 1, 3];
    } else {
      xCoords = [-1, 0, 2];
    }

    return xCoords.map((x) => {
      const y = effectiveM * x + effectiveD;
      return {
        x,
        y: Math.round(y * 10) / 10,
        svgX: toSvgX(x),
        svgY: toSvgY(y),
        isYIntercept: x === 0,
      };
    });
  }, [line.type, effectiveM, effectiveD, plotW, plotH]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    let timer: NodeJS.Timeout;

    if (step === 1) {
      setCurveProgress(0);
      setLineProgress(0);
      timer = setTimeout(() => {
        setStep(2);
      }, 2200 / playbackSpeed);
    } else if (step === 2) {
      let start = performance.now();
      const duration = 2200 / playbackSpeed;
      const animateCurve = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        setCurveProgress(p);
        if (p < 1) {
          animRef.current = requestAnimationFrame(animateCurve);
        } else {
          timer = setTimeout(() => {
            setStep(3);
          }, 800 / playbackSpeed);
        }
      };
      animRef.current = requestAnimationFrame(animateCurve);
    } else if (step === 3) {
      setCurveProgress(1);
      setLineProgress(0);
      let start = performance.now();
      const duration = 1800 / playbackSpeed;
      const animateLine = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        setLineProgress(p);
        if (p < 1) {
          animRef.current = requestAnimationFrame(animateLine);
        } else {
          timer = setTimeout(() => {
            setStep(4);
          }, 900 / playbackSpeed);
        }
      };
      animRef.current = requestAnimationFrame(animateLine);
    } else if (step === 4) {
      setCurveProgress(1);
      setLineProgress(1);
      timer = setTimeout(() => {
        setIsPlaying(false);
      }, 2000 / playbackSpeed);
    }

    return () => {
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [step, isPlaying, playbackSpeed]);

  const animateLinearLineOnly = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setLineProgress(0);
    const start = performance.now();
    const duration = 1600 / playbackSpeed;
    const stepFn = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      setLineProgress(p);
      if (p < 1) {
        animRef.current = requestAnimationFrame(stepFn);
      }
    };
    animRef.current = requestAnimationFrame(stepFn);
  };

  const handleStepSelect = (newStep: 1 | 2 | 3 | 4) => {
    setIsPlaying(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setStep(newStep);
    if (newStep === 1) {
      setCurveProgress(0);
      setLineProgress(0);
    } else if (newStep === 2) {
      setCurveProgress(1);
      setLineProgress(0);
    } else if (newStep === 3) {
      setCurveProgress(1);
      // Trigger smooth animated sketch of the linear line
      animateLinearLineOnly();
    } else if (newStep === 4) {
      setCurveProgress(1);
      setLineProgress(1);
    }
  };

  const handleReplay = () => {
    handleStepSelect(1);
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  // Vertex
  const vertexX = -curveB / (2 * curveA);
  const vertexY = curveC - (curveB * curveB) / (4 * curveA);

  // Sliced points for drawing curve
  const visibleCount = Math.max(2, Math.floor(allCurvePoints.length * (step === 2 ? curveProgress : step >= 3 ? 1 : 0)));
  const visibleCurvePoints = allCurvePoints.slice(0, visibleCount);
  const curvePathData =
    visibleCurvePoints.length > 1
      ? visibleCurvePoints.reduce((acc, [px, py], idx) => {
          return idx === 0 ? `M ${px.toFixed(2)} ${py.toFixed(2)}` : `${acc} L ${px.toFixed(2)} ${py.toFixed(2)}`;
        }, '')
      : '';

  const penPos = visibleCurvePoints.length > 0 ? visibleCurvePoints[visibleCurvePoints.length - 1] : null;

  // Linear current endpoint
  const currentLineEndSvgX = lineStartSvgX + (lineEndSvgX - lineStartSvgX) * (step === 3 ? lineProgress : step === 4 ? 1 : 0);
  const currentLineEndSvgY = lineStartSvgY + (lineEndSvgY - lineStartSvgY) * (step === 3 ? lineProgress : step === 4 ? 1 : 0);

  // Ticks
  const xTicks: number[] = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) xTicks.push(x);
  const yTicks: number[] = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) yTicks.push(y);

  // Ruler tick marks array
  const rulerTicks = useMemo(() => {
    const ticks: number[] = [];
    const stepPx = 16;
    for (let pos = 10; pos < rulerLength - 10; pos += stepPx) {
      ticks.push(pos);
    }
    return ticks;
  }, [rulerLength]);

  return (
    <div className="space-y-4 rounded-3xl bg-slate-900/90 border border-slate-800 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
      {/* Title & Speed Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <span>Interactive Step-by-Step Sketch Animator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300">
                Step {step} of 4
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Watch how <MathView math={equation} /> is decomposed into two graphs and solved via intersections.
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          <button
            onClick={handleReplay}
            title="Restart Animation from Step 1"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-[11px] font-mono text-slate-400">
            {[1, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  playbackSpeed === spd ? 'bg-cyan-900/60 text-cyan-200 font-bold' : 'hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Progress Navigation Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => handleStepSelect(1)}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            step === 1
              ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-0.5">
            <span className={step === 1 ? 'text-cyan-300 font-bold' : 'text-slate-500'}>Step 1</span>
            {step > 1 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </div>
          <div className="text-xs font-semibold">Break Equation</div>
          <div className="text-[10px] text-slate-400 truncate">Split into 2 Components</div>
        </button>

        <button
          onClick={() => handleStepSelect(2)}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            step === 2
              ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-0.5">
            <span className={step === 2 ? 'text-cyan-300 font-bold' : 'text-slate-500'}>Step 2</span>
            {step > 2 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </div>
          <div className="text-xs font-semibold text-cyan-200">Sketch Parabola</div>
          <div className="text-[10px] text-slate-400 truncate">Freehand Component 1</div>
        </button>

        <button
          onClick={() => handleStepSelect(3)}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            step === 3
              ? 'bg-pink-950/70 border-pink-400 text-white shadow-md ring-1 ring-pink-400'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-0.5">
            <span className={step === 3 ? 'text-pink-300 font-bold' : 'text-slate-500'}>Step 3</span>
            {step > 3 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </div>
          <div className="text-xs font-semibold text-pink-200">Sketch Linear Line</div>
          <div className="text-[10px] text-pink-300 font-medium truncate">Points & Ruler Line</div>
        </button>

        <button
          onClick={() => handleStepSelect(4)}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            step === 4
              ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-0.5">
            <span className={step === 4 ? 'text-emerald-300 font-bold' : 'text-slate-500'}>Step 4</span>
            {step === 4 && <Sparkles className="w-3 h-3 text-amber-300" />}
          </div>
          <div className="text-xs font-semibold text-emerald-200">Find Intersections</div>
          <div className="text-[10px] text-slate-400 truncate">Read x-coordinates</div>
        </button>
      </div>

      {/* Dynamic Pedagogical Explanation for Active Step */}
      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs md:text-sm">
        {step === 1 && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Step 1: Break <MathView math={equation} /> into Two Components</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              We separate the equation into two visual components by setting each side equal to <MathView math="y" />:
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 font-mono font-bold text-xs">
                Component 1: <MathView math={component1} /> (Curve)
              </span>
              <span className="text-slate-400 font-bold">&</span>
              <span className="px-3 py-1.5 rounded-xl bg-pink-950/80 border border-pink-500/60 text-pink-200 font-mono font-bold text-xs">
                Component 2: <MathView math={component2} /> (Straight Line)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              When both graphs have identical <MathView math="y" />-values, their <MathView math="x" />-values satisfy the equation!
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Pencil className="w-4 h-4 text-cyan-400" />
              <span>Step 2: Sketch Component 1 (<MathView math={component1} />)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Construct a table of values and draw a <strong>smooth freehand parabolic curve</strong> through the points. 
              The curve is {curveA > 0 ? 'a U-shape (minimum)' : 'an n-shape (maximum)'} with vertex at{' '}
              <span className="font-mono text-cyan-300">
                ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
              </span>.
            </p>
          </div>
        )}

        {/* STEP 3: DETAILED SKETCH OF THE LINEAR LINE */}
        {step === 3 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 text-pink-300 font-bold">
                <Pencil className="w-4 h-4 text-pink-400" />
                <span>Step 3: Sketching the Linear Line (<MathView math={component2} />)</span>
                <button
                  onClick={animateLinearLineOnly}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-[11px] shadow-sm cursor-pointer transition-all ml-2"
                  title="Replay drawing animation of the linear line"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>▶ Replay Line Sketch</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    setShowGuidePoints(false);
                    setShowRuler(false);
                    setShowGradientTriangle(false);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-all ${
                    !showGuidePoints && !showRuler && !showGradientTriangle
                      ? 'bg-rose-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  ✨ Clear Line Only (Clean)
                </button>
                <button
                  onClick={() => setShowGuidePoints(!showGuidePoints)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-all ${
                    showGuidePoints ? 'bg-pink-900/60 text-pink-200 border border-pink-700' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {showGuidePoints ? '✓ Guide Points (×)' : '+ Guide Points'}
                </button>
                <button
                  onClick={() => setShowRuler(!showRuler)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-all ${
                    showRuler ? 'bg-amber-900/60 text-amber-200 border border-amber-700' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {showRuler ? '✓ Straight Ruler' : '+ Ruler'}
                </button>
                {effectiveM !== 0 && (
                  <button
                    onClick={() => setShowGradientTriangle(!showGradientTriangle)}
                    className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-all ${
                      showGradientTriangle ? 'bg-teal-900/60 text-teal-200 border border-teal-700' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {showGradientTriangle ? '✓ Slope Triangle' : '+ Slope Triangle'}
                  </button>
                )}
              </div>
            </div>

            {/* Clear Line Technique Banner */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-950/50 to-slate-900 border border-pink-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-pink-200">
                <span className="text-sm">📏</span>
                <span>
                  <strong>Clear Line Technique:</strong> Draw a single, sharp, continuous straight line across the grid with a ruler. A clean, clear line is essential for accurately reading intersection solutions.
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-900/80 text-pink-200 border border-pink-700/60 shrink-0">
                CLEAR LINE ACTIVE
              </span>
            </div>

            {/* Linear Line Plotting Guide Table */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-7 space-y-1.5">
                <p className="text-slate-200 text-xs leading-relaxed">
                  To sketch the straight line <strong className="text-pink-300 font-mono">{component2}</strong>:
                </p>
                <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside">
                  <li>
                    Plot 2 or 3 guide points with a pencil (starting with the <MathView math="y" />-intercept at <span className="font-mono text-pink-300 font-bold">(0, {effectiveD})</span>).
                  </li>
                  <li>
                    Lay your <strong>straight ruler</strong> precisely along the plotted points.
                  </li>
                  <li>
                    Draw the continuous straight line across the full grid and label it <strong className="font-mono text-pink-300">{component2}</strong>.
                  </li>
                </ol>
              </div>

              {/* Guide Points Table */}
              <div className="md:col-span-5 p-2 rounded-xl bg-slate-900/90 border border-pink-900/50 text-center">
                <span className="text-[10px] uppercase font-bold text-pink-400 block tracking-wider mb-1">
                  Linear Guide Points ({component2})
                </span>
                <table className="w-full text-center text-[11px] border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="p-1">x</th>
                      {linearGuidePoints.map((pt, idx) => (
                        <th key={idx} className="p-1 text-pink-300">{pt.x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-white font-bold">
                      <td className="p-1 text-slate-400">y</td>
                      {linearGuidePoints.map((pt, idx) => (
                        <td key={idx} className="p-1 text-amber-300">{pt.y}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="text-[10px] text-slate-400 mt-1">
                  Gradient <MathView math={`m = ${effectiveM}`} /> · Intercept <MathView math={`d = ${effectiveD}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Step 4: Intersections are the Solutions!</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              The <strong className="text-amber-300">meeting points</strong> where the curve meets the straight line give the solutions.
              Drop vertical dashed guidelines straight down to the <MathView math="x" />-axis to read off:
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-white font-mono font-bold text-center">
              <MathView math={explanationLaTeX} />
            </div>
          </div>
        )}
      </div>

      {/* SVG Animated Canvas */}
      <div className="relative w-full max-w-[560px] mx-auto select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-inner overflow-visible"
        >
          <defs>
            <pattern id="gridAnim" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <marker id="arrow-axis-anim" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
            </marker>
            {/* Linear Line Clear Arrowheads */}
            <marker id="arrow-linear-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 8 1.5 L 0 5 L 8 8.5 z" fill="#f43f5e" />
            </marker>
            <marker id="arrow-linear-end" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
            </marker>
            <clipPath id="sketch-plot-clip">
              <rect x={padding.left} y={padding.top} width={plotW} height={plotH} />
            </clipPath>
            <filter id="glow-cyan-anim" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-pink-anim" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect x={padding.left} y={padding.top} width={plotW} height={plotH} fill="url(#gridAnim)" />

          {/* Coordinate grid lines */}
          {xTicks.map((x) => (
            <line
              key={`x-grid-${x}`}
              x1={toSvgX(x)}
              y1={padding.top}
              x2={toSvgX(x)}
              y2={padding.top + plotH}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          ))}
          {yTicks.map((y) => (
            <line
              key={`y-grid-${y}`}
              x1={padding.left}
              y1={toSvgY(y)}
              x2={padding.left + plotW}
              y2={toSvgY(y)}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          ))}

          {/* Main X Axis */}
          <line
            x1={padding.left - 10}
            y1={originY}
            x2={padding.left + plotW + 15}
            y2={originY}
            stroke="#cbd5e1"
            strokeWidth="2"
            markerEnd="url(#arrow-axis-anim)"
          />
          <text x={padding.left + plotW + 22} y={originY + 4} fill="#cbd5e1" fontSize="12" fontWeight="bold">
            x
          </text>

          {/* Main Y Axis */}
          <line
            x1={originX}
            y1={padding.top + plotH + 10}
            x2={originX}
            y2={padding.top - 15}
            stroke="#cbd5e1"
            strokeWidth="2"
            markerEnd="url(#arrow-axis-anim)"
          />
          <text x={originX - 4} y={padding.top - 20} fill="#cbd5e1" fontSize="12" fontWeight="bold">
            y
          </text>

          {/* Tick numbers */}
          {xTicks
            .filter((x) => x !== 0)
            .map((x) => (
              <text
                key={`xtick-${x}`}
                x={toSvgX(x)}
                y={originY + 14}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {x}
              </text>
            ))}
          {yTicks
            .filter((y) => y !== 0)
            .map((y) => (
              <text
                key={`ytick-${y}`}
                x={originX - 8}
                y={toSvgY(y) + 3}
                textAnchor="end"
                fill="#64748b"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {y}
              </text>
            ))}

          {/* Origin zero */}
          <text x={originX - 8} y={originY + 12} fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">
            0
          </text>

          {/* STEP 2+: Render Component 1 (Parabola) */}
          {step >= 2 && curvePathData && (
            <g>
              <path
                d={curvePathData}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-cyan-anim)"
              />

              {/* Animated pen cursor at the leading edge of drawing curve */}
              {step === 2 && penPos && curveProgress < 1 && (
                <g transform={`translate(${penPos[0]}, ${penPos[1]})`}>
                  <circle r="7" fill="#38bdf8" className="animate-ping" />
                  <circle r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  <rect x="8" y="-18" width="55" height="18" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
                  <text x="35" y="-6" fill="#e0f2fe" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                    x={penPos[2].toFixed(1)}
                  </text>
                </g>
              )}

              {/* Component 1 Badge on curve */}
              {(step >= 3 || (step === 2 && curveProgress >= 0.9)) && (
                <g transform={`translate(${toSvgX(vertexX) - 50}, ${toSvgY(vertexY) + (curveA > 0 ? 28 : -32)})`}>
                  <rect width="100" height="20" rx="5" fill="#082f49" stroke="#0ea5e9" strokeWidth="1" />
                  <text x="50" y="14" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
                    y = ax² + bx + c
                  </text>
                </g>
              )}
            </g>
          )}

          {/* STEP 3+: SKETCH OF LINEAR LINE */}
          {step >= 3 && (
            <g>
              {/* Optional: Straightedge Ruler Overlay along the line angle */}
              {showRuler && (
                <g transform={`translate(${lineStartSvgX}, ${lineStartSvgY}) rotate(${rulerAngleDeg})`}>
                  {/* Ruler body */}
                  <rect
                    x="0"
                    y="-22"
                    width={rulerLength}
                    height="22"
                    fill="rgba(251, 191, 36, 0.12)"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="8,4"
                    rx="3"
                  />
                  {/* Ruler millimeter graduation marks */}
                  {rulerTicks.map((tX) => (
                    <line key={tX} x1={tX} y1="0" x2={tX} y2="-6" stroke="#fbbf24" strokeWidth="1" />
                  ))}
                  <text x={rulerLength / 2} y="-10" fill="#fde68a" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                    RULER STRAIGHTEDGE: {component2}
                  </text>
                </g>
              )}

              {/* Optional: Gradient Slope Triangle for slanted lines */}
              {showGradientTriangle && effectiveM !== 0 && linearGuidePoints.length >= 2 && (
                <g>
                  {/* Triangle between guide point 0 and guide point 1 */}
                  {(() => {
                    const p1 = linearGuidePoints[0];
                    const p2 = linearGuidePoints[1];
                    const cornerX = p2.svgX;
                    const cornerY = p1.svgY;
                    return (
                      <g opacity="0.85">
                        <polygon
                          points={`${p1.svgX},${p1.svgY} ${cornerX},${cornerY} ${p2.svgX},${p2.svgY}`}
                          fill="rgba(236, 72, 153, 0.08)"
                        />
                        {/* Run line (horizontal) */}
                        <line
                          x1={p1.svgX}
                          y1={p1.svgY}
                          x2={cornerX}
                          y2={cornerY}
                          stroke="#a855f7"
                          strokeWidth="1.5"
                          strokeDasharray="4,3"
                        />
                        {/* Rise line (vertical) */}
                        <line
                          x1={cornerX}
                          y1={cornerY}
                          x2={p2.svgX}
                          y2={p2.svgY}
                          stroke="#ec4899"
                          strokeWidth="1.5"
                          strokeDasharray="4,3"
                        />
                        <text
                          x={(p1.svgX + cornerX) / 2}
                          y={p1.svgY + 14}
                          fill="#c084fc"
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          Run = {p2.x - p1.x}
                        </text>
                        <text
                          x={cornerX + 8}
                          y={(cornerY + p2.svgY) / 2 + 3}
                          fill="#f472b6"
                          fontSize="9"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          Rise = {p2.y - p1.y}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              )}

              {/* CLEAR LINE: Crisp dark underlay border for separation from background & grid */}
              <line
                x1={lineStartSvgX}
                y1={lineStartSvgY}
                x2={currentLineEndSvgX}
                y2={currentLineEndSvgY}
                stroke="#020617"
                strokeWidth="6"
                strokeLinecap="round"
                shapeRendering="geometricPrecision"
              />

              {/* CLEAR LINE: Ultra-sharp, crisp, solid linear line */}
              <line
                x1={lineStartSvgX}
                y1={lineStartSvgY}
                x2={currentLineEndSvgX}
                y2={currentLineEndSvgY}
                stroke="#f43f5e"
                strokeWidth="3.6"
                strokeLinecap="round"
                shapeRendering="geometricPrecision"
                markerStart={lineProgress >= 0.95 || step === 4 ? "url(#arrow-linear-start)" : undefined}
                markerEnd={lineProgress >= 0.95 || step === 4 ? "url(#arrow-linear-end)" : undefined}
              />

              {/* Anchor y-intercept marker for the linear line */}
              <g>
                <circle
                  cx={toSvgX(0)}
                  cy={toSvgY(effectiveD)}
                  r="7"
                  fill="rgba(244, 63, 94, 0.3)"
                  className={step === 3 && lineProgress < 1 ? "animate-ping" : undefined}
                />
                <circle
                  cx={toSvgX(0)}
                  cy={toSvgY(effectiveD)}
                  r="4"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <g transform={`translate(${toSvgX(0) + 8}, ${toSvgY(effectiveD) - 10})`}>
                  <rect
                    width="70"
                    height="18"
                    rx="4"
                    fill="#4c0519"
                    stroke="#fb7185"
                    strokeWidth="1"
                  />
                  <text
                    x="35"
                    y="12"
                    textAnchor="middle"
                    fill="#ffe4e6"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    (0, {effectiveD}) y-int
                  </text>
                </g>
              </g>

              {/* Guide Points on the Linear Line (Crosses & Coordinates) */}
              {showGuidePoints &&
                linearGuidePoints.map((pt, idx) => (
                  <g key={`guide-pt-${idx}`}>
                    {/* Pulsing ring on guide points */}
                    <circle
                      cx={pt.svgX}
                      cy={pt.svgY}
                      r="9"
                      fill="rgba(236, 72, 153, 0.25)"
                      className="animate-pulse"
                    />
                    {/* Plotted Cross Mark (Cambridge Mathematical Plotting) */}
                    <line
                      x1={pt.svgX - 5}
                      y1={pt.svgY - 5}
                      x2={pt.svgX + 5}
                      y2={pt.svgY + 5}
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                    />
                    <line
                      x1={pt.svgX - 5}
                      y1={pt.svgY + 5}
                      x2={pt.svgX + 5}
                      y2={pt.svgY - 5}
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                    />
                    {/* Guide point label callout */}
                    <g transform={`translate(${pt.svgX + 8}, ${pt.svgY - 14})`}>
                      <rect
                        width={pt.isYIntercept ? "82" : "54"}
                        height="18"
                        rx="4"
                        fill="#500724"
                        stroke="#f472b6"
                        strokeWidth="1"
                      />
                      <text
                        x={pt.isYIntercept ? "41" : "27"}
                        y="12"
                        textAnchor="middle"
                        fill="#fdf2f8"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {pt.isYIntercept ? `(0, ${pt.y}) y-int` : `(${pt.x}, ${pt.y})`}
                      </text>
                    </g>
                  </g>
                ))}

              {/* Drawing Pencil Icon at the tip of the moving line */}
              {step === 3 && lineProgress < 1 && (
                <g transform={`translate(${currentLineEndSvgX}, ${currentLineEndSvgY})`}>
                  <circle r="9" fill="#f43f5e" className="animate-ping" />
                  <circle r="5" fill="#be123c" stroke="#ffffff" strokeWidth="2" />
                  <g transform="translate(6, -24)">
                    <rect width="90" height="20" rx="5" fill="#4c0519" stroke="#fb7185" strokeWidth="1" />
                    <text x="45" y="14" fill="#fecdd3" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                      ✏️ Sketching Line...
                    </text>
                  </g>
                </g>
              )}

              {/* Component 2 Badge on line - Clear & Crisp */}
              {(step === 4 || (step === 3 && lineProgress >= 0.8)) && (
                <g transform={`translate(${toSvgX(Math.min(xMax - 2.2, 3.0))}, ${toSvgY(getLineY(Math.min(xMax - 2.2, 3.0))) - 26})`}>
                  <rect width="130" height="22" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
                  <text x="65" y="15" textAnchor="middle" fill="#fecdd3" fontSize="10.5" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
                    Line: {component2}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* STEP 4: Intersections & Drop-down projection lines */}
          {step === 4 &&
            intersections.map((pt, idx) => (
              <g key={`intersect-anim-${idx}`}>
                {/* Pulsing ring at meeting point */}
                <circle
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.y)}
                  r="16"
                  fill="rgba(236, 72, 153, 0.35)"
                  className="animate-ping"
                />

                {/* Vertical drop line to x-axis */}
                <line
                  x1={toSvgX(pt.x)}
                  y1={toSvgY(pt.y)}
                  x2={toSvgX(pt.x)}
                  y2={originY}
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="5,3"
                />

                {/* Solid meeting point dot */}
                <circle
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.y)}
                  r="6.5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />

                {/* Meeting Point coordinate callout */}
                <g transform={`translate(${toSvgX(pt.x) - 40}, ${toSvgY(pt.y) - 26})`}>
                  <rect width="80" height="20" rx="5" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="40" y="14" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
                    ({pt.x % 1 === 0 ? pt.x : pt.x.toFixed(1)}, {pt.y % 1 === 0 ? pt.y : pt.y.toFixed(1)})
                  </text>
                </g>

                {/* Projected Root Dot on x-axis */}
                <circle
                  cx={toSvgX(pt.x)}
                  cy={originY}
                  r="6.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Solution label on x-axis */}
                <g transform={`translate(${toSvgX(pt.x) - 28}, ${originY + 18})`}>
                  <rect width="56" height="22" rx="4" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                  <text x="28" y="15" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
                    x = {pt.x % 1 === 0 ? pt.x : pt.x.toFixed(1)}
                  </text>
                </g>
              </g>
            ))}

          {/* Step 1 Overlay Notice */}
          {step === 1 && (
            <g transform={`translate(${padding.left + 40}, ${padding.top + 70})`}>
              <rect width={plotW - 80} height="90" rx="12" fill="rgba(15, 23, 42, 0.92)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x={(plotW - 80) / 2} y="30" textAnchor="middle" fill="#e0f2fe" fontSize="14" fontWeight="bold">
                Step 1: Equation Decomposed
              </text>
              <text x={(plotW - 80) / 2} y="52" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono, monospace">
                {component1}   and   {component2}
              </text>
              <text x={(plotW - 80) / 2} y="74" textAnchor="middle" fill="#94a3b8" fontSize="11">
                Press "Step 2" or "Play Animation" to sketch!
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => handleStepSelect(Math.max(1, step - 1) as 1 | 2 | 3 | 4)}
          disabled={step === 1}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          Step {step} of 4
        </span>

        <button
          onClick={() => handleStepSelect(Math.min(4, step + 1) as 1 | 2 | 3 | 4)}
          disabled={step === 4}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
        >
          <span>Next Step</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
