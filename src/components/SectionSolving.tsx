import React, { useState } from 'react';
import { MathView } from './MathView';
import { ParabolaGraph, LineSpec, Point } from './ParabolaGraph';
import { soundManager } from '../utils/soundEffects';
import {
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface SectionSolvingProps {
  onCompleteSection: () => void;
}

interface ExampleData {
  id: number;
  title: string;
  equation: string;
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

export const SectionSolving: React.FC<SectionSolvingProps> = ({ onCompleteSection }) => {
  const [activeEx, setActiveEx] = useState(1);
  const [tryItInputs, setTryItInputs] = useState<{ [id: number]: string }>({});
  const [tryItResults, setTryItResults] = useState<{ [id: number]: boolean | null }>({});

  const examples: ExampleData[] = [
    {
      id: 1,
      title: '1. Equation equal to Zero',
      equation: 'x^2 - 2x - 3 = 0',
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: 0, color: '#f43f5e', dashed: false, label: 'y = 0 (x-axis)' },
      intersections: [
        { x: -1, y: 0 },
        { x: 3, y: 0 },
      ],
      explanationLaTeX: 'x = -1 \\quad \\text{or} \\quad x = 3',
      steps: [
        'The right side is $0$, which represents the horizontal line $y = 0$ (the $x$-axis).',
        'Look at where the parabola $y = x^2 - 2x - 3$ crosses the $x$-axis.',
        'Read the $x$-coordinates directly: $x = -1$ and $x = 3$.',
      ],
      tryItPrompt: 'What are the two roots shown on the x-axis?',
      tryItAnswers: ['-1, 3', '-1,3', '3, -1', '3,-1', '-1 and 3', 'x = -1, x = 3'],
      tryItFeedback: 'Spot on! The intersections with y = 0 give x = -1 and x = 3.',
    },
    {
      id: 2,
      title: '2. Equation equal to a Positive Constant',
      equation: 'x^2 - 2x - 3 = 5',
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: 5, color: '#ec4899', dashed: false, label: 'y = 5' },
      intersections: [
        { x: -2, y: 5 },
        { x: 4, y: 5 },
      ],
      explanationLaTeX: 'x = -2 \\quad \\text{or} \\quad x = 4',
      steps: [
        'Draw the horizontal line $y = 5$ across the grid.',
        'Find the two intersection points between the curve and $y = 5$: $(-2, 5)$ and $(4, 5)$.',
        'Drop dotted vertical lines straight down to the $x$-axis to read the solutions: $x = -2$ and $x = 4$.',
      ],
      tryItPrompt: 'Enter the two x-values where the curve meets y = 5 (separated by comma):',
      tryItAnswers: ['-2, 4', '-2,4', '4, -2', '4,-2', '-2 and 4'],
      tryItFeedback: 'Excellent! Drop lines straight down from y = 5 to get x = -2 and x = 4.',
    },
    {
      id: 3,
      title: '3. Equation equal to a Negative Constant',
      equation: 'x^2 - 2x - 3 = -3',
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: -3, color: '#ec4899', dashed: false, label: 'y = -3' },
      intersections: [
        { x: 0, y: -3 },
        { x: 2, y: -3 },
      ],
      explanationLaTeX: 'x = 0 \\quad \\text{or} \\quad x = 2',
      steps: [
        'Draw the horizontal line $y = -3$.',
        'One intersection is on the $y$-axis at $(0, -3)$, giving $x = 0$.',
        'The second intersection is at $(2, -3)$, giving $x = 2$.',
      ],
      tryItPrompt: 'Enter the two solutions for x^2 - 2x - 3 = -3:',
      tryItAnswers: ['0, 2', '0,2', '2, 0', '2,0', '0 and 2'],
      tryItFeedback: 'Correct! The solutions are x = 0 and x = 2.',
    },
    {
      id: 4,
      title: '4. Line Touching the Turning Point (One Solution)',
      equation: 'x^2 - 2x - 3 = -4',
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: -4, color: '#f59e0b', dashed: false, label: 'y = -4 (Tangent)' },
      intersections: [{ x: 1, y: -4 }],
      explanationLaTeX: 'x = 1 \\quad \\text{(one repeated root)}',
      steps: [
        'Draw the horizontal line $y = -4$.',
        'The minimum turning point of the curve is exactly $(1, -4)$.',
        'Because the horizontal line just grazes the curve at its vertex, there is only ONE point of contact.',
        'Solution: $x = 1$ (a repeated or double root).',
      ],
      tryItPrompt: 'How many real solutions does x^2 - 2x - 3 = -4 have?',
      tryItAnswers: ['1', 'one', '1 solution', 'one solution'],
      tryItFeedback: 'Exactly! It is tangent at the vertex, so there is only 1 repeated solution (x = 1).',
    },
    {
      id: 5,
      title: '5. Line Missing the Curve (No Real Solutions)',
      equation: 'x^2 - 2x - 3 = -6',
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: -6, color: '#94a3b8', dashed: true, label: 'y = -6' },
      intersections: [],
      explanationLaTeX: '\\text{No real solutions}',
      steps: [
        'Draw the horizontal line $y = -6$.',
        'Notice that the lowest point on the parabola is $y = -4$.',
        'The line $y = -6$ lies completely beneath the parabola and never touches or crosses it.',
        'Therefore, there are NO real solutions to this equation.',
      ],
      tryItPrompt: 'How many intersection points are there with y = -6?',
      tryItAnswers: ['0', 'zero', 'none', 'no solutions', '0 solutions'],
      tryItFeedback: 'Spot on! The line lies below the minimum, so there are 0 real solutions.',
    },
    {
      id: 6,
      title: '6. Rearranging to Match the Given Curve',
      equation: 'x^2 - 2x = 3',
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'horizontal', value: 0, color: '#f43f5e', dashed: false, label: 'y = 0' },
      intersections: [
        { x: -1, y: 0 },
        { x: 3, y: 0 },
      ],
      explanationLaTeX: 'x^2 - 2x - 3 = 0 \\implies x = -1 \\quad \\text{or} \\quad x = 3',
      steps: [
        'The question asks to solve $x^2 - 2x = 3$ using our drawn graph of $y = x^2 - 2x - 3$.',
        'First, rearrange by subtracting $3$ from both sides: $x^2 - 2x - 3 = 0$.',
        'Now the left-hand side matches our plotted curve!',
        'Read the roots on the $x$-axis: $x = -1$ and $x = 3$.',
      ],
      tryItPrompt: 'What should you subtract from both sides to get the graphed equation?',
      tryItAnswers: ['3', '-3', 'three'],
      tryItFeedback: 'Correct! Subtract 3 to turn x^2 - 2x = 3 into x^2 - 2x - 3 = 0.',
    },
    {
      id: 7,
      title: '7. Solving with a Slanted Straight Line y = mx + c',
      equation: 'x^2 - 2x - 3 = x - 1',
      curveA: 1,
      curveB: -2,
      curveC: -3,
      line: { type: 'linear', m: 1, c: -1, color: '#ec4899', dashed: false, label: 'y = x - 1' },
      intersections: [
        { x: -0.56, y: -1.56 },
        { x: 3.56, y: 2.56 },
      ],
      explanationLaTeX: 'x \\approx -0.6 \\quad \\text{or} \\quad x \\approx 3.6',
      steps: [
        'To solve $x^2 - 2x - 3 = x - 1$, draw the straight line $y = x - 1$ on the same coordinate axes.',
        'Plot two or three points for $y = x - 1$: $(0, -1)$, $(2, 1)$, $(4, 3)$, and draw a straight line with a ruler.',
        'Find where the line and curve intersect.',
        'Read the $x$-coordinates: $x \\approx -0.6$ and $x \\approx 3.6$.',
      ],
      tryItPrompt: 'What type of line is y = x - 1? (horizontal, vertical, or straight line)',
      tryItAnswers: ['straight', 'straight line', 'linear', 'diagonal', 'slanted'],
      tryItFeedback: 'Correct! y = mx + c is a straight line drawn with a ruler.',
    },
    {
      id: 8,
      title: '8. Solving on a Concave-Down Parabola (a < 0)',
      equation: '-x^2 + 2x + 3 = 3',
      curveA: -1,
      curveB: 2,
      curveC: 3,
      line: { type: 'horizontal', value: 3, color: '#ec4899', dashed: false, label: 'y = 3' },
      intersections: [
        { x: 0, y: 3 },
        { x: 2, y: 3 },
      ],
      explanationLaTeX: 'x = 0 \\quad \\text{or} \\quad x = 2',
      steps: [
        'We now use the graph of $y = -x^2 + 2x + 3$ (the frown curve).',
        'Draw the horizontal line $y = 3$.',
        'The line meets the parabola at $(0, 3)$ and $(2, 3)$.',
        'Reading down to the $x$-axis gives the two solutions: $x = 0$ and $x = 2$.',
      ],
      tryItPrompt: 'Enter the two solutions for -x^2 + 2x + 3 = 3:',
      tryItAnswers: ['0, 2', '0,2', '2, 0', '2,0', '0 and 2'],
      tryItFeedback: 'Awesome work! The solutions are x = 0 and x = 2.',
    },
  ];

  const current = examples.find((e) => e.id === activeEx) || examples[0];

  const handleCheckTryIt = () => {
    const input = (tryItInputs[current.id] || '').trim().toLowerCase();
    const isCorrect = current.tryItAnswers.some((ans) =>
      input.replace(/\s+/g, '').includes(ans.toLowerCase().replace(/\s+/g, ''))
    );
    setTryItResults((prev) => ({ ...prev, [current.id]: isCorrect }));
    if (isCorrect) {
      soundManager.playCorrectSound("Spot on! That's the correct graphical solution.");
    } else {
      soundManager.playWrongSound();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
          IGCSE Core Principle · Graphical Solutions
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
          Solving Quadratic Equations Graphically
        </h2>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          The solutions to any equation <MathView math="ax^2 + bx + c = k" /> are simply the 
          <strong className="text-cyan-300"> x-coordinates</strong> of the intersection points between the curve 
          <MathView math="y = ax^2 + bx + c" /> and the line <MathView math="y = k" />!
        </p>
      </div>

      {/* Main Interactive Stage: Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Example Navigator & Full LaTeX Solution Deck */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6 backdrop-blur-xl">
            {/* 8 numbered buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Select an Example (1 to 8):
              </span>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveEx(ex.id)}
                    className={`h-11 rounded-xl text-sm font-bold font-mono transition-all flex items-center justify-center ${
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
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-center mt-3">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">Final Answer</span>
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
                  onChange={(e) => setTryItInputs({ ...tryItInputs, [current.id]: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  onClick={handleCheckTryIt}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
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
                  Not quite. Look carefully at the graph on the right and read the x-axis directly below the pink dots!
                </p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={activeEx === 1}
                onClick={() => setActiveEx(activeEx - 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold"
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Graph Animation and Intersection Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <ParabolaGraph
            a={current.curveA}
            b={current.curveB}
            c={current.curveC}
            xMin={-3.5}
            xMax={5.5}
            yMin={-7}
            yMax={8}
            additionalLines={[current.line]}
            intersectPoints={current.intersections}
            curveColor={current.curveA > 0 ? '#38bdf8' : '#f43f5e'}
          />

          {/* Remember Box */}
          <div className="rounded-2xl bg-amber-950/30 border border-amber-800/40 p-5 text-xs text-amber-200 space-y-3">
            <div className="flex items-center gap-2 font-bold font-heading text-sm text-amber-400">
              <Info className="w-4 h-4" />
              <span>IGCSE Exam Rule · The Number of Real Solutions</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                • If the line <MathView math="y = k" /> cuts the curve twice <MathView math="\implies" /> <strong>2 real solutions</strong>.
              </li>
              <li>
                • If the line <MathView math="y = k" /> touches the turning point <MathView math="\implies" /> <strong>1 repeated solution</strong>.
              </li>
              <li>
                • If the line <MathView math="y = k" /> does not meet the curve <MathView math="\implies" /> <strong>0 real solutions</strong>.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-amber-900/30">
              <strong>Accuracy Tip:</strong> In the IGCSE examination, readings taken from a drawn graph that are non-integers are acceptable within $\pm 0.1$ of the true value.
            </p>
          </div>

          {/* Continue Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onCompleteSection}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold font-heading text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <span>Ready for Final Assessment (5 Marks)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
