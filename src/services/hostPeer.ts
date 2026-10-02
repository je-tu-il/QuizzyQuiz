import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { Quiz, Player, GameState, ServerToClientMessage, ClientToServerMessage } from '../types';
import { pinToPeerId } from './pin';
import { sounds } from './audio';

export interface UseHostPeerOptions {
  quiz: Quiz;
  pin: string;
}

export function useHostGame({ quiz, pin }: UseHostPeerOptions) {
  const [peerId, setPeerId] = useState<string>('');
  const [isPeerReady, setIsPeerReady] = useState<boolean>(false);
  const [peerError, setPeerError] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState>('lobby');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [answerStats, setAnswerStats] = useState<Record<string, number>>({});
  const [answersCount, setAnswersCount] = useState<number>(0);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const timerRef = useRef<any>(null);
  const currentQuestionStartTime = useRef<number>(0);
  const answersGivenRef = useRef<Map<string, { answerIds: string[]; timeMs: number }>>(new Map());

  // Broadcast helper
  const broadcast = useCallback((msg: ServerToClientMessage) => {
    connectionsRef.current.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(msg);
        } catch (e) {
          console.error('Failed to send to peer', conn.peer, e);
        }
      }
    });
  }, []);

  // Send to specific player
  const sendToPlayer = useCallback((connId: string, msg: ServerToClientMessage) => {
    const conn = connectionsRef.current.get(connId);
    if (conn && conn.open) {
      try {
        conn.send(msg);
      } catch (e) {
        console.error('Failed to send to peer', connId, e);
      }
    }
  }, []);

  // Initialize Peer with global fallback STUN & TURN
  useEffect(() => {
    const hostPeerId = pinToPeerId(pin);
    const peer = new Peer(hostPeerId, {
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

    peer.on('open', (id) => {
      setPeerId(id);
      setIsPeerReady(true);
      setPeerError(null);
    });

    peer.on('error', (err: any) => {
      console.warn('Peer error:', err);
      if (err.type === 'unavailable-id') {
        setPeerError(`Le code PIN ${pin} est déjà en cours d'utilisation.`);
      } else {
        setPeerError(err.message || 'Erreur réseau WebRTC');
      }
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        connectionsRef.current.set(conn.peer, conn);

        conn.send({
          type: 'gameState',
          state: 'lobby',
          pin,
          playersCount: players.length,
        } as ServerToClientMessage);
      });

      conn.on('data', (data) => {
        handleClientMessage(conn.peer, data as ClientToServerMessage);
      });

      conn.on('close', () => {
        connectionsRef.current.delete(conn.peer);
        setPlayers((prev) => prev.filter((p) => p.connectionId !== conn.peer));
      });
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      peer.destroy();
    };
  }, [pin]);

  // Handle incoming message from players
  const handleClientMessage = (connId: string, msg: ClientToServerMessage) => {
    if (msg.type === 'join') {
      const newPlayer: Player = {
        id: msg.playerId || connId,
        name: (msg.name || 'Joueur').trim().slice(0, 16),
        avatar: msg.avatar || '😎',
        score: 0,
        streak: 0,
        connectionId: connId,
        hasAnsweredCurrent: false,
      };

      setPlayers((prev) => {
        const filtered = prev.filter((p) => p.connectionId !== connId && p.id !== newPlayer.id);
        const updated = [...filtered, newPlayer];
        sounds.playLobbyPop();
        return updated;
      });
    }

    if (msg.type === 'answer') {
      if (answersGivenRef.current.has(connId)) return; // Already answered

      const givenIds = msg.answerIds || (msg.answerId ? [msg.answerId] : []);
      const timeTaken = msg.timeToAnswer || Date.now() - currentQuestionStartTime.current;

      answersGivenRef.current.set(connId, {
        answerIds: givenIds,
        timeMs: timeTaken,
      });

      setPlayers((prev) =>
        prev.map((p) => (p.connectionId === connId ? { ...p, hasAnsweredCurrent: true } : p))
      );

      setAnswerStats((prev) => {
        const next = { ...prev };
        givenIds.forEach((id) => {
          next[id] = (next[id] || 0) + 1;
        });
        return next;
      });

      setAnswersCount((c) => c + 1);
    }
  };

  // Sync player count & lobby changes
  useEffect(() => {
    if (gameState === 'lobby') {
      broadcast({
        type: 'gameState',
        state: 'lobby',
        pin,
        playersCount: players.length,
        players: players.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar })),
      });
    }
  }, [players, gameState, broadcast, pin]);

  // Check if all players answered
  useEffect(() => {
    if (gameState === 'question' && players.length > 0 && answersCount >= players.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      revealAnswers();
    }
  }, [answersCount, players.length, gameState]);

  // Reveal Answers step
  const revealAnswers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('answersReveal');

    const curQ = quiz.questions[currentQuestionIndex];
    if (!curQ) return;

    const correctAnswers = curQ.answers.filter((a) => a.isCorrect);
    const correctIds = correctAnswers.map((a) => a.id);
    const multiplier = curQ.pointsMultiplier !== undefined ? curQ.pointsMultiplier : 1;

    // Calculate scores and streak for players
    const updatedPlayers = players.map((player) => {
      const ansData = answersGivenRef.current.get(player.connectionId);
      const given = ansData?.answerIds || [];

      // Check if all chosen are correct and all correct were chosen
      const isCorrect =
        given.length > 0 &&
        given.every((id) => correctIds.includes(id)) &&
        correctIds.every((id) => given.includes(id));

      let pointsEarned = 0;
      let newStreak = isCorrect ? player.streak + 1 : 0;

      if (isCorrect && ansData && multiplier > 0) {
        // Kahoot scoring: (1 - ((response_time / question_timer) / 2)) * maxPoints + streakBonus
        const timeRatio = Math.min(1, Math.max(0, ansData.timeMs / (curQ.timeLimit * 1000)));
        const speedBonus = 1 - timeRatio / 2;
        const basePoints = 1000 * multiplier * speedBonus;
        const streakBonus = Math.min(500, newStreak * 50);
        pointsEarned = Math.round(basePoints + streakBonus);
      }

      const newScore = player.score + pointsEarned;

      return {
        ...player,
        score: newScore,
        streak: newStreak,
        lastAnswerCorrect: isCorrect,
        lastPointsEarned: pointsEarned,
      };
    });

    const rankedPlayers = [...updatedPlayers].sort((a, b) => b.score - a.score);
    setPlayers(rankedPlayers);

    // Send individual results to each player
    rankedPlayers.forEach((player, rankIdx) => {
      sendToPlayer(player.connectionId, {
        type: 'gameState',
        state: 'answersReveal',
        correctAnswerIds: correctIds,
        playerResult: {
          isCorrect: !!player.lastAnswerCorrect,
          pointsEarned: player.lastPointsEarned || 0,
          score: player.score,
          rank: rankIdx + 1,
          streak: player.streak,
        },
      });
    });
  }, [players, quiz, currentQuestionIndex, sendToPlayer]);

  // Start question
  const startQuestion = useCallback(
    (qIndex: number) => {
      const q = quiz.questions[qIndex];
      if (!q) return;

      answersGivenRef.current.clear();
      setAnswerStats({});
      setAnswersCount(0);
      setPlayers((prev) => prev.map((p) => ({ ...p, hasAnsweredCurrent: false })));

      setCurrentQuestionIndex(qIndex);
      setGameState('getReady');

      // 3 seconds "Get Ready" countdown
      broadcast({
        type: 'gameState',
        state: 'getReady',
        questionIndex: qIndex,
        totalQuestions: quiz.questions.length,
        question: {
          id: q.id,
          type: q.type,
          text: q.text,
          timeLimit: q.timeLimit,
          pointsMultiplier: q.pointsMultiplier,
          image: q.image,
          answers: q.answers.map((a) => ({ id: a.id, text: a.text, shape: a.shape })),
        },
      });

      setTimeout(() => {
        setGameState('question');
        setTimeRemaining(q.timeLimit);
        currentQuestionStartTime.current = Date.now();

        broadcast({
          type: 'gameState',
          state: 'question',
          questionIndex: qIndex,
          totalQuestions: quiz.questions.length,
          timeRemaining: q.timeLimit,
          question: {
            id: q.id,
            type: q.type,
            text: q.text,
            timeLimit: q.timeLimit,
            pointsMultiplier: q.pointsMultiplier,
            image: q.image,
            answers: q.answers.map((a) => ({ id: a.id, text: a.text, shape: a.shape })),
          },
        });

        if (timerRef.current) clearInterval(timerRef.current);

        let timeLeft = q.timeLimit;
        timerRef.current = setInterval(() => {
          timeLeft -= 1;
          setTimeRemaining(timeLeft);
          sounds.playTick();

          if (timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            revealAnswers();
          }
        }, 1000);
      }, 3000);
    },
    [quiz, broadcast, revealAnswers]
  );

  const startGame = useCallback(() => {
    if (players.length === 0) return;
    startQuestion(0);
  }, [players.length, startQuestion]);

  const showLeaderboard = useCallback(() => {
    setGameState('leaderboard');
    sounds.playFanfare();

    broadcast({
      type: 'gameState',
      state: 'leaderboard',
      leaderboard: players,
      questionIndex: currentQuestionIndex,
      totalQuestions: quiz.questions.length,
    });
  }, [players, currentQuestionIndex, quiz.questions.length, broadcast]);

  const nextStep = useCallback(() => {
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      startQuestion(currentQuestionIndex + 1);
    } else {
      setGameState('podium');
      sounds.playFanfare();

      broadcast({
        type: 'gameState',
        state: 'podium',
        leaderboard: players,
      });
    }
  }, [currentQuestionIndex, quiz.questions.length, startQuestion, players, broadcast]);

  return {
    peerId,
    isPeerReady,
    peerError,
    gameState,
    players,
    currentQuestionIndex,
    currentQuestion: quiz.questions[currentQuestionIndex],
    totalQuestions: quiz.questions.length,
    timeRemaining,
    answerStats,
    answersCount,
    startGame,
    revealAnswers,
    showLeaderboard,
    nextStep,
  };
}
