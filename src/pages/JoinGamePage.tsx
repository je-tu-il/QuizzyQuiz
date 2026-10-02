import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePlayerPeer } from '../services/playerPeer';
import { PlayerController } from '../components/PlayerController';

const AVATARS = ['😎', '🚀', '🦊', '🐱', '🦄', '🦁', '🐼', '🍕', '🎮', '⚡', '🔥', '👑'];

export const JoinGamePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlPin = searchParams.get('pin') || '';

  const [pin, setPin] = useState(urlPin);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😎');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const cleanPin = pin.replace(/\s+/g, '');

  const peerData = usePlayerPeer({
    pin: hasSubmitted ? cleanPin : '',
    playerName: name,
    avatar,
  });

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || !name.trim()) return;
    setHasSubmitted(true);
  };

  if (!hasSubmitted) {
    return (
      <div className="min-h-screen bg-[#46178f] text-white flex flex-col justify-between p-6 select-none">
        <header className="text-center py-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-amber-300 drop-shadow-md">
            KAHOUT!
          </h1>
          <p className="text-white/70 text-sm mt-1">Rejoindre la partie en direct P2P</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
          <form
            onSubmit={handleJoin}
            className="w-full bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                Code PIN du jeu
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ex: 482 910"
                maxLength={8}
                className="w-full text-center text-3xl font-black tracking-widest border-2 border-gray-300 focus:border-[#46178f] rounded-2xl py-3 focus:outline-none bg-gray-50 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                Pseudo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre prénom ou pseudo"
                maxLength={15}
                className="w-full text-center text-xl font-bold border-2 border-gray-300 focus:border-[#46178f] rounded-2xl py-3 focus:outline-none bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 text-center">
                Choisissez votre avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      avatar === av
                        ? 'bg-purple-100 ring-2 ring-[#46178f] scale-110'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!pin.trim() || !name.trim()}
              className="w-full bg-[#46178f] hover:bg-[#5d20b6] disabled:opacity-50 text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 mt-4"
            >
              C'est parti !
            </button>
          </form>
        </main>

        <footer className="text-center text-white/50 text-xs py-4">
          Connexion directe P2P WebRTC sans compte ni inscription
        </footer>
      </div>
    );
  }

  return (
    <PlayerController
      connectionStatus={peerData.connectionStatus}
      errorMessage={peerData.errorMessage}
      gameState={peerData.gameState}
      playerName={name}
      avatar={avatar}
      questionIndex={peerData.questionIndex}
      totalQuestions={peerData.totalQuestions}
      selectedAnswerIds={peerData.selectedAnswerIds}
      answers={peerData.currentQuestion?.answers || []}
      playerResult={peerData.playerResult}
      onSubmitAnswers={peerData.submitAnswers}
    />
  );
};
