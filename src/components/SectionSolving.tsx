import React, { useState, useRef } from 'react';
import { MathView } from './MathView';
import { ParabolaGraph, LineSpec, Point } from './ParabolaGraph';
import { AnimatedSolvingSketch } from './AnimatedSolvingSketch';
import { soundManager } from '../utils/soundEffects';
import { exportElementToPdf } from '../utils/pdfExport';
import { Section2State } from '../types';
import {
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Download,
  FileCheck,
  Layers,
  GitCommit,
  Maximize2,
  Play,
  Film
} from 'lucide-react';

interface SectionSolvingProps {
  state: Section2State;
  onChange: (updater: (prev: Section2State) => Section2State) => void;
  studentName: string;
  onCompleteSection: () => void;
}

interface ExampleData {
  id: number;
  title: string;
  equation: string;
  component1: string; // "y = ax^2 + bx + c"
  component2: string; // "y = mx + d"
  lineType: 'horizontal' | 'slanted';
  mValue: number;
  dValue: number;
  curveA: number;
  curveB: number;
  curveC: number;
  line: LineSpec;
  intersections: Point[];
  explanationLaTeX: string;
  steps: string[];
  tryItPrompt: string;
  tryItAnswers: string[]; // accepted string answers
  tryItFeedback: string;
}

