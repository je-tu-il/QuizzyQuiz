export type Shape = 'triangle' | 'diamond' | 'circle' | 'square';

export type QuestionType = 'quiz' | 'true_false';

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  shape: Shape;
}

export interface Question {
  id: string;
  type?: QuestionType; // 'quiz' (4 options) or 'true_false' (2 options)
  text: string;
  timeLimit: number; // in seconds (5, 10, 20, 30, 60, 90, 120, 240)
  points?: number; // legacy points field
  pointsMultiplier?: number; // 0 (standard 0), 1 (standard 1000), 2 (double 2000)
  image?: string; // Base64 data URL or external URL
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  questions: Question[];
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  lastAnswerCorrect?: boolean;
  lastPointsEarned?: number;
  connectionId: string;
  hasAnsweredCurrent?: boolean;
}

export type GameState = 'lobby' | 'getReady' | 'question' | 'answersReveal' | 'leaderboard' | 'podium';

export interface ServerToClientMessage {
  type: 'gameState';
  state: GameState;
  pin?: string;
  questionIndex?: number;
  totalQuestions?: number;
  question?: {
    id: string;
    type?: QuestionType;
    text: string;
    timeLimit: number;
    pointsMultiplier?: number;
    image?: string;
    answers: { id: string; text: string; shape: Shape }[];
  };
  timeRemaining?: number;
  playersCount?: number;
  players?: { id: string; name: string; avatar: string }[];
  leaderboard?: Player[];
  correctAnswerIds?: string[];
  answerStats?: Record<string, number>; // answerId -> count of answers
  playerResult?: {
    isCorrect: boolean;
    pointsEarned: number;
    score: number;
    rank: number;
    streak: number;
  };
}

export interface ClientToServerMessage {
  type: 'join' | 'answer';
  playerId?: string;
  name?: string;
  avatar?: string;
  answerId?: string;
  answerIds?: string[]; // for multi-select
  timeToAnswer?: number; // milliseconds taken to answer
}
