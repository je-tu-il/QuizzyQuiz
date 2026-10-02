import { Quiz } from '../types';

export const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: 'culture-generale-fun',
    title: 'Culture Générale & Fun ⚡',
    description: 'Testez vos réflexes et vos connaissances dans ce quiz endiablé !',
    createdAt: Date.now(),
    questions: [
      {
        id: 'q1',
        text: 'Quel est le pays d\'origine de Kahoot ?',
        timeLimit: 15,
        points: 1000,
        answers: [
          { id: 'q1-a1', shape: 'triangle', text: 'Norvège', isCorrect: true },
          { id: 'q1-a2', shape: 'diamond', text: 'Suède', isCorrect: false },
          { id: 'q1-a3', shape: 'circle', text: 'États-Unis', isCorrect: false },
          { id: 'q1-a4', shape: 'square', text: 'Finlande', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        text: 'Quelle est la planète la plus proche du Soleil ?',
        timeLimit: 12,
        points: 1000,
        answers: [
          { id: 'q2-a1', shape: 'triangle', text: 'Vénus', isCorrect: false },
          { id: 'q2-a2', shape: 'diamond', text: 'Mercure', isCorrect: true },
          { id: 'q2-a3', shape: 'circle', text: 'Mars', isCorrect: false },
          { id: 'q2-a4', shape: 'square', text: 'Terre', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        text: 'Quel protocole P2P permet aux navigateurs d\'échanger directement des données ?',
        timeLimit: 15,
        points: 1000,
        answers: [
          { id: 'q3-a1', shape: 'triangle', text: 'HTTP/3', isCorrect: false },
          { id: 'q3-a2', shape: 'diamond', text: 'WebSockets', isCorrect: false },
          { id: 'q3-a3', shape: 'circle', text: 'WebRTC DataChannels', isCorrect: true },
          { id: 'q3-a4', shape: 'square', text: 'FTP Direct', isCorrect: false },
        ],
      },
      {
        id: 'q4',
        text: 'Combien de cœurs possède une pieuvre ?',
        timeLimit: 15,
        points: 1000,
        answers: [
          { id: 'q4-a1', shape: 'triangle', text: '1', isCorrect: false },
          { id: 'q4-a2', shape: 'diamond', text: '2', isCorrect: false },
          { id: 'q4-a3', shape: 'circle', text: '3', isCorrect: true },
          { id: 'q4-a4', shape: 'square', text: '8', isCorrect: false },
        ],
      },
      {
        id: 'q5',
        text: 'Quel langage est principalement exécuté côté client dans le navigateur ?',
        timeLimit: 12,
        points: 1000,
        answers: [
          { id: 'q5-a1', shape: 'triangle', text: 'Python', isCorrect: false },
          { id: 'q5-a2', shape: 'diamond', text: 'JavaScript / TypeScript', isCorrect: true },
          { id: 'q5-a3', shape: 'circle', text: 'C++', isCorrect: false },
          { id: 'q5-a4', shape: 'square', text: 'Java', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'geek-culture',
    title: 'Quiz Pop Culture & Gaming 🎮',
    description: 'Cinéma, jeux vidéo et univers geek.',
    createdAt: Date.now() - 100000,
    questions: [
      {
        id: 'g1',
        text: 'Dans Minecraft, quel minéral est historiquement le plus résistant pour les armures ?',
        timeLimit: 15,
        points: 1000,
        answers: [
          { id: 'g1-a1', shape: 'triangle', text: 'Diamant', isCorrect: false },
          { id: 'g1-a2', shape: 'diamond', text: 'Netherite', isCorrect: true },
          { id: 'g1-a3', shape: 'circle', text: 'Or', isCorrect: false },
          { id: 'g1-a4', shape: 'square', text: 'Fer', isCorrect: false },
        ],
      },
      {
        id: 'g2',
        text: 'Quel est le nom du protagoniste principal dans The Legend of Zelda ?',
        timeLimit: 10,
        points: 1000,
        answers: [
          { id: 'g2-a1', shape: 'triangle', text: 'Zelda', isCorrect: false },
          { id: 'g2-a2', shape: 'diamond', text: 'Ganon', isCorrect: false },
          { id: 'g2-a3', shape: 'circle', text: 'Link', isCorrect: true },
          { id: 'g2-a4', shape: 'square', text: 'Epona', isCorrect: false },
        ],
      },
      {
        id: 'g3',
        text: 'Qui a réalisé le film Inception et Interstellar ?',
        timeLimit: 15,
        points: 1000,
        answers: [
          { id: 'g3-a1', shape: 'triangle', text: 'Steven Spielberg', isCorrect: false },
          { id: 'g3-a2', shape: 'diamond', text: 'Christopher Nolan', isCorrect: true },
          { id: 'g3-a3', shape: 'circle', text: 'Denis Villeneuve', isCorrect: false },
          { id: 'g3-a4', shape: 'square', text: 'James Cameron', isCorrect: false },
        ],
      },
    ],
  },
];

const STORAGE_KEY = 'kahout_saved_quizzes';

export function getStoredQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_QUIZZES));
      return DEFAULT_QUIZZES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_QUIZZES;
  } catch (e) {
    console.error('Failed to load stored quizzes', e);
    return DEFAULT_QUIZZES;
  }
}

export function saveStoredQuizzes(quizzes: Quiz[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.error('Failed to save quizzes', e);
  }
}

export function saveQuiz(quiz: Quiz): void {
  const current = getStoredQuizzes();
  const index = current.findIndex((q) => q.id === quiz.id);
  let updated: Quiz[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = quiz;
  } else {
    updated = [quiz, ...current];
  }
  saveStoredQuizzes(updated);
}

export function deleteQuiz(id: string): void {
  const current = getStoredQuizzes();
  const updated = current.filter((q) => q.id !== id);
  saveStoredQuizzes(updated);
}
