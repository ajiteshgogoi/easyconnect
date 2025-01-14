import React, { useState } from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateQuestion = async () => {
    setLoading(true);
    setError(null);
    setIsAnimating(true);
    
    // Fade out current question
    await new Promise(resolve => setTimeout(resolve, 200));
    setQuestion(null);

    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://easyconnect-red.vercel.app/api/generate'
        : 'http://localhost:5000/api/generate';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      console.log('Received question:', data);
      setQuestion(data.question);
      setIsFirstQuestion(false);
    } catch (err) {
      console.error('Error generating question:', err);
      setError(`Failed to generate question: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnimating(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 pb-2 leading-tight">Easy Connect</h1>
        <p className="text-xl text-gray-600 mt-4">❤️ Conversation prompts to help you create deeper connections.</p>
      </header>
      <div className="flex flex-col items-center space-y-10 w-full max-w-2xl">
        <div className="bg-gray-50 p-8 rounded-lg shadow-xl w-full text-gray-800 text-center min-h-[160px] flex items-center justify-center relative overflow-hidden mb-6">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 blur opacity-25"></div>
          <div className="absolute inset-[2px] rounded-lg bg-gray-50"></div>
          <div className="relative z-10">
            <p className={`text-l font-medium text-gray-600 transition-opacity duration-200 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}>
              {isFirstQuestion ? "Click 'Generate a Question' to get your prompt..." : question}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={generateQuestion}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-12"
        >
          Generate a Question
        </button>
      </div>
      <div className="h-8 mb-8">
        {loading && (
          <p className="text-gray-600 animate-pulse">Generating question...</p>
        )}
        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </div>
      <footer className="relative mt-3 w-full text-center">
        <a 
          href="https://ko-fi.com/gogoi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gray-700 text-white font-medium py-1.5 px-3 rounded-full transition duration-200 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <img 
            src="https://storage.ko-fi.com/cdn/cup-border.png" 
            alt="Ko-Fi logo" 
            className="w-4 h-4 mr-1.5"
          />
          Buy Me a Coffee
        </a>
      </footer>
    </div>
  );
};

export default App;
