import { Question } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizBarProps {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  score: number;
}

export default function QuizBar({
  currentQuestion,
  currentIndex,
  totalQuestions,
  score,
}: QuizBarProps) {
  const navigate = useNavigate();
  const percentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-r from-purple-500 to-indigo-600 border-b border-purple-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">{currentQuestion.category}</h2>
              <p className="text-sm text-purple-100">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{score}</div>
            <p className="text-sm text-purple-100">Score</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
