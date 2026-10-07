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
  FileCheck
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
    q4Ans,
    q5Ans,
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

  const setQ4Ans = (val: string) => onChange((prev) => ({ ...prev, q4Ans: val }));
  const setQ5Ans = (val: string) => onChange((prev) => ({ ...prev, q5Ans: val }));

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

  // Verification handlers
  const handleCheckQ1 = () => {
    // y = x^2 - 4x + 3
    // x=0: 3, x=1: 0, x=2: -1, x=3: 0, x=4: 3
    // y-int: 3 or (0,3)
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
    if (isAllCorrect) {
      soundManager.playCorrectSound("Brilliant! 1 mark awarded for Question 1.");
    } else {
      soundManager.playWrongSound();
    }
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
    if (isAllCorrect) {
      soundManager.playCorrectSound("Superb! 1 mark awarded for Question 2.");
    } else {
      soundManager.playWrongSound();
    }
  };

  const handleCheckQ3 = () => {
    // y = -3x^2 + x + 5
    // a = -3 < 0 -> maximum
    // y-intercept = 5 or (0, 5)
    const typeOk = q3Type === 'maximum';
    const yClean = q3YInt.trim().toLowerCase().replace(/\s+/g, '');
    const yOk = yClean === '5' || yClean === '(0,5)' || yClean === '0,5' || yClean === 'y=5';

    const isAllCorrect = typeOk && yOk;
    onUpdateQuestion(3, `Type: ${q3Type}, y-int: ${q3YInt}`, isAllCorrect);
    setShowSolution((prev) => ({ ...prev, 3: true }));
    if (isAllCorrect) {
      soundManager.playCorrectSound("Excellent deduction! 1 mark awarded for Question 3.");
    } else {
      soundManager.playWrongSound();
    }
  };

  const handleCheckQ4 = () => {
    // x^2 - 4x + 3 = 0 -> roots are x = 1 and x = 3
    const clean = q4Ans.trim().toLowerCase().replace(/\s+/g, '');
    const isOk =
      clean === '1,3' ||
      clean === '3,1' ||
      clean === '1and3' ||
      clean === 'x=1,x=3' ||
      clean === 'x=3,x=1' ||
      (clean.includes('1') && clean.includes('3'));

    onUpdateQuestion(4, q4Ans, isOk);
    setShowSolution((prev) => ({ ...prev, 4: true }));
    if (isOk) {
      soundManager.playCorrectSound("Spot on! 1 mark awarded for Question 4.");
    } else {
      soundManager.playWrongSound();
    }
  };

  const handleCheckQ5 = () => {
    // x^2 - 4x + 3 = 3 -> intersections with y = 3 -> x = 0 and x = 4
    const clean = q5Ans.trim().toLowerCase().replace(/\s+/g, '');
    const isOk =
      clean === '0,4' ||
      clean === '4,0' ||
      clean === '0and4' ||
      clean === 'x=0,x=4' ||
      clean === 'x=4,x=0' ||
      (clean.includes('0') && clean.includes('4'));

    onUpdateQuestion(5, q5Ans, isOk);
    setShowSolution((prev) => ({ ...prev, 5: true }));
    if (isOk) {
      soundManager.playCorrectSound("Fantastic work! 1 mark awarded for Question 5.");
    } else {
      soundManager.playWrongSound();
    }
  };

  const allCompleted = [1, 2, 3, 4, 5].every((id) => quizChecked[id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Quiz Header & Running Score */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Cambridge IGCSE 0580 Exam Assessment · 5 Marks Total
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
            Final Mastery Assessment
          </h2>
          <p className="text-sm text-slate-300">
            Answer each question carefully. You can access an exam hint before submitting, and every question reveals a full step-by-step LaTeX solution.
          </p>
        </div>

        {/* Live Score Counter Badge & Download Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-700/80 rounded-2xl p-4 shrink-0 shadow-lg">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Running Score</span>
              <div className="text-2xl font-bold text-white font-mono">
                <span className="text-amber-400">{score}</span> / 5 Marks
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
          <span>Section 3 Examination Paper PDF downloaded successfully!</span>
        </div>
      )}

      {/* Question Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === id
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md font-heading font-bold'
                : quizChecked[id]
                ? quizCorrect[id]
                  ? 'bg-emerald-950/50 border border-emerald-600/60 text-emerald-300'
                  : 'bg-rose-950/50 border border-rose-600/60 text-rose-300'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>Question {id}</span>
            {quizChecked[id] && (
              quizCorrect[id] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )
            )}
          </button>
        ))}
      </div>

      {/* ========================================================
          QUESTION 1: Table & Y-intercept
         ======================================================== */}
      {activeTab === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Question 1 · 1 Mark</span>
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
                            placeholder="?"
                            className="w-11 h-9 text-center rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Y-intercept question */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  State the <MathView math="y" />-intercept of the graph:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 or (0, 3)"
                  value={q1YInt}
                  onChange={(e) => setQ1YInt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 1: !showHint[1] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[1] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ1}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Check Question 1
                </button>
              </div>

              {showHint[1] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Substitute each $x$-value into $y = x^2 - 4x + 3$. For $x = 0$, $y = 0^2 - 4(0) + 3 = 3$. This also immediately gives your $y$-intercept!
                </div>
              )}

              {quizChecked[1] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[1] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[1] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[1] ? 'Great Job! 1 Mark Awarded.' : 'Incorrect or incomplete. Check the step-by-step solution below.'}
                  </div>
                </div>
              )}

              {/* Worked Solution */}
              {showSolution[1] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• When <MathView math="x = 0" />: <MathView math="y = (0)^2 - 4(0) + 3 = 3" /></p>
                  <p>• When <MathView math="x = 1" />: <MathView math="y = (1)^2 - 4(1) + 3 = 0" /></p>
                  <p>• When <MathView math="x = 2" />: <MathView math="y = (2)^2 - 4(2) + 3 = 4 - 8 + 3 = -1" /></p>
                  <p>• When <MathView math="x = 3" />: <MathView math="y = (3)^2 - 4(3) + 3 = 9 - 12 + 3 = 0" /></p>
                  <p>• When <MathView math="x = 4" />: <MathView math="y = (4)^2 - 4(4) + 3 = 16 - 16 + 3 = 3" /></p>
                  <p>• The <MathView math="y" />-intercept occurs at <MathView math="x = 0" />, which is <MathView math="(0, 3)" /> (or simply <MathView math="3" />).</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph a={1} b={-4} c={3} xMin={-1} xMax={5} yMin={-2} yMax={5} showVertex showYIntercept />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 2: Identify from Graph y = -x^2 + 4
         ======================================================== */}
      {activeTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Question 2 · 1 Mark</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Identify Features from Graph of <MathView math="y = -x^2 + 4" />
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Inspect the displayed parabola on the right and determine its key features.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    (a) Write down the two roots of <MathView math="y = -x^2 + 4" />:
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
                    (b) Write down the coordinates of the turning point:
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
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[2] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ2}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Check Question 2
                </button>
              </div>

              {showHint[2] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Roots are where the curve hits the <MathView math="x" />-axis (<MathView math="y=0" />). The turning point is the peak vertex at the top. The symmetry line is a vertical line <MathView math="x = h" /> passing through the peak.
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
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Question 3 · 1 Mark</span>
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
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold ${
                      q3Type === 'minimum' ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    Minimum
                  </button>
                  <button
                    onClick={() => setQ3Type('maximum')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold ${
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
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                {showHint[3] ? 'Hide Hint' : 'Exam Hint'}
              </button>
              <button
                onClick={handleCheckQ3}
                className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
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
          QUESTION 4: Solve x^2 - 4x + 3 = 0 graphically
         ======================================================== */}
      {activeTab === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Question 4 · 1 Mark</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Solve <MathView math="x^2 - 4x + 3 = 0" /> from the Graph
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Use the given graph of <MathView math="y = x^2 - 4x + 3" /> on the right to state the solutions to the equation:
                </p>
                <div className="p-3 my-2 rounded-xl bg-slate-950 text-center font-mono text-cyan-300 text-lg font-bold">
                  <MathView math="x^2 - 4x + 3 = 0" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Write the two values of <MathView math="x" /> (separated by a comma):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1, 3"
                  value={q4Ans}
                  onChange={(e) => setQ4Ans(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 4: !showHint[4] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[4] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ4}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Check Question 4
                </button>
              </div>

              {showHint[4] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> The equation $= 0$ means finding where the curve crosses $y = 0$ (the $x$-axis). Read the numbers where the curve cuts across the horizontal axis!
                </div>
              )}

              {quizChecked[4] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[4] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[4] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[4] ? 'Correct! 1 Mark Awarded.' : 'Look at the roots on the x-axis.'}
                  </div>
                </div>
              )}

              {showSolution[4] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• The solutions to <MathView math="x^2 - 4x + 3 = 0" /> are the <MathView math="x" />-intercepts of the graph.</p>
                  <p>• Reading the graph at <MathView math="y = 0" />, the curve crosses at <MathView math="x = 1" /> and <MathView math="x = 3" />.</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            <ParabolaGraph a={1} b={-4} c={3} xMin={-1} xMax={5} yMin={-2} yMax={5} showRoots />
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 5: Solve x^2 - 4x + 3 = 3 graphically
         ======================================================== */}
      {activeTab === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-5 backdrop-blur-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Question 5 · 1 Mark</span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  Solve <MathView math="x^2 - 4x + 3 = 3" /> from the Graph
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Use the same drawn graph of <MathView math="y = x^2 - 4x + 3" /> to solve:
                </p>
                <div className="p-3 my-2 rounded-xl bg-slate-950 text-center font-mono text-cyan-300 text-lg font-bold">
                  <MathView math="x^2 - 4x + 3 = 3" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Write the two values of <MathView math="x" /> where the curve meets <MathView math="y = 3" />:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0, 4"
                  value={q5Ans}
                  onChange={(e) => setQ5Ans(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, 5: !showHint[5] })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  {showHint[5] ? 'Hide Hint' : 'Exam Hint'}
                </button>
                <button
                  onClick={handleCheckQ5}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Check Question 5
                </button>
              </div>

              {showHint[5] && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                  <strong>Hint:</strong> Look at horizontal level $y = 3$. Find where the pink horizontal line cuts the blue parabola, then look straight down to the $x$-axis.
                </div>
              )}

              {quizChecked[5] && (
                <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                  quizCorrect[5] ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border border-rose-800 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {quizCorrect[5] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    {quizCorrect[5] ? 'Brilliant! 1 Mark Awarded.' : 'Review the intersection points below.'}
                  </div>
                </div>
              )}

              {showSolution[5] && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider block">Detailed Worked Solution:</span>
                  <p>• Draw the horizontal line <MathView math="y = 3" /> across the graph.</p>
                  <p>• The line meets the curve at <MathView math="(0, 3)" /> and <MathView math="(4, 3)" />.</p>
                  <p>• Therefore, the solutions are <MathView math="x = 0" /> or <MathView math="x = 4" />.</p>
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
              additionalLines={[{ type: 'horizontal', value: 3, color: '#ec4899', label: 'y = 3' }]}
              intersectPoints={[{ x: 0, y: 3 }, { x: 4, y: 3 }]}
            />
          </div>
        </div>
      )}

      {/* Complete Quiz & Go to Certificate */}
      {allCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/80 to-indigo-950/80 border border-teal-700/60 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white font-heading">
              Assessment Completed! You scored {score} / 5 marks 🎉
            </h4>
            <p className="text-xs text-slate-300">
              Proceed to generate your personalized Cambridge IGCSE Portfolio Certificate & PDF download.
            </p>
          </div>
          <button
            onClick={onCompleteQuiz}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold font-heading text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <span>View Certificate & Export PDF</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          PRINT-FRIENDLY LIGHT THEME CONTAINER FOR SECTION 3 PDF EXPORT
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
            <div><strong>Score:</strong> <span className="font-bold text-amber-700 text-sm">{score} / 5</span> ({Math.round(score * 20)}%)</div>
          </div>
        </div>

        {/* Exam Score Summary Box */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
          <div>
            <div className="font-bold text-slate-900 text-sm">Official Cambridge Assessment Result</div>
            <div className="text-slate-600 mt-0.5">
              Extended Mathematics Syllabus 0580: Topics E2.4 & E2.5 (Quadratic Functions & Graphs)
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded bg-teal-100 text-teal-900 font-bold font-mono text-sm">
              {score === 5 ? 'Grade A* (Distinction)' : score === 4 ? 'Grade A (Merit)' : score === 3 ? 'Grade B (Pass)' : 'Core Competency'}
            </span>
          </div>
        </div>

        {/* 5 Questions Breakdown */}
        <div className="space-y-3 text-xs">
          {/* Question 1 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 1 (1 Mark) — Table of Values & y-Intercept</span>
              <span className={quizCorrect[1] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[1] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">
              For <MathView math="y = x^2 - 4x + 3" />: table of values for <MathView math="x \in [0, 4]" /> and <MathView math="y" />-intercept.
            </div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded space-y-1">
              <div><strong>Student Answer:</strong> {quizAnswers[1] || 'Completed in interactive table'}</div>
              <div><strong>Model Solution:</strong> Table values: <MathView math="x=0 \to 3, x=1 \to 0, x=2 \to -1, x=3 \to 0, x=4 \to 3" />. The <MathView math="y" />-intercept is <MathView math="(0, 3)" /> (where <MathView math="x=0" />).</div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 2 (1 Mark) — Inverted Parabola Features</span>
              <span className={quizCorrect[2] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[2] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">
              For <MathView math="y = -x^2 + 4" />: roots, maximum turning point, and axis of symmetry.
            </div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded space-y-1">
              <div><strong>Student Answer:</strong> {quizAnswers[2] || `Roots: ${q2Roots}, TP: ${q2TP}, Sym: ${q2Sym}`}</div>
              <div><strong>Model Solution:</strong> Roots: <MathView math="x = -2, 2" /> (where <MathView math="y=0" />). Maximum vertex: <MathView math="(0, 4)" />. Line of symmetry: <MathView math="x = 0" /> (the <MathView math="y" />-axis).</div>
            </div>
          </div>

          {/* Question 3 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 3 (1 Mark) — Algebraic Concavity & Intercept</span>
              <span className={quizCorrect[3] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[3] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">
              Without drawing, deduce whether <MathView math="y = -3x^2 + x + 5" /> has a minimum or maximum, and state its <MathView math="y" />-intercept.
            </div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded space-y-1">
              <div><strong>Student Answer:</strong> {quizAnswers[3] || `Type: ${q3Type}, y-int: ${q3YInt}`}</div>
              <div><strong>Model Solution:</strong> Since <MathView math="a = -3 < 0" />, the parabola is concave down (frown shape), giving a <strong>maximum</strong> turning point. The <MathView math="y" />-intercept is given by constant <MathView math="c = 5" /> at <MathView math="(0, 5)" />.</div>
            </div>
          </div>

          {/* Question 4 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 4 (1 Mark) — Graphical Equation Solving (= 0)</span>
              <span className={quizCorrect[4] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[4] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">
              Use the graph of <MathView math="y = x^2 - 4x + 3" /> to solve <MathView math="x^2 - 4x + 3 = 0" />.
            </div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded space-y-1">
              <div><strong>Student Answer:</strong> {quizAnswers[4] || q4Ans}</div>
              <div><strong>Model Solution:</strong> Set <MathView math="y = 0" /> (the <MathView math="x" />-axis). The curve crosses the <MathView math="x" />-axis at <MathView math="x = 1" /> and <MathView math="x = 3" />.</div>
            </div>
          </div>

          {/* Question 5 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Question 5 (1 Mark) — Horizontal Line Intersection (= 3)</span>
              <span className={quizCorrect[5] ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
                {quizCorrect[5] ? '[1 / 1 Mark] ✓ Correct' : '[0 / 1 Mark]'}
              </span>
            </div>
            <div className="text-slate-700">
              Use the graph of <MathView math="y = x^2 - 4x + 3" /> to solve <MathView math="x^2 - 4x + 3 = 3" />.
            </div>
            <div className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded space-y-1">
              <div><strong>Student Answer:</strong> {quizAnswers[5] || q5Ans}</div>
              <div><strong>Model Solution:</strong> Draw the horizontal line <MathView math="y = 3" />. It meets the parabola at <MathView math="(0, 3)" /> and <MathView math="(4, 3)" />. Reading the <MathView math="x" />-coordinates yields <MathView math="x = 0" /> or <MathView math="x = 4" />.</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-500">
          <span>Cambridge IGCSE Examination Assessment Paper</span>
          <span>Verified & Recorded Portfolio</span>
        </div>
      </div>
    </div>
  );
};
