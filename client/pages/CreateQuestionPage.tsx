import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CreateQuestionPage() {
  const navigate = useNavigate();

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
        <div className="bg-white/70 backdrop-blur border border-purple-200/50 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Question</h1>
          <p className="text-gray-600 mb-6">
            This feature is coming soon. For now, create questions using the JSON upload feature.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            Go to Upload
          </button>
        </div>
      </main>
    </div>
  );
}
