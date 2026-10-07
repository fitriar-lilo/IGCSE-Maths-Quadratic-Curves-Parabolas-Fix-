import React, { useState, useEffect, useRef } from 'react';
import { SectionWelcome } from './components/SectionWelcome';
import { SectionDiscovery } from './components/SectionDiscovery';
import { SectionSolving } from './components/SectionSolving';
import { SectionQuiz } from './components/SectionQuiz';
import { SectionFinish } from './components/SectionFinish';
import { soundManager } from './utils/soundEffects';
import {
  LessonState,
  Section1State,
  Section2State,
  Section3State,
  getDefaultLessonState,
  getDefaultSection1State,
  getDefaultSection2State,
  getDefaultSection3State,
} from './types';
import {
  Compass,
  Sparkles,
  BookOpen,
  Trophy,
  GraduationCap,
  ArrowRight,
  User,
  Volume2,
  VolumeX,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const STORAGE_KEY = 'igcse_0580_parabola_lesson_state_v2';

const loadSavedState = (): LessonState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...getDefaultLessonState(),
          ...parsed,
          section1: { ...getDefaultSection1State(), ...(parsed.section1 || {}) },
          section2: { ...getDefaultSection2State(), ...(parsed.section2 || {}) },
          section3: { ...getDefaultSection3State(), ...(parsed.section3 || {}) },
        };
      }
    }
  } catch (err) {
    console.error('Failed to load saved state:', err);
  }
  return getDefaultLessonState();
};

