import React from 'react';
import { Question, GameState } from '../types';
import { ShapeIcon, SHAPE_CONFIG } from './ShapeIcon';
import { ArrowRight, CheckCircle2, XCircle, Zap } from 'lucide-react';

interface HostQuestionViewProps {
  gameState: GameState;
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  answersCount: number;
  totalPlayers: number;
  answerStats: Record<string, number>;
  onShowLeaderboard: () => void;
  onSkipTimer?: () => void;
}

export const HostQuestionView: React.FC<HostQuestionViewProps> = ({
  gameState,
  question,
  questionIndex,
  totalQuestions,
  timeRemaining,
  answersCount,
  totalPlayers,
  answerStats,
  onShowLeaderboard,
}) => {
  const isReveal = gameState === 'answersReveal';
  const hasMultipleCorrect = question.answers.filter((a) => a.isCorrect).length > 1;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Header bar */}
      <header className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <span className="bg-[#46178f] text-white font-black px-4 py-1.5 rounded-xl text-lg">
            {questionIndex + 1} / {totalQuestions}
          </span>
          {question.pointsMultiplier === 2 && (
            <span className="bg-amber-400 text-gray-950 font-black px-3 py-1 rounded-xl text-sm flex items-center gap-1">
              <Zap className="w-4 h-4 fill-current" /> Points Doubles (2x)
            </span>
          )}
          {hasMultipleCorrect && (
            <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-xl text-sm">
              Choix Multiples
            </span>
          )}
        </div>

        {/* Answers count & Next button */}
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 text-[#46178f] font-bold px-4 py-1.5 rounded-xl flex items-center gap-2 text-sm sm:text-base">
            <span>Réponses :</span>
            <span className="font-black text-lg">
              {answersCount} / {totalPlayers}
            </span>
          </div>

          {isReveal && (
            <button
              onClick={onShowLeaderboard}
              className="bg-[#1368ce] hover:bg-[#0f54a8] text-white font-extrabold px-6 py-2 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all animate-pulse"
            >
              <span>Suivant</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Question Display */}
      <main className="flex-1 flex flex-col items-center justify-center my-4 max-w-5xl mx-auto w-full">
        {/* Question Text Box */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-gray-200 text-center mb-4 min-h-[100px] flex items-center justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            {question.text}
          </h1>
        </div>

        {/* Center Area: Optional Media Image + Chrono or Reveal Bar Chart */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 my-2">
          {/* Question illustration image if present */}
          {question.image && (
            <div className="max-h-56 sm:max-h-64 max-w-sm rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-black/5 flex items-center justify-center">
              <img
                src={question.image}
                alt="Illustration"
                className="max-h-56 sm:max-h-64 object-contain rounded-2xl"
              />
            </div>
          )}

          {/* Timer or Histogram */}
          {!isReveal ? (
            <div className="flex items-center justify-center">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-8 flex items-center justify-center text-3xl sm:text-4xl font-black transition-colors ${
                  timeRemaining <= 5
                    ? 'border-red-500 text-red-500 animate-ping duration-1000'
                    : 'border-[#46178f] text-[#46178f]'
                }`}
              >
                {timeRemaining}
              </div>
            </div>
          ) : (
            <div className="flex-1 max-w-xl bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-end justify-around h-32 gap-3">
                {question.answers.map((ans) => {
                  const count = answerStats[ans.id] || 0;
                  const maxCount = Math.max(1, ...Object.values(answerStats));
                  const heightPercent = Math.max(12, (count / maxCount) * 100);
                  const cfg = SHAPE_CONFIG[ans.shape];

                  return (
                    <div key={ans.id} className="flex-1 flex flex-col items-center h-full justify-end">
                      <span className="font-extrabold text-sm sm:text-base text-gray-800 mb-1">{count}</span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[48px] rounded-t-xl ${cfg.bg} flex items-center justify-center text-white transition-all duration-700 shadow`}
                      >
                        <ShapeIcon shape={ans.shape} className="w-5 h-5" />
                      </div>
                      <div className="mt-1">
                        {ans.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 opacity-60" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Answers Grid (2 columns or 2 options if True/False) */}
        <div
          className={`grid ${
            question.answers.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
          } gap-3 sm:gap-4 w-full mt-2`}
        >
          {question.answers.map((answer) => {
            const config = SHAPE_CONFIG[answer.shape];
            const isDimmed = isReveal && !answer.isCorrect;

            return (
              <div
                key={answer.id}
                className={`relative rounded-2xl p-4 sm:p-5 text-white flex items-center gap-3 sm:gap-4 transition-all duration-300 shadow-md ${
                  config.bg
                } ${config.border} ${
                  isDimmed ? 'opacity-30 filter grayscale' : 'opacity-100 scale-[1.01]'
                }`}
              >
                <div className="p-2 sm:p-3 bg-black/20 rounded-xl flex-shrink-0">
                  <ShapeIcon shape={answer.shape} className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <span className="text-lg sm:text-2xl font-black flex-1 break-words">
                  {answer.text}
                </span>

                {isReveal && answer.isCorrect && (
                  <div className="bg-white text-green-600 font-black p-1.5 sm:p-2 rounded-xl shadow flex items-center gap-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 font-medium text-xs sm:text-sm">
        Partie animée en P2P WebRTC sans serveur intermédiaire
      </footer>
    </div>
  );
};
