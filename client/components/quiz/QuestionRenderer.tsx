import { useState } from 'react';
import { Question } from '@/types';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: unknown) => void;
  answered: boolean;
  userAnswer?: unknown;
}

export default function QuestionRenderer({
  question,
  onAnswer,
  answered,
  userAnswer,
}: QuestionRendererProps) {
  const [matchSelection, setMatchSelection] = useState<Array<number | null>>([]);

  if (question.type === 'multiple-choice') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, idx) => {
            const isSelected = userAnswer === idx;
            const isCorrect = idx === question.correctAnswer;
            let buttonClass =
              'w-full p-4 text-left border-2 rounded-lg transition-all font-medium';

            if (answered) {
              if (isCorrect) {
                buttonClass += ' bg-green-50 border-green-500 text-green-900';
              } else if (isSelected) {
                buttonClass += ' bg-red-50 border-red-500 text-red-900';
              } else {
                buttonClass += ' bg-gray-50 border-gray-300 text-gray-600';
              }
            } else {
              buttonClass += isSelected
                ? ' bg-purple-100 border-purple-500 text-gray-900'
                : ' bg-white border-purple-200 text-gray-900 hover:border-purple-400';
            }

            return (
              <button
                key={idx}
                onClick={() => !answered && onAnswer(idx)}
                disabled={answered}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full border-2 border-current mr-3 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </div>
              </button>
            );
          })}
        </div>
        {answered && question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-1">Explanation</p>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  if (question.type === 'true-false') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{question.statement}</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'True', value: true },
            { label: 'False', value: false },
          ].map(({ label, value }) => {
            const isSelected = userAnswer === value;
            const isCorrect = value === question.correctAnswer;
            let buttonClass =
              'p-6 border-2 rounded-lg transition-all font-bold text-lg';

            if (answered) {
              if (isCorrect) {
                buttonClass += ' bg-green-50 border-green-500 text-green-900';
              } else if (isSelected) {
                buttonClass += ' bg-red-50 border-red-500 text-red-900';
              } else {
                buttonClass += ' bg-gray-50 border-gray-300 text-gray-600';
              }
            } else {
              buttonClass += isSelected
                ? ' bg-purple-100 border-purple-500 text-gray-900'
                : ' bg-white border-purple-200 text-gray-900 hover:border-purple-400';
            }

            return (
              <button
                key={String(value)}
                onClick={() => !answered && onAnswer(value)}
                disabled={answered}
                className={buttonClass}
              >
                {label}
              </button>
            );
          })}
        </div>
        {answered && question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-1">Explanation</p>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  if (question.type === 'order-steps') {
    const [orderSteps, setOrderSteps] = useState<string[]>(question.steps);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
        <div className="space-y-2">
          {orderSteps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-purple-200 rounded-lg">
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    if (idx > 0 && !answered) {
                      const newSteps = [...orderSteps];
                      [newSteps[idx - 1], newSteps[idx]] = [newSteps[idx], newSteps[idx - 1]];
                      setOrderSteps(newSteps);
                    }
                  }}
                  disabled={answered || idx === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (idx < orderSteps.length - 1 && !answered) {
                      const newSteps = [...orderSteps];
                      [newSteps[idx], newSteps[idx + 1]] = [newSteps[idx + 1], newSteps[idx]];
                      setOrderSteps(newSteps);
                    }
                  }}
                  disabled={answered || idx === orderSteps.length - 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              <span className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded font-bold text-sm flex-shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1 text-gray-900">{step}</span>
            </div>
          ))}
        </div>
        {answered && (
          <>
            {JSON.stringify(
              orderSteps.map((s) => question.steps.indexOf(s))
            ) === JSON.stringify(question.correctOrder) ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-900">✓ Correct order!</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900">✗ Incorrect order</p>
              </div>
            )}
            {question.explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-1">Explanation</p>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            )}
          </>
        )}
        {!answered && (
          <button
            onClick={() => onAnswer(orderSteps.map((s) => question.steps.indexOf(s)))}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Submit Answer
          </button>
        )}
      </div>
    );
  }

  if (question.type === 'match-items') {
    const pairCount = question.pairs.length;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div className="space-y-2">
            {question.pairs.map((pair, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-purple-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => {
                  if (!answered) {
                    const newSelection = [...matchSelection];
                    newSelection[idx] = newSelection[idx] === undefined ? null : undefined;
                    setMatchSelection(newSelection);
                  }
                }}
              >
                {pair.left}
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="space-y-2">
            {question.pairs.map((pair, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-purple-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
              >
                {pair.right}
              </div>
            ))}
          </div>
        </div>

        {!answered && (
          <button
            onClick={() => onAnswer(matchSelection.map((_, i) => ({ left: i, right: i })))}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Submit Matches
          </button>
        )}

        {answered && question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-1">Explanation</p>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  return <div className="text-gray-500">Unknown question type</div>;
}
