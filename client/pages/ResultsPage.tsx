import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/useQuizStore';
import { ArrowLeft, Home, RotateCw } from 'lucide-react';
import { Question } from '@/types';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { currentSession, questions, startSession, currentSessionConfig } = useQuizStore();

  useEffect(() => {
    if (!currentSession || !currentSession.completedAt) {
      navigate('/');
    }
  }, [currentSession, navigate]);

  if (!currentSession || !currentSessionConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-600">No quiz results found</p>
        </div>
      </div>
    );
  }

  const totalQuestions = currentSession.questions.length;
  const correctCount = currentSession.correctAnswers.length;
  const incorrectCount = currentSession.incorrectAnswers.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const correctQuestions = currentSession.questions.filter((q) =>
    currentSession.correctAnswers.includes(q.id)
  );
  const incorrectQuestions = currentSession.questions.filter((q) =>
    currentSession.incorrectAnswers.includes(q.id)
  );

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getScoreMessage = () => {
    if (percentage === 100) return 'Perfect Score!';
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good Job!';
    return 'Keep Practicing!';
  };

  const handleRetryFailed = () => {
    const failedIds = incorrectQuestions.map((q) => q.id);
    startSession(currentSessionConfig, failedIds);
    navigate('/quiz');
  };

  const handleRetryAll = () => {
    startSession(currentSessionConfig);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-purple-200/30 bg-white/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
        {/* Score Summary */}
        <div className="bg-gradient-to-br from-white to-purple-50/50 backdrop-blur border border-purple-200/50 rounded-2xl p-8 md:p-12 mb-8">
          <h1 className={`text-5xl font-bold ${getScoreColor()} mb-2 text-center`}>
            {getScoreMessage()}
          </h1>
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>{percentage}%</div>
            <p className="text-gray-600 mt-2">
              You got {correctCount} out of {totalQuestions} questions correct
            </p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalQuestions}</div>
              <div className="text-sm text-purple-700">Total</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetryAll}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCw className="w-5 h-5" />
              Retry All Questions
            </button>
            {incorrectCount > 0 && (
              <button
                onClick={handleRetryFailed}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="w-5 h-5" />
                Retry Failed ({incorrectCount})
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>

        {/* Correct Answers */}
        {correctCount > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✓</span> Correct Answers ({correctCount})
            </h2>
            <div className="space-y-3">
              {correctQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {getQuestionText(question)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {question.category} • {question.difficulty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incorrect Answers */}
        {incorrectCount > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-red-600">✗</span> Incorrect Answers ({incorrectCount})
            </h2>
            <div className="space-y-3">
              {incorrectQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {getQuestionText(question)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {question.category} • {question.difficulty}
                  </p>
                  {question.explanation && (
                    <p className="text-sm text-red-700 mt-2 p-2 bg-white rounded border border-red-100">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getQuestionText(question: Question): string {
  switch (question.type) {
    case 'multiple-choice':
      return question.question;
    case 'true-false':
      return question.statement;
    case 'order-steps':
      return question.question;
    case 'match-items':
      return question.question;
    default:
      return 'Unknown question';
  }
}
