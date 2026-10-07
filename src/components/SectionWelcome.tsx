import React, { useState, useRef } from 'react';
import { MathView } from './MathView';
import { Sparkles, Compass, CheckCircle2, Award, Play, Download, BookOpen, FileCheck } from 'lucide-react';
import { exportElementToPdf } from '../utils/pdfExport';

interface SectionWelcomeProps {
  studentName: string;
  onSetName: (name: string) => void;
  onStart: () => void;
}

export const SectionWelcome: React.FC<SectionWelcomeProps> = ({
  studentName,
  onSetName,
  onStart,
}) => {
  const [nameInput, setNameInput] = useState(studentName);
  const [error, setError] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const pdf0Ref = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onSetName(nameInput.trim());
    onStart();
  };

  const handleDownloadSection0 = async () => {
    if (!pdf0Ref.current) return;
    setIsExporting(true);
    const safeName = (nameInput.trim() || studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const success = await exportElementToPdf(pdf0Ref.current, `IGCSE_0580_Section0_Syllabus_Overview_${safeName}.pdf`);
    setIsExporting(false);
    if (success) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-teal-950/70 border border-slate-800/80 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Cambridge IGCSE Mathematics 0580 · Extended & Core
            </div>

            <button
              type="button"
              onClick={handleDownloadSection0}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-cyan-300 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Section 0 (PDF)'}</span>
            </button>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-heading">
            The Quadratic Curve: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">The Parabola</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
            Welcome to your interactive maths laboratory! Master quadratic graphs, plot tables of values with animated precision, unlock key features like <span className="text-rose-400 font-semibold">roots</span> and <span className="text-amber-400 font-semibold">turning points</span>, and solve equations graphically.
          </p>

          {/* Student Name Input Form */}
          <form onSubmit={handleStart} className="pt-4 max-w-md space-y-3">
            <label className="block text-sm font-medium text-slate-200">
              Enter your name to begin your saved learning session:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  onSetName(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="e.g. Alex Chen"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-base transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold font-heading text-base shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Begin</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
            {error && (
              <p className="text-rose-400 text-xs font-medium">
                Please enter your name to personalize your notes and final PDF certificate!
              </p>
            )}
            {exportSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Section 0 Syllabus & Formula Sheet downloaded successfully!</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Syllabus Learning Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-3 text-cyan-400 font-semibold text-lg font-heading">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3>IGCSE 0580 Learning Objectives</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Construct tables of values for quadratic functions of the form <MathView math="y = ax^2 + bx + c" />.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Draw smooth, accurate parabolic curves freehand without a ruler.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Locate and interpret the <strong className="text-rose-400">roots</strong> (<MathView math="y = 0" />), the <strong className="text-amber-400">turning point</strong> (vertex), the <strong className="text-emerald-400">y-intercept</strong>, and the <strong className="text-purple-400">line of symmetry</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Solve equations of the form <MathView math="ax^2 + bx + c = k" /> and linear-quadratic systems graphically.
              </span>
            </li>
          </ul>
        </div>

        {/* How to Use Guide */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-3 text-amber-400 font-semibold text-lg font-heading">
            <Award className="w-5 h-5 text-amber-400" />
            <h3>How to Use & Auto-Save Guide</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">1</span>
              <span><strong>Auto-Saved Progress:</strong> Every table cell, answer, and explanation is automatically saved. Feel free to navigate freely between sections!</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">2</span>
              <span><strong>Download Any Section:</strong> You can download each individual section as an official Cambridge-style PDF at any time.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">3</span>
              <span><strong>Visual Tour & Animations:</strong> Use Play, Pause, and Speed controls to watch smooth plotting at your own pace.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">4</span>
              <span><strong>Exam Quiz:</strong> Test your knowledge with 5 Cambridge-style marks with instant step-by-step solutions.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Print-friendly container for Section 0 PDF export */}
      <div
        ref={pdf0Ref}
        style={{ display: 'none' }}
        className="w-[800px] p-10 bg-white text-slate-900 font-sans space-y-6"
      >
        <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Cambridge IGCSE Mathematics 0580 · Extended & Core
            </span>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Section 0: Course Overview & Formula Reference Sheet
            </h1>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div><strong>Student:</strong> {nameInput.trim() || studentName || 'Student'}</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-800">
          <h2 className="font-bold text-slate-900 text-sm">Essential Parabola Formulae Reference:</h2>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <strong>1. General Quadratic Form:</strong>
              <div className="font-mono text-cyan-800 mt-1"><MathView math="y = ax^2 + bx + c" /></div>
              <p className="text-[11px] text-slate-600 mt-1">• <MathView math="a \neq 0" /> controls concavity: <MathView math="a > 0" /> = smile (minimum), <MathView math="a < 0" /> = frown (maximum)</p>
              <p className="text-[11px] text-slate-600">• <MathView math="c" /> gives <MathView math="y" />-intercept at <MathView math="(0, c)" /></p>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <strong>2. Line of Symmetry:</strong>
              <div className="font-mono text-purple-800 mt-1"><MathView math="x = -\dfrac{b}{2a}" /></div>
              <p className="text-[11px] text-slate-600 mt-1">• Vertical line passing through the turning point (vertex).</p>
              <p className="text-[11px] text-slate-600">• Lies exactly halfway between the two roots: <MathView math="x = \dfrac{x_1 + x_2}{2}" /></p>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <strong>3. Roots (x-intercepts):</strong>
              <div className="font-mono text-rose-800 mt-1"><MathView math="y = 0 \iff ax^2 + bx + c = 0" /></div>
              <p className="text-[11px] text-slate-600 mt-1">• Points where the curve cuts the <MathView math="x" />-axis.</p>
              <p className="text-[11px] text-slate-600">• Found via factoring, quadratic formula, or graphical reading.</p>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <strong>4. Graphical Solving Principle:</strong>
              <div className="font-mono text-emerald-800 mt-1"><MathView math="ax^2 + bx + c = k" /></div>
              <p className="text-[11px] text-slate-600 mt-1">• Intersect the parabola with horizontal line <MathView math="y = k" />.</p>
              <p className="text-[11px] text-slate-600">• Solutions are the <MathView math="x" />-values of the intersection points.</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
          <strong>Key Cambridge IGCSE Examiner Tips:</strong>
          <div>• Never use a straight ruler to join points on a curve. Curves must be drawn freehand and smooth.</div>
          <div>• Keep line width uniform; do not use multiple feathering strokes.</div>
          <div>• Always check symmetry: points with equal <MathView math="y" />-values must be equidistant from the axis of symmetry.</div>
        </div>

        <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-500">
          <span>Cambridge Extended Mathematics 0580</span>
          <span>Workbook of {nameInput.trim() || studentName || 'Student'}</span>
        </div>
      </div>
    </div>
  );
};
