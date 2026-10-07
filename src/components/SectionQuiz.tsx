import React, { useState, useRef } from 'react';
import { MathView } from './MathView';
import { ParabolaGraph } from './ParabolaGraph';
import { soundManager } from '../utils/soundEffects';
import { exportElementToPdf } from '../utils/pdfExport';
import { Section3State } from '../types';
import {
  Award,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Download,
  FileCheck,
  Compass,
  GitCommit,
  Layers
} from 'lucide-react';

interface SectionQuizProps {
  state: Section3State;
  onChange: (updater: (prev: Section3State) => Section3State) => void;
  studentName: string;
  onCompleteQuiz: () => void;
}

export const SectionQuiz: React.FC<SectionQuizProps> = ({
  state,
  onChange,
  studentName,
  onCompleteQuiz,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const pdf3Ref = useRef<HTMLDivElement>(null);

  const handleDownloadSection3PDF = async () => {
    if (!pdf3Ref.current) return;
    setIsExporting(true);
    const safeName = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const success = await exportElementToPdf(pdf3Ref.current, `IGCSE_Maths_0580_Section3_Assessment_${safeName}.pdf`);
    setIsExporting(false);
    if (success) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }
  };

  const {
    activeTab,
    showHint,
    showSolution,
    q1Table,
    q1YInt,
    q2Roots,
    q2TP,
    q2Sym,
    q3Type,
    q3YInt,
    q4TP,
    q4Sym,
    q5Disc,
    q5NumRoots,
    q6Ans,
    q7Ans,
    q8NumSol,
    q8Ans,
    q9Ans,
    q10NumSol,
    q10Explanation,
    quizAnswers,
    quizChecked,
    quizCorrect,
    score,
  } = state;

  type BoolKeyMap = { [key: number]: boolean };
  type TableMap = { [x: number]: string };

  const setActiveTab = (t: number) => onChange((prev) => ({ ...prev, activeTab: t }));
  const setShowHint = (valOrFn: BoolKeyMap | ((prev: BoolKeyMap) => BoolKeyMap)) =>
    onChange((prev) => ({
      ...prev,
      showHint: typeof valOrFn === 'function' ? valOrFn(prev.showHint) : valOrFn,
    }));
  const setShowSolution = (valOrFn: BoolKeyMap | ((prev: BoolKeyMap) => BoolKeyMap)) =>
    onChange((prev) => ({
      ...prev,
      showSolution: typeof valOrFn === 'function' ? valOrFn(prev.showSolution) : valOrFn,
    }));

  const setQ1Table = (valOrFn: TableMap | ((prev: TableMap) => TableMap)) =>
    onChange((prev) => ({
      ...prev,
      q1Table: typeof valOrFn === 'function' ? valOrFn(prev.q1Table) : valOrFn,
    }));
  const setQ1YInt = (val: string) => onChange((prev) => ({ ...prev, q1YInt: val }));

  const setQ2Roots = (val: string) => onChange((prev) => ({ ...prev, q2Roots: val }));
  const setQ2TP = (val: string) => onChange((prev) => ({ ...prev, q2TP: val }));
  const setQ2Sym = (val: string) => onChange((prev) => ({ ...prev, q2Sym: val }));

  const setQ3Type = (val: 'minimum' | 'maximum' | '') => onChange((prev) => ({ ...prev, q3Type: val }));
  const setQ3YInt = (val: string) => onChange((prev) => ({ ...prev, q3YInt: val }));

  const setQ4TP = (val: string) => onChange((prev) => ({ ...prev, q4TP: val }));
  const setQ4Sym = (val: string) => onChange((prev) => ({ ...prev, q4Sym: val }));

  const setQ5Disc = (val: string) => onChange((prev) => ({ ...prev, q5Disc: val }));
  const setQ5NumRoots = (val: string) => onChange((prev) => ({ ...prev, q5NumRoots: val }));

  const setQ6Ans = (val: string) => onChange((prev) => ({ ...prev, q6Ans: val }));
  const setQ7Ans = (val: string) => onChange((prev) => ({ ...prev, q7Ans: val }));

  const setQ8NumSol = (val: string) => onChange((prev) => ({ ...prev, q8NumSol: val }));
  const setQ8Ans = (val: string) => onChange((prev) => ({ ...prev, q8Ans: val }));

  const setQ9Ans = (val: string) => onChange((prev) => ({ ...prev, q9Ans: val }));

  const setQ10NumSol = (val: string) => onChange((prev) => ({ ...prev, q10NumSol: val }));
  const setQ10Explanation = (val: string) => onChange((prev) => ({ ...prev, q10Explanation: val }));

  const onUpdateQuestion = (qId: number, answer: string, isCorrect: boolean) => {
    onChange((prev) => {
      const updatedAnswers = { ...prev.quizAnswers, [qId]: answer };
      const updatedChecked = { ...prev.quizChecked, [qId]: true };
      const updatedCorrect = { ...prev.quizCorrect, [qId]: isCorrect };
      const newScore = Object.values(updatedCorrect).filter(Boolean).length;
      return {
        ...prev,
        quizAnswers: updatedAnswers,
        quizChecked: updatedChecked,
        quizCorrect: updatedCorrect,
        score: newScore,
      };
    });
  };

  // --- Checking Handlers for All 10 Questions ---
  const handleCheckQ1 = () => {
    // y = x^2 - 4x + 3
    // x=0: 3, x=1: 0, x=2: -1, x=3: 0, x=4: 3
    const t0 = parseInt(q1Table[0], 10) === 3;
    const t1 = parseInt(q1Table[1], 10) === 0;
    const t2 = parseInt(q1Table[2], 10) === -1;
    const t3 = parseInt(q1Table[3], 10) === 0;
    const t4 = parseInt(q1Table[4], 10) === 3;
    const yIntClean = q1YInt.trim().toLowerCase().replace(/\s+/g, '');
    const yIntOk = yIntClean === '3' || yIntClean === '(0,3)' || yIntClean === '0,3' || yIntClean === 'y=3';

    const isAllCorrect = t0 && t1 && t2 && t3 && t4 && yIntOk;
    onUpdateQuestion(1, `Table: [${Object.values(q1Table).join(',')}], y-int: ${q1YInt}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 1: true }));
    if (isAllCorrect) soundManager.playCorrectSound("Brilliant! 1 mark awarded for Question 1.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ2 = () => {
    // y = -x^2 + 4
    // roots: -2 and 2
    // TP: (0, 4)
    // Symmetry: x = 0
    const rClean = q2Roots.trim().toLowerCase().replace(/\s+/g, '');
    const rootsOk =
      rClean === '-2,2' ||
      rClean === '2,-2' ||
      rClean === '-2and2' ||
      rClean === 'x=-2,x=2' ||
      rClean === 'x=2,x=-2' ||
      (rClean.includes('-2') && rClean.includes('2'));

    const tpClean = q2TP.trim().toLowerCase().replace(/\s+/g, '');
    const tpOk = tpClean === '(0,4)' || tpClean === '0,4' || tpClean === '(0,4)max';

    const symClean = q2Sym.trim().toLowerCase().replace(/\s+/g, '');
    const symOk = symClean === 'x=0' || symClean === '0' || symClean === 'y-axis';

    const isAllCorrect = rootsOk && tpOk && symOk;
    onUpdateQuestion(2, `Roots: ${q2Roots}, TP: ${q2TP}, Sym: ${q2Sym}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 2: true }));
    if (isAllCorrect) soundManager.playCorrectSound("Superb! 1 mark awarded for Question 2.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ3 = () => {
    // y = -3x^2 + x + 5 -> a = -3 < 0 -> maximum, y-int = 5
    const typeOk = q3Type === 'maximum';
    const yClean = q3YInt.trim().toLowerCase().replace(/\s+/g, '');
    const yOk = yClean === '5' || yClean === '(0,5)' || yClean === '0,5' || yClean === 'y=5';

    const isAllCorrect = typeOk && yOk;
    onUpdateQuestion(3, `Type: ${q3Type}, y-int: ${q3YInt}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 3: true }));
    if (isAllCorrect) soundManager.playCorrectSound("Excellent deduction! 1 mark awarded for Question 3.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ4 = () => {
    // y = x^2 - 6x + 8 = (x - 3)^2 - 1 -> TP: (3, -1), axis: x = 3
    const tpClean = q4TP.trim().toLowerCase().replace(/\s+/g, '');
    const tpOk = tpClean === '(3,-1)' || tpClean === '3,-1' || tpClean === '(3,-1)min' || tpClean === 'x=3,y=-1';

    const symClean = q4Sym.trim().toLowerCase().replace(/\s+/g, '');
    const symOk = symClean === 'x=3' || symClean === '3' || symClean === 'linex=3';

    const isAllCorrect = tpOk && symOk;
    onUpdateQuestion(4, `TP: ${q4TP}, Symmetry: ${q4Sym}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 4: true }));
    if (isAllCorrect) soundManager.playCorrectSound("Outstanding! 1 mark awarded for Question 4.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ5 = () => {
    // y = x^2 - 2x + 5 -> Delta = (-2)^2 - 4(1)(5) = -16 < 0 -> 0 roots
    const discClean = q5Disc.trim().toLowerCase().replace(/\s+/g, '');
    const discOk = discClean === '-16' || discClean === 'delta=-16' || discClean === 'd=-16';

    const numClean = q5NumRoots.trim().toLowerCase().replace(/\s+/g, '');
    const numOk = numClean === '0' || numClean === 'zero' || numClean === 'none' || numClean === '0roots';

    const isAllCorrect = discOk && numOk;
    onUpdateQuestion(5, `Discriminant: ${q5Disc}, Num Roots: ${q5NumRoots}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 5: true }));
    if (isAllCorrect) soundManager.playCorrectSound("Brilliant calculation! 1 mark awarded for Question 5.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ6 = () => {
    // x^2 - 4x + 3 = 0 -> x = 1 and x = 3
    const clean = q6Ans.trim().toLowerCase().replace(/\s+/g, '');
    const isOk =
      clean === '1,3' ||
      clean === '3,1' ||
      clean === '1and3' ||
      clean === 'x=1,x=3' ||
      clean === 'x=3,x=1' ||
      (clean.includes('1') && clean.includes('3'));

    onUpdateQuestion(6, q6Ans, isOk);
    setShowSolution((prev) => ({ ...prev, 6: true }));
    if (isOk) soundManager.playCorrectSound("Spot on! 1 mark awarded for Question 6.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ7 = () => {
    // x^2 - 4x + 3 = 3 -> intersections with y = 3 -> x = 0 and x = 4
    const clean = q7Ans.trim().toLowerCase().replace(/\s+/g, '');
    const isOk =
      clean === '0,4' ||
      clean === '4,0' ||
      clean === '0and4' ||
      clean === 'x=0,x=4' ||
      clean === 'x=4,x=0' ||
      (clean.includes('0') && clean.includes('4'));

    onUpdateQuestion(7, q7Ans, isOk);
    setShowSolution((prev) => ({ ...prev, 7: true }));
    if (isOk) soundManager.playCorrectSound("Fantastic work! 1 mark awarded for Question 7.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ8 = () => {
    // x^2 - 4x + 3 = -1 -> tangent touching vertex (2, -1) -> 1 solution, x = 2
    const numClean = q8NumSol.trim().toLowerCase().replace(/\s+/g, '');
    const numOk = numClean === '1' || numClean === 'one' || numClean === '1solution';

    const rootClean = q8Ans.trim().toLowerCase().replace(/\s+/g, '');
    const rootOk = rootClean === '2' || rootClean === 'x=2' || rootClean === '2.0';

    const isAllCorrect = numOk && rootOk;
    onUpdateQuestion(8, `Num solutions: ${q8NumSol}, x = ${q8Ans}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 8: true }));
    if (isAllCorrect) soundManager.playCorrectSound("Superb graphical deduction! 1 mark awarded for Question 8.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ9 = () => {
    // x^2 - 4x + 3 = -x + 3 -> meeting points at (0, 3) and (3, 0) -> x = 0 and x = 3
    const clean = q9Ans.trim().toLowerCase().replace(/\s+/g, '');
    const isOk =
      clean === '0,3' ||
      clean === '3,0' ||
      clean === '0and3' ||
      clean === 'x=0,x=3' ||
      clean === 'x=3,x=0' ||
      (clean.includes('0') && clean.includes('3'));

    onUpdateQuestion(9, q9Ans, isOk);
    setShowSolution((prev) => ({ ...prev, 9: true }));
    if (isOk) soundManager.playCorrectSound("Exceptional! 1 mark awarded for Question 9.");
    else soundManager.playWrongSound();
  };

  const handleCheckQ10 = () => {
    // x^2 - 4x + 3 = -4 -> line y = -4 lies below vertex y = -1 -> 0 real solutions
    const numClean = q10NumSol.trim().toLowerCase().replace(/\s+/g, '');
    const numOk = numClean === '0' || numClean === 'zero' || numClean === 'none' || numClean === 'no' || numClean === 'nosolutions';

    const expClean = q10Explanation.trim().toLowerCase();
    const expOk =
      expClean.includes('below') ||
      expClean.includes('minimum') ||
      expClean.includes('never') ||
      expClean.includes('meet') ||
      expClean.includes('vertex') ||
      expClean.includes('-1');

    const isAllCorrect = numOk && (expOk || expClean.length > 3);
    onUpdateQuestion(10, `Solutions: ${q10NumSol}, Explanation: ${q10Explanation}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 10: true }));
    if (isAllCorrect) soundManager.playCorrectSound("Masterful! 1 mark awarded for Question 10.");
    else soundManager.playWrongSound();
  };

  const allCompleted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].every((id) => quizChecked[id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Quiz Header & Running Score */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Cambridge IGCSE 0580 Exam Assessment · 10 Marks Total
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
            Final Mastery Assessment (10 Questions)
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Consists of <strong className="text-cyan-300">5 questions of Discovery & Sketching</strong> (Questions 1–5) and <strong className="text-pink-300">5 questions of Solving Graphically</strong> (Questions 6–10).
            Work through each question with exam hints and verified Cambridge mark schemes.
          </p>
        </div>

        {/* Live Score Counter Badge & Download Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-4 bg-slate-950/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Running Score</span>
              <div className="text-2xl font-bold text-white font-mono">
                <span className="text-amber-400">{score}</span> / 10 Marks
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Answers Saved</span>
            </div>

            <button
              onClick={handleDownloadSection3PDF}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold font-heading text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Section 3 (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Section 3 Examination Paper PDF (10 Questions & Mark Scheme) downloaded successfully!</span>
        </div>
      )}

      {/* Two-Part Sub-Navigation Bar */}
      <div className="space-y-3 p-4 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Part 1 Header & Tabs */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Part 1: Discovery & Sketching (Q1–Q5)</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md font-bold ring-2 ring-cyan-400/50'
                      : quizChecked[id]
                      ? quizCorrect[id]
                        ? 'bg-emerald-950/50 border border-emerald-600/60 text-emerald-300'
                        : 'bg-rose-950/50 border border-rose-600/60 text-rose-300'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-xs">Q{id}</span>
                  {quizChecked[id] && (
                    <span className="text-[10px] mt-0.5">
                      {quizCorrect[id] ? '✓ 1m' : '✗ 0m'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Part 2 Header & Tabs */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-300 uppercase tracking-wider font-mono">
              <Layers className="w-3.5 h-3.5 text-pink-400" />
              <span>Part 2: Solving Graphically (Q6–Q10)</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[6, 7, 8, 9, 10].map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-slate-950 shadow-md font-bold ring-2 ring-pink-400/50'
                      : quizChecked[id]
                      ? quizCorrect[id]
                        ? 'bg-emerald-950/50 border border-emerald-600/60 text-emerald-300'
                        : 'bg-rose-950/50 border border-rose-600/60 text-rose-300'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-xs">Q{id}</span>
                  {quizChecked[id] && (
                    <span className="text-[10px] mt-0.5">
                      {quizCorrect[id] ? '✓ 1m' : '✗ 0m'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          QUESTION 1: Table & Y-intercept
         ======================================================== */}
      {activeTab === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Part 1 · Question 1 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Table Completion & <MathView math="y" />-Intercept
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Complete the table of values for the quadratic function <MathView math="y = x^2 - 4x + 3" /> for <MathView math="0 \le x \le 4" />, and state its <MathView math="y" />-intercept.
                </p>
              </div>

              {/* Table Inputs */}
              <div className="overflow-x-auto pb-2">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-cyan-300 text-xs font-mono border-b border-slate-800">
                      <th className="p-2.5">x</th>
                      <th className="p-2.5">0</th>
                      <th className="p-2.5">1</th>
                      <th className="p-2.5">2</th>
                      <th className="p-2.5">3</th>
                      <th className="p-2.5">4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-sm">
                      <td className="p-2.5 font-bold text-slate-400 font-mono">y</td>
                      {[0, 1, 2, 3, 4].map((x) => (
                        <td key={x} className="p-1">
                          <input
                            type="number"
                            value={q1Table[x]}
                            onChange={(e) => setQ1Table({ ...q1Table, [x]: e.target.value })}
                            className="w-12 h-10 text-center font-mono rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                            placeholder="?"
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  What is the <MathView math="y" />-intercept of this curve?
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 or (0, 3)"
                  value={q1YInt}
                  onChange={(e) => setQ1YInt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 1: !showHint[1] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[1] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ1}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 1
                </button>
              </div>

              {showHint[1] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Substitute each $x$ into $y = x^2 - 4x + 3$. Notice the symmetry around $x = 2$! For the $y$-intercept, look at the value when $x = 0$.
                </div>
              )}

              {quizChecked[1] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[1] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[1] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[1] ? 'Correct! 1 Mark Awarded.' : 'Please verify each calculation carefully.'}
                  </div>
                </div>
              )}

              {showSolution[1] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• For <MathView math="x=0: (0)^2 - 4(0) + 3 = 3" />.</p>
                  <p>• For <MathView math="x=1: (1)^2 - 4(1) + 3 = 0" />.</p>
                  <p>• For <MathView math="x=2: (2)^2 - 4(2) + 3 = -1" /> (Vertex minimum).</p>
                  <p>• For <MathView math="x=3: (3)^2 - 4(3) + 3 = 0" />.</p>
                  <p>• For <MathView math="x=4: (4)^2 - 4(4) + 3 = 3" />.</p>
                  <p>• The <MathView math="y" />-intercept is where <MathView math="x = 0" />, giving <MathView math="y = 3" /> or coordinate <MathView math="(0, 3)" />.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph a={1} b={-4} c={3} xMin={-1} xMax={5} yMin={-2} yMax={5} showVertex showYIntercept curveColor="#38bdf8" />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 2: Roots, TP, Symmetry
         ======================================================== */}
      {activeTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Part 1 · Question 2 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Features of an Inverted Parabola
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  The graph of <MathView math="y = -x^2 + 4" /> is shown on the right. Identify the key features from the graph:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (a) State the two roots (<MathView math="x" />-intercepts):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. -2, 2"
                    value={q2Roots}
                    onChange={(e) => setQ2Roots(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (b) State the coordinates of the maximum turning point:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. (0, 4)"
                    value={q2TP}
                    onChange={(e) => setQ2TP(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (c) State the equation of the line of symmetry:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. x = 0"
                    value={q2Sym}
                    onChange={(e) => setQ2Sym(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 2: !showHint[2] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[2] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ2}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 2
                </button>
              </div>

              {showHint[2] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Roots are where the curve hits the $x$-axis ($y=0$). The turning point is the peak vertex at the top. The symmetry line is a vertical line $x = h$ passing through the peak.
                </div>
              )}

              {quizChecked[2] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[2] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[2] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[2] ? 'Well done! 1 Mark Awarded.' : 'Review the exact values below.'}
                  </div>
                </div>
              )}

              {showSolution[2] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• Setting <MathView math="-x^2 + 4 = 0 \implies x^2 = 4 \implies x = -2 \text{ or } x = 2" />.</p>
                  <p>• The peak vertex is at <MathView math="(0, 4)" /> (a maximum turning point).</p>
                  <p>• The vertical mirror line runs through <MathView math="x = 0" /> (the <MathView math="y" />-axis).</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph a={-1} b={0} c={4} xMin={-4} xMax={4} yMin={-3} yMax={6} showRoots showVertex showSymmetry curveColor="#f43f5e" />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 3: Without plotting y = -3x^2 + x + 5
         ======================================================== */}
      {activeTab === 3 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Part 1 · Question 3 (1 Mark)</span>
              <h3 className="text-xl font-bold text-white mt-1 font-heading">
                Deductions Without Plotting
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                A quadratic function is given by <MathView math="y = -3x^2 + x + 5" />. 
                Without plotting any points on a graph, answer the following:
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-2">
                  (a) Does this parabola have a minimum or a maximum turning point?
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setQ3Type('minimum')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      q3Type === 'minimum' ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    Minimum
                  </button>
                  <button
                    onClick={() => setQ3Type('maximum')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      q3Type === 'maximum' ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    Maximum
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  (b) What is the <MathView math="y" />-intercept of this curve?
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 or (0, 5)"
                  value={q3YInt}
                  onChange={(e) => setQ3YInt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowHint({ ...showHint, 3: !showHint[3] })}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                {showHint[3] ? 'Hide Hint' : 'Exam Hint'}
              </button>
              <button
                onClick={handleCheckQ3}
                className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Check Question 3
              </button>
            </div>

            {showHint[3] && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                <strong>Hint:</strong> Look at the coefficient of $x^2$ ($a = -3$). Is it positive or negative? For the $y$-intercept, what is $y$ when $x = 0$?
              </div>
            )}

            {quizChecked[3] && (
              <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                quizCorrect[3] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
              }`}>
                <div className="font-bold flex items-center gap-2">
                  {quizCorrect[3] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  {quizCorrect[3] ? 'Excellent! 1 Mark Awarded.' : 'Check the rules below.'}
                </div>
              </div>
            )}

            {showSolution[3] && (
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                <p>• In <MathView math="y = ax^2 + bx + c" />, <MathView math="a = -3" />. Since <MathView math="a < 0" />, the curve is an inverted "frown" shape, meaning its turning point is a <strong>maximum</strong>.</p>
                <p>• The constant term is <MathView math="c = 5" />, so the <MathView math="y" />-intercept is <MathView math="5" /> (or coordinate <MathView math="(0, 5)" />).</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 4: Vertex Form & Line of Symmetry
         ======================================================== */}
      {activeTab === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Part 1 · Question 4 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Vertex Form & Axis of Symmetry
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  The quadratic <MathView math="y = x^2 - 6x + 8" /> can be expressed in completed square form as:
                  <br />
                  <span className="block font-mono text-cyan-300 font-bold mt-1 text-base">
                    <MathView math="y = (x - 3)^2 - 1" />
                  </span>
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (a) State the coordinates of the minimum turning point:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. (3, -1)"
                    value={q4TP}
                    onChange={(e) => setQ4TP(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (b) State the equation of the axis of symmetry:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. x = 3"
                    value={q4Sym}
                    onChange={(e) => setQ4Sym(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 4: !showHint[4] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[4] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ4}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 4
                </button>
              </div>

              {showHint[4] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> In vertex form $y = (x - h)^2 + k$, the minimum turning point occurs when the squared bracket is zero ($(x - h) = 0 \implies x = h$), giving vertex $(h, k)$ and symmetry line $x = h$.
                </div>
              )}

              {quizChecked[4] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[4] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[4] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[4] ? 'Brilliant! 1 Mark Awarded.' : 'Check the vertex form coordinates below.'}
                  </div>
                </div>
              )}

              {showSolution[4] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• In <MathView math="y = (x - 3)^2 - 1" />, since <MathView math="(x - 3)^2 \ge 0" /> for all real <MathView math="x" />, the minimum value of <MathView math="y" /> is <MathView math="-1" />, which occurs when <MathView math="x = 3" />.</p>
                  <p>• Turning point coordinates: <MathView math="(3, -1)" />.</p>
                  <p>• The vertical axis of symmetry passes right through the vertex at <MathView math="x = 3" />.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph a={1} b={-6} c={8} xMin={0} xMax={6} yMin={-3} yMax={6} showVertex showSymmetry curveColor="#38bdf8" />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 5: The Discriminant & Number of Roots
         ======================================================== */}
      {activeTab === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Part 1 · Question 5 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  The Discriminant & Number of <MathView math="x" />-Intercepts
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Consider the quadratic function <MathView math="y = x^2 - 2x + 5" /> (<MathView math="a = 1, b = -2, c = 5" />).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (a) Calculate the discriminant <MathView math="\Delta = b^2 - 4ac" />:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. -16"
                    value={q5Disc}
                    onChange={(e) => setQ5Disc(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (b) How many times does this parabola cross the <MathView math="x" />-axis? (Number of real roots):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0"
                    value={q5NumRoots}
                    onChange={(e) => setQ5NumRoots(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 5: !showHint[5] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[5] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ5}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 5
                </button>
              </div>

              {showHint[5] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Remember: <MathView math="(-2)^2 = +4" />. Calculate <MathView math="4 - 4(1)(5)" />. If <MathView math="\Delta < 0" />, the quadratic has no real square root, so the parabola never crosses the x-axis!
                </div>
              )}

              {quizChecked[5] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[5] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[5] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[5] ? 'Spot on! 1 Mark Awarded.' : 'Check the discriminant sign below.'}
                  </div>
                </div>
              )}

              {showSolution[5] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• <MathView math="\Delta = b^2 - 4ac = (-2)^2 - 4(1)(5) = 4 - 20 = -16" />.</p>
                  <p>• Since <MathView math="\Delta < 0" />, the equation <MathView math="x^2 - 2x + 5 = 0" /> has <strong>no real roots</strong>.</p>
                  <p>• Therefore, the parabola hovers entirely above the <MathView math="x" />-axis and crosses it <strong>0 times</strong>.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph a={1} b={-2} c={5} xMin={-2} xMax={4} yMin={-1} yMax={10} showVertex curveColor="#f59e0b" />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 6: Solve x^2 - 4x + 3 = 0 graphically
         ======================================================== */}
      {activeTab === 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono">Part 2 · Question 6 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Solve <MathView math="x^2 - 4x + 3 = 0" /> Graphically
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Decompose into two components: Component 1 is the curve <MathView math="y = x^2 - 4x + 3" /> and Component 2 is the line <MathView math="y = 0" /> (the <MathView math="x" />-axis).
                  State the solutions (separated by comma):
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="e.g. 1, 3"
                  value={q6Ans}
                  onChange={(e) => setQ6Ans(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 6: !showHint[6] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[6] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ6}
                  className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 6
                </button>
              </div>

              {showHint[6] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Look at where Component 1 meets Component 2 ($y = 0$, the $x$-axis). Read the two $x$-values directly from the grid.
                </div>
              )}

              {quizChecked[6] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[6] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[6] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[6] ? 'Correct! 1 Mark Awarded.' : 'Read the x-axis meeting points.'}
                  </div>
                </div>
              )}

              {showSolution[6] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-pink-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• Component 1: <MathView math="y = x^2 - 4x + 3" />.</p>
                  <p>• Component 2: <MathView math="y = 0" />.</p>
                  <p>• The two components meet at points <MathView math="(1, 0)" /> and <MathView math="(3, 0)" />.</p>
                  <p>• Taking the <MathView math="x" />-coordinates: <MathView math="x = 1 \text{ or } x = 3" />.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph
              a={1}
              b={-4}
              c={3}
              xMin={-1}
              xMax={5}
              yMin={-2}
              yMax={5}
              additionalLines={[{ type: 'horizontal', value: 0, color: '#f43f5e', label: 'Component 2: y = 0' }]}
              intersectPoints={[{ x: 1, y: 0 }, { x: 3, y: 0 }]}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 7: Solve x^2 - 4x + 3 = 3 graphically
         ======================================================== */}
      {activeTab === 7 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono">Part 2 · Question 7 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Solve <MathView math="x^2 - 4x + 3 = 3" /> Graphically
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Component 1 is <MathView math="y = x^2 - 4x + 3" /> and Component 2 is the horizontal line <MathView math="y = 3" />.
                  Read the solutions from their meeting points on the graph:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="e.g. 0, 4"
                  value={q7Ans}
                  onChange={(e) => setQ7Ans(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 7: !showHint[7] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[7] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ7}
                  className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 7
                </button>
              </div>

              {showHint[7] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Look at height $y = 3$. Find where the pink line cuts the blue curve, and project straight down to read the $x$-axis.
                </div>
              )}

              {quizChecked[7] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[7] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[7] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[7] ? 'Well done! 1 Mark Awarded.' : 'Examine the two meeting points at level y = 3.'}
                  </div>
                </div>
              )}

              {showSolution[7] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-pink-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• Draw the horizontal line <MathView math="y = 3" /> across the coordinate grid.</p>
                  <p>• It intersects the curve at <MathView math="(0, 3)" /> on the <MathView math="y" />-axis and at <MathView math="(4, 3)" />.</p>
                  <p>• Reading the <MathView math="x" />-values: <MathView math="x = 0 \text{ or } x = 4" />.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph
              a={1}
              b={-4}
              c={3}
              xMin={-1}
              xMax={5}
              yMin={-2}
              yMax={5}
              additionalLines={[{ type: 'horizontal', value: 3, color: '#ec4899', label: 'Component 2: y = 3' }]}
              intersectPoints={[{ x: 0, y: 3 }, { x: 4, y: 3 }]}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 8: Tangent Line Touching Vertex (1 Solution)
         ======================================================== */}
      {activeTab === 8 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono">Part 2 · Question 8 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Tangent Line Touching the Turning Point
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Consider solving <MathView math="x^2 - 4x + 3 = -1" /> using Component 1 (<MathView math="y = x^2 - 4x + 3" />) and Component 2 (<MathView math="y = -1" />).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (a) How many solutions (meeting points) exist between the curve and <MathView math="y = -1" />?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1"
                    value={q8NumSol}
                    onChange={(e) => setQ8NumSol(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (b) What is the value of this solution <MathView math="x" />?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2"
                    value={q8Ans}
                    onChange={(e) => setQ8Ans(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 8: !showHint[8] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[8] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ8}
                  className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 8
                </button>
              </div>

              {showHint[8] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> The minimum turning point is $(2, -1)$. The line $y = -1$ is a tangent that just grazes the bottom of the parabola.
                </div>
              )}

              {quizChecked[8] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[8] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[8] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[8] ? 'Excellent deduction! 1 Mark Awarded.' : 'Notice the tangent at the vertex.'}
                  </div>
                </div>
              )}

              {showSolution[8] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-pink-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• The line <MathView math="y = -1" /> touches the parabola at exactly one point: the minimum vertex <MathView math="(2, -1)" />.</p>
                  <p>• Because it touches at only 1 meeting point, there is <strong>1 repeated solution</strong>.</p>
                  <p>• Reading the <MathView math="x" />-coordinate: <MathView math="x = 2" />.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph
              a={1}
              b={-4}
              c={3}
              xMin={-1}
              xMax={5}
              yMin={-2}
              yMax={5}
              additionalLines={[{ type: 'horizontal', value: -1, color: '#f59e0b', label: 'Component 2: y = -1 (Tangent)' }]}
              intersectPoints={[{ x: 2, y: -1 }]}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 9: Solve with Slanted Line y = -x + 3
         ======================================================== */}
      {activeTab === 9 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono">Part 2 · Question 9 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Solving with a Slanted Line: <MathView math="y = mx + d" />
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Solve <MathView math="x^2 - 4x + 3 = -x + 3" /> graphically by breaking into:
                  <br />
                  • Component 1: <MathView math="y = x^2 - 4x + 3" /> (Parabola)
                  <br />
                  • Component 2: <MathView math="y = -x + 3" /> (Slanted straight line, gradient <MathView math="m = -1" />, intercept <MathView math="d = 3" />).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="block font-semibold text-slate-300 mb-1">
                  Enter the two solutions <MathView math="x" /> where the curve meets the line:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0, 3"
                  value={q9Ans}
                  onChange={(e) => setQ9Ans(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 9: !showHint[9] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[9] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ9}
                  className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 9
                </button>
              </div>

              {showHint[9] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Look at where the downward straight line cuts the parabola. One meeting point is right on the $y$-axis $(0, 3)$, and the second is on the $x$-axis $(3, 0)$.
                </div>
              )}

              {quizChecked[9] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[9] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[9] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[9] ? 'Superb! 1 Mark Awarded.' : 'Read the two intersection coordinates.'}
                  </div>
                </div>
              )}

              {showSolution[9] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-pink-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• The straight line <MathView math="y = -x + 3" /> cuts the parabola at two meeting points: <MathView math="(0, 3)" /> and <MathView math="(3, 0)" />.</p>
                  <p>• Dropping straight to the <MathView math="x" />-axis gives the solutions: <MathView math="x = 0 \text{ or } x = 3" />.</p>
                  <p>• Check: <MathView math="(0)^2 - 4(0) + 3 = 3" /> and <MathView math="-(0) + 3 = 3" /> ✓; <MathView math="(3)^2 - 4(3) + 3 = 0" /> and <MathView math="-(3) + 3 = 0" /> ✓.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph
              a={1}
              b={-4}
              c={3}
              xMin={-1}
              xMax={5}
              yMin={-2}
              yMax={5}
              additionalLines={[{ type: 'linear', m: -1, c: 3, color: '#a855f7', label: 'Component 2: y = -x + 3' }]}
              intersectPoints={[{ x: 0, y: 3 }, { x: 3, y: 0 }]}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 10: Equations with No Real Solutions
         ======================================================== */}
      {activeTab === 10 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono">Part 2 · Question 10 (1 Mark)</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Equations with No Real Solutions
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  A student attempts to solve <MathView math="x^2 - 4x + 3 = -4" /> graphically using Component 1 (<MathView math="y = x^2 - 4x + 3" />) and Component 2 (<MathView math="y = -4" />).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (a) How many real solutions are there to this equation?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0"
                    value={q10NumSol}
                    onChange={(e) => setQ10NumSol(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (b) Explain why from the graph:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The line y = -4 is below the minimum turning point (y = -1)"
                    value={q10Explanation}
                    onChange={(e) => setQ10Explanation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 10: !showHint[10] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[10] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ10}
                  className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Check Question 10
                </button>
              </div>

              {showHint[10] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Look at the graph. Does the horizontal dashed line at $y = -4$ ever touch or meet the parabola? Where is the parabola's minimum turning point?
                </div>
              )}

              {quizChecked[10] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[10] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[10] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[10] ? 'Outstanding deduction! 1 Mark Awarded.' : 'Notice the line lies below the curve minimum.'}
                  </div>
                </div>
              )}

              {showSolution[10] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-pink-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• The minimum value of the parabola is <MathView math="y = -1" /> at the turning point <MathView math="(2, -1)" />.</p>
                  <p>• The line <MathView math="y = -4" /> lies completely below the lowest point of the curve.</p>
                  <p>• Since the two components have <strong>0 meeting points</strong>, there are <strong>0 real solutions</strong>.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph
              a={1}
              b={-4}
              c={3}
              xMin={-1}
              xMax={5}
              yMin={-5}
              yMax={5}
              additionalLines={[{ type: 'horizontal', value: -4, color: '#94a3b8', dashed: true, label: 'Component 2: y = -4 (No contact)' }]}
              intersectPoints={[]}
            />
          </div>
        </div>
      )}

      {/* Complete Quiz & Go to Certificate */}
      {allCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/90 to-indigo-950/90 border border-teal-700/60 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white font-heading">
              Assessment Completed! You scored {score} / 10 marks 🎉
            </h4>
            <p className="text-xs text-slate-300">
              Proceed to generate your personalized Cambridge IGCSE Portfolio Certificate & Course Completion PDF.
            </p>
          </div>
          <button
            onClick={onCompleteQuiz}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold font-heading text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>View Certificate & Export Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          PRINT-FRIENDLY LIGHT THEME CONTAINER FOR SECTION 3 PDF EXPORT (10 QUESTIONS)
         ========================================================================= */}
      <div
        ref={pdf3Ref}
        style={{ display: 'none' }}
        className="w-[800px] p-10 bg-white text-slate-900 font-sans space-y-6"
      >
        <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Cambridge IGCSE Mathematics 0580 · Extended Curriculum
            </span>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Section 3: Final Examination Paper & Mark Scheme
            </h1>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div><strong>Student:</strong> {studentName || 'Student'}</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Score:</strong> <span className="font-bold text-amber-700 text-sm">{score} / 10</span> ({Math.round(score * 10)}%)</div>
          </div>
        </div>

        {/* Exam Score Summary Box */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
          <div>
            <div className="font-bold text-slate-900 text-sm">Official Cambridge Assessment Result</div>
            <div className="text-slate-600 mt-0.5">
              Extended Mathematics Syllabus 0580: Topics E2.4 & E2.5 (Quadratic Functions & Graphical Solutions)
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded bg-teal-100 text-teal-900 font-bold font-mono text-sm">
              {score >= 9 ? 'Grade A* (Distinction)' : score >= 7 ? 'Grade A (Merit)' : score >= 5 ? 'Grade B (Pass)' : 'Core Competency'}
            </span>
          </div>
        </div>

        {/* 10 Questions Breakdown */}
        <div className="space-y-3 text-xs">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b pb-1">
            Part 1: Discovery & Sketching (Questions 1–5)
          </div>

          {/* Question 1 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 1 (1 Mark) — Table of Values & y-Intercept</span>
              <span className={quizCorrect[1] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[1] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Function: <MathView math="y = x^2 - 4x + 3" /> for <MathView math="x \in [0, 4]" />.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Table values: <MathView math="3, 0, -1, 0, 3" />. y-intercept: <MathView math="(0, 3)" />.
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 2 (1 Mark) — Inverted Parabola Features</span>
              <span className={quizCorrect[2] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[2] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Function: <MathView math="y = -x^2 + 4" />: roots, vertex, symmetry.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Roots: <MathView math="x = -2, 2" />. Maximum vertex: <MathView math="(0, 4)" />. Axis: <MathView math="x = 0" />.
            </div>
          </div>

          {/* Question 3 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 3 (1 Mark) — Deductions Without Graphing</span>
              <span className={quizCorrect[3] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[3] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Function: <MathView math="y = -3x^2 + x + 5" />. Turning point type & y-intercept.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> <MathView math="a = -3 < 0 \implies" /> Maximum turning point. y-intercept: <MathView math="(0, 5)" />.
            </div>
          </div>

          {/* Question 4 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 4 (1 Mark) — Vertex Form & Symmetry</span>
              <span className={quizCorrect[4] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[4] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Function: <MathView math="y = x^2 - 6x + 8 = (x - 3)^2 - 1" />.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Minimum turning point: <MathView math="(3, -1)" />. Axis of symmetry: <MathView math="x = 3" />.
            </div>
          </div>

          {/* Question 5 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 5 (1 Mark) — Discriminant & Number of Roots</span>
              <span className={quizCorrect[5] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[5] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Function: <MathView math="y = x^2 - 2x + 5" />.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> <MathView math="\Delta = (-2)^2 - 4(1)(5) = -16 < 0" />. Crosses x-axis: 0 times.
            </div>
          </div>

          <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b pb-1 pt-2">
            Part 2: Solving Graphically (Questions 6–10)
          </div>

          {/* Question 6 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 6 (1 Mark) — Solving ax² + bx + c = 0</span>
              <span className={quizCorrect[6] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[6] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Solve <MathView math="x^2 - 4x + 3 = 0" /> graphically.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Component 1 meets line <MathView math="y = 0" /> at <MathView math="x = 1" /> and <MathView math="x = 3" />.
            </div>
          </div>

          {/* Question 7 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 7 (1 Mark) — Horizontal Line Intersection (= 3)</span>
              <span className={quizCorrect[7] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[7] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Solve <MathView math="x^2 - 4x + 3 = 3" /> graphically.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Component 1 meets line <MathView math="y = 3" /> at <MathView math="(0, 3)" /> and <MathView math="(4, 3)" /> <MathView math="\implies x = 0" /> or <MathView math="x = 4" />.
            </div>
          </div>

          {/* Question 8 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 8 (1 Mark) — Tangent at Vertex (1 Repeated Root)</span>
              <span className={quizCorrect[8] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[8] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Solve <MathView math="x^2 - 4x + 3 = -1" /> graphically.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Line <MathView math="y = -1" /> touches the minimum vertex <MathView math="(2, -1)" /> once <MathView math="\implies 1" /> solution (<MathView math="x = 2" />).
            </div>
          </div>

          {/* Question 9 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 9 (1 Mark) — Slanted Line y = mx + d</span>
              <span className={quizCorrect[9] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[9] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Solve <MathView math="x^2 - 4x + 3 = -x + 3" /> graphically.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Line <MathView math="y = -x + 3" /> intersects parabola at <MathView math="(0, 3)" /> and <MathView math="(3, 0)" /> <MathView math="\implies x = 0" /> or <MathView math="x = 3" />.
            </div>
          </div>

          {/* Question 10 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 10 (1 Mark) — No Real Solutions</span>
              <span className={quizCorrect[10] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[10] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">Solve <MathView math="x^2 - 4x + 3 = -4" /> graphically.</div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded">
              <strong>Model Solution:</strong> Line <MathView math="y = -4" /> lies completely below the minimum turning point (<MathView math="y = -1" />), yielding 0 meeting points (0 real solutions).
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-500">
          <span>Cambridge IGCSE Examination Assessment Paper</span>
          <span>10 Questions Total · Verified & Recorded Portfolio</span>
        </div>
      </div>
    </div>
  );
};
