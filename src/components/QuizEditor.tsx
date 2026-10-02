import React, { useState, useRef } from 'react';
import { Quiz, Question, QuestionType } from '../types';
import { saveQuiz } from '../services/quizStorage';
import { ShapeIcon, SHAPE_CONFIG } from './ShapeIcon';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  Save,
  Image as ImageIcon,
  Clock,
  Zap,
  CheckSquare,
  HelpCircle,
  X,
  Upload,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface QuizEditorProps {
  initialQuiz?: Quiz;
}

const TIME_LIMITS = [5, 10, 15, 20, 30, 60, 90, 120];

export const QuizEditor: React.FC<QuizEditorProps> = ({ initialQuiz }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialQuiz?.title || 'Nouveau Quiz Kahout');
  const [description, setDescription] = useState(
    initialQuiz?.description || 'Créé avec le créateur de quiz Kahout P2P'
  );
  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions || [
      {
        id: 'q_' + Date.now(),
        type: 'quiz',
        text: 'Quelle est la capitale de la France ?',
        timeLimit: 15,
        pointsMultiplier: 1,
        answers: [
          { id: 'a1', shape: 'triangle', text: 'Paris', isCorrect: true },
          { id: 'a2', shape: 'diamond', text: 'Lyon', isCorrect: false },
          { id: 'a3', shape: 'circle', text: 'Marseille', isCorrect: false },
          { id: 'a4', shape: 'square', text: 'Bordeaux', isCorrect: false },
        ],
      },
    ]
  );

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const currentQ = questions[activeQuestionIndex];

  // Update Question text
  const handleUpdateQuestionText = (text: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIndex ? { ...q, text } : q))
    );
  };

  // Switch Question Type (Quiz 4-options vs Vrai / Faux 2-options)
  const handleSetQuestionType = (type: QuestionType) => {
    if (!currentQ) return;
    let newAnswers = currentQ.answers;

    if (type === 'true_false') {
      newAnswers = [
        { id: 'tf_1_' + Date.now(), shape: 'diamond', text: 'Vrai', isCorrect: true },
        { id: 'tf_2_' + Date.now(), shape: 'triangle', text: 'Faux', isCorrect: false },
      ];
    } else if (type === 'quiz' && currentQ.answers.length === 2) {
      newAnswers = [
        { id: 'a1_' + Date.now(), shape: 'triangle', text: '', isCorrect: true },
        { id: 'a2_' + Date.now(), shape: 'diamond', text: '', isCorrect: false },
        { id: 'a3_' + Date.now(), shape: 'circle', text: '', isCorrect: false },
        { id: 'a4_' + Date.now(), shape: 'square', text: '', isCorrect: false },
      ];
    }

    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === activeQuestionIndex ? { ...q, type, answers: newAnswers } : q
      )
    );
  };

  // Update Time Limit
  const handleUpdateTimeLimit = (seconds: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIndex ? { ...q, timeLimit: seconds } : q))
    );
  };

  // Update Points Multiplier (0 = Aucun, 1 = Standard 1000, 2 = Double 2000)
  const handleUpdatePointsMultiplier = (mult: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIndex ? { ...q, pointsMultiplier: mult } : q))
    );
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop lourde pour être partagée en P2P direct. Merci de choisir une image de moins de 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setQuestions((prev) =>
        prev.map((q, idx) => (idx === activeQuestionIndex ? { ...q, image: base64 } : q))
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIndex ? { ...q, image: undefined } : q))
    );
  };

  // Update Answer text
  const handleUpdateAnswerText = (ansIdx: number, text: string) => {
    if (!currentQ) return;
    const newAnswers = [...currentQ.answers];
    newAnswers[ansIdx] = { ...newAnswers[ansIdx], text };
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIndex ? { ...q, answers: newAnswers } : q))
    );
  };

  // Toggle correct answer (support single or multiple correct answers!)
  const handleToggleCorrect = (ansIdx: number) => {
    if (!currentQ) return;
    const newAnswers = currentQ.answers.map((a, i) =>
      i === ansIdx ? { ...a, isCorrect: !a.isCorrect } : a
    );

    // Make sure at least one answer remains marked correct
    const hasCorrect = newAnswers.some((a) => a.isCorrect);
    if (!hasCorrect) {
      newAnswers[ansIdx].isCorrect = true;
    }

    setQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIndex ? { ...q, answers: newAnswers } : q))
    );
  };

  // Add Question
  const handleAddQuestion = (type: QuestionType = 'quiz') => {
    const newQ: Question = {
      id: 'q_' + Date.now(),
      type,
      text: type === 'quiz' ? 'Nouvelle question ?' : 'Cette affirmation est-elle vraie ou fausse ?',
      timeLimit: 15,
      pointsMultiplier: 1,
      answers:
        type === 'quiz'
          ? [
              { id: 'a1_' + Date.now(), shape: 'triangle', text: '', isCorrect: true },
              { id: 'a2_' + Date.now(), shape: 'diamond', text: '', isCorrect: false },
              { id: 'a3_' + Date.now(), shape: 'circle', text: '', isCorrect: false },
              { id: 'a4_' + Date.now(), shape: 'square', text: '', isCorrect: false },
            ]
          : [
              { id: 'tf1_' + Date.now(), shape: 'diamond', text: 'Vrai', isCorrect: true },
              { id: 'tf2_' + Date.now(), shape: 'triangle', text: 'Faux', isCorrect: false },
            ],
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionIndex(questions.length);
  };

  const handleDeleteQuestion = (delIdx: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, idx) => idx !== delIdx);
    setQuestions(updated);
    setActiveQuestionIndex(Math.max(0, delIdx - 1));
  };

  const handleSave = () => {
    const finalQuiz: Quiz = {
      id: initialQuiz?.id || 'quiz_' + Date.now(),
      title: title.trim() || 'Quiz sans titre',
      description: description.trim(),
      questions,
      createdAt: initialQuiz?.createdAt || Date.now(),
    };
    saveQuiz(finalQuiz);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Top Header bar with Kahoot styling */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            title="Retour à l'accueil"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-[#46178f] text-white font-black px-2.5 py-1 rounded-lg text-xs uppercase tracking-wider">
              KAHOUT! Studio
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg sm:text-xl font-black text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-[#46178f] focus:outline-none px-2 py-0.5 rounded transition-all"
              placeholder="Titre du quiz..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:bg-gray-100 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
          >
            <Save className="w-5 h-5" />
            <span>Enregistrer</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Left Sidebar + Center Stage + Right Inspector) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT COLUMN: Slide miniatures */}
        <aside className="w-full md:w-56 bg-white border-r border-gray-200 p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
          <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 px-2 py-1 hidden md:block">
            Questions ({questions.length})
          </div>

          {questions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => setActiveQuestionIndex(idx)}
              className={`p-2.5 rounded-xl border-2 cursor-pointer flex items-center justify-between min-w-[170px] md:min-w-0 transition-all ${
                activeQuestionIndex === idx
                  ? 'border-[#46178f] bg-purple-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-black text-xs bg-gray-200 text-gray-800 rounded-md w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold truncate text-gray-800">
                  {q.text || 'Question vide'}
                </span>
              </div>

              {questions.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestion(idx);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                  title="Supprimer la question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {/* Add question buttons */}
          <div className="flex flex-col gap-1.5 mt-2">
            <button
              onClick={() => handleAddQuestion('quiz')}
              className="border-2 border-dashed border-gray-300 hover:border-[#46178f] text-gray-700 hover:text-[#46178f] font-bold p-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Quiz (4 choix)</span>
            </button>
            <button
              onClick={() => handleAddQuestion('true_false')}
              className="border-2 border-dashed border-gray-300 hover:border-[#1368ce] text-gray-700 hover:text-[#1368ce] font-bold p-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
            >
              <CheckSquare className="w-4 h-4" />
              <span>+ Vrai / Faux</span>
            </button>
          </div>
        </aside>

        {/* CENTER STAGE: Kahoot Game Visual Editor */}
        {currentQ && (
          <main className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-w-4xl mx-auto w-full">
            <div className="space-y-4">
              {/* Question Headline Input */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
                <input
                  type="text"
                  value={currentQ.text}
                  onChange={(e) => handleUpdateQuestionText(e.target.value)}
                  placeholder="Commencez à saisir votre question ici..."
                  className="w-full text-center text-xl sm:text-2xl font-black text-gray-900 border-none focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Center Media Dropzone / Preview */}
              <div className="flex items-center justify-center">
                {currentQ.image ? (
                  <div className="relative group rounded-2xl overflow-hidden shadow-md border-2 border-gray-200 bg-white max-h-56">
                    <img
                      src={currentQ.image}
                      alt="Question"
                      className="max-h-56 object-contain"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-lg transition-transform hover:scale-110"
                      title="Supprimer l'image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-md border-2 border-dashed border-gray-300 hover:border-[#46178f] bg-white/60 hover:bg-purple-50/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm"
                  >
                    <div className="p-3 bg-purple-100 text-[#46178f] rounded-2xl mb-2">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <span className="font-extrabold text-sm text-gray-700">
                      Ajouter une image ou un média
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG, GIF, WebP (Max 2 Mo)
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Answers Grid: 4 options or 2 options */}
              <div
                className={`grid ${
                  currentQ.answers.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
                } gap-3`}
              >
                {currentQ.answers.map((ans, aIdx) => {
                  const cfg = SHAPE_CONFIG[ans.shape];

                  return (
                    <div
                      key={ans.id}
                      className={`rounded-2xl p-3.5 ${cfg.bg} ${cfg.border} text-white shadow-md flex items-center gap-3 transition-transform hover:scale-[1.01]`}
                    >
                      <div className="bg-black/25 p-2 rounded-xl flex-shrink-0">
                        <ShapeIcon shape={ans.shape} className="w-6 h-6" />
                      </div>

                      <input
                        type="text"
                        value={ans.text}
                        onChange={(e) => handleUpdateAnswerText(aIdx, e.target.value)}
                        placeholder={`Réponse ${aIdx + 1}...`}
                        className="bg-transparent text-white font-bold text-base sm:text-lg placeholder-white/60 focus:outline-none flex-1 border-b border-transparent focus:border-white"
                      />

                      <button
                        type="button"
                        onClick={() => handleToggleCorrect(aIdx)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                          ans.isCorrect
                            ? 'bg-white text-green-600 border-white shadow-md scale-110 ring-4 ring-green-400/40'
                            : 'border-white/50 text-transparent hover:border-white'
                        }`}
                        title={
                          ans.isCorrect
                            ? 'Bonne réponse (Cliquer pour désactiver)'
                            : 'Marquer comme bonne réponse'
                        }
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              💡 Vous pouvez cocher <b>plusieurs bonnes réponses</b> pour créer une question à choix multiples !
            </div>
          </main>
        )}

        {/* RIGHT COLUMN: Settings Inspector (Kahoot style) */}
        {currentQ && (
          <aside className="w-full md:w-64 bg-white border-l border-gray-200 p-4 space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                Type de question
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSetQuestionType('quiz')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border-2 transition-all ${
                    currentQ.type !== 'true_false'
                      ? 'border-[#46178f] bg-purple-50 text-[#46178f]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Quiz (4 choix)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuestionType('true_false')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border-2 transition-all ${
                    currentQ.type === 'true_false'
                      ? 'border-[#46178f] bg-purple-50 text-[#46178f]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Vrai / Faux
                </button>
              </div>
            </div>

            {/* Time limit */}
            <div>
              <label className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Limite de temps</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_LIMITS.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleUpdateTimeLimit(sec)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentQ.timeLimit === sec
                        ? 'bg-[#46178f] text-white shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Points multiplier */}
            <div>
              <label className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Attribution des points</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Standard', val: 1 },
                  { label: 'Double (2x)', val: 2 },
                  { label: 'Sans points', val: 0 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleUpdatePointsMultiplier(item.val)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-bold text-center transition-all ${
                      (currentQ.pointsMultiplier ?? 1) === item.val
                        ? 'bg-amber-400 text-gray-950 shadow-sm font-black'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiple choice reminder */}
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600">
              <div className="font-bold mb-1 flex items-center gap-1 text-gray-800">
                <HelpCircle className="w-3.5 h-3.5 text-[#46178f]" /> Choix multiples
              </div>
              Cochez plusieurs options si plusieurs réponses sont acceptées. Les joueurs marqueront les points s'ils sélectionnent les bonnes réponses.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
