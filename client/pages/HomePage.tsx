import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/useQuizStore';
import { useEffect } from 'react';
import { Brain, Upload, Plus, Settings, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { questions, loadInitialData } = useQuizStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleStartQuiz = () => {
    if (questions.length === 0) {
      navigate('/upload');
      return;
    }
    navigate('/configure-session');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-purple-200/30 bg-white/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recall Trainer</h1>
              <p className="text-sm text-gray-500">Master your knowledge through intelligent practice</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Recall Trainer
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elevate your learning with interactive quizzes. Support for multiple choice, true/false, ordering, and matching questions.
          </p>
        </div>

        {/* Stats */}
        {questions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white/70 backdrop-blur border border-purple-200/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{questions.length}</div>
              <div className="text-gray-600">Questions Loaded</div>
            </div>
            <div className="bg-white/70 backdrop-blur border border-blue-200/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {new Set(questions.map((q) => q.category)).size}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="bg-white/70 backdrop-blur border border-indigo-200/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">Ready</div>
              <div className="text-gray-600">to Start Learning</div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Start Quiz Card */}
          <button
            onClick={handleStartQuiz}
            disabled={questions.length === 0}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-left transition-all hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Quiz</h3>
              <p className="text-purple-100 mb-4">
                {questions.length > 0
                  ? 'Configure and begin your training session'
                  : 'Load questions first to get started'}
              </p>
              <span className="inline-block text-sm font-semibold text-purple-200 group-hover:text-white transition-colors">
                {questions.length > 0 ? 'Begin Training →' : 'Setup Required →'}
              </span>
            </div>
          </button>

          {/* Upload Questions Card */}
          <button
            onClick={() => navigate('/upload')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-left transition-all hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 group-hover:bg-white/30 transition-colors">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Load Questions</h3>
              <p className="text-blue-100 mb-4">
                Upload JSON file or paste data directly. Support for bulk imports.
              </p>
              <span className="inline-block text-sm font-semibold text-blue-200 group-hover:text-white transition-colors">
                Import Questions →
              </span>
            </div>
          </button>

          {/* Create Question Card */}
          <button
            onClick={() => navigate('/create-question')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-left transition-all hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 group-hover:bg-white/30 transition-colors">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Create Question</h3>
              <p className="text-emerald-100 mb-4">
                Add individual questions manually with different types and difficulties.
              </p>
              <span className="inline-block text-sm font-semibold text-emerald-200 group-hover:text-white transition-colors">
                New Question →
              </span>
            </div>
          </button>

          {/* Configure Session Card */}
          <button
            disabled={questions.length === 0}
            onClick={() => navigate('/configure-session')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 p-8 text-left transition-all hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-orange-400/30 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 group-hover:bg-white/30 transition-colors">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Configure Session</h3>
              <p className="text-orange-100 mb-4">
                {questions.length > 0
                  ? 'Set up custom quiz sessions with filters and preferences'
                  : 'Load questions to configure sessions'}
              </p>
              <span className="inline-block text-sm font-semibold text-orange-200 group-hover:text-white transition-colors">
                Customize →
              </span>
            </div>
          </button>
        </div>

        {/* Features Section */}
        <div className="bg-white/60 backdrop-blur border border-purple-200/30 rounded-2xl p-8 mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Question Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Multiple Choice', desc: 'Select one correct answer' },
              { title: 'True/False', desc: 'Evaluate statements' },
              { title: 'Order Steps', desc: 'Arrange items in sequence' },
              { title: 'Match Items', desc: 'Connect related pairs' },
            ].map((type, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-purple-600">{idx + 1}</span>
                </div>
                <h4 className="font-semibold text-gray-900">{type.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/30 bg-white/30 backdrop-blur mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600">
            © 2024 Recall Trainer. Master your knowledge with intelligent practice.
          </p>
        </div>
      </footer>
    </div>
  );
}
