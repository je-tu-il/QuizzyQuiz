import React, { useState } from 'react';
import { Quiz } from '../types';
import { getStoredQuizzes, deleteQuiz, saveQuiz } from '../services/quizStorage';
import { Play, Plus, Trash2, Download, Upload, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HomePageProps {
  onHostQuiz: (quiz: Quiz) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onHostQuiz }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getStoredQuizzes());

  const handleExport = (quiz: Quiz) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${quiz.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.title && Array.isArray(parsed.questions)) {
          parsed.id = 'quiz_' + Date.now();
          saveQuiz(parsed);
          setQuizzes(getStoredQuizzes());
        } else {
          alert('Format de quiz JSON invalide.');
        }
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer ce quiz ?')) {
      deleteQuiz(id);
      setQuizzes(getStoredQuizzes());
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-[#46178f] via-[#5d20b6] to-[#1368ce] py-12 px-6 shadow-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-gray-950 font-black px-3 py-1 rounded-lg text-sm uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 fill-current" />
              100% P2P & Décentralisé
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-2">
              KAHOUT!
            </h1>
            <p className="text-white/80 text-lg max-w-xl font-medium">
              L'ambiance et la dynamique festive de Kahoot, sans aucun serveur centralisé.
              Parties hébergées en direct WebRTC depuis votre propre navigateur !
            </p>
          </div>

          {/* Quick Join CTA button for mobile users or players */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/join"
              className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xl px-8 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Smartphone className="w-6 h-6" />
              <span>Rejoindre une partie</span>
            </Link>

            <Link
              to="/create"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Créer un quiz</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content: Quiz library */}
      <main className="max-w-5xl mx-auto w-full p-6 sm:p-10 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">Vos Quiz disponibles</h2>
            <p className="text-gray-400 text-sm">
              Choisissez un quiz à projeter sur grand écran ou importez le vôtre en JSON.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 text-sm transition-colors">
              <Upload className="w-4 h-4" />
              <span>Importer JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 rounded-3xl p-6 transition-all duration-200 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                    {quiz.title}
                  </h3>
                  <span className="bg-purple-900/60 border border-purple-500/30 text-purple-300 font-extrabold text-xs px-3 py-1 rounded-full whitespace-nowrap">
                    {quiz.questions.length} questions
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                  {quiz.description || 'Aucune description'}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-slate-700/60 pt-4">
                <button
                  onClick={() => onHostQuiz(quiz)}
                  className="bg-[#46178f] hover:bg-[#5d20b6] text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all text-base"
                >
                  <Monitor className="w-5 h-5 text-amber-400" />
                  <span>Lancer l'écran (Host)</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleExport(quiz)}
                    className="p-2.5 rounded-xl hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                    title="Exporter le quiz en JSON"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(quiz.id, e)}
                    className="p-2.5 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    title="Supprimer ce quiz"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-gray-500 text-sm">
        <p>Kahout P2P • Zéro serveur intermédiaire • Conçu pour des animations locales et ultra-rapides</p>
      </footer>
    </div>
  );
};
