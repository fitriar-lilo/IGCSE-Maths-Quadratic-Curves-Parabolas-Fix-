import React, { useState } from 'react';
import { MathView } from './MathView';
import { Sparkles, Compass, CheckCircle2, Award, Play } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-teal-950/70 border border-slate-800/80 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Cambridge IGCSE Mathematics 0580 · Extended & Core
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-heading">
            The Quadratic Curve: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">The Parabola</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
            Welcome to your interactive maths laboratory! Master quadratic graphs, plot tables of values with animated precision, unlock key features like <span className="text-coral-400 font-semibold text-rose-400">roots</span> and <span className="text-amber-400 font-semibold">turning points</span>, and solve equations graphically.
          </p>

          {/* Student Name Input Form */}
          <form onSubmit={handleStart} className="pt-4 max-w-md space-y-3">
            <label className="block text-sm font-medium text-slate-200">
              Enter your name to begin your certified learning session:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="e.g. Alex Chen"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-base transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold font-heading text-base shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
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
            <h3>How to Use This Digital Lesson</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">1</span>
              <span><strong>Interactive Practice:</strong> Type table values, slide coefficients <MathView math="a, b, c" />, and hit <em>Check</em>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">2</span>
              <span><strong>Visual Tour & Animations:</strong> Use Play, Pause, and Speed controls to watch smooth plotting at your own pace.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">3</span>
              <span><strong>Exam Quiz:</strong> Test your knowledge with 5 Cambridge-style marks with instant step-by-step solutions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs shrink-0 mt-0.5">4</span>
              <span><strong>PDF Portfolio:</strong> Once complete, generate a print-ready PDF containing your answers, graphs, and score!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
