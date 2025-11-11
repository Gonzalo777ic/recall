import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/useQuizStore';
import { validateQuestionsJSON } from '@/utils/validation';
import { ArrowLeft, Upload, Eye, EyeOff } from 'lucide-react';
import { Question } from '@/types';

export default function UploadQuestionsPage() {
  const navigate = useNavigate();
  const { addQuestions } = useQuizStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jsonText, setJsonText] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    questions?: Question[];
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateJSON = () => {
    setIsLoading(true);
    try {
      const parsed = JSON.parse(jsonText);
      const result = validateQuestionsJSON(parsed);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [`Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`],
      });
    }
    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      setValidationResult(null);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (validationResult?.isValid && validationResult.questions) {
      addQuestions(validationResult.questions);
      navigate('/');
    }
  };

  const handleLoadExample = () => {
    const exampleQuestions = [
      {
        id: '1',
        type: 'multiple-choice',
        category: 'Biology',
        difficulty: 'medium',
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
        correctAnswer: 1,
        explanation: 'Mitochondria is responsible for energy production in cells.',
      },
      {
        id: '2',
        type: 'true-false',
        category: 'Biology',
        difficulty: 'easy',
        statement: 'Photosynthesis occurs in the chloroplasts of plant cells.',
        correctAnswer: true,
        explanation: 'Chloroplasts contain chlorophyll and are where photosynthesis takes place.',
      },
      {
        id: '3',
        type: 'order-steps',
        category: 'Biology',
        difficulty: 'hard',
        question: 'Order the steps of cellular respiration:',
        steps: ['Krebs Cycle', 'Electron Transport Chain', 'Glycolysis', 'Pyruvate Oxidation'],
        correctOrder: [2, 3, 0, 1],
        explanation: 'The correct sequence is: Glycolysis → Pyruvate Oxidation → Krebs Cycle → Electron Transport Chain',
      },
      {
        id: '4',
        type: 'match-items',
        category: 'Biology',
        difficulty: 'medium',
        question: 'Match the organelle with its function:',
        pairs: [
          { left: 'Nucleus', right: 'Genetic Material Storage' },
          { left: 'Mitochondria', right: 'Energy Production' },
          { left: 'Chloroplast', right: 'Photosynthesis' },
          { left: 'Ribosome', right: 'Protein Synthesis' },
        ],
        explanation: 'Each organelle has a specific function in the cell.',
      },
    ];

    setJsonText(JSON.stringify(exampleQuestions, null, 2));
    setValidationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-purple-200/30 bg-white/40 backdrop-blur-xl sticky top-0 z-10">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Load Questions</h1>
          <p className="text-gray-600">
            Import your questions from JSON. Paste directly or upload a file.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/70 backdrop-blur border border-purple-200/50 rounded-2xl p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                JSON Input
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste your JSON array here or load an example..."
                className="w-full h-64 px-4 py-3 border border-purple-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={validateJSON}
                disabled={!jsonText.trim() || isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Validating...' : 'Validate JSON'}
              </button>
              <button
                onClick={handleLoadExample}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Load Example
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Validation Results */}
          <div className="space-y-4">
            {validationResult && (
              <div
                className={`bg-white/70 backdrop-blur border rounded-2xl p-6 ${
                  validationResult.isValid
                    ? 'border-green-200/50 bg-green-50/50'
                    : 'border-red-200/50 bg-red-50/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {validationResult.isValid ? '✓ Valid' : '✗ Invalid'}
                  </h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPreview ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {validationResult.isValid && validationResult.questions ? (
                  <div>
                    <div className="mb-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        {validationResult.questions.length} valid questions ready to import
                      </p>
                    </div>

                    {showPreview && (
                      <div className="mt-4 max-h-64 overflow-y-auto space-y-2 border-t border-green-200 pt-4">
                        {validationResult.questions.slice(0, 5).map((q) => (
                          <div
                            key={q.id}
                            className="text-xs bg-white rounded p-2 border border-green-100"
                          >
                            <p className="font-medium text-gray-900">{q.id}</p>
                            <p className="text-gray-600">
                              {q.type === 'multiple-choice' && q.question}
                              {q.type === 'true-false' && q.statement}
                              {q.type === 'order-steps' && q.question}
                              {q.type === 'match-items' && q.question}
                            </p>
                            <p className="text-gray-500">
                              {q.category} · {q.difficulty}
                            </p>
                          </div>
                        ))}
                        {validationResult.questions.length > 5 && (
                          <p className="text-xs text-gray-500 p-2">
                            ... and {validationResult.questions.length - 5} more
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleImport}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Import Questions
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {validationResult.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-red-700 bg-white/50 rounded p-2"
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!validationResult && jsonText.trim() && (
              <div className="bg-blue-50/50 backdrop-blur border border-blue-200/50 rounded-2xl p-6">
                <p className="text-sm text-blue-700">
                  Click "Validate JSON" to check your questions.
                </p>
              </div>
            )}

            {!jsonText.trim() && !validationResult && (
              <div className="bg-white/70 backdrop-blur border border-purple-200/50 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-600">
                  Load an example or paste your own JSON to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* JSON Format Guide */}
        <div className="mt-12 bg-white/60 backdrop-blur border border-purple-200/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">JSON Format Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Common Fields</h3>
              <ul className="space-y-2 text-sm text-gray-600 font-mono">
                <li>
                  <span className="text-purple-600">id</span>: Unique identifier
                </li>
                <li>
                  <span className="text-purple-600">type</span>: multiple-choice, true-false, order-steps, match-items
                </li>
                <li>
                  <span className="text-purple-600">category</span>: Subject or topic
                </li>
                <li>
                  <span className="text-purple-600">difficulty</span>: easy, medium, hard
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Type-Specific Fields</h3>
              <ul className="space-y-2 text-sm text-gray-600 font-mono">
                <li>
                  <span className="text-blue-600">Multiple:</span> question, options[], correctAnswer (index)
                </li>
                <li>
                  <span className="text-blue-600">True/False:</span> statement, correctAnswer (boolean)
                </li>
                <li>
                  <span className="text-blue-600">Order:</span> question, steps[], correctOrder (indices)
                </li>
                <li>
                  <span className="text-blue-600">Match:</span> question, pairs[{"{ left, right }"}]
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