export default function App() {
  const [lessonState, setLessonState] = useState<LessonState>(() => loadSavedState());
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [voiceOn, setVoiceOn] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [downloadDropdown, setDownloadDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage whenever lessonState changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lessonState));
    } catch (err) {
      console.error('Failed to persist session state:', err);
    }
  }, [lessonState]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDownloadDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleManualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lessonState));
      if (soundOn) soundManager.playPointSound(5);
      showNotification('✓ All section work successfully saved to local browser storage!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset your workbook progress? All completed tables and answers will be cleared.'
    );
    if (confirmed) {
      const fresh = getDefaultLessonState();
      setLessonState(fresh);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
      showNotification('Workbook reset to initial state.');
    }
  };

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
    if (next) soundManager.speak('Teacher voice effect enabled.');
  };

  const currentSection = lessonState.currentSection;
  const setCurrentSection = (sec: number) => {
    setLessonState((prev) => ({
      ...prev,
      currentSection: sec,
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const setStudentName = (name: string) => {
    setLessonState((prev) => ({ ...prev, studentName: name }));
  };

  const updateSection1 = (updater: (prev: Section1State) => Section1State) => {
    setLessonState((prev) => ({
      ...prev,
      section1: updater(prev.section1),
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const updateSection2 = (updater: (prev: Section2State) => Section2State) => {
    setLessonState((prev) => ({
      ...prev,
      section2: updater(prev.section2),
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const updateSection3 = (updater: (prev: Section3State) => Section3State) => {
    setLessonState((prev) => ({
      ...prev,
      section3: updater(prev.section3),
      lastSavedAt: new Date().toISOString(),
    }));
  };

  const sections = [
    { id: 0, title: 'Welcome', icon: Compass },
    { id: 1, title: '1. Discovery & Sketching', icon: Sparkles },
    { id: 2, title: '2. Solving Graphically', icon: BookOpen },
    { id: 3, title: '3. Final Assessment', icon: Trophy },
    { id: 4, title: '4. Certificate & PDF', icon: GraduationCap },
  ];

  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (currentSection === 0) return 5;
    if (currentSection === 1) {
      let p = 20;
      if (lessonState.section1.isCurve1Connected) p += 5;
      if (lessonState.section1.isCurve2Connected) p += 5;
      if (lessonState.section1.isCurve3Connected) p += 5;
      return p;
    }
    if (currentSection === 2) {
      const solved = Object.keys(lessonState.section2.tryItResults).length;
      return 40 + Math.min(solved * 3, 20);
    }
    if (currentSection === 3) {
      const answeredCount = Object.keys(lessonState.section3.quizChecked).length;
      return 65 + answeredCount * 6; // up to 95%
    }
    return 100;
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
                {lessonState.studentName && (
                  <>
                    <span>·</span>
                    <span className="text-cyan-300 font-medium flex items-center gap-1">
                      <User className="w-3 h-3 inline" /> {lessonState.studentName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Nav steps */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = currentSection === sec.id;
              const isPast = currentSection > sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

          {/* Action Tools: Save, Download Dropdown, Audio & Progress */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Auto-save status / Save Button */}
            <button
              onClick={handleManualSave}
              title="Click to manually save workbook progress to browser storage"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-emerald-400 transition-all cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-[11px]">Save Work</span>
            </button>

            {/* Download Sections Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDownloadDropdown(!downloadDropdown)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-cyan-300 transition-all cursor-pointer shadow-sm"
                title="Download any section as PDF"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline text-[11px]">Download PDF</span>
                <ChevronDown className="w-3 h-3 text-cyan-400" />
              </button>

              {downloadDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Export Section as PDF
                  </div>
                  <button
                    onClick={() => {
                      setCurrentSection(0);
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-all"
                  >
                    <span>Section 0: Syllabus & Formulae</span>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSection(1);
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-all"
                  >
                    <span>Section 1: Discovery & 3 Curves</span>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSection(2);
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-all"
                  >
                    <span>Section 2: Graphical Solving</span>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSection(3);
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-all"
                  >
                    <span>Section 3: Exam Paper & Results</span>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSection(4);
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 hover:bg-cyan-900/50 flex items-center justify-between transition-all font-semibold"
                  >
                    <span>Complete Lesson Portfolio & Cert</span>
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'Sound Effects Enabled (click to mute)' : 'Sound Effects Muted (click to enable)'}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                soundOn
                  ? 'bg-slate-900 border border-slate-700 text-cyan-300 shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-500'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span className="hidden xl:inline text-[11px]">{soundOn ? 'SFX' : 'Muted'}</span>
            </button>

            {/* Teacher Voice Toggle */}
            <button
              onClick={toggleVoice}
              title={voiceOn ? 'Teacher Voice Enabled (click to mute)' : 'Teacher Voice Muted (click to enable)'}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                voiceOn
                  ? 'bg-slate-900 border border-slate-700 text-amber-300 shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-sm">🗣️</span>
              <span className="hidden xl:inline text-[11px]">{voiceOn ? 'Voice' : 'Off'}</span>
            </button>

            {/* Reset button */}
            <button
              onClick={handleReset}
              title="Reset progress and start fresh"
              className="p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="text-right hidden sm:block pl-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Progress</span>
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

      {/* Floating Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-16 right-4 z-50 p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/60 shadow-2xl backdrop-blur-xl text-xs text-emerald-300 flex items-center gap-2.5 animate-in slide-in-from-top-4 fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

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
                {currentSection === 0 && 'Welcome! All your work in every section is automatically saved so you never lose progress.'}
                {currentSection === 1 && 'Remember: Join points with a smooth curved line. You can download Section 1 at any time!'}
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium shrink-0 transition-all cursor-pointer"
            >
              <span>Next Section</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active Section Content with Persistent Lifted State */}
        {currentSection === 0 && (
          <SectionWelcome
            studentName={lessonState.studentName}
            onSetName={setStudentName}
            onStart={() => setCurrentSection(1)}
          />
        )}

        {currentSection === 1 && (
          <SectionDiscovery
            state={lessonState.section1}
            onChange={updateSection1}
            studentName={lessonState.studentName}
            onCompleteSection={() => setCurrentSection(2)}
          />
        )}

        {currentSection === 2 && (
          <SectionSolving
            state={lessonState.section2}
            onChange={updateSection2}
            studentName={lessonState.studentName}
            onCompleteSection={() => setCurrentSection(3)}
          />
        )}

        {currentSection === 3 && (
          <SectionQuiz
            state={lessonState.section3}
            onChange={updateSection3}
            studentName={lessonState.studentName}
            onCompleteQuiz={() => setCurrentSection(4)}
          />
        )}

        {currentSection === 4 && (
          <SectionFinish
            studentName={lessonState.studentName}
            score={lessonState.section3.score}
            explanations={lessonState.section1.explanations}
            quizAnswers={lessonState.section3.quizAnswers}
            quizCorrect={lessonState.section3.quizCorrect}
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