export const SectionSolving: React.FC<SectionSolvingProps> = ({
  state,
  onChange,
  studentName,
  onCompleteSection,
}) => {
  const activeEx = state.activeEx;
  const setActiveEx = (ex: number) => onChange((prev) => ({ ...prev, activeEx: ex }));
  const tryItInputs = state.tryItInputs;
  const tryItResults = state.tryItResults;

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showTheoryGuide, setShowTheoryGuide] = useState(true);
  const [displayMode, setDisplayMode] = useState<'animated' | 'standard'>('animated');
  const pdf2Ref = useRef<HTMLDivElement>(null);

  const handleDownloadSection2PDF = async () => {
    if (!pdf2Ref.current) return;
    setIsExporting(true);
    const safeName = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const success = await exportElementToPdf(pdf2Ref.current, `IGCSE_Maths_0580_Section2_Solving_${safeName}.pdf`);
    setIsExporting(false);
    if (success) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }
  };

  const examples: ExampleData[] = [
    {
      id: 1,
      title: '1. Equation equal to Zero',
      equation: 'x^2 - 2x - 3 = 0',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = 0',
      lineType: 'horizontal',
      mValue: 0,
      dValue: 0,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: 0, color: '#f43f5e', dashed: false, label: 'Component 2: y = 0 (x-axis)' },
      intersections: [
        { x: -1, y: 0 },
        { x: 3, y: 0 },
      ],
      explanationLaTeX: 'x = -1 \\quad \\text{or} \\quad x = 3',
      steps: [
        'Split into two components: Component 1 is the curve $y = x^2 - 2x - 3$; Component 2 is the line $y = 0$ (the $x$-axis, where $m = 0, d = 0$).',
        'Sketch Component 1 (the smooth parabola) and Component 2 (the horizontal $x$-axis).',
        'Find the meeting points: the curve meets the line at $(-1, 0)$ and $(3, 0)$.',
        'The solutions are the $x$-coordinates of these meeting points: $x = -1$ and $x = 3$.',
      ],
      tryItPrompt: 'What are the two roots shown where Component 1 meets Component 2?',
      tryItAnswers: ['-1, 3', '-1,3', '3, -1', '3,-1', '-1 and 3', 'x = -1, x = 3'],
      tryItFeedback: 'Spot on! The meeting points with line y = 0 give x = -1 and x = 3.',
    },
    {
      id: 2,
      title: '2. Equation equal to a Positive Constant',
      equation: 'x^2 - 2x - 3 = 5',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = 5',
      lineType: 'horizontal',
      mValue: 0,
      dValue: 5,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: 5, color: '#f43f5e', dashed: false, label: 'Component 2: y = 5' },
      intersections: [
        { x: -2, y: 5 },
        { x: 4, y: 5 },
      ],
      explanationLaTeX: 'x = -2 \\quad \\text{or} \\quad x = 4',
      steps: [
        'Split into two components: Component 1 is the curve $y = x^2 - 2x - 3$; Component 2 is the horizontal line $y = 5$ ($m = 0, d = 5$).',
        'Sketch both components on the same grid: draw the parabola and draw the straight horizontal line at level $y = 5$ with a ruler.',
        'Locate the meeting points between the two components: $(-2, 5)$ and $(4, 5)$.',
        'Drop dotted vertical lines straight down to the $x$-axis: the solutions are $x = -2$ and $x = 4$.',
      ],
      tryItPrompt: 'Enter the two x-values where Component 1 meets Component 2 (separated by comma):',
      tryItAnswers: ['-2, 4', '-2,4', '4, -2', '4,-2', '-2 and 4'],
      tryItFeedback: 'Excellent! Drop lines straight down from y = 5 to read x = -2 and x = 4.',
    },
    {
      id: 3,
      title: '3. Equation equal to a Negative Constant',
      equation: 'x^2 - 2x - 3 = -3',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = -3',
      lineType: 'horizontal',
      mValue: 0,
      dValue: -3,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: -3, color: '#f43f5e', dashed: false, label: 'Component 2: y = -3' },
      intersections: [
        { x: 0, y: -3 },
        { x: 2, y: -3 },
      ],
      explanationLaTeX: 'x = 0 \\quad \\text{or} \\quad x = 2',
      steps: [
        'Split into two components: Component 1 is $y = x^2 - 2x - 3$; Component 2 is the horizontal line $y = -3$ ($m = 0, d = -3$).',
        'Sketch Component 2 as a straight horizontal line across the grid at height $y = -3$.',
        'Identify the two meeting points: $(0, -3)$ on the $y$-axis and $(2, -3)$.',
        'Read the $x$-coordinates of the meeting points: $x = 0$ and $x = 2$.',
      ],
      tryItPrompt: 'Enter the two solutions for x^2 - 2x - 3 = -3:',
      tryItAnswers: ['0, 2', '0,2', '2, 0', '2,0', '0 and 2'],
      tryItFeedback: 'Correct! The meeting points give x = 0 and x = 2.',
    },
    {
      id: 4,
      title: '4. Line Touching the Vertex (One Repeated Solution)',
      equation: 'x^2 - 2x - 3 = -4',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = -4',
      lineType: 'horizontal',
      mValue: 0,
      dValue: -4,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: -4, color: '#f43f5e', dashed: false, label: 'Component 2: y = -4 (Tangent)' },
      intersections: [{ x: 1, y: -4 }],
      explanationLaTeX: 'x = 1 \\quad \\text{(one repeated root)}',
      steps: [
        'Split into two components: Component 1 is $y = x^2 - 2x - 3$; Component 2 is the horizontal line $y = -4$.',
        'The minimum turning point (vertex) of the curve is exactly $(1, -4)$.',
        'Because the line touches the curve at only ONE meeting point (it is a tangent), there is exactly one solution.',
        'Solution: $x = 1$ (a repeated or double root).',
      ],
      tryItPrompt: 'How many meeting points (solutions) are there when y = -4 touches the vertex?',
      tryItAnswers: ['1', 'one', '1 solution', 'one solution'],
      tryItFeedback: 'Exactly! It is tangent at the vertex, so there is only 1 meeting point (x = 1).',
    },
    {
      id: 5,
      title: '5. Line Missing the Curve (No Real Solutions)',
      equation: 'x^2 - 2x - 3 = -6',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = -6',
      lineType: 'horizontal',
      mValue: 0,
      dValue: -6,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: -6, color: '#f43f5e', dashed: false, label: 'Component 2: y = -6 (No contact)' },
      intersections: [],
      explanationLaTeX: '\\text{No real solutions}',
      steps: [
        'Split into two components: Component 1 is $y = x^2 - 2x - 3$; Component 2 is the horizontal line $y = -6$.',
        'The minimum point on the parabola is at $y = -4$.',
        'The line $y = -6$ passes completely below the parabola, so the two components never meet.',
        'Because there are 0 meeting points, there are NO real solutions to this equation.',
      ],
      tryItPrompt: 'How many meeting points are there between the curve and y = -6?',
      tryItAnswers: ['0', 'zero', 'none', 'no solutions', '0 solutions'],
      tryItFeedback: 'Spot on! The line lies below the minimum, so they never meet (0 solutions).',
    },
    {
      id: 6,
      title: '6. Rearranging to Match the Parabola',
      equation: 'x^2 - 2x = 3',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = 0',
      lineType: 'horizontal',
      mValue: 0,
      dValue: 0,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: 0, color: '#f43f5e', dashed: false, label: 'Component 2: y = 0' },
      intersections: [
        { x: -1, y: 0 },
        { x: 3, y: 0 },
      ],
      explanationLaTeX: 'x^2 - 2x - 3 = 0 \\implies x = -1 \\quad \\text{or} \\quad x = 3',
      steps: [
        'The question asks to solve $x^2 - 2x = 3$ using our already plotted curve $y = x^2 - 2x - 3$.',
        'First, rearrange by subtracting $3$ from both sides: $x^2 - 2x - 3 = 0$.',
        'Now we have our two components: Component 1 is $y = x^2 - 2x - 3$ and Component 2 is $y = 0$.',
        'The meeting points are on the $x$-axis at $(-1, 0)$ and $(3, 0)$, giving solutions $x = -1$ and $x = 3$.',
      ],
      tryItPrompt: 'What should you subtract from both sides to form Component 1 (x^2 - 2x - 3)?',
      tryItAnswers: ['3', '-3', 'three'],
      tryItFeedback: 'Correct! Subtract 3 to turn x^2 - 2x = 3 into x^2 - 2x - 3 = 0.',
    },
    {
      id: 7,
      title: '7. Slanted Line: y = mx + d (m > 0)',
      equation: 'x^2 - 2x - 3 = x - 1',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = x - 1',
      lineType: 'slanted',
      mValue: 1,
      dValue: -1,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'linear', m: 1, c: -1, color: '#ec4899', dashed: false, label: 'Component 2: y = x - 1 (m=1, d=-1)' },
      intersections: [
        { x: -0.56, y: -1.56 },
        { x: 3.56, y: 2.56 },
      ],
      explanationLaTeX: 'x \\approx -0.6 \\quad \\text{or} \\quad x \\approx 3.6',
      steps: [
        'Decompose into two components: Component 1 is the parabola $y = x^2 - 2x - 3$; Component 2 is the slanted straight line $y = x - 1$ ($m = 1, d = -1$).',
        'Sketch Component 2 using a ruler: find points $(0, -1)$, $(2, 1)$, and $(4, 3)$, then draw the straight line across the grid.',
        'Locate the two meeting points where the straight line cuts the parabola: $(-0.56, -1.56)$ and $(3.56, 2.56)$.',
        'Project straight down to the $x$-axis to read the solutions: $x \\approx -0.6$ and $x \\approx 3.6$.',
      ],
      tryItPrompt: 'What is the gradient m of Component 2 (y = x - 1)?',
      tryItAnswers: ['1', 'm=1', 'one', '+1'],
      tryItFeedback: 'Correct! In y = mx + d, the gradient m is 1 and y-intercept d is -1.',
    },
    {
      id: 8,
      title: '8. Slanted Line: y = mx + d (m < 0, Integer Solutions)',
      equation: 'x^2 - 2x - 3 = -x + 3',
      component1: 'y = x^2 - 2x - 3',
      component2: 'y = -x + 3',
      lineType: 'slanted',
      mValue: -1,
      dValue: 3,
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'linear', m: -1, c: 3, color: '#a855f7', dashed: false, label: 'Component 2: y = -x + 3 (m=-1, d=3)' },
      intersections: [
        { x: -2, y: 5 },
        { x: 3, y: 0 },
      ],
      explanationLaTeX: 'x = -2 \\quad \\text{or} \\quad x = 3',
      steps: [
        'Decompose into two components: Component 1 is the parabola $y = x^2 - 2x - 3$; Component 2 is the downward-slanted straight line $y = -x + 3$ ($m = -1, d = 3$).',
        'Sketch Component 2 with a straight ruler: plot points $(0, 3)$, $(1, 2)$, and $(3, 0)$, then draw the line across the coordinate grid.',
        'Find the exact meeting points where the line intersects the parabola: $(-2, 5)$ and $(3, 0)$.',
        'Drop lines to the $x$-axis to read the exact solutions: $x = -2$ and $x = 3$.',
        'Verification: $(-2)^2 - 2(-2) - 3 = 5$ equals $-(-2) + 3 = 5$ ✓; $(3)^2 - 2(3) - 3 = 0$ equals $-(3) + 3 = 0$ ✓.',
      ],
      tryItPrompt: 'Enter the two solutions where the curve meets y = -x + 3:',
      tryItAnswers: ['-2, 3', '-2,3', '3, -2', '3,-2', '-2 and 3'],
      tryItFeedback: 'Outstanding! The meeting points (-2, 5) and (3, 0) give x = -2 and x = 3.',
    },
  ];

  const current = examples.find((e) => e.id === activeEx) || examples[0];

  const handleCheckTryIt = () => {
    const input = (tryItInputs[current.id] || '').trim().toLowerCase();
    const isCorrect = current.tryItAnswers.some((ans) =>
      input.replace(/\s+/g, '').includes(ans.toLowerCase().replace(/\s+/g, ''))
    );
    onChange((prev) => ({
      ...prev,
      tryItResults: { ...prev.tryItResults, [current.id]: isCorrect },
    }));
    if (isCorrect) {
      soundManager.playCorrectSound("Spot on! That's the correct graphical solution.");
    } else {
      soundManager.playWrongSound();
    }
  };

  const handleInputChange = (val: string) => {
    onChange((prev) => ({
      ...prev,
      tryItInputs: { ...prev.tryItInputs, [current.id]: val },
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            IGCSE Core Principle · Graphical Solutions
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
            Solving Quadratic Equations Graphically
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
            Understand equations of the form <MathView math="ax^2 + bx + c = mx + d" /> by splitting them into 
            <strong className="text-cyan-300"> two components</strong>: the parabolic curve <MathView math="y = ax^2 + bx + c" /> and the straight line <MathView math="y = mx + d" />. The solutions are the 
            <strong className="text-pink-300"> meeting points</strong> where they intersect!
          </p>
        </div>

        {/* Section 2 Download Button */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <button
            onClick={handleDownloadSection2PDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>{isExporting ? 'Generating PDF...' : 'Download Section 2 (PDF)'}</span>
          </button>
          {exportSuccess && (
            <span className="text-[11px] text-emerald-400 font-medium">✓ Section 2 PDF Downloaded!</span>
          )}
        </div>
      </div>

      {/* =========================================================================
          THE TWO-COMPONENT PRINCIPLE DISCOVERY & EXPLANATION CARD
         ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-teal-950/50 border border-cyan-500/30 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block font-mono">
                Mathematical Foundation
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white font-heading">
                The Two-Component Principle: Solving <MathView math="ax^2 + bx + c = mx + d" />
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowTheoryGuide(!showTheoryGuide)}
            className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1 cursor-pointer"
          >
            {showTheoryGuide ? 'Collapse Theory Guide ▲' : 'Expand Theory Guide ▼'}
          </button>
        </div>

        {showTheoryGuide && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Visual Equation Formula Breakdown */}
            <div className="p-4 md:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                How Any Quadratic Equation Splits into Two Visual Components
              </span>
              <div className="text-xl md:text-2xl font-bold text-white font-mono flex flex-wrap items-center justify-center gap-3">
                <span className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-sm">
                  <MathView math="y = ax^2 + bx + c" />
                  <span className="block text-[10px] font-sans text-cyan-400 uppercase tracking-wider mt-0.5">Component 1 (Curve)</span>
                </span>
                <span className="text-amber-400 font-bold text-2xl">=</span>
                <span className="p-2 rounded-xl bg-pink-950/60 border border-pink-500/50 text-pink-300 shadow-sm">
                  <MathView math="y = mx + d" />
                  <span className="block text-[10px] font-sans text-pink-400 uppercase tracking-wider mt-0.5">Component 2 (Straight Line)</span>
                </span>
              </div>
            </div>

            {/* 3 Step Interactive Explanation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-heading">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs">1</span>
                  <span>Component 1: The Parabola</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  The left-hand side <MathView math="y = ax^2 + bx + c" /> is always a quadratic curve. 
                  Construct a table of values and draw a <strong>smooth freehand curve</strong> (never a ruler).
                </p>
                <div className="text-[11px] text-cyan-300 font-mono bg-cyan-950/40 p-1.5 rounded border border-cyan-900">
                  Shape: U-shape (<MathView math="a > 0" />) or n-shape (<MathView math="a < 0" />)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-pink-400 font-bold font-heading">
                  <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-mono text-xs">2</span>
                  <span>Component 2: Straight Line</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  The right-hand side <MathView math="y = mx + d" /> is always a straight line with gradient <MathView math="m" /> and <MathView math="y" />-intercept <MathView math="d" />. 
                  Draw this as a <strong>clear, sharp, unbroken line with a straight ruler</strong> across the full coordinate grid.
                </p>
                <div className="text-[11px] text-pink-300 font-mono bg-pink-950/40 p-1.5 rounded border border-pink-900">
                  If <MathView math="m = 0" />: horizontal line <MathView math="y = d" />. If <MathView math="m \neq 0" />: slanted line.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-xs">3</span>
                  <span>Solutions = Meeting Points!</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  At the meeting points, both components share the exact same height (<MathView math="y_1 = y_2" />). 
                  The <strong><MathView math="x" />-coordinates</strong> where they meet are the true solutions to the equation!
                </p>
                <div className="text-[11px] text-emerald-300 font-mono bg-emerald-950/40 p-1.5 rounded border border-emerald-900">
                  Read straight down to the <MathView math="x" />-axis from each meeting point.
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Number of Meeting Points:</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-semibold">
                  • 2 Meeting Points = 2 Distinct Real Solutions
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 font-semibold">
                  • 1 Meeting Point (Tangent at vertex) = 1 Repeated Real Solution
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-semibold">
                  • 0 Meeting Points (No contact) = 0 Real Solutions
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Stage: Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Example Navigator & Full LaTeX Solution Deck */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
            {/* 8 numbered buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Select an Example (1 to 8):
                </span>
                <span className="text-[11px] text-cyan-300 font-mono">
                  {current.lineType === 'horizontal' ? 'Horizontal Line (m = 0)' : 'Slanted Line (m ≠ 0)'}
                </span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveEx(ex.id)}
                    className={`h-11 rounded-xl text-sm font-bold font-mono transition-all flex items-center justify-center cursor-pointer ${
                      activeEx === ex.id
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md ring-2 ring-cyan-400/50'
                        : tryItResults[ex.id] === true
                        ? 'bg-emerald-950/50 border border-emerald-600 text-emerald-300'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {ex.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Example Header */}
            <div className="border-t border-slate-800/80 pt-4 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                {current.title}
              </span>
              <div className="text-2xl font-bold text-white font-heading">
                Solve: <MathView math={current.equation} />
              </div>
            </div>

            {/* Two-Component Decomposition Card */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Two-Component Decomposition:
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {current.intersections.length} meeting point{current.intersections.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Component 1 (Curve)</span>
                  <div className="font-mono text-cyan-200 font-bold">
                    <MathView math={current.component1} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Drawn freehand without ruler</span>
                </div>

                <div className="p-2.5 rounded-xl bg-pink-950/40 border border-pink-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-pink-400 block">Component 2 (Linear Line)</span>
                  <div className="font-mono text-pink-200 font-bold">
                    <MathView math={current.component2} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {current.lineType === 'horizontal' ? `Flat line (m = 0, y = ${current.dValue})` : `Slanted line (gradient m = ${current.mValue}, y-intercept d = ${current.dValue})`}
                  </span>
                </div>
              </div>

              {/* Linear Line Sketch Guide Points Table */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-pink-900/40 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-pink-300 font-semibold flex items-center gap-1.5">
                    <span>📏</span>
                    <span>Linear Line Sketch Guide · Clear Line Technique ({current.component2}):</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Plot with ruler through points:
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  {(current.lineType === 'horizontal'
                    ? [
                        { x: -2, y: current.dValue },
                        { x: 0, y: current.dValue },
                        { x: 4, y: current.dValue },
                      ]
                    : current.mValue === 1
                    ? [
                        { x: 0, y: current.dValue },
                        { x: 2, y: 2 + current.dValue },
                        { x: 4, y: 4 + current.dValue },
                      ]
                    : [
                        { x: 0, y: current.dValue },
                        { x: 1, y: -1 + current.dValue },
                        { x: 3, y: -3 + current.dValue },
                      ]
                  ).map((pt, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-pink-950/60 border border-pink-700/60 text-pink-200"
                    >
                      ({pt.x}, {pt.y}){pt.x === 0 ? ' y-int' : ''}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-400 font-sans">
                    → connect with ruler (clear continuous straight line)
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-300 font-medium">Meeting Point(s) on Graph:</span>
                <span className="font-mono font-bold text-amber-300">
                  {current.intersections.length > 0
                    ? current.intersections
                        .map(
                          (pt) =>
                            `(${pt.x % 1 === 0 ? pt.x : pt.x.toFixed(1)}, ${
                              pt.y % 1 === 0 ? pt.y : pt.y.toFixed(1)
                            })`
                        )
                        .join(' and ')
                    : 'None (No contact)'}
                </span>
              </div>
            </div>

            {/* Step-by-Step LaTeX Walkthrough */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                Method & Working:
              </span>
              <ol className="space-y-2.5 text-xs md:text-sm text-slate-200">
                {current.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>
                      {st.includes('$') ? (
                        st.split('$').map((part, pIdx) =>
                          pIdx % 2 === 1 ? <MathView key={pIdx} math={part} /> : <span key={pIdx}>{part}</span>
                        )
                      ) : (
                        st
                      )}
                    </span>
                  </li>
                ))}
              </ol>

              {/* Final LaTeX Solution Box */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-center mt-3">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  Solutions (x-coordinates of Meeting Points)
                </span>
                <div className="text-lg font-bold text-white mt-0.5 font-mono">
                  <MathView math={current.explanationLaTeX} />
                </div>
              </div>
            </div>

            {/* Mini "Try It" Check */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Mini Check: {current.tryItPrompt}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={tryItInputs[current.id] || ''}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  onClick={handleCheckTryIt}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check
                </button>
              </div>
              {tryItResults[current.id] === true && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  {current.tryItFeedback}
                </p>
              )}
              {tryItResults[current.id] === false && (
                <p className="text-xs text-rose-400 font-medium">
                  Not quite. Look carefully at the graph on the right and read the x-axis directly below the meeting dots!
                </p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={activeEx === 1}
                onClick={() => setActiveEx(activeEx - 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-xs font-mono text-slate-400">
                Example {activeEx} of {examples.length}
              </span>
              <button
                disabled={activeEx === examples.length}
                onClick={() => setActiveEx(activeEx + 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Graph Animation and Intersection Highlights */}
        <div className="lg:col-span-6 space-y-6">
          {/* View Mode Switcher: Animated Step Sketch vs Static Full Graph */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
              <button
                onClick={() => setDisplayMode('animated')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  displayMode === 'animated'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>🎬 Step-by-Step Sketch Animator</span>
              </button>
              <button
                onClick={() => setDisplayMode('standard')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  displayMode === 'standard'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>📊 Full Coordinate Graph</span>
              </button>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-semibold">
              {current.intersections.length} Meeting Point{current.intersections.length === 1 ? '' : 's'}
            </span>
          </div>

          {displayMode === 'animated' ? (
            <AnimatedSolvingSketch
              equation={current.equation}
              component1={current.component1}
              component2={current.component2}
              curveA={current.curveA}
              curveB={current.curveB}
              curveC={current.curveC}
              line={current.line}
              mValue={current.mValue}
              dValue={current.dValue}
              intersections={current.intersections}
              explanationLaTeX={current.explanationLaTeX}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-[11px]">
                    Component 1: {current.component1}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-pink-950/80 border border-pink-800 text-pink-300 font-mono text-[11px]">
                    Component 2: {current.component2}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-pink-300 bg-pink-950/60 border border-pink-800/60 px-2 py-0.5 rounded">
                  Linear Guide Points Plotted on Line
                </span>
              </div>

              <ParabolaGraph
                a={current.curveA}
                b={current.curveB}
                c={current.curveC}
                xMin={-3.5}
                xMax={5.5}
                yMin={-7}
                yMax={8}
                points={(current.lineType === 'horizontal'
                  ? [
                      { x: -2, y: current.dValue },
                      { x: 0, y: current.dValue },
                      { x: 4, y: current.dValue },
                    ]
                  : current.mValue === 1
                  ? [
                      { x: 0, y: current.dValue },
                      { x: 2, y: 2 + current.dValue },
                      { x: 4, y: 4 + current.dValue },
                    ]
                  : [
                      { x: 0, y: current.dValue },
                      { x: 1, y: -1 + current.dValue },
                      { x: 3, y: -3 + current.dValue },
                    ]
                ).map((p) => ({
                  x: p.x,
                  y: p.y,
                  label: `(${p.x}, ${p.y})`,
                  color: '#ec4899',
                }))}
                additionalLines={[current.line]}
                intersectPoints={current.intersections}
                curveColor={current.curveA > 0 ? '#38bdf8' : '#f43f5e'}
              />
            </div>
          )}

          {/* Remember Box */}
          <div className="rounded-2xl bg-amber-950/30 border border-amber-800/40 p-5 text-xs text-amber-200 space-y-3">
            <div className="flex items-center gap-2 font-bold font-heading text-sm text-amber-400">
              <Info className="w-4 h-4" />
              <span>IGCSE Exam Rule · Meeting Points & Real Solutions</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                • <strong>Two Meeting Points:</strong> If the straight line cuts the parabola twice <MathView math="\implies" /> <strong>2 distinct real solutions</strong>.
              </li>
              <li>
                • <strong>One Meeting Point (Tangent):</strong> If the line touches the parabola at exactly one point (like at the vertex) <MathView math="\implies" /> <strong>1 repeated real solution</strong>.
              </li>
              <li>
                • <strong>Zero Meeting Points:</strong> If the line never meets or crosses the curve <MathView math="\implies" /> <strong>0 real solutions (no real roots)</strong>.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-amber-900/30">
              <strong>Accuracy Tip:</strong> In Cambridge examinations, reading non-integer coordinates from a drawn graph is acceptable within $\pm 0.1$ of the true value. Always drop a vertical guideline straight down to the $x$-axis.
            </p>
          </div>

          {/* Action Buttons: Download Section 2 & Continue */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleDownloadSection2PDF}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Section 2 (PDF)'}</span>
            </button>

            <button
              onClick={onCompleteSection}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold font-heading text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Ready for Final Assessment (10 Marks)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINT-FRIENDLY LIGHT THEME CONTAINER FOR SECTION 2 PDF EXPORT
         ========================================================================= */}
      <div
        ref={pdf2Ref}
        style={{ display: 'none' }}
        className="w-[800px] p-10 bg-white text-slate-900 font-sans space-y-6"
      >
        <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Cambridge IGCSE Mathematics 0580 · Extended Curriculum
            </span>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Section 2: Solving Quadratic Equations Graphically
            </h1>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div><strong>Student:</strong> {studentName || 'Student'}</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* The Two-Component Principle Box in PDF */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2">
          <h2 className="font-bold text-slate-900 text-sm">The Two-Component Principle:</h2>
          <p className="leading-relaxed">
            To solve any quadratic equation of the form <MathView math="ax^2 + bx + c = mx + d" /> graphically:
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2 bg-white rounded border border-slate-200">
              <strong>Component 1 (Curve):</strong>
              <div className="font-mono text-cyan-800 mt-0.5"><MathView math="y = ax^2 + bx + c" /></div>
              <p className="text-[11px] text-slate-600 mt-1">Plot using table of values and draw a smooth continuous curve freehand.</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <strong>Component 2 (Straight Line):</strong>
              <div className="font-mono text-pink-800 mt-0.5"><MathView math="y = mx + d" /></div>
              <p className="text-[11px] text-slate-600 mt-1">Draw with a straight ruler. If <MathView math="m = 0" />, line is horizontal <MathView math="y = d" />.</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-700 font-medium pt-1">
            • <strong>Meeting Points = Solutions:</strong> The solutions to the equation are the <MathView math="x" />-coordinates where Component 1 and Component 2 intersect!
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Worked Examples & Student Practice
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {examples.map((ex) => (
              <div key={ex.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>{ex.title}</span>
                  <span className={tryItResults[ex.id] ? 'text-emerald-700 font-mono text-[11px]' : 'text-slate-500 font-mono text-[11px]'}>
                    {tryItResults[ex.id] ? '✓ Solved' : 'Practiced'}
                  </span>
                </div>
                <div className="font-mono text-cyan-800 text-[11px] bg-slate-50 p-1 rounded">
                  Solve: {ex.equation}
                </div>
                <div className="text-[11px] text-slate-600">
                  <div>• <strong>Component 1:</strong> <MathView math={ex.component1} /></div>
                  <div>• <strong>Component 2:</strong> <MathView math={ex.component2} /></div>
                </div>
                <div className="text-slate-900 font-semibold text-[11px]">
                  <strong>Meeting Points / Solutions:</strong> <MathView math={ex.explanationLaTeX} />
                </div>
                {tryItInputs[ex.id] && (
                  <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-1">
                    Student answer: <em>"{tryItInputs[ex.id]}"</em> {tryItResults[ex.id] ? '✓' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
          <strong>IGCSE Exam Rules for Meeting Points:</strong>
          <div>• Line cuts curve twice: 2 distinct real solutions</div>
          <div>• Line touches curve at vertex (tangent): 1 repeated real solution</div>
          <div>• Line does not meet curve: 0 real solutions (no real roots)</div>
        </div>

        <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-500">
          <span>Cambridge IGCSE Mathematics 0580 Verification</span>
          <span>Status: Section 2 Mastered</span>
        </div>
      </div>
    </div>
  );
};
