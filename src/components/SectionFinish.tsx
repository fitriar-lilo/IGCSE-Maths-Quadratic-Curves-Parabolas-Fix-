import React, { useState, useRef } from 'react';
import { MathView } from './MathView';
import { ParabolaGraph } from './ParabolaGraph';
import {
  Download,
  Award,
  CheckCircle,
  FileCheck,
  Star,
  RefreshCw,
  Sparkles,
  BookOpen,
  Calendar
} from 'lucide-react';

declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
    jspdf?: {
      jsPDF: new (options?: any) => any;
    };
  }
}

interface SectionFinishProps {
  studentName: string;
  score: number;
  explanations: {
    sketching: string;
    roots: string;
    turningPoint: string;
    symmetry: string;
  };
  quizAnswers: { [key: number]: string };
  quizCorrect: { [key: number]: boolean };
  onRestart: () => void;
}

export const SectionFinish: React.FC<SectionFinishProps> = ({
  studentName,
  score,
  explanations,
  quizAnswers,
  quizCorrect,
  onRestart,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const getGradeTitle = (s: number) => {
    if (s >= 9) return 'A* (Distinction Level) — Outstanding Master';
    if (s >= 7) return 'A (Merit Level) — Strong Proficiency';
    if (s >= 5) return 'B (Good Pass) — Solid Foundation';
    return 'Core Progress — Keep Practicing';
  };

  const strengths: string[] = [];
  const areasToReview: string[] = [];

  if (quizCorrect[1]) strengths.push('Constructing and calculating tables of values accurately');
  else areasToReview.push('Substituting values into quadratic equations to build tables');

  if (quizCorrect[2]) strengths.push('Identifying roots, maximum turning point, and axis of symmetry from a graph');
  else areasToReview.push('Reading vertex coordinates and symmetric axes on inverted parabolas');

  if (quizCorrect[3]) strengths.push('Deducing concavity and y-intercept algebraically without plotting');
  else areasToReview.push('Connecting coefficient signs (a > 0 vs a < 0) to smile/frown shapes');

  if (quizCorrect[4]) strengths.push('Extracting vertex turning point and axis of symmetry from vertex form y = (x - h)² + k');
  else areasToReview.push('Finding minimum/maximum vertex coordinates from completed square form');

  if (quizCorrect[5]) strengths.push('Calculating the discriminant Δ = b² - 4ac and determining the number of roots');
  else areasToReview.push('Applying discriminant rules (Δ > 0, Δ = 0, Δ < 0) to determine x-axis intersections');

  if (quizCorrect[6]) strengths.push('Solving ax² + bx + c = 0 graphically by reading x-intercepts with line y = 0');
  else areasToReview.push('Recognizing that roots correspond to y = 0 on the x-axis');

  if (quizCorrect[7]) strengths.push('Solving quadratic equations equal to a constant (ax² + bx + c = k) using horizontal lines');
  else areasToReview.push('Drawing horizontal lines y = k and projecting down to the x-axis');

  if (quizCorrect[8]) strengths.push('Identifying tangent lines touching the vertex (one repeated solution)');
  else areasToReview.push('Recognizing that a horizontal line touching the vertex yields exactly 1 repeated root');

  if (quizCorrect[9]) strengths.push('Solving equations with slanted lines y = mx + d via graphical intersections');
  else areasToReview.push('Decomposing equations into curve and slanted line y = mx + d to find meeting points');

  if (quizCorrect[10]) strengths.push('Recognizing when equations have 0 real solutions because lines lie beyond the turning point');
  else areasToReview.push('Explaining why no real solutions exist when lines do not intersect the parabola');

  if (strengths.length === 0) strengths.push('Completed all sections and attempted all 10 challenging exam problems!');

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsExporting(true);

    try {
      // Temporarily reveal pdf container offscreen
      const container = pdfRef.current;
      container.style.display = 'block';

      if (window.html2canvas && window.jspdf) {
        const canvas = await window.html2canvas(container, {
          scale: 1.8,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        const safeName = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`IGCSE_Maths_0580_Quadratic_${safeName}.pdf`);
        setExportSuccess(true);
      } else {
        // Fallback print dialog
        window.print();
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      if (pdfRef.current) {
        pdfRef.current.style.display = 'none';
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Certificate Display Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-teal-950/80 border-2 border-amber-500/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-widest font-heading">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          Certificate of Course Mastery
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-heading tracking-tight">
            Cambridge IGCSE Mathematics 0580
          </h2>
          <p className="text-cyan-300 text-lg md:text-xl font-medium">
            Graphs of Functions · The Quadratic Parabola
          </p>
        </div>

        <div className="py-2">
          <span className="text-xs text-slate-400 uppercase tracking-widest block">This certifies that</span>
          <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-heading mt-1">
            {studentName || 'Dedicated Mathematician'}
          </div>
          <span className="text-xs text-slate-400 block mt-2">
            has successfully completed all guided discovery modules, graphical solvers, and the final 10-question examination.
          </span>
        </div>

        {/* Score Pill & Level */}
        <div className="inline-flex flex-col items-center p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1">
          <div className="text-3xl font-bold font-mono text-amber-400">{score} / 10 Marks</div>
          <span className="text-xs font-semibold text-slate-300">{getGradeTitle(score)}</span>
        </div>

        {/* PDF Download Button */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold font-heading text-base shadow-xl shadow-cyan-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{isExporting ? 'Generating PDF Portfolio...' : 'Download Certified PDF Portfolio'}</span>
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Review Lesson from Start</span>
          </button>
        </div>

        {exportSuccess && (
          <p className="text-xs text-emerald-400 font-medium">
            ✓ Your PDF report has been downloaded! It contains your name, tables, graphs, explanations, and exam answers.
          </p>
        )}
      </div>

      {/* Strengths & Areas to Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading text-base">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3>Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-2 text-xs md:text-sm text-slate-300">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-heading text-base">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3>Recommendations for Revision</h3>
          </div>
          <ul className="space-y-2 text-xs md:text-sm text-slate-300">
            {areasToReview.length > 0 ? (
              areasToReview.map((rev, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span>{rev}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">
                Flawless score! You are fully prepared for quadratic curve questions on Cambridge IGCSE Papers 2 & 4.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* =========================================================================
          HIDDEN PRINT-FRIENDLY LIGHT THEME CONTAINER FOR HTML2CANVAS & JSPDF
         ========================================================================= */}
      <div
        ref={pdfRef}
        style={{ display: 'none' }}
        className="w-[800px] p-10 bg-white text-slate-900 font-sans space-y-8"
      >
        {/* PDF Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Cambridge IGCSE Mathematics (0580)
            </span>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Student Portfolio: Quadratic Graphs & Parabolas
            </h1>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div><strong>Student:</strong> {studentName || 'Student'}</div>
            <div><strong>Final Score:</strong> {score} / 5 Marks ({getGradeTitle(score)})</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Section A: Tables & Graphs */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 font-heading">
            1. Manual Concavity Research & Tables of Values
          </h2>

          {/* Curve 1 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-teal-800">Curve 1: y = x² - 2x - 3 (Smile · a = +1 &gt; 0, Minimum at (1, -4))</span>
              <span className="text-slate-500 font-mono">Roots: x = -1, 3 | y-int: (0, -3) | Line: x = 1</span>
            </div>
            <table className="w-full text-center border border-slate-300 text-[11px]">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="p-1.5 border border-slate-300">x</th>
                  <th className="p-1.5 border border-slate-300">-2</th>
                  <th className="p-1.5 border border-slate-300">-1</th>
                  <th className="p-1.5 border border-slate-300">0</th>
                  <th className="p-1.5 border border-slate-300">1</th>
                  <th className="p-1.5 border border-slate-300">2</th>
                  <th className="p-1.5 border border-slate-300">3</th>
                  <th className="p-1.5 border border-slate-300">4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1.5 font-bold border border-slate-300">y</td>
                  <td className="p-1.5 border border-slate-300">5</td>
                  <td className="p-1.5 border border-slate-300">0</td>
                  <td className="p-1.5 border border-slate-300">-3</td>
                  <td className="p-1.5 border border-slate-300">-4</td>
                  <td className="p-1.5 border border-slate-300">-3</td>
                  <td className="p-1.5 border border-slate-300">0</td>
                  <td className="p-1.5 border border-slate-300">5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Curve 2 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-rose-800">Curve 2: y = -x² + 2x + 3 (Frown · a = -1 &lt; 0, Maximum at (1, 4))</span>
              <span className="text-slate-500 font-mono">Roots: x = -1, 3 | y-int: (0, 3) | Line: x = 1</span>
            </div>
            <table className="w-full text-center border border-slate-300 text-[11px]">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="p-1.5 border border-slate-300">x</th>
                  <th className="p-1.5 border border-slate-300">-2</th>
                  <th className="p-1.5 border border-slate-300">-1</th>
                  <th className="p-1.5 border border-slate-300">0</th>
                  <th className="p-1.5 border border-slate-300">1</th>
                  <th className="p-1.5 border border-slate-300">2</th>
                  <th className="p-1.5 border border-slate-300">3</th>
                  <th className="p-1.5 border border-slate-300">4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1.5 font-bold border border-slate-300">y</td>
                  <td className="p-1.5 border border-slate-300">-5</td>
                  <td className="p-1.5 border border-slate-300">0</td>
                  <td className="p-1.5 border border-slate-300">3</td>
                  <td className="p-1.5 border border-slate-300">4</td>
                  <td className="p-1.5 border border-slate-300">3</td>
                  <td className="p-1.5 border border-slate-300">0</td>
                  <td className="p-1.5 border border-slate-300">-5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Curve 3 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-teal-800">Curve 3: y = ½x² - 2x (Wide Smile · a = 0.5 &gt; 0, Minimum at (2, -2))</span>
              <span className="text-slate-500 font-mono">Roots: x = 0, 4 | y-int: (0, 0) | Line: x = 2</span>
            </div>
            <table className="w-full text-center border border-slate-300 text-[11px]">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="p-1.5 border border-slate-300">x</th>
                  <th className="p-1.5 border border-slate-300">-1</th>
                  <th className="p-1.5 border border-slate-300">0</th>
                  <th className="p-1.5 border border-slate-300">1</th>
                  <th className="p-1.5 border border-slate-300">2</th>
                  <th className="p-1.5 border border-slate-300">3</th>
                  <th className="p-1.5 border border-slate-300">4</th>
                  <th className="p-1.5 border border-slate-300">5</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1.5 font-bold border border-slate-300">y</td>
                  <td className="p-1.5 border border-slate-300">2.5</td>
                  <td className="p-1.5 border border-slate-300">0</td>
                  <td className="p-1.5 border border-slate-300">-1.5</td>
                  <td className="p-1.5 border border-slate-300">-2</td>
                  <td className="p-1.5 border border-slate-300">-1.5</td>
                  <td className="p-1.5 border border-slate-300">0</td>
                  <td className="p-1.5 border border-slate-300">2.5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section B: Student Written Explanations */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 font-heading">
            2. Student Written Conceptual Explanations
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong>(a) How to sketch a parabola:</strong>
              <p className="text-slate-700 italic mt-0.5">
                {explanations.sketching || 'Construct a table of values, plot coordinate points accurately, and connect with a smooth continuous curve without using a ruler.'}
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong>(b) What are roots:</strong>
              <p className="text-slate-700 italic mt-0.5">
                {explanations.roots || 'The x-intercepts where the parabola intersects the horizontal x-axis (where y = 0).'}
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong>(c) What is the turning point:</strong>
              <p className="text-slate-700 italic mt-0.5">
                {explanations.turningPoint || 'The vertex where curve changes direction; minimum when a > 0 (smile) and maximum when a < 0 (frown).'}
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong>(d) What is the line of symmetry:</strong>
              <p className="text-slate-700 italic mt-0.5">
                {explanations.symmetry || 'A vertical line x = h passing through the vertex, lying exactly halfway between the two roots.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section C: Final Assessment Answers */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 font-heading">
            3. Final Assessment Results & Worked Solutions (10 Questions Total)
          </h2>
          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Part 1: Discovery & Sketching</div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q1:</strong> Table & y-intercept for y = x² - 4x + 3</span>
              <span className={quizCorrect[1] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[1] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q2:</strong> Features of y = -x² + 4 (Roots: -2, 2 | TP: (0, 4) | Sym: x = 0)</span>
              <span className={quizCorrect[2] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[2] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q3:</strong> Deducing y = -3x² + x + 5 (Maximum, y-intercept = 5)</span>
              <span className={quizCorrect[3] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[3] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q4:</strong> Vertex form y = (x - 3)² - 1 (TP: (3, -1) | Sym: x = 3)</span>
              <span className={quizCorrect[4] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[4] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q5:</strong> Discriminant Δ = -16 & 0 real roots for y = x² - 2x + 5</span>
              <span className={quizCorrect[5] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[5] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>

            <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] pt-1">Part 2: Solving Graphically</div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q6:</strong> Graphical solution of x² - 4x + 3 = 0 (x = 1, x = 3)</span>
              <span className={quizCorrect[6] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[6] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q7:</strong> Graphical solution of x² - 4x + 3 = 3 (x = 0, x = 4)</span>
              <span className={quizCorrect[7] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[7] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q8:</strong> Tangent at vertex x² - 4x + 3 = -1 (1 solution: x = 2)</span>
              <span className={quizCorrect[8] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[8] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q9:</strong> Slanted line x² - 4x + 3 = -x + 3 (x = 0, x = 3)</span>
              <span className={quizCorrect[9] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[9] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span><strong>Q10:</strong> No real solutions x² - 4x + 3 = -4 (0 meeting points)</span>
              <span className={quizCorrect[10] ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                {quizCorrect[10] ? '1/1 Mark (Correct)' : '0/1 Mark'}
              </span>
            </div>
          </div>
        </div>

        {/* Stamp / Endorsement */}
        <div className="pt-6 border-t-2 border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div>
            Cambridge IGCSE Mathematics 0580 Extended Standard Verification
          </div>
          <div className="border border-slate-400 p-2 rounded text-slate-700 font-mono font-semibold">
            VERIFIED COMPLETE · GRADE: {score}/10
          </div>
        </div>
      </div>
    </div>
  );
};
