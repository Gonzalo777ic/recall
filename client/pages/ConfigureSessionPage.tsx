import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/useQuizStore';
import { SessionConfig } from '@/types';
import { ArrowLeft, Play } from 'lucide-react';

export default function ConfigureSessionPage() {
  const navigate = useNavigate();
  const { questions, startSession } = useQuizStore();

  const [sessionName, setSessionName] = useState('My Session');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'' | 'easy' | 'medium' | 'hard'>('');
  const [questionsPerSession, setQuestionsPerSession] = useState(10);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);

  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const availableCount = questions.filter((q) => {
    if (categoryFilter && q.category !== categoryFilter) return false;
    if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
    return true;
  }).length;

  const handleStartQuiz = () => {
    const config: SessionConfig = {
      id: Date.now().toString(),
      name: sessionName,
      categoryFilter: categoryFilter || undefined,
      difficultyFilter: difficultyFilter || undefined,
      questionsPerSession: Math.min(questionsPerSession, availableCount),
      randomizeQuestions,
      createdAt: Date.now(),
    };
    startSession(config);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-purple-200/30 bg-white/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Configure Session</h1>
          <p className="text-gray-600">
            Customize your quiz session with filters and preferences
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur border border-purple-200/50 rounded-2xl p-8">
          <div className="space-y-6">
            {/* Session Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Filter (Optional)
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Filter (Optional)
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Questions Per Session */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Questions Per Session: {questionsPerSession}
              </label>
              <input
                type="range"
                min="1"
                max={Math.max(availableCount, 1)}
                value={questionsPerSession}
                onChange={(e) => setQuestionsPerSession(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">
                {availableCount} questions available with current filters
              </p>
            </div>

            {/* Randomize Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="randomize"
                checked={randomizeQuestions}
                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-purple-200 rounded focus:ring-purple-500"
              />
              <label htmlFor="randomize" className="text-sm font-medium text-gray-700">
                Randomize Question Order
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-purple-200">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStartQuiz}
                disabled={availableCount === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
