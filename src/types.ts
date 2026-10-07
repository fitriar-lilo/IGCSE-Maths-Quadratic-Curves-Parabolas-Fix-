export interface Section1State {
  tab: 1 | 2 | 3 | 4 | 5;
  plotEx: 1 | 2 | 3;
  animationSpeed: number;
  table1Inputs: { [x: number]: string };
  table1Errors: { [x: number]: boolean };
  isCurve1Connected: boolean;
  table2Inputs: { [x: number]: string };
  table2Errors: { [x: number]: boolean };
  isCurve2Connected: boolean;
  table3Inputs: { [x: number]: string };
  table3Errors: { [x: number]: boolean };
  isCurve3Connected: boolean;
  tourStep: 1 | 2 | 3 | 4;
  tourNoticeAnswer: { [step: number]: string };
  tourNoticeChecked: { [step: number]: boolean };
  sliderA: number;
  sliderB: number;
  sliderC: number;
  predictShape: 'smile' | 'frown' | null;
  exTab: 1 | 2 | 3;
  ex2Inputs: { [x: number]: string };
  ex2Checked: boolean;
  ex3Inputs: { [x: number]: string };
  ex3Checked: boolean;
  explanations: {
    sketching: string;
    roots: string;
    turningPoint: string;
    symmetry: string;
  };
  showModel: { [key: string]: boolean };
}

export interface Section2State {
  activeEx: number;
  tryItInputs: { [id: number]: string };
  tryItResults: { [id: number]: boolean | null };
}

export interface Section3State {
  activeTab: number;
  showHint: { [key: number]: boolean };
  showSolution: { [key: number]: boolean };
  // Part 1: Discovery and Sketching (Q1 - Q5)
  q1Table: { [x: number]: string };
  q1YInt: string;
  q2Roots: string;
  q2TP: string;
  q2Sym: string;
  q3Type: 'minimum' | 'maximum' | '';
  q3YInt: string;
  q4TP: string;
  q4Sym: string;
  q5Disc: string;
  q5NumRoots: string;
  // Part 2: Solving Graphically (Q6 - Q10)
  q6Ans: string;
  q7Ans: string;
  q8NumSol: string;
  q8Ans: string;
  q9Ans: string;
  q10NumSol: string;
  q10Explanation: string;
  // Legacy fields for backward compatibility
  q4Ans?: string;
  q5Ans?: string;
  // General quiz answers, checked status, and scoring
  quizAnswers: { [key: number]: string };
  quizChecked: { [key: number]: boolean };
  quizCorrect: { [key: number]: boolean };
  score: number;
}

export interface LessonState {
  version: number;
  studentName: string;
  currentSection: number;
  section1: Section1State;
  section2: Section2State;
  section3: Section3State;
  lastSavedAt: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  prompt: string;
  mathPrompt: string;
  type: 'text' | 'coords' | 'choice';
  options?: string[];
  placeholder?: string;
  correctAnswer: string[];
  hint: string;
  solutionMath: string;
  solutionSteps: string[];
}

export const getDefaultSection1State = (): Section1State => ({
  tab: 1,
  plotEx: 1,
  animationSpeed: 1,
  table1Inputs: {
    '-1': '',
    '0': '',
    '1': '',
    '2': '',
    '3': '',
  },
  table1Errors: {},
  isCurve1Connected: false,
  table2Inputs: {
    '-1': '',
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
  },
  table2Errors: {},
  isCurve2Connected: false,
  table3Inputs: {
    '-1': '',
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
  },
  table3Errors: {},
  isCurve3Connected: false,
  tourStep: 1,
  tourNoticeAnswer: {},
  tourNoticeChecked: {},
  sliderA: 1,
  sliderB: -2,
  sliderC: -3,
  predictShape: null,
  exTab: 1,
  ex2Inputs: {
    '-1': '',
    '1': '',
    '3': '',
  },
  ex2Checked: false,
  ex3Inputs: {
    '0': '',
    '2': '',
    '4': '',
  },
  ex3Checked: false,
  explanations: {
    sketching: '',
    roots: '',
    turningPoint: '',
    symmetry: '',
  },
  showModel: {},
});

export const getDefaultSection2State = (): Section2State => ({
  activeEx: 1,
  tryItInputs: {},
  tryItResults: {},
});

export const getDefaultSection3State = (): Section3State => ({
  activeTab: 1,
  showHint: {},
  showSolution: {},
  q1Table: {
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
  },
  q1YInt: '',
  q2Roots: '',
  q2TP: '',
  q2Sym: '',
  q3Type: '',
  q3YInt: '',
  q4TP: '',
  q4Sym: '',
  q5Disc: '',
  q5NumRoots: '',
  q6Ans: '',
  q7Ans: '',
  q8NumSol: '',
  q8Ans: '',
  q9Ans: '',
  q10NumSol: '',
  q10Explanation: '',
  q4Ans: '',
  q5Ans: '',
  quizAnswers: {},
  quizChecked: {},
  quizCorrect: {},
  score: 0,
});

export const getDefaultLessonState = (): LessonState => ({
  version: 2,
  studentName: '',
  currentSection: 0,
  section1: getDefaultSection1State(),
  section2: getDefaultSection2State(),
  section3: getDefaultSection3State(),
  lastSavedAt: new Date().toISOString(),
});
