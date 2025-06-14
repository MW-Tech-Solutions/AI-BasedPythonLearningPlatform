// src/lib/types.ts

export interface LessonContentPart {
  type: 'text' | 'code' | 'heading';
  value: string;
  language?: string; // For code blocks
  level?: 1 | 2 | 3 | 4; // For heading blocks
}

export interface Exercise {
  id: string;
  description: string;
  starterCode: string;
  solution?: string; // Optional: for reference or automated grading hints
  tests?: Array<{ input: any; expectedOutput: any }>; // For automated grading
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string; // Short description for lesson cards
  category: string; // e.g., "Basics", "Data Structures"
  estimatedTime: string; // e.g., "15 mins"
  content: LessonContentPart[];
  exercises: Exercise[];
}

export interface UserProgress {
  completedLessons: string[]; // Array of lesson IDs
  currentLesson?: string; // ID of the lesson currently being worked on
  exerciseScores: Record<string, { score: number; completed: boolean; lastAttempt?: string }>; // exerciseId: { score, completed, lastAttemptCode }
  quizScores: Record<string, number>; // quizId: score
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  createdAt: Date | any; // Firestore Timestamp might be used
  progress?: UserProgress;
}
