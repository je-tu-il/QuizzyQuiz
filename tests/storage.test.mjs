import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { deleteQuiz, getStoredQuizzes, saveQuiz, saveStoredQuizzes } from '../src/services/quizStorage.ts';
import { formatPin, generatePin, pinToPeerId } from '../src/services/pin.ts';

const key = 'kahout_saved_quizzes';
const quiz = { id: 'custom', title: 'Démo', description: '', createdAt: 1, questions: [] };

beforeEach(() => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
  };
});

test('removing every quiz stays empty on the next load', () => {
  for (const existing of getStoredQuizzes()) deleteQuiz(existing.id);
  assert.deepEqual(getStoredQuizzes(), []);
  saveQuiz(quiz);
  assert.deepEqual(getStoredQuizzes(), [quiz]);
});

test('updating a quiz preserves the other entries', () => {
  const other = { ...quiz, id: 'other' };
  saveStoredQuizzes([quiz, other]);
  const updated = { ...quiz, title: 'Titre mis à jour' };
  saveQuiz(updated);
  assert.deepEqual(getStoredQuizzes(), [updated, other]);
});

test('malformed entries are ignored without losing valid quizzes', () => {
  localStorage.setItem(key, JSON.stringify([null, { ...quiz, questions: null }, quiz]));
  assert.deepEqual(getStoredQuizzes(), [quiz]);
});

test('sample quizzes are independent between reads', () => {
  getStoredQuizzes()[0].questions.length = 0;
  assert.ok(getStoredQuizzes()[0].questions.length > 0);
});

test('room codes use six digits and round-trip through their display format', () => {
  for (let index = 0; index < 100; index++) {
    const pin = generatePin();
    assert.match(pin, /^[1-9][0-9]{5}$/);
    assert.equal(pinToPeerId(formatPin(pin)), pinToPeerId(pin));
  }
});
