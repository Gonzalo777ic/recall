import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/useQuizStore';
import QuestionRenderer from '@/components/quiz/QuestionRenderer';
import QuizBar from '@/components/quiz/QuizBar';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

export default function QuizPage() {
  const navigate = useNavigate();
  const { currentSession, answerQuestion, nextQuestion, previousQuestion, endSession } =
    useQuizStore();
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      navigate('/');
      return;
    }
    setHasAnswered(currentSession.answers[currentSession.questions[currentSession.currentQuestionIndex].id] !== undefined);
  }, [currentSession, navigate, currentSession?.currentQuestionIndex]);

  if (!currentSession || currentSession.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-600">No quiz session found</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const isLastQuestion = currentSession.currentQuestionIndex === currentSession.questions.length - 1;
  const userAnswer = currentSession.answers[currentQuestion.id];

  const handleAnswer = (answer: unknown) => {
    answerQuestion(currentQuestion.id, answer);
    setHasAnswered(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      endSession();
      navigate('/results');
    } else {
      nextQuestion();
      setHasAnswered(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <QuizBar
        currentQuestion={currentQuestion}
        currentIndex={currentSession.currentQuestionIndex}
        totalQuestions={currentSession.questions.length}
        score={currentSession.score}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur border border-purple-200/50 rounded-2xl p-8 md:p-12 shadow-lg">
          <QuestionRenderer
            question={currentQuestion}
            onAnswer={handleAnswer}
            answered={hasAnswered}
            userAnswer={userAnswer}
          />

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={previousQuestion}
              disabled={currentSession.currentQuestionIndex === 0 || !hasAnswered}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {hasAnswered && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 ml-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors font-medium"
              >
                {isLastQuestion ? (
                  <>
                    <Flag className="w-5 h-5" />
                    Finish Quiz
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
