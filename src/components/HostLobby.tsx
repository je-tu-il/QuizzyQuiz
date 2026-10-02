import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Users, Play, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { formatPin } from '../services/pin';
import { sounds } from '../services/audio';

interface HostLobbyProps {
  pin: string;
  quizTitle: string;
  players: { id: string; name: string; avatar: string }[];
  isPeerReady: boolean;
  peerError: string | null;
  onStartGame: () => void;
}

export const HostLobby: React.FC<HostLobbyProps> = ({
  pin,
  quizTitle,
  players,
  isPeerReady,
  peerError,
  onStartGame,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted);

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/join?pin=${pin}` : '';

  const copyUrl = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMute = () => {
    sounds.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-[#46178f] text-white flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:px-8 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-black font-extrabold px-3 py-1 rounded-lg text-lg tracking-wider">
            KAHOUT! P2P
          </div>
          <span className="text-white/80 font-medium text-lg hidden md:inline truncate max-w-md">
            {quizTitle}
          </span>
        </div>

        {/* Join Info Pill */}
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-white/70 font-semibold">
            Rejoindre sur mobile
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {typeof window !== 'undefined' ? window.location.host : 'kahout.p2p'}
            </span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-mono">
              /join
            </span>
          </div>
        </div>

        {/* Sound toggle & status */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white/90"
            title="Couper/Activer le son"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Center Area: PIN, QR code, and Players */}
      <main className="flex-1 flex flex-col items-center justify-center my-8 max-w-5xl mx-auto w-full">
        {peerError ? (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-6 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Erreur P2P</h3>
            <p className="text-white/80">{peerError}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* PIN Card */}
            <div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 border-4 border-amber-400 transform transition-all hover:scale-[1.01]">
              {/* QR Code */}
              <div className="bg-white p-3 rounded-2xl shadow-inner border border-gray-100 flex flex-col items-center">
                {joinUrl ? (
                  <QRCodeSVG
                    value={joinUrl}
                    size={160}
                    level="M"
                    includeMargin={false}
                    className="rounded-lg"
                  />
                ) : null}
                <span className="text-[11px] font-semibold text-gray-500 mt-2">
                  Scannez pour rejoindre
                </span>
              </div>

              {/* Game PIN Display */}
              <div className="text-center md:text-left flex flex-col items-center md:items-start">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Code PIN du jeu :
                </span>
                <h1 className="text-5xl sm:text-7xl font-black tracking-wider text-[#46178f] my-1 font-mono">
                  {formatPin(pin)}
                </h1>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={copyUrl}
                    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Lien copié !' : 'Copier le lien direct'}
                  </button>
                </div>
              </div>
            </div>

            {/* Players Joined header */}
            <div className="mt-10 mb-4 flex items-center justify-between w-full px-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-amber-400" />
                <span className="text-xl font-bold">
                  {players.length} joueur{players.length > 1 ? 's' : ''} connecté{players.length > 1 ? 's' : ''}
                </span>
              </div>

              {players.length > 0 && (
                <button
                  onClick={onStartGame}
                  className="bg-green-500 hover:bg-green-600 text-white font-extrabold text-xl px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex items-center gap-3 animate-bounce"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Commencer la partie !
                </button>
              )}
            </div>

            {/* Players Avatar Grid */}
            <div className="w-full bg-black/20 rounded-3xl p-6 min-h-[200px] border border-white/10 flex flex-wrap gap-4 items-center justify-center max-h-[350px] overflow-y-auto">
              {players.length === 0 ? (
                <div className="text-center text-white/60 flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-lg font-medium">En attente de joueurs...</p>
                  <p className="text-sm text-white/40 mt-1">
                    Connectez-vous avec le code PIN sur votre téléphone ou autre onglet.
                  </p>
                </div>
              ) : (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 bg-white text-gray-900 px-5 py-3 rounded-2xl font-bold text-lg shadow-md animate-in fade-in zoom-in-75 duration-200 border-2 border-purple-200"
                  >
                    <span className="text-2xl">{player.avatar}</span>
                    <span className="truncate max-w-[150px]">{player.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Instructions */}
      <footer className="text-center text-white/60 text-sm flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span>Réseau P2P Direct WebRTC (Aucun serveur intermédiaire de jeu)</span>
        </div>
        <div>Prêt pour animer sur vidéoprojecteur, TV ou écran partagé</div>
      </footer>
    </div>
  );
};
