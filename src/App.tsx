import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { HostGamePage } from './pages/HostGamePage';
import { JoinGamePage } from './pages/JoinGamePage';
import { QuizEditor } from './components/QuizEditor';
import { Quiz } from './types';

export function App() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleHostQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    navigate('/host');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage onHostQuiz={handleHostQuiz} />} />
      <Route
        path="/host"
        element={
          selectedQuiz ? (
            <HostGamePage quiz={selectedQuiz} />
          ) : (
            <HomePage onHostQuiz={handleHostQuiz} />
          )
        }
      />
      <Route path="/join" element={<JoinGamePage />} />
      <Route path="/create" element={<QuizEditor />} />
    </Routes>
  );
}

export default App;
