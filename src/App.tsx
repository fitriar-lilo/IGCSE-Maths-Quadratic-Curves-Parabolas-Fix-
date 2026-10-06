import React, { useState } from 'react';
import { SectionWelcome } from './components/SectionWelcome';
import { SectionDiscovery } from './components/SectionDiscovery';
import { SectionSolving } from './components/SectionSolving';
import { SectionQuiz } from './components/SectionQuiz';
import { SectionFinish } from './components/SectionFinish';
import { MathView } from './components/MathView';
import { soundManager } from './utils/soundEffects';
import {
  Compass,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Trophy,
  ArrowRight,
  User,
  GraduationCap,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function App() {
  const [studentName, setStudentName] = useState('');
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [voiceOn, setVoiceOn] = useState<boolean>(true);

  const toggleSound = () => {
    const next = !soundOn;
    soundManager.setSoundEnabled(next);
    setSoundOn(next);
    if (next) soundManager.playPointSound(0);
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    soundManager.setVoiceEnabled(next);
    setVoiceOn(next);
    if (next) soundManager.speak("Teacher voice effect enabled.");
  };
  
  // Student written explanations for Section 1.5
  const [explanations, setExplanations] = useState({
    sketching: '',
    roots: '',
    turningPoint: '',
    symmetry: '',
  });

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizChecked, setQuizChecked] = useState<{ [key: number]: boolean }>({});
  const [quizCorrect, setQuizCorrect] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState<number>(0);

  const sections = [
    { id: 0, title: 'Welcome', icon: Compass },
    { id: 1, title: '1. Discovery & Sketching', icon: Sparkles },
    { id: 2, title: '2. Solving Graphically', icon: BookOpen },
    { id: 3, title: '3. Final Assessment', icon: Trophy },
    { id: 4, title: '4. Certificate & PDF', icon: GraduationCap },
  ];

  // Calculate progress percentage
  const calculateProgress = () => {
    if (currentSection === 0) return 5;
    if (currentSection === 1) return 30;
    if (currentSection === 2) return 60;
    if (currentSection === 3) {
      const answeredCount = Object.keys(quizChecked).length;
      return 60 + answeredCount * 6; // 60% to 90%
    }
    return 100;
  };

  const handleUpdateQuiz = (qId: number, answer: string, isCorrect: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: answer }));
    setQuizChecked((prev) => ({ ...prev, [qId]: true }));
    setQuizCorrect((prev) => {
      const updated = { ...prev, [qId]: isCorrect };
      const newScore = Object.values(updated).filter(Boolean).length;
      setScore(newScore);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#131131] to-[#0a2f35] text-slate-100 flex flex-col font-sans">
      {/* Top Header & Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand & Course Lockup */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <Compass className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white font-heading leading-tight">
                IGCSE 0580: The Quadratic Parabola
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Cambridge Extended Maths</span>
                {studentName && (
                  <>
                    <span>·</span>
                    <span className="text-cyan-300 font-medium flex items-center gap-1">
                      <User className="w-3 h-3 inline" /> {studentName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Nav steps */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = currentSection === sec.id;
              const isPast = currentSection > sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : isPast
                      ? 'text-emerald-400 hover:text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Score, Sound Toggles & Progress Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'Sound Effects Enabled (click to mute)' : 'Sound Effects Muted (click to enable)'}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                soundOn
                  ? 'bg-slate-900 border border-slate-700 text-cyan-300 shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-500'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span className="hidden xl:inline text-[11px]">{soundOn ? 'SFX On' : 'Muted'}</span>
            </button>

            {/* Voice Feedback Toggle */}
            <button
              onClick={toggleVoice}
              title={voiceOn ? 'Teacher Voice Enabled (click to mute)' : 'Teacher Voice Muted (click to enable)'}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                voiceOn
                  ? 'bg-slate-900 border border-slate-700 text-amber-300 shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-sm">🗣️</span>
              <span className="hidden xl:inline text-[11px]">{voiceOn ? 'Voice On' : 'Voice Off'}</span>
            </button>

            <div className="text-right hidden sm:block pl-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lesson Progress</span>
              <span className="text-xs font-mono font-bold text-cyan-300">{calculateProgress()}%</span>
            </div>
          </div>
        </div>

        {/* Global Persistent Progress Bar */}
        <div className="w-full bg-slate-900 h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Mascot Encouragement Header */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
              🦉
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 font-heading">
                Archie the Angle Owl · Your IGCSE Guide
              </span>
              <p className="text-xs text-slate-300">
                {currentSection === 0 && 'Welcome! Enter your name below to unlock your interactive quadratic workbook.'}
                {currentSection === 1 && 'Remember: Join points with a smooth curved line. Never use a straight ruler!'}
                {currentSection === 2 && 'To solve an equation graphically, draw the horizontal line and read straight down to the x-axis.'}
                {currentSection === 3 && 'Take your time on each mark. Read non-integer graph values to 1 decimal place.'}
                {currentSection === 4 && 'Outstanding work! Download your certified PDF report below to keep your proof of mastery.'}
              </p>
            </div>
          </div>

          {/* Section Quick Jump */}
          {currentSection < 4 && (
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium shrink-0 transition-all"
            >
              <span>Next Section</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active Section Content */}
        {currentSection === 0 && (
          <SectionWelcome
            studentName={studentName}
            onSetName={(name) => setStudentName(name)}
            onStart={() => setCurrentSection(1)}
          />
        )}

        {currentSection === 1 && (
          <SectionDiscovery
            explanations={explanations}
            onUpdateExplanations={(newExp) => setExplanations(newExp)}
            onCompleteSection={() => setCurrentSection(2)}
          />
        )}

        {currentSection === 2 && (
          <SectionSolving onCompleteSection={() => setCurrentSection(3)} />
        )}

        {currentSection === 3 && (
          <SectionQuiz
            quizAnswers={quizAnswers}
            quizChecked={quizChecked}
            quizCorrect={quizCorrect}
            score={score}
            onUpdateQuestion={handleUpdateQuiz}
            onCompleteQuiz={() => setCurrentSection(4)}
          />
        )}

        {currentSection === 4 && (
          <SectionFinish
            studentName={studentName}
            score={score}
            explanations={explanations}
            quizAnswers={quizAnswers}
            quizCorrect={quizCorrect}
            onRestart={() => setCurrentSection(0)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>Cambridge IGCSE Mathematics 0580 Interactive Digital Curriculum</div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Consistent Colour Key:</span>
            <span className="text-rose-400 font-semibold">• Roots</span>
            <span className="text-amber-400 font-semibold">• Vertex</span>
            <span className="text-emerald-400 font-semibold">• y-Intercept</span>
            <span className="text-purple-400 font-semibold">• Axis of Symmetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
