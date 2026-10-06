export interface StudentState {
  name: string;
  avatar: string;
  currentSection: number; // 0: Welcome, 1: Discovery, 2: Solving, 3: Quiz, 4: Finish
  subSection1: number; // 1 to 5 for Section 1
  
  // Section 1.1 Data
  table1Completed: boolean;
  table1CurveDrawn: boolean;
  
  // Section 1.5 Explanations
  explanations: {
    sketching: string;
    roots: string;
    turningPoint: string;
    symmetry: string;
  };
  
  // Section 2 Progress
  solvingStep: number;
  
  // Section 3 Quiz
  quizAnswers: { [key: number]: string };
  quizChecked: { [key: number]: boolean };
  quizCorrect: { [key: number]: boolean };
  score: number;
  
  completedAll: boolean;
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
