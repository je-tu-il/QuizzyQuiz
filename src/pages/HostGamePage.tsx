import React, { useState } from 'react';
import { Quiz } from '../types';
import { useHostGame } from '../services/hostPeer';
import { HostLobby } from '../components/HostLobby';
import { HostQuestionView } from '../components/HostQuestionView';
import { HostLeaderboard } from '../components/HostLeaderboard';
import { HostPodium } from '../components/HostPodium';
import { generatePin } from '../services/pin';

interface HostGamePageProps {
  quiz: Quiz;
}

export const HostGamePage: React.FC<HostGamePageProps> = ({ quiz }) => {
  const [pin] = useState<string>(() => generatePin());

  const {
    isPeerReady,
    peerError,
    gameState,
    players,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    timeRemaining,
    answerStats,
    answersCount,
    startGame,
    showLeaderboard,
    nextStep,
  } = useHostGame({ quiz, pin });

  if (gameState === 'lobby') {
    return (
      <HostLobby
        pin={pin}
        quizTitle={quiz.title}
        players={players}
        isPeerReady={isPeerReady}
        peerError={peerError}
        onStartGame={startGame}
      />
    );
  }

  if (gameState === 'getReady' || gameState === 'question' || gameState === 'answersReveal') {
    return (
      <HostQuestionView
        gameState={gameState}
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
        answersCount={answersCount}
        totalPlayers={players.length}
        answerStats={answerStats}
        onShowLeaderboard={showLeaderboard}
      />
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <HostLeaderboard
        players={players}
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onNext={nextStep}
      />
    );
  }

  if (gameState === 'podium') {
    return (
      <HostPodium
        players={players}
        onPlayAgain={() => {
          window.location.reload();
        }}
      />
    );
  }

  return null;
};
