import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { GameState, ServerToClientMessage, ClientToServerMessage, Shape, QuestionType } from '../types';
import { pinToPeerId } from './pin';
import { sounds } from './audio';

export interface UsePlayerPeerOptions {
  pin: string;
  playerName: string;
  avatar: string;
}

export function usePlayerPeer({ pin, playerName, avatar }: UsePlayerPeerOptions) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState>('lobby');
  const [currentQuestion, setCurrentQuestion] = useState<{
    id: string;
    type?: QuestionType;
    text: string;
    timeLimit: number;
    pointsMultiplier?: number;
    image?: string;
    answers: { id: string; text: string; shape: Shape }[];
  } | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<string[]>([]);
  const [playerResult, setPlayerResult] = useState<{
    isCorrect: boolean;
    pointsEarned: number;
    score: number;
    rank: number;
    streak: number;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const send = useCallback((msg: ClientToServerMessage) => {
    if (connRef.current && connRef.current.open) {
      try {
        connRef.current.send(msg);
      } catch (e) {
        console.error('Failed to send to host', e);
      }
    }
  }, []);

  const submitAnswers = useCallback(
    (answerIds: string[]) => {
      if (selectedAnswerIds.length > 0 || gameState !== 'question') return;
      setSelectedAnswerIds(answerIds);
      const timeMs = Date.now() - questionStartTimeRef.current;
      send({
        type: 'answer',
        answerId: answerIds[0],
        answerIds,
        timeToAnswer: timeMs,
      });
    },
    [selectedAnswerIds, gameState, send]
  );

  useEffect(() => {
    const peer = new Peer({
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
          {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
          {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
        ],
      },
    });

    peerRef.current = peer;

    peer.on('open', () => {
      const hostId = pinToPeerId(pin);
      const conn = peer.connect(hostId, {
        reliable: true,
      });

      connRef.current = conn;

      conn.on('open', () => {
        setConnectionStatus('connected');
        setErrorMessage(null);

        conn.send({
          type: 'join',
          name: playerName,
          avatar,
        } as ClientToServerMessage);
      });

      conn.on('data', (data) => {
        const msg = data as ServerToClientMessage;
        if (msg.type === 'gameState') {
          setGameState(msg.state);

          if (msg.state === 'getReady') {
            setSelectedAnswerIds([]);
            setPlayerResult(null);
            if (msg.question) setCurrentQuestion(msg.question);
            if (msg.questionIndex !== undefined) setQuestionIndex(msg.questionIndex);
            if (msg.totalQuestions !== undefined) setTotalQuestions(msg.totalQuestions);
          }

          if (msg.state === 'question') {
            setSelectedAnswerIds([]);
            questionStartTimeRef.current = Date.now();
            if (msg.question) setCurrentQuestion(msg.question);
            if (msg.questionIndex !== undefined) setQuestionIndex(msg.questionIndex);
            if (msg.totalQuestions !== undefined) setTotalQuestions(msg.totalQuestions);
          }

          if (msg.state === 'answersReveal') {
            if (msg.playerResult) {
              setPlayerResult(msg.playerResult);
              if (msg.playerResult.isCorrect) {
                sounds.playCorrect();
              } else {
                sounds.playWrong();
              }
            }
          }

          if (msg.state === 'leaderboard' || msg.state === 'podium') {
            if (msg.leaderboard) {
              setLeaderboard(msg.leaderboard);
            }
          }
        }
      });

      conn.on('close', () => {
        setConnectionStatus('disconnected');
        setErrorMessage('La connexion avec l\'hôte a été fermée.');
      });

      conn.on('error', (err) => {
        setConnectionStatus('error');
        setErrorMessage('Erreur de connexion avec l\'hôte.');
        console.error(err);
      });
    });

    peer.on('error', (err: any) => {
      setConnectionStatus('error');
      if (err.type === 'peer-unavailable') {
        setErrorMessage(`Partie introuvable pour le PIN "${pin}". Vérifiez que l'hôte a bien démarré la partie.`);
      } else {
        setErrorMessage(err.message || 'Impossible de se connecter au réseau P2P.');
      }
    });

    return () => {
      peer.destroy();
    };
  }, [pin, playerName, avatar]);

  return {
    connectionStatus,
    errorMessage,
    gameState,
    currentQuestion,
    questionIndex,
    totalQuestions,
    selectedAnswerIds,
    playerResult,
    leaderboard,
    submitAnswers,
  };
}
