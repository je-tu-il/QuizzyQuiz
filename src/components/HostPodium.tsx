import React from 'react';
import { Player } from '../types';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HostPodiumProps {
  players: Player[];
  onPlayAgain: () => void;
}

export const HostPodium: React.FC<HostPodiumProps> = ({ players, onPlayAgain }) => {
  const first = players[0];
  const second = players[1];
  const third = players[2];

  return (
    <div className="min-h-screen bg-[#46178f] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden relative">
      {/* Background celebration shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-pink-500 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="text-center z-10">
        <div className="inline-flex items-center gap-3 bg-amber-400 text-gray-950 font-black px-6 py-2 rounded-full shadow-lg text-lg uppercase tracking-wider mb-2">
          <Trophy className="w-6 h-6 fill-current" />
          Podium Final
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Félicitations aux champions !</h1>
      </header>

      {/* Podium Blocks */}
      <main className="flex-1 flex items-end justify-center max-w-4xl mx-auto w-full pb-8 z-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end w-full max-w-3xl">
          {/* 2nd Place (Left) */}
          <div className="flex flex-col items-center">
            {second ? (
              <div className="flex flex-col items-center mb-3 animate-in fade-in slide-in-from-bottom duration-700">
                <span className="text-4xl sm:text-5xl mb-1">{second.avatar}</span>
                <span className="font-black text-lg sm:text-2xl text-center truncate max-w-[120px] sm:max-w-[160px]">
                  {second.name}
                </span>
                <span className="text-sm sm:text-lg font-mono text-gray-300 font-bold">
                  {second.score.toLocaleString()} pts
                </span>
              </div>
            ) : null}
            <div className="w-full bg-[#1368ce] border-t-8 border-blue-400 rounded-t-3xl h-52 sm:h-64 flex flex-col items-center justify-start pt-6 shadow-2xl">
              <span className="text-5xl sm:text-7xl font-black text-white/90">2</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200 mt-2">
                Argent
              </span>
            </div>
          </div>

          {/* 1st Place (Center) */}
          <div className="flex flex-col items-center">
            {first ? (
              <div className="flex flex-col items-center mb-4 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                  <span className="absolute -top-6 -right-2 text-3xl animate-bounce">👑</span>
                  <span className="text-5xl sm:text-7xl">{first.avatar}</span>
                </div>
                <span className="font-black text-xl sm:text-3xl text-center truncate max-w-[140px] sm:max-w-[200px] text-amber-300">
                  {first.name}
                </span>
                <span className="text-base sm:text-xl font-mono text-white font-extrabold">
                  {first.score.toLocaleString()} pts
                </span>
              </div>
            ) : null}
            <div className="w-full bg-amber-400 border-t-8 border-yellow-200 text-gray-950 rounded-t-3xl h-72 sm:h-88 flex flex-col items-center justify-start pt-8 shadow-2xl relative">
              <span className="text-6xl sm:text-8xl font-black">1</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-gray-800 mt-2">
                Champion
              </span>
            </div>
          </div>

          {/* 3rd Place (Right) */}
          <div className="flex flex-col items-center">
            {third ? (
              <div className="flex flex-col items-center mb-3 animate-in fade-in slide-in-from-bottom duration-700">
                <span className="text-4xl sm:text-5xl mb-1">{third.avatar}</span>
                <span className="font-black text-lg sm:text-2xl text-center truncate max-w-[120px] sm:max-w-[160px]">
                  {third.name}
                </span>
                <span className="text-sm sm:text-lg font-mono text-gray-300 font-bold">
                  {third.score.toLocaleString()} pts
                </span>
              </div>
            ) : null}
            <div className="w-full bg-[#d89e00] border-t-8 border-yellow-500 rounded-t-3xl h-40 sm:h-48 flex flex-col items-center justify-start pt-4 shadow-2xl">
              <span className="text-4xl sm:text-6xl font-black text-white/90">3</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-200 mt-2">
                Bronze
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Actions */}
      <footer className="flex items-center justify-center gap-4 z-10">
        <button
          onClick={onPlayAgain}
          className="bg-green-500 hover:bg-green-600 text-white font-black text-lg px-8 py-3.5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Rejouer une partie</span>
        </button>
        <Link
          to="/"
          className="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-6 py-3.5 rounded-2xl transition-all flex items-center gap-2 border border-white/20"
        >
          <Home className="w-5 h-5" />
          <span>Menu principal</span>
        </Link>
      </footer>
    </div>
  );
};
