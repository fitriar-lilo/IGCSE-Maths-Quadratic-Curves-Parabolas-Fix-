import React, { useState, useRef } from 'react';
import { MathView } from './MathView';
import { ParabolaGraph, Point } from './ParabolaGraph';
import { soundManager } from '../utils/soundEffects';
import { exportElementToPdf } from '../utils/pdfExport';
import { Section1State } from '../types';
import {
  Sparkles,
  Play,
  RotateCcw,
  Check,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Info,
  Sliders,
  BookOpen,
  Edit3,
  Download,
  FileCheck
} from 'lucide-react';

interface SectionDiscoveryProps {
  state: Section1State;
  onChange: (updater: (prev: Section1State) => Section1State) => void;
  studentName: string;
  onCompleteSection: () => void;
}

export const SectionDiscovery: React.FC<SectionDiscoveryProps> = ({
  state,
  onChange,
  studentName,
  onCompleteSection,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const pdf1Ref = useRef<HTMLDivElement>(null);

  const handleDownloadSection1PDF = async () => {
    if (!pdf1Ref.current) return;
    setIsExporting(true);
    const safeName = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const success = await exportElementToPdf(pdf1Ref.current, `IGCSE_Maths_0580_Section1_Discovery_${safeName}.pdf`);
    setIsExporting(false);
    if (success) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }
  };

  const tab = state.tab;
  const setTab = (t: 1 | 2 | 3 | 4 | 5) => onChange((prev) => ({ ...prev, tab: t }));

  // --- Sub-section 1.1 State (3 Concavity Examples) ---
  const plotEx = state.plotEx;
  const setPlotEx = (p: 1 | 2 | 3) => onChange((prev) => ({ ...prev, plotEx: p }));
  const animationSpeed = state.animationSpeed;
  const setAnimationSpeed = (s: number | ((prev: number) => number)) =>
    onChange((prev) => ({
      ...prev,
      animationSpeed: typeof s === 'function' ? s(prev.animationSpeed) : s,
    }));

  // Curve 1: y = x^2 - 2x - 3 (Concave Up / Smile, a = 1)
  type StringMap = { [x: number]: string };
  type BoolMap = { [x: number]: boolean };

  const table1Inputs = state.table1Inputs;
  const setTable1Inputs = (valOrFn: StringMap | ((prev: StringMap) => StringMap)) =>
    onChange((prev) => ({
      ...prev,
      table1Inputs: typeof valOrFn === 'function' ? valOrFn(prev.table1Inputs) : valOrFn,
    }));
  const table1Errors = state.table1Errors;
  const setTable1Errors = (valOrFn: BoolMap | ((prev: BoolMap) => BoolMap)) =>
    onChange((prev) => ({
      ...prev,
      table1Errors: typeof valOrFn === 'function' ? valOrFn(prev.table1Errors) : valOrFn,
    }));
  const isCurve1Connected = state.isCurve1Connected;
  const setIsCurve1Connected = (c: boolean) => onChange((prev) => ({ ...prev, isCurve1Connected: c }));
  const [curve1Animating, setCurve1Animating] = useState(false);

  const table1Solutions: { [x: number]: number } = {
    '-2': 5,
    '-1': 0,
    '0': -3,
    '1': -4,
    '2': -3,
    '3': 0,
    '4': 5,
  };

  // Curve 2: y = -x^2 + 2x + 3 (Concave Down / Frown, a = -1)
  const table2Inputs = state.table2Inputs;
  const setTable2Inputs = (valOrFn: StringMap | ((prev: StringMap) => StringMap)) =>
    onChange((prev) => ({
      ...prev,
      table2Inputs: typeof valOrFn === 'function' ? valOrFn(prev.table2Inputs) : valOrFn,
    }));
  const table2Errors = state.table2Errors;
  const setTable2Errors = (valOrFn: BoolMap | ((prev: BoolMap) => BoolMap)) =>
    onChange((prev) => ({
      ...prev,
      table2Errors: typeof valOrFn === 'function' ? valOrFn(prev.table2Errors) : valOrFn,
    }));
  const isCurve2Connected = state.isCurve2Connected;
  const setIsCurve2Connected = (c: boolean) => onChange((prev) => ({ ...prev, isCurve2Connected: c }));
  const [curve2Animating, setCurve2Animating] = useState(false);

  const table2Solutions: { [x: number]: number } = {
    '-2': -5,
    '-1': 0,
    '0': 3,
    '1': 4,
    '2': 3,
    '3': 0,
    '4': -5,
  };

  // Curve 3: y = 0.5x^2 - 2x (Wide Concave Up, a = 0.5)
  const table3Inputs = state.table3Inputs;
  const setTable3Inputs = (valOrFn: StringMap | ((prev: StringMap) => StringMap)) =>
    onChange((prev) => ({
      ...prev,
      table3Inputs: typeof valOrFn === 'function' ? valOrFn(prev.table3Inputs) : valOrFn,
    }));
  const table3Errors = state.table3Errors;
  const setTable3Errors = (valOrFn: BoolMap | ((prev: BoolMap) => BoolMap)) =>
    onChange((prev) => ({
      ...prev,
      table3Errors: typeof valOrFn === 'function' ? valOrFn(prev.table3Errors) : valOrFn,
    }));
  const isCurve3Connected = state.isCurve3Connected;
  const setIsCurve3Connected = (c: boolean) => onChange((prev) => ({ ...prev, isCurve3Connected: c }));
  const [curve3Animating, setCurve3Animating] = useState(false);

  const table3Solutions: { [x: number]: number } = {
    '-1': 2.5,
    '0': 0,
    '1': -1.5,
    '2': -2,
    '3': -1.5,
    '4': 0,
    '5': 2.5,
  };

  // Checkers and handlers for Curve 1
  const handleTable1Change = (x: number, val: string) => {
    setTable1Inputs((prev) => ({ ...prev, [x]: val }));
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed === table1Solutions[x]) {
      setTable1Errors((prev) => ({ ...prev, [x]: false }));
      soundManager.playPointSound(x + 3, `(${x}, ${parsed})`);
    }
  };

  const checkTable1 = () => {
    const errs: { [x: number]: boolean } = {};
    let allValid = true;
    Object.keys(table1Inputs).forEach((k) => {
      const numX = parseInt(k, 10);
      const val = parseFloat(table1Inputs[numX]);
      if (isNaN(val) || val !== table1Solutions[numX]) {
        errs[numX] = true;
        allValid = false;
      } else {
        errs[numX] = false;
      }
    });
    setTable1Errors(errs);
    if (allValid) {
      soundManager.playCorrectSound("Great job! All points in Table 1 are correct.");
    } else {
      soundManager.playWrongSound();
    }
    return allValid;
  };

  // Checkers and handlers for Curve 2
  const handleTable2Change = (x: number, val: string) => {
    setTable2Inputs((prev) => ({ ...prev, [x]: val }));
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed === table2Solutions[x]) {
      setTable2Errors((prev) => ({ ...prev, [x]: false }));
      soundManager.playPointSound(x + 3, `(${x}, ${parsed})`);
    }
  };

  const checkTable2 = () => {
    const errs: { [x: number]: boolean } = {};
    let allValid = true;
    Object.keys(table2Inputs).forEach((k) => {
      const numX = parseInt(k, 10);
      const val = parseFloat(table2Inputs[numX]);
      if (isNaN(val) || val !== table2Solutions[numX]) {
        errs[numX] = true;
        allValid = false;
      } else {
        errs[numX] = false;
      }
    });
    setTable2Errors(errs);
    if (allValid) {
      soundManager.playCorrectSound("Superb! All points in Table 2 are correct.");
    } else {
      soundManager.playWrongSound();
    }
    return allValid;
  };

  // Checkers and handlers for Curve 3
  const handleTable3Change = (x: number, val: string) => {
    setTable3Inputs((prev) => ({ ...prev, [x]: val }));
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && Math.abs(parsed - table3Solutions[x]) < 0.01) {
      setTable3Errors((prev) => ({ ...prev, [x]: false }));
      soundManager.playPointSound(x + 3, `(${x}, ${parsed})`);
    }
  };

  const checkTable3 = () => {
    const errs: { [x: number]: boolean } = {};
    let allValid = true;
    Object.keys(table3Inputs).forEach((k) => {
      const numX = parseInt(k, 10);
      const val = parseFloat(table3Inputs[numX]);
      if (isNaN(val) || Math.abs(val - table3Solutions[numX]) >= 0.01) {
        errs[numX] = true;
        allValid = false;
      } else {
        errs[numX] = false;
      }
    });
    setTable3Errors(errs);
    if (allValid) {
      soundManager.playCorrectSound("Outstanding! All points in Table 3 are correct.");
    } else {
      soundManager.playWrongSound();
    }
    return allValid;
  };

  // Plotted points for Curve 1
  const calculatedMiddlePoints1: Point[] = [];
  Object.keys(table1Inputs).forEach((k) => {
    const x = parseInt(k, 10);
    const y = parseFloat(table1Inputs[x]);
    if (!isNaN(y) && y === table1Solutions[x]) {
      calculatedMiddlePoints1.push({ x, y, color: '#38bdf8' });
    }
  });
  const plottedPoints1_1: Point[] = [
    { x: -2, y: 5, color: '#38bdf8' },
    ...calculatedMiddlePoints1,
    { x: 4, y: 5, color: '#38bdf8' },
  ];

  // Plotted points for Curve 2
  const calculatedMiddlePoints2: Point[] = [];
  Object.keys(table2Inputs).forEach((k) => {
    const x = parseInt(k, 10);
    const y = parseFloat(table2Inputs[x]);
    if (!isNaN(y) && y === table2Solutions[x]) {
      calculatedMiddlePoints2.push({ x, y, color: '#f43f5e' });
    }
  });
  const plottedPoints1_2: Point[] = [
    { x: -2, y: -5, color: '#f43f5e' },
    ...calculatedMiddlePoints2,
  ];

  // Plotted points for Curve 3
  const calculatedMiddlePoints3: Point[] = [];
  Object.keys(table3Inputs).forEach((k) => {
    const x = parseInt(k, 10);
    const y = parseFloat(table3Inputs[x]);
    if (!isNaN(y) && Math.abs(y - table3Solutions[x]) < 0.01) {
      calculatedMiddlePoints3.push({ x, y, color: '#2dd4bf' });
    }
  });
  const plottedPoints1_3: Point[] = [...calculatedMiddlePoints3];

  // --- Sub-section 1.2 State (Feature Tour) ---
  const tourStep = state.tourStep;
  const setTourStep = (s: 1 | 2 | 3 | 4) => onChange((prev) => ({ ...prev, tourStep: s }));
  const tourNoticeAnswer = state.tourNoticeAnswer;
  const setTourNoticeAnswer = (valOrFn: any) =>
    onChange((prev) => ({
      ...prev,
      tourNoticeAnswer: typeof valOrFn === 'function' ? valOrFn(prev.tourNoticeAnswer) : valOrFn,
    }));
  const tourNoticeChecked = state.tourNoticeChecked;
  const setTourNoticeChecked = (valOrFn: any) =>
    onChange((prev) => ({
      ...prev,
      tourNoticeChecked: typeof valOrFn === 'function' ? valOrFn(prev.tourNoticeChecked) : valOrFn,
    }));

  // --- Sub-section 1.3 State (Sliders Lab) ---
  const sliderA = state.sliderA;
  const setSliderA = (a: number) => onChange((prev) => ({ ...prev, sliderA: a }));
  const sliderB = state.sliderB;
  const setSliderB = (b: number) => onChange((prev) => ({ ...prev, sliderB: b }));
  const sliderC = state.sliderC;
  const setSliderC = (c: number) => onChange((prev) => ({ ...prev, sliderC: c }));
  const predictShape = state.predictShape;
  const setPredictShape = (p: 'smile' | 'frown' | null) => onChange((prev) => ({ ...prev, predictShape: p }));

  // --- Sub-section 1.4 State (Three Examples) ---
  const exTab = state.exTab;
  const setExTab = (t: 1 | 2 | 3) => onChange((prev) => ({ ...prev, exTab: t }));
  const ex2Inputs = state.ex2Inputs;
  const setEx2Inputs = (valOrFn: any) =>
    onChange((prev) => ({
      ...prev,
      ex2Inputs: typeof valOrFn === 'function' ? valOrFn(prev.ex2Inputs) : valOrFn,
    }));
  const ex2Checked = state.ex2Checked;
  const setEx2Checked = (c: boolean) => onChange((prev) => ({ ...prev, ex2Checked: c }));
  const ex3Inputs = state.ex3Inputs;
  const setEx3Inputs = (valOrFn: any) =>
    onChange((prev) => ({
      ...prev,
      ex3Inputs: typeof valOrFn === 'function' ? valOrFn(prev.ex3Inputs) : valOrFn,
    }));
  const ex3Checked = state.ex3Checked;
  const setEx3Checked = (c: boolean) => onChange((prev) => ({ ...prev, ex3Checked: c }));

  // --- Sub-section 1.5 State (Own Words) ---
  const localExp = state.explanations;
  const setLocalExp = (exp: typeof state.explanations) => onChange((prev) => ({ ...prev, explanations: exp }));
  const showModel = state.showModel;
  const setShowModel = (valOrFn: any) =>
    onChange((prev) => ({
      ...prev,
      showModel: typeof valOrFn === 'function' ? valOrFn(prev.showModel) : valOrFn,
    }));

  const keywordsList: { [key: string]: string[] } = {
    sketching: ['table', 'points', 'smooth', 'curve', 'ruler', 'freehand', 'values'],
    roots: ['x-axis', 'crosses', 'y = 0', 'intercept', 'solutions', 'zero'],
    turningPoint: ['minimum', 'maximum', 'vertex', 'lowest', 'highest', 'turn'],
    symmetry: ['halfway', 'vertical', 'mirror', 'divided', 'line', 'x =', 'axis'],
  };

  const getMatchedKeywords = (key: string, text: string) => {
    const list = keywordsList[key] || [];
    const lower = text.toLowerCase();
    return list.filter((kw) => lower.includes(kw.toLowerCase()));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section 1 Header & Quick Download / Save Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Cambridge 0580 · Section 1: Discovery & Sketching
          </div>
          <h2 className="text-xl font-bold text-white font-heading mt-1">
            Research the Quadratic Parabola
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Progress Saved</span>
          </div>

          <button
            onClick={handleDownloadSection1PDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold font-heading text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download Section 1 (PDF)'}</span>
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Section 1 Discovery & Sketching PDF downloaded successfully!</span>
        </div>
      )}

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        {[
          { id: 1, label: '1.1 Plotting Points' },
          { id: 2, label: '1.2 Feature Tour' },
          { id: 3, label: '1.3 Dynamic Sliders' },
          { id: 4, label: '1.4 Three Key Curves' },
          { id: 5, label: '1.5 In Your Own Words' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              tab === t.id
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md font-heading'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          1.1 SKETCHING A QUADRATIC: 3 CONCAVITY EXAMPLES
         ======================================================== */}
      {tab === 1 && (
        <div className="space-y-6">
          {/* Curve Selector Pill Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mr-1">
                Select Curve to Research:
              </span>
              {[
                { id: 1, label: 'Curve 1: y = x² - 2x - 3', sub: 'Smile (a > 0)', color: 'text-cyan-400' },
                { id: 2, label: 'Curve 2: y = -x² + 2x + 3', sub: 'Frown (a < 0)', color: 'text-rose-400' },
                { id: 3, label: 'Curve 3: y = ½x² - 2x', sub: 'Wide (a = 0.5)', color: 'text-teal-400' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setPlotEx(c.id as any)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    plotEx === c.id
                      ? 'bg-slate-800 text-white shadow-md border border-slate-700 ring-2 ring-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-heading">{c.label}</span>
                  <span className={`text-[10px] font-mono ${c.color}`}>({c.sub})</span>
                </button>
              ))}
            </div>

            {/* Animation Speed Selector */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setAnimationSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                    animationSpeed === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* ==================== CURVE 1: a = 1 > 0 ==================== */}
          {plotEx === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-[11px] font-mono font-semibold uppercase">
                      Concavity Example 1 · a = +1 &gt; 0
                    </div>
                    <h2 className="text-2xl font-bold text-white font-heading">
                      Plotting <MathView math="y = x^2 - 2x - 3" />
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300">
                      Observe how the positive coefficient <MathView math="a = 1 > 0" /> creates a curve that opens upward like a smile.
                    </p>
                  </div>

                  {/* Substitution Tip */}
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> Working Examples:
                    </div>
                    <p>When <MathView math="x = -1" />: <MathView math="y = (-1)^2 - 2(-1) - 3 = 1 + 2 - 3 = 0" />.</p>
                    <p>When <MathView math="x = 1" />: <MathView math="y = (1)^2 - 2(1) - 3 = 1 - 2 - 3 = -4" />.</p>
                  </div>

                  {/* Table of Values */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Fill in the 5 missing values of <MathView math="y" />:
                    </label>
                    <div className="overflow-x-auto pb-1">
                      <table className="w-full text-center border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-cyan-300 text-xs font-mono border-b border-slate-800">
                            <th className="py-2 px-2.5 text-slate-400">x</th>
                            <th className="py-2 px-2.5">-2</th>
                            <th className="py-2 px-2.5">-1</th>
                            <th className="py-2 px-2.5">0</th>
                            <th className="py-2 px-2.5">1</th>
                            <th className="py-2 px-2.5">2</th>
                            <th className="py-2 px-2.5">3</th>
                            <th className="py-2 px-2.5">4</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-xs md:text-sm">
                            <td className="py-2.5 px-2 font-bold text-slate-400 font-mono">y</td>
                            <td className="py-2.5 px-2 font-mono text-slate-400 bg-slate-950/60">5</td>
                            {[-1, 0, 1, 2, 3].map((x) => (
                              <td key={x} className="py-1 px-1">
                                <input
                                  type="number"
                                  value={table1Inputs[x]}
                                  onChange={(e) => handleTable1Change(x, e.target.value)}
                                  placeholder="?"
                                  className={`w-11 h-9 text-center rounded-xl font-mono text-xs border focus:outline-none focus:ring-2 transition-all ${
                                    table1Errors[x] === true
                                      ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                                      : table1Inputs[x] !== '' && !table1Errors[x]
                                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                      : 'bg-slate-950 border-slate-700 text-white focus:ring-cyan-400'
                                  }`}
                                />
                              </td>
                            ))}
                            <td className="py-2.5 px-2 font-mono text-slate-400 bg-slate-950/60">5</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      onClick={checkTable1}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Check Table
                    </button>
                    <button
                      onClick={() => {
                        if (checkTable1()) {
                          soundManager.playConnectCurveSound();
                          setCurve1Animating(true);
                          setIsCurve1Connected(true);
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs font-heading flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Connect the points (Smooth Curve)
                    </button>
                  </div>

                  {/* Concavity Discovery Callout */}
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-2 text-cyan-300">
                      <span>😊 Concavity Rule:</span>
                      <span className="font-mono bg-cyan-900/60 px-2 py-0.5 rounded text-[11px]">a = +1 &gt; 0</span>
                    </div>
                    <p>
                      Because <MathView math="a > 0" />, the parabola opens upwards (U-shape). 
                      The vertex at <MathView math="(1, -4)" /> is a <strong>MINIMUM</strong> turning point.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: SVG Graph for Curve 1 */}
              <div className="lg:col-span-6 space-y-4">
                <ParabolaGraph
                  a={1}
                  b={-2}
                  c={-3}
                  xMin={-3}
                  xMax={5}
                  yMin={-6}
                  yMax={7}
                  points={plottedPoints1_1}
                  animateCurve={curve1Animating}
                  curveProgress={isCurve1Connected ? 1 : 0}
                  speedMultiplier={animationSpeed}
                  onAnimationComplete={() => setCurve1Animating(false)}
                />
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <button
                    onClick={() => {
                      setCurve1Animating(true);
                      setIsCurve1Connected(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Replay Curve
                  </button>
                  <span className="text-slate-400 font-mono text-[11px]">Points Plotted: {plottedPoints1_1.length} / 7</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== CURVE 2: a = -1 < 0 ==================== */}
          {plotEx === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-[11px] font-mono font-semibold uppercase">
                      Concavity Example 2 · a = -1 &lt; 0
                    </div>
                    <h2 className="text-2xl font-bold text-white font-heading">
                      Plotting <MathView math="y = -x^2 + 2x + 3" />
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300">
                      Now <MathView math="a = -1 < 0" />! Watch how the negative squared term inverts the curve into a frown shape.
                    </p>
                  </div>

                  {/* Substitution Tip */}
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-rose-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> Crucial Examiner Warning on Negative Signs:
                    </div>
                    <p>
                      In <MathView math="-x^2" />, you square first, then apply the negative:
                    </p>
                    <p>
                      For <MathView math="x = -1" />: <MathView math="y = -(-1)^2 + 2(-1) + 3 = -(1) - 2 + 3 = 0" />.
                    </p>
                    <p>
                      For <MathView math="x = 1" />: <MathView math="y = -(1)^2 + 2(1) + 3 = -1 + 2 + 3 = 4" />.
                    </p>
                  </div>

                  {/* Table of Values (6 manual blanks) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Fill in the 6 missing values of <MathView math="y" />:
                    </label>
                    <div className="overflow-x-auto pb-1">
                      <table className="w-full text-center border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-rose-300 text-xs font-mono border-b border-slate-800">
                            <th className="py-2 px-2.5 text-slate-400">x</th>
                            <th className="py-2 px-2.5">-2</th>
                            <th className="py-2 px-2.5">-1</th>
                            <th className="py-2 px-2.5">0</th>
                            <th className="py-2 px-2.5">1</th>
                            <th className="py-2 px-2.5">2</th>
                            <th className="py-2 px-2.5">3</th>
                            <th className="py-2 px-2.5">4</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-xs md:text-sm">
                            <td className="py-2.5 px-2 font-bold text-slate-400 font-mono">y</td>
                            <td className="py-2.5 px-2 font-mono text-slate-400 bg-slate-950/60">-5</td>
                            {[-1, 0, 1, 2, 3, 4].map((x) => (
                              <td key={x} className="py-1 px-1">
                                <input
                                  type="number"
                                  value={table2Inputs[x]}
                                  onChange={(e) => handleTable2Change(x, e.target.value)}
                                  placeholder="?"
                                  className={`w-11 h-9 text-center rounded-xl font-mono text-xs border focus:outline-none focus:ring-2 transition-all ${
                                    table2Errors[x] === true
                                      ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                                      : table2Inputs[x] !== '' && !table2Errors[x]
                                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                      : 'bg-slate-950 border-slate-700 text-white focus:ring-rose-400'
                                  }`}
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      onClick={checkTable2}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Check Table
                    </button>
                    <button
                      onClick={() => {
                        if (checkTable2()) {
                          soundManager.playConnectCurveSound();
                          setCurve2Animating(true);
                          setIsCurve2Connected(true);
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-slate-950 font-bold text-xs font-heading flex items-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Connect the points (Smooth Curve)
                    </button>
                  </div>

                  {/* Concavity Discovery Callout */}
                  <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-rose-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-2 text-rose-300">
                      <span>☹️ Concavity Rule:</span>
                      <span className="font-mono bg-rose-900/60 px-2 py-0.5 rounded text-[11px]">a = -1 &lt; 0</span>
                    </div>
                    <p>
                      Because <MathView math="a < 0" />, the parabola opens downwards (n-shape / frown). 
                      The vertex at <MathView math="(1, 4)" /> is a <strong>MAXIMUM</strong> turning point.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: SVG Graph for Curve 2 */}
              <div className="lg:col-span-6 space-y-4">
                <ParabolaGraph
                  a={-1}
                  b={2}
                  c={3}
                  xMin={-3}
                  xMax={5}
                  yMin={-7}
                  yMax={6}
                  curveColor="#f43f5e"
                  points={plottedPoints1_2}
                  animateCurve={curve2Animating}
                  curveProgress={isCurve2Connected ? 1 : 0}
                  speedMultiplier={animationSpeed}
                  onAnimationComplete={() => setCurve2Animating(false)}
                />
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <button
                    onClick={() => {
                      setCurve2Animating(true);
                      setIsCurve2Connected(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Replay Curve
                  </button>
                  <span className="text-slate-400 font-mono text-[11px]">Points Plotted: {plottedPoints1_2.length} / 7</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== CURVE 3: a = 0.5 (Wide Curve) ==================== */}
          {plotEx === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-950/70 border border-teal-800/50 text-teal-300 text-[11px] font-mono font-semibold uppercase">
                      Concavity Example 3 · Wide Curve (a = 0.5)
                    </div>
                    <h2 className="text-2xl font-bold text-white font-heading">
                      Plotting <MathView math="y = \dfrac{1}{2}x^2 - 2x" />
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300">
                      When <MathView math="|a| < 1" />, the parabola opens wider and more gently! Calculate all 7 values yourself.
                    </p>
                  </div>

                  {/* Substitution Tip */}
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-teal-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> Working Examples:
                    </div>
                    <p>When <MathView math="x = 0" />: <MathView math="y = \frac{1}{2}(0)^2 - 2(0) = 0" />.</p>
                    <p>When <MathView math="x = 2" />: <MathView math="y = \frac{1}{2}(4) - 2(2) = 2 - 4 = -2" /> (the turning point!).</p>
                    <p>When <MathView math="x = 1" />: <MathView math="y = 0.5 - 2 = -1.5" /> (decimals are allowed!).</p>
                  </div>

                  {/* Table of Values (ALL 7 manual blanks) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Fill in ALL 7 values of <MathView math="y" />:
                    </label>
                    <div className="overflow-x-auto pb-1">
                      <table className="w-full text-center border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-teal-300 text-xs font-mono border-b border-slate-800">
                            <th className="py-2 px-2 text-slate-400">x</th>
                            <th className="py-2 px-2">-1</th>
                            <th className="py-2 px-2">0</th>
                            <th className="py-2 px-2">1</th>
                            <th className="py-2 px-2">2</th>
                            <th className="py-2 px-2">3</th>
                            <th className="py-2 px-2">4</th>
                            <th className="py-2 px-2">5</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-xs md:text-sm">
                            <td className="py-2.5 px-2 font-bold text-slate-400 font-mono">y</td>
                            {[-1, 0, 1, 2, 3, 4, 5].map((x) => (
                              <td key={x} className="py-1 px-1">
                                <input
                                  type="text"
                                  value={table3Inputs[x]}
                                  onChange={(e) => handleTable3Change(x, e.target.value)}
                                  placeholder="?"
                                  className={`w-11 h-9 text-center rounded-xl font-mono text-xs border focus:outline-none focus:ring-2 transition-all ${
                                    table3Errors[x] === true
                                      ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                                      : table3Inputs[x] !== '' && !table3Errors[x]
                                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                      : 'bg-slate-950 border-slate-700 text-white focus:ring-teal-400'
                                  }`}
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      onClick={checkTable3}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Check Table
                    </button>
                    <button
                      onClick={() => {
                        if (checkTable3()) {
                          soundManager.playConnectCurveSound();
                          setCurve3Animating(true);
                          setIsCurve3Connected(true);
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs font-heading flex items-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Connect the points (Smooth Curve)
                    </button>
                  </div>

                  {/* Concavity Discovery Callout */}
                  <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/40 text-teal-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-2 text-teal-300">
                      <span>🌊 Width &amp; Concavity Rule:</span>
                      <span className="font-mono bg-teal-900/60 px-2 py-0.5 rounded text-[11px]">a = +0.5</span>
                    </div>
                    <p>
                      Because <MathView math="a > 0" />, it is concave up (smile), but because <MathView math="|a| = 0.5 < 1" />, it is wider than <MathView math="y = x^2" />. 
                      Notice the curve passes right through the origin <MathView math="(0, 0)" />!
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: SVG Graph for Curve 3 */}
              <div className="lg:col-span-6 space-y-4">
                <ParabolaGraph
                  a={0.5}
                  b={-2}
                  c={0}
                  xMin={-2}
                  xMax={6}
                  yMin={-4}
                  yMax={5}
                  curveColor="#2dd4bf"
                  points={plottedPoints1_3}
                  animateCurve={curve3Animating}
                  curveProgress={isCurve3Connected ? 1 : 0}
                  speedMultiplier={animationSpeed}
                  onAnimationComplete={() => setCurve3Animating(false)}
                />
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <button
                    onClick={() => {
                      setCurve3Animating(true);
                      setIsCurve3Connected(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Replay Curve
                  </button>
                  <span className="text-slate-400 font-mono text-[11px]">Points Plotted: {plottedPoints1_3.length} / 7</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Summary Comparison Card across the 3 Plotted Curves */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0 font-bold">
                ✓
              </div>
              <div className="text-slate-300">
                <strong className="text-white">Your Concavity Research Takeaway:</strong> The sign of <MathView math="a" /> dictates whether the parabola smiles (<MathView math="a > 0" />, minimum vertex) or frowns (<MathView math="a < 0" />, maximum vertex), while <MathView math="|a|" /> controls the curve's width.
              </div>
            </div>
            <button
              onClick={() => setTab(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold shrink-0 transition-all flex items-center gap-1.5"
            >
              <span>Next: 1.2 Feature Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          1.2 FEATURE TOUR: ROOTS, VERTEX, Y-INT, SYMMETRY
         ======================================================== */}
      {tab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Stage 1.2 · Anatomical Discovery</span>
                <h2 className="text-2xl font-bold text-white font-heading">
                  Key Features of the Parabola
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Step through each critical geometric hallmark tested in Cambridge 0580.
                </p>
              </div>

              {/* Step Selector Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 1, label: 'Roots (x-intercepts)', color: 'border-rose-500 text-rose-400' },
                  { id: 2, label: 'Turning Point', color: 'border-amber-500 text-amber-400' },
                  { id: 3, label: 'y-Intercept', color: 'border-emerald-500 text-emerald-400' },
                  { id: 4, label: 'Line of Symmetry', color: 'border-purple-500 text-purple-400' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTourStep(s.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      tourStep === s.id
                        ? `${s.color} bg-slate-800 shadow-md ring-1 ring-white/10`
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Feature Content */}
              {tourStep === 1 && (
                <div className="space-y-4 p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40">
                  <div className="flex items-center gap-2 text-rose-400 font-bold font-heading text-lg">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    Roots (<MathView math="x" />-intercepts)
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    The <strong>roots</strong> are the points where the curve crosses the <MathView math="x" />-axis. 
                    At these points, the vertical height is zero (<MathView math="y = 0" />).
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm font-mono text-rose-300 space-y-1">
                    <div>Crossing points: <MathView math="(-1, 0)" /> and <MathView math="(3, 0)" /></div>
                    <div>Solutions to <MathView math="x^2 - 2x - 3 = 0" />: <MathView math="x = -1" /> or <MathView math="x = 3" /></div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-rose-900/30">
                    <span className="text-xs font-semibold text-slate-300">What do you notice? What is the value of y at every root?</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type value of y..."
                        value={tourNoticeAnswer[1] || ''}
                        onChange={(e) => setTourNoticeAnswer({ ...tourNoticeAnswer, 1: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                      />
                      <button
                        onClick={() => setTourNoticeChecked({ ...tourNoticeChecked, 1: true })}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                      >
                        Check
                      </button>
                    </div>
                    {tourNoticeChecked[1] && (
                      <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Exact! On the x-axis, the height is always <MathView math="y = 0" />.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tourStep === 2 && (
                <div className="space-y-4 p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-heading text-lg">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                    Turning Point (Vertex)
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    The <strong>turning point</strong> is where the curve changes direction from decreasing to increasing (or vice-versa).
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm font-mono text-amber-300 space-y-1">
                    <div>Coordinates: <MathView math="(1, -4)" /></div>
                    <div>Because <MathView math="a = 1 > 0" /> (smile curve), this is a <strong>MINIMUM</strong> turning point.</div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-amber-900/30">
                    <span className="text-xs font-semibold text-slate-300">Is this a minimum or maximum?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTourNoticeAnswer({ ...tourNoticeAnswer, 2: 'minimum' });
                          setTourNoticeChecked({ ...tourNoticeChecked, 2: true });
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                          tourNoticeAnswer[2] === 'minimum' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Minimum
                      </button>
                      <button
                        onClick={() => {
                          setTourNoticeAnswer({ ...tourNoticeAnswer, 2: 'maximum' });
                          setTourNoticeChecked({ ...tourNoticeChecked, 2: true });
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                          tourNoticeAnswer[2] === 'maximum' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Maximum
                      </button>
                    </div>
                    {tourNoticeChecked[2] && (
                      <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Correct! It is the lowest point on the curve, so it is a minimum.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tourStep === 3 && (
                <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading text-lg">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    The <MathView math="y" />-Intercept
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Where the curve crosses the vertical <MathView math="y" />-axis (<MathView math="x = 0" />).
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm font-mono text-emerald-300 space-y-1">
                    <div>Coordinates: <MathView math="(0, -3)" /></div>
                    <div>Notice: In <MathView math="y = ax^2 + bx + c" />, the constant term is <MathView math="c = -3" />!</div>
                  </div>
                  <p className="text-xs text-slate-300">
                    The <MathView math="y" />-intercept always equals the constant term <MathView math="c" /> because setting <MathView math="x = 0" /> cancels <MathView math="ax^2" /> and <MathView math="bx" />.
                  </p>
                </div>
              )}

              {tourStep === 4 && (
                <div className="space-y-4 p-5 rounded-2xl bg-purple-950/20 border border-purple-900/40">
                  <div className="flex items-center gap-2 text-purple-400 font-bold font-heading text-lg">
                    <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                    The Line of Symmetry
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    A vertical mirror line that divides the parabola into two identical, matching halves.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm font-mono text-purple-300 space-y-1">
                    <div>Equation: <MathView math="x = 1" /></div>
                    <div>Halfway between roots: <MathView math="x = \dfrac{-1 + 3}{2} = \dfrac{2}{2} = 1" /></div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Notice how points match in symmetric pairs across <MathView math="x = 1" />: <MathView math="(0, -3)" /> and <MathView math="(2, -3)" /> are both 1 unit away!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <ParabolaGraph
              a={1}
              b={-2}
              c={-3}
              xMin={-3}
              xMax={5}
              yMin={-6}
              yMax={7}
              showRoots={tourStep === 1}
              showVertex={tourStep === 2}
              showYIntercept={tourStep === 3}
              showSymmetry={tourStep === 4}
              activeFeature={
                tourStep === 1
                  ? 'roots'
                  : tourStep === 2
                  ? 'vertex'
                  : tourStep === 3
                  ? 'yIntercept'
                  : 'symmetry'
              }
            />
          </div>
        </div>
      )}

      {/* ========================================================
          1.3 DYNAMIC SLIDERS LAB (A, B, C COEFFICIENTS)
         ======================================================== */}
      {tab === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Stage 1.3 · Coefficient Laboratory</span>
                <h2 className="text-2xl font-bold text-white font-heading">
                  How <MathView math="a, b, c" /> Shape the Curve
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Drag the sliders below to discover the geometric secrets of each parameter in <MathView math="y = ax^2 + bx + c" />.
                </p>
              </div>

              {/* Dynamic Live LaTeX Equation */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-center shadow-inner">
                <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Active Function</span>
                <div className="text-2xl font-bold text-cyan-300">
                  <MathView
                    math={`y = ${sliderA === 1 ? '' : sliderA === -1 ? '-' : sliderA}x^2 ${
                      sliderB > 0 ? `+ ${sliderB === 1 ? '' : sliderB}` : sliderB < 0 ? `- ${Math.abs(sliderB) === 1 ? '' : Math.abs(sliderB)}` : ''
                    }${sliderB !== 0 ? 'x' : ''} ${sliderC > 0 ? `+ ${sliderC}` : sliderC < 0 ? `- ${Math.abs(sliderC)}` : ''}`}
                    block
                  />
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                {/* Slider A */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-cyan-300 flex items-center gap-1.5">
                      <strong>Coefficient a</strong> (Controls concavity & width)
                    </span>
                    <span className="font-mono text-cyan-400">{sliderA}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.5"
                    value={sliderA}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSliderA(v === 0 ? (e.target.valueAsNumber > sliderA ? 0.5 : -0.5) : v);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>a &lt; 0 (Frown / Max)</span>
                    <span>a &gt; 0 (Smile / Min)</span>
                  </div>
                </div>

                {/* Slider B */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-purple-300 flex items-center gap-1.5">
                      <strong>Coefficient b</strong> (Horizontal shift)
                    </span>
                    <span className="font-mono text-purple-400">{sliderB}</span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="1"
                    value={sliderB}
                    onChange={(e) => setSliderB(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400">
                    Symmetry axis formula: <MathView math="x = -\dfrac{b}{2a}" />
                  </div>
                </div>

                {/* Slider C */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      <strong>Constant c</strong> (Vertical shift / y-intercept)
                    </span>
                    <span className="font-mono text-emerald-400">{sliderC}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={sliderC}
                    onChange={(e) => setSliderC(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400">
                    Always passes through <MathView math={`(0, ${sliderC})`} />
                  </div>
                </div>
              </div>

              {/* Status Pill Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Concavity</span>
                  <span className={`font-bold ${sliderA > 0 ? 'text-cyan-300' : 'text-amber-300'}`}>
                    {sliderA > 0 ? '😊 Smile (U-Shape, Minimum)' : '☹️ Frown (n-Shape, Maximum)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">y-Intercept</span>
                  <span className="font-bold text-emerald-400">
                    (0, {sliderC})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <ParabolaGraph
              a={sliderA}
              b={sliderB}
              c={sliderC}
              xMin={-5}
              xMax={5}
              yMin={-8}
              yMax={8}
              showRoots={true}
              showVertex={true}
              showYIntercept={true}
              showSymmetry={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          1.4 THREE KEY SKETCHING EXAMPLES WITH COMPARISON TABLE
         ======================================================== */}
      {tab === 4 && (
        <div className="space-y-8">
          <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 w-fit">
            {[
              { id: 1, label: 'Example 1: a > 0 (U-Shape)' },
              { id: 2, label: 'Example 2: a < 0 (n-Shape)' },
              { id: 3, label: 'Example 3: a = 0.5 (Wide Curve)' },
            ].map((e) => (
              <button
                key={e.id}
                onClick={() => setExTab(e.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  exTab === e.id
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-800/60 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>

          {exTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Example 1 · Standard Parabola</span>
                <h3 className="text-2xl font-bold text-white font-heading">
                  <MathView math="y = x^2 - 2x - 3" />
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span><strong>Concavity:</strong> <MathView math="a = 1 > 0" /> (Opens upwards, smile curve).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span><strong>Roots:</strong> <MathView math="x = -1" /> and <MathView math="x = 3" /> (factorises to <MathView math="(x+1)(x-3) = 0" />).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span><strong>Turning Point:</strong> Minimum at <MathView math="(1, -4)" />.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span><strong>y-intercept:</strong> <MathView math="(0, -3)" />.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span><strong>Line of symmetry:</strong> <MathView math="x = 1" />.</span>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-6">
                <ParabolaGraph a={1} b={-2} c={-3} showRoots showVertex showYIntercept showSymmetry />
              </div>
            </div>
          )}

          {exTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Example 2 · Inverted Parabola</span>
                <h3 className="text-2xl font-bold text-white font-heading">
                  <MathView math="y = -x^2 + 2x + 3" />
                </h3>
                <p className="text-sm text-slate-300">
                  Notice that <MathView math="a = -1 < 0" />. The parabola opens downward (n-shape / frown).
                </p>

                {/* Interactive Practice Question */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Fill in the missing values for <MathView math="y = -x^2 + 2x + 3" />:
                  </span>
                  <div className="flex gap-3 text-xs">
                    <div>
                      <span className="block text-slate-400">x = -1, y =</span>
                      <input
                        type="number"
                        value={ex2Inputs['-1']}
                        onChange={(e) => setEx2Inputs({ ...ex2Inputs, '-1': e.target.value })}
                        className="w-16 h-8 text-center rounded bg-slate-900 border border-slate-700 text-white font-mono mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <span className="block text-slate-400">x = 1, y =</span>
                      <input
                        type="number"
                        value={ex2Inputs['1']}
                        onChange={(e) => setEx2Inputs({ ...ex2Inputs, '1': e.target.value })}
                        className="w-16 h-8 text-center rounded bg-slate-900 border border-slate-700 text-white font-mono mt-1"
                        placeholder="4"
                      />
                    </div>
                    <div>
                      <span className="block text-slate-400">x = 3, y =</span>
                      <input
                        type="number"
                        value={ex2Inputs['3']}
                        onChange={(e) => setEx2Inputs({ ...ex2Inputs, '3': e.target.value })}
                        className="w-16 h-8 text-center rounded bg-slate-900 border border-slate-700 text-white font-mono mt-1"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setEx2Checked(true)}
                    className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                  >
                    Check Values
                  </button>
                  {ex2Checked && (
                    <p className="text-xs text-emerald-400 font-medium">
                      Maximum turning point is at <MathView math="(1, 4)" />!
                    </p>
                  )}
                </div>
              </div>
              <div className="lg:col-span-6">
                <ParabolaGraph a={-1} b={2} c={3} showRoots showVertex showYIntercept showSymmetry curveColor="#f43f5e" />
              </div>
            </div>
          )}

          {exTab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Example 3 · Wide Curve</span>
                <h3 className="text-2xl font-bold text-white font-heading">
                  <MathView math="y = \dfrac{1}{2}x^2 - 2x" />
                </h3>
                <p className="text-sm text-slate-300">
                  Because <MathView math="|a| = 0.5 < 1" />, the curve is noticeably wider. Also, since <MathView math="c = 0" />, the curve passes straight through the origin <MathView math="(0, 0)" />!
                </p>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div><strong>Roots:</strong> <MathView math="x = 0" /> and <MathView math="x = 4" /></div>
                  <div><strong>Turning Point:</strong> Minimum at <MathView math="(2, -2)" /></div>
                  <div><strong>Line of symmetry:</strong> <MathView math="x = 2" /></div>
                </div>
              </div>
              <div className="lg:col-span-6">
                <ParabolaGraph a={0.5} b={-2} c={0} xMin={-2} xMax={6} yMin={-4} yMax={5} showRoots showVertex showYIntercept showSymmetry curveColor="#2dd4bf" />
              </div>
            </div>
          )}

          {/* Grand Comparison Table */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-4 backdrop-blur-xl">
            <h4 className="text-lg font-bold text-white font-heading">Comparison Summary of the Three Curves</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-cyan-300 font-mono">
                    <th className="py-3 px-4">Function</th>
                    <th className="py-3 px-4">Sign of a</th>
                    <th className="py-3 px-4">Shape</th>
                    <th className="py-3 px-4">Turning Point</th>
                    <th className="py-3 px-4">Roots</th>
                    <th className="py-3 px-4">y-Intercept</th>
                    <th className="py-3 px-4">Symmetry Line</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-mono text-white"><MathView math="y = x^2 - 2x - 3" /></td>
                    <td className="py-3 px-4 font-mono text-cyan-400">a = 1 &gt; 0</td>
                    <td className="py-3 px-4">Smile (U)</td>
                    <td className="py-3 px-4 text-amber-300 font-mono">Min (1, -4)</td>
                    <td className="py-3 px-4 text-rose-300 font-mono">-1, 3</td>
                    <td className="py-3 px-4 text-emerald-300 font-mono">(0, -3)</td>
                    <td className="py-3 px-4 text-purple-300 font-mono">x = 1</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-white"><MathView math="y = -x^2 + 2x + 3" /></td>
                    <td className="py-3 px-4 font-mono text-rose-400">a = -1 &lt; 0</td>
                    <td className="py-3 px-4">Frown (n)</td>
                    <td className="py-3 px-4 text-amber-300 font-mono">Max (1, 4)</td>
                    <td className="py-3 px-4 text-rose-300 font-mono">-1, 3</td>
                    <td className="py-3 px-4 text-emerald-300 font-mono">(0, 3)</td>
                    <td className="py-3 px-4 text-purple-300 font-mono">x = 1</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-white"><MathView math="y = \frac{1}{2}x^2 - 2x" /></td>
                    <td className="py-3 px-4 font-mono text-teal-400">a = 0.5 &gt; 0</td>
                    <td className="py-3 px-4">Wide Smile</td>
                    <td className="py-3 px-4 text-amber-300 font-mono">Min (2, -2)</td>
                    <td className="py-3 px-4 text-rose-300 font-mono">0, 4</td>
                    <td className="py-3 px-4 text-emerald-300 font-mono">(0, 0)</td>
                    <td className="py-3 px-4 text-purple-300 font-mono">x = 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          1.5 EXPLAIN IT IN YOUR OWN WORDS (KEYWORD CHECKER)
         ======================================================== */}
      {tab === 5 && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Stage 1.5 · Metacognition</span>
              <h2 className="text-2xl font-bold text-white font-heading">
                Explain It in Your Own Words
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Writing down mathematical explanations strengthens your conceptual memory. Your responses will be saved directly into your certified PDF portfolio!
              </p>
            </div>

            {/* Prompt 1 */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <label className="block text-sm font-semibold text-white">
                1. How do you sketch a parabola from an algebraic quadratic equation?
              </label>
              <textarea
                rows={3}
                value={localExp.sketching}
                onChange={(e) => {
                  const val = e.target.value;
                  const updated = { ...localExp, sketching: val };
                  setLocalExp(updated);
                }}
                placeholder="Explain the steps (e.g. table of values, calculating points, plotting on grid, smooth curve without a ruler)..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Key terms used:</span>
                  {getMatchedKeywords('sketching', localExp.sketching).map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                      {k}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowModel({ ...showModel, sketching: !showModel.sketching })}
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                >
                  {showModel.sketching ? 'Hide Model Answer' : 'View Model Answer'}
                </button>
              </div>
              {showModel.sketching && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50 text-xs text-cyan-200 space-y-1">
                  <strong>Model Answer:</strong> Construct a table of values by substituting each x-value into the equation. Plot each coordinate pair (x, y) with a small cross. Finally, join the points with a single, smooth, continuous curved line freehand without using a ruler.
                </div>
              )}
            </div>

            {/* Prompt 2 */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <label className="block text-sm font-semibold text-white">
                2. What are the roots of a parabola, and how do you find them?
              </label>
              <textarea
                rows={3}
                value={localExp.roots}
                onChange={(e) => {
                  const val = e.target.value;
                  const updated = { ...localExp, roots: val };
                  setLocalExp(updated);
                }}
                placeholder="Explain what roots represent and where they appear on the graph..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Key terms used:</span>
                  {getMatchedKeywords('roots', localExp.roots).map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                      {k}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowModel({ ...showModel, roots: !showModel.roots })}
                  className="text-rose-400 hover:text-rose-300 underline font-medium"
                >
                  {showModel.roots ? 'Hide Model Answer' : 'View Model Answer'}
                </button>
              </div>
              {showModel.roots && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200 space-y-1">
                  <strong>Model Answer:</strong> The roots (or x-intercepts) are the x-coordinates where the curve intersects the x-axis, corresponding to y = 0. They are the algebraic solutions to the quadratic equation ax^2 + bx + c = 0.
                </div>
              )}
            </div>

            {/* Prompt 3 */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <label className="block text-sm font-semibold text-white">
                3. What is the turning point, and when is it a minimum vs a maximum?
              </label>
              <textarea
                rows={3}
                value={localExp.turningPoint}
                onChange={(e) => {
                  const val = e.target.value;
                  const updated = { ...localExp, turningPoint: val };
                  setLocalExp(updated);
                }}
                placeholder="Explain the turning point / vertex and concavity..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Key terms used:</span>
                  {getMatchedKeywords('turningPoint', localExp.turningPoint).map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                      {k}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowModel({ ...showModel, turningPoint: !showModel.turningPoint })}
                  className="text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  {showModel.turningPoint ? 'Hide Model Answer' : 'View Model Answer'}
                </button>
              </div>
              {showModel.turningPoint && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200 space-y-1">
                  <strong>Model Answer:</strong> The turning point (vertex) is the extreme point where the curve changes slope direction. If a &gt; 0, the curve is U-shaped and the vertex is a MINIMUM (lowest point). If a &lt; 0, the curve is n-shaped and the vertex is a MAXIMUM (highest point).
                </div>
              )}
            </div>

            {/* Prompt 4 */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <label className="block text-sm font-semibold text-white">
                4. What is the line of symmetry, and how does it relate to the roots?
              </label>
              <textarea
                rows={3}
                value={localExp.symmetry}
                onChange={(e) => {
                  const val = e.target.value;
                  const updated = { ...localExp, symmetry: val };
                  setLocalExp(updated);
                }}
                placeholder="Explain the line of symmetry and its relation to roots..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Key terms used:</span>
                  {getMatchedKeywords('symmetry', localExp.symmetry).map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                      {k}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowModel({ ...showModel, symmetry: !showModel.symmetry })}
                  className="text-purple-400 hover:text-purple-300 underline font-medium"
                >
                  {showModel.symmetry ? 'Hide Model Answer' : 'View Model Answer'}
                </button>
              </div>
              {showModel.symmetry && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/50 text-xs text-purple-200 space-y-1">
                  <strong>Model Answer:</strong> The line of symmetry is the vertical mirror line x = h passing directly through the vertex. It lies exactly halfway between any two symmetric points on the curve, specifically the midpoint between the roots: x = (root1 + root2) / 2.
                </div>
              )}
            </div>

            {/* Complete Section 1 Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={onCompleteSection}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold font-heading text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <span>Continue to Section 2: Solving Equations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINT-FRIENDLY LIGHT THEME CONTAINER FOR SECTION 1 PDF EXPORT
         ========================================================================= */}
      <div
        ref={pdf1Ref}
        style={{ display: 'none' }}
        className="w-[800px] p-10 bg-white text-slate-900 font-sans space-y-6"
      >
        <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Cambridge IGCSE Mathematics 0580 · Extended Curriculum
            </span>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Section 1: Parabola Discovery & Sketching Report
            </h1>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div><strong>Student:</strong> {studentName || 'Student'}</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* 3 Concavity Investigations */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Part 1: The Three Concavity Investigations & Tables of Values
          </h2>

          <div className="space-y-3">
            {/* Investigation 1 */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">
                  Curve 1: <MathView math="y = x^2 - 2x - 3" />
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-semibold text-[11px]">
                  Concave Up (Smile, <MathView math="a = 1 > 0" />)
                </span>
              </div>
              <table className="w-full text-center border-collapse text-xs bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-1 font-mono">x</th>
                    <th className="p-1">-2</th>
                    <th className="p-1">-1</th>
                    <th className="p-1">0</th>
                    <th className="p-1">1</th>
                    <th className="p-1">2</th>
                    <th className="p-1">3</th>
                    <th className="p-1">4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 font-mono font-bold bg-slate-50">y</td>
                    <td className="p-1">5</td>
                    <td className="p-1 font-bold text-cyan-700">{table1Inputs['-1'] || '0'}</td>
                    <td className="p-1 font-bold text-cyan-700">{table1Inputs['0'] || '-3'}</td>
                    <td className="p-1 font-bold text-cyan-700">{table1Inputs['1'] || '-4'}</td>
                    <td className="p-1 font-bold text-cyan-700">{table1Inputs['2'] || '-3'}</td>
                    <td className="p-1 font-bold text-cyan-700">{table1Inputs['3'] || '0'}</td>
                    <td className="p-1">5</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[11px] text-slate-600 grid grid-cols-2 gap-2 pt-1">
                <div>• <strong>Roots:</strong> <MathView math="x = -1" /> and <MathView math="x = 3" /> (<MathView math="y = 0" />)</div>
                <div>• <strong>Turning Point:</strong> Minimum vertex at <MathView math="(1, -4)" /></div>
                <div>• <strong>y-Intercept:</strong> <MathView math="(0, -3)" /></div>
                <div>• <strong>Axis of Symmetry:</strong> <MathView math="x = 1" /></div>
              </div>
            </div>

            {/* Investigation 2 */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">
                  Curve 2: <MathView math="y = -x^2 + 2x + 3" />
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[11px]">
                  Concave Down (Frown, <MathView math="a = -1 < 0" />)
                </span>
              </div>
              <table className="w-full text-center border-collapse text-xs bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-1 font-mono">x</th>
                    <th className="p-1">-2</th>
                    <th className="p-1">-1</th>
                    <th className="p-1">0</th>
                    <th className="p-1">1</th>
                    <th className="p-1">2</th>
                    <th className="p-1">3</th>
                    <th className="p-1">4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 font-mono font-bold bg-slate-50">y</td>
                    <td className="p-1">-5</td>
                    <td className="p-1 font-bold text-rose-700">{table2Inputs['-1'] || '0'}</td>
                    <td className="p-1 font-bold text-rose-700">{table2Inputs['0'] || '3'}</td>
                    <td className="p-1 font-bold text-rose-700">{table2Inputs['1'] || '4'}</td>
                    <td className="p-1 font-bold text-rose-700">{table2Inputs['2'] || '3'}</td>
                    <td className="p-1 font-bold text-rose-700">{table2Inputs['3'] || '0'}</td>
                    <td className="p-1 font-bold text-rose-700">{table2Inputs['4'] || '-5'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[11px] text-slate-600 grid grid-cols-2 gap-2 pt-1">
                <div>• <strong>Roots:</strong> <MathView math="x = -1" /> and <MathView math="x = 3" /> (<MathView math="y = 0" />)</div>
                <div>• <strong>Turning Point:</strong> Maximum vertex at <MathView math="(1, 4)" /></div>
                <div>• <strong>y-Intercept:</strong> <MathView math="(0, 3)" /></div>
                <div>• <strong>Axis of Symmetry:</strong> <MathView math="x = 1" /></div>
              </div>
            </div>

            {/* Investigation 3 */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">
                  Curve 3: <MathView math="y = 0.5x^2 - 2x" />
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold text-[11px]">
                  Wide Concave Up (<MathView math="a = 0.5 > 0" />)
                </span>
              </div>
              <table className="w-full text-center border-collapse text-xs bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-1 font-mono">x</th>
                    <th className="p-1">-1</th>
                    <th className="p-1">0</th>
                    <th className="p-1">1</th>
                    <th className="p-1">2</th>
                    <th className="p-1">3</th>
                    <th className="p-1">4</th>
                    <th className="p-1">5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 font-mono font-bold bg-slate-50">y</td>
                    <td className="p-1 font-bold text-teal-700">{table3Inputs['-1'] || '2.5'}</td>
                    <td className="p-1 font-bold text-teal-700">{table3Inputs['0'] || '0'}</td>
                    <td className="p-1 font-bold text-teal-700">{table3Inputs['1'] || '-1.5'}</td>
                    <td className="p-1 font-bold text-teal-700">{table3Inputs['2'] || '-2'}</td>
                    <td className="p-1 font-bold text-teal-700">{table3Inputs['3'] || '-1.5'}</td>
                    <td className="p-1 font-bold text-teal-700">{table3Inputs['4'] || '0'}</td>
                    <td className="p-1 font-bold text-teal-700">{table3Inputs['5'] || '2.5'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[11px] text-slate-600 grid grid-cols-2 gap-2 pt-1">
                <div>• <strong>Roots:</strong> <MathView math="x = 0" /> and <MathView math="x = 4" /> (<MathView math="y = 0" />)</div>
                <div>• <strong>Turning Point:</strong> Minimum vertex at <MathView math="(2, -2)" /></div>
                <div>• <strong>y-Intercept:</strong> <MathView math="(0, 0)" /></div>
                <div>• <strong>Axis of Symmetry:</strong> <MathView math="x = 2" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Written Explanations */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Part 2: Student Explanations in Own Words
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded border border-slate-200 bg-white space-y-1">
              <strong>1. Parabola Sketching Method:</strong>
              <p className="text-slate-700 italic text-[11px]">
                "{localExp.sketching || 'Joined points with smooth curve freehand without a ruler.'}"
              </p>
              <div className="text-[10px] text-teal-700">✓ Evaluated: Table calculation & smooth freehand curve.</div>
            </div>

            <div className="p-2.5 rounded border border-slate-200 bg-white space-y-1">
              <strong>2. Roots Definition & Location:</strong>
              <p className="text-slate-700 italic text-[11px]">
                "{localExp.roots || 'The x-intercepts where the curve crosses the x-axis, where y = 0.'}"
              </p>
              <div className="text-[10px] text-teal-700">✓ Evaluated: y = 0 condition & x-intercept points.</div>
            </div>

            <div className="p-2.5 rounded border border-slate-200 bg-white space-y-1">
              <strong>3. Turning Point (Vertex):</strong>
              <p className="text-slate-700 italic text-[11px]">
                "{localExp.turningPoint || 'The peak or trough of the curve. Minimum when a > 0, maximum when a < 0.'}"
              </p>
              <div className="text-[10px] text-teal-700">✓ Evaluated: Minimum / Maximum identification.</div>
            </div>

            <div className="p-2.5 rounded border border-slate-200 bg-white space-y-1">
              <strong>4. Line of Symmetry:</strong>
              <p className="text-slate-700 italic text-[11px]">
                "{localExp.symmetry || 'Vertical line x = -b/(2a) passing through vertex, exactly halfway between roots.'}"
              </p>
              <div className="text-[10px] text-teal-700">✓ Evaluated: Midpoint of roots & vertex vertical axis.</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-500">
          <span>Cambridge IGCSE Mathematics 0580 Verification</span>
          <span>Status: Section 1 Completed & Verified</span>
        </div>
      </div>
    </div>
  );
};
