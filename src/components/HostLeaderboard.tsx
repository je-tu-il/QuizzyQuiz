import React from 'react';
import { Player } from '../types';
import { Trophy, ArrowRight, Zap } from 'lucide-react';

interface HostLeaderboardProps {
  players: Player[];
  questionIndex: number;
  totalQuestions: number;
  onNext: () => void;
}

export const HostLeaderboard: React.FC<HostLeaderboardProps> = ({
  players,
  questionIndex,
  totalQuestions,
  onNext,
}) => {
  const topPlayers = players.slice(0, 5);
  const isFinal = questionIndex + 1 >= totalQuestions;

  return (
    <div className="min-h-screen bg-[#46178f] text-white flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl sm:text-4xl font-black tracking-wide">Classement</h1>
        </div>

        <button
          onClick={onNext}
          className="bg-white hover:bg-gray-100 text-[#46178f] font-black text-lg px-8 py-3 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <span>{isFinal ? 'Voir le Podium final' : 'Question suivante'}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </header>

      {/* Leaderboard list */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full my-8">
        <div className="w-full flex flex-col gap-3">
          {topPlayers.map((player, index) => {
            const rank = index + 1;
            const rankColors = [
              'bg-amber-400 text-gray-950 font-black',
              'bg-gray-300 text-gray-950 font-black',
              'bg-amber-700 text-white font-black',
              'bg-white/20 text-white font-bold',
              'bg-white/20 text-white font-bold',
            ];

            return (
              <div
                key={player.id}
                className="flex items-center justify-between bg-white text-gray-900 rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-purple-200 transform transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${rankColors[index] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {rank}
                  </div>
                  <span className="text-2xl">{player.avatar}</span>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black">{player.name}</span>
                    {player.streak > 1 && (
                      <span className="text-xs text-orange-600 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-current" /> {player.streak} bonnes réponses d'affilée !
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {player.lastPointsEarned ? (
                    <span className="text-green-600 font-bold text-sm sm:text-base animate-pulse">
                      +{player.lastPointsEarned}
                    </span>
                  ) : null}
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#46178f]">
                    {player.score.toLocaleString()} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="text-center text-white/60 text-sm font-medium">
        Question {questionIndex + 1} terminée sur {totalQuestions}
      </footer>
    </div>
  );
};
