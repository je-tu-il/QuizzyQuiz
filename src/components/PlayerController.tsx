import React, { useState } from 'react';
import { Shape } from '../types';
import { ShapeIcon, SHAPE_CONFIG } from './ShapeIcon';
import { CheckCircle2, XCircle, Trophy, Zap, AlertCircle, Check } from 'lucide-react';

interface PlayerControllerProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  errorMessage: string | null;
  gameState: string;
  playerName: string;
  avatar: string;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswerIds: string[];
  answers: { id: string; text: string; shape: Shape }[];
  playerResult: {
    isCorrect: boolean;
    pointsEarned: number;
    score: number;
    rank: number;
    streak: number;
  } | null;
  onSubmitAnswers: (answerIds: string[]) => void;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  connectionStatus,
  errorMessage,
  gameState,
  playerName,
  avatar,
  questionIndex,
  totalQuestions,
  selectedAnswerIds,
  answers,
  playerResult,
  onSubmitAnswers,
}) => {
  // Local multi-select draft state before validation if needed
  const [draftSelection, setDraftSelection] = useState<string[]>([]);

  // If connection is in progress
  if (connectionStatus === 'connecting') {
    return (
      <div className="min-h-screen bg-[#46178f] text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-black mb-2">Connexion en direct P2P...</h2>
        <p className="text-white/70 max-w-xs text-sm">
          Établissement du tunnel WebRTC direct (STUN / TURN).
        </p>
      </div>
    );
  }

  // If connection error
  if (connectionStatus === 'error' || connectionStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-[#46178f] text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="bg-white/10 p-6 rounded-3xl max-w-sm border border-white/20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Connexion interrompue</h2>
          <p className="text-white/80 mb-6 text-sm">{errorMessage || 'Vérifiez le code PIN.'}</p>
          <a
            href="/join"
            className="inline-block bg-amber-400 text-gray-950 font-black px-6 py-3 rounded-2xl w-full"
          >
            Réessayer
          </a>
        </div>
      </div>
    );
  }

  // Player in Lobby
  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-[#46178f] text-white flex flex-col justify-between p-6 text-center select-none">
        <header className="py-4">
          <span className="bg-white/20 text-white font-extrabold px-4 py-1.5 rounded-full text-sm">
            KAHOUT! P2P
          </span>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="text-7xl mb-4 animate-bounce">{avatar}</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">{playerName}</h1>
          <p className="text-amber-300 font-bold text-lg mb-6">Tu es dans la partie ! 🎉</p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-xs text-sm text-white/80">
            Regarde le grand écran, la partie va bientôt commencer...
          </div>
        </main>

        <footer className="text-xs text-white/40 pb-2">
          Manette connectée directement en WebRTC
        </footer>
      </div>
    );
  }

  // Get Ready Screen
  if (gameState === 'getReady') {
    return (
      <div className="min-h-screen bg-[#46178f] text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-amber-400 font-black text-xl mb-4 uppercase tracking-widest">
          Question {questionIndex + 1} / {totalQuestions}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black animate-pulse">Préparez-vous !</h1>
        <div className="mt-8 w-12 h-12 border-4 border-white border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Active Question (Mobile Touch Buttons)
  if (gameState === 'question') {
    // If player already submitted their answer
    if (selectedAnswerIds.length > 0) {
      return (
        <div className="min-h-screen bg-[#46178f] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-black mb-2">Réponse enregistrée !</h2>
            <p className="text-white/70 text-sm">
              Attente des autres joueurs ou de la fin du chrono...
            </p>
          </div>
        </div>
      );
    }

    const handleSingleClick = (id: string) => {
      onSubmitAnswers([id]);
    };

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col p-3 sm:p-4 select-none touch-manipulation">
        {/* Top bar with player name & question number */}
        <div className="flex items-center justify-between text-white px-2 py-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{avatar}</span>
            <span className="font-bold text-sm truncate max-w-[120px]">{playerName}</span>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black">
            Q {questionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Tactile Answer Buttons */}
        <div
          className={`flex-1 grid ${
            answers.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'
          } gap-3 sm:gap-4`}
        >
          {answers.map((answer) => {
            const cfg = SHAPE_CONFIG[answer.shape];

            return (
              <button
                key={answer.id}
                onClick={() => handleSingleClick(answer.id)}
                className={`w-full h-full rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center ${cfg.bg} ${cfg.border} text-white active:scale-95 transition-all shadow-lg active:shadow-none p-4`}
              >
                <div className="p-3 bg-black/20 rounded-2xl mb-2">
                  <ShapeIcon shape={answer.shape} className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
                {answer.text && (
                  <span className="text-sm sm:text-base font-extrabold text-center line-clamp-2 px-1">
                    {answer.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Answer Revelation Feedback (Correct or Wrong)
  if (gameState === 'answersReveal') {
    const isCorrect = playerResult?.isCorrect ?? false;
    const points = playerResult?.pointsEarned ?? 0;
    const streak = playerResult?.streak ?? 0;

    return (
      <div
        className={`min-h-screen ${
          isCorrect ? 'bg-[#26890c]' : 'bg-[#e21b3c]'
        } text-white flex flex-col justify-between p-6 text-center select-none`}
      >
        <header className="py-2">
          <span className="text-sm uppercase tracking-widest font-black text-white/80">
            Résultat
          </span>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4">
            {isCorrect ? (
              <CheckCircle2 className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-white animate-bounce" />
            ) : (
              <XCircle className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-white animate-pulse" />
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            {isCorrect ? 'Correct !' : 'Incorrect !'}
          </h1>

          {isCorrect && (
            <div className="bg-black/20 px-6 py-2 rounded-2xl font-black text-2xl mb-4">
              +{points} pts
            </div>
          )}

          {streak > 1 && (
            <div className="flex items-center gap-2 bg-amber-400 text-gray-950 font-black px-4 py-1.5 rounded-full text-sm mb-4">
              <Zap className="w-4 h-4 fill-current" /> Série de {streak} d'affilée !
            </div>
          )}

          {playerResult && (
            <div className="text-white/90 font-bold text-lg">
              Position actuelle : #{playerResult.rank} ({playerResult.score.toLocaleString()} pts)
            </div>
          )}
        </main>

        <footer className="text-white/60 text-xs pb-2">
          Regarde le grand écran pour voir le classement complet !
        </footer>
      </div>
    );
  }

  // Leaderboard / Podium Wait Screen for player
  return (
    <div className="min-h-screen bg-[#46178f] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <Trophy className="w-20 h-20 text-amber-400 mb-4 animate-bounce" />
      <h2 className="text-3xl font-black mb-2">Classement en cours</h2>
      <p className="text-white/80 max-w-xs mb-4">
        Regardez le tableau des scores sur le grand écran !
      </p>
      {playerResult && (
        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="text-sm text-white/70">Votre score total</div>
          <div className="text-3xl font-black text-amber-300 font-mono">
            {playerResult.score.toLocaleString()} pts
          </div>
        </div>
      )}
    </div>
  );
};
