import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { generateCitations } from './services/geminiService';
import type { CitationStyle, CitationMode, ApiResponse } from './types';

const LOCAL_STORAGE_KEY = 'citationGeneratorState';

interface SavedState {
  text: string;
  style: CitationStyle;
  mode: CitationMode;
}

const App: React.FC = () => {
  // Lazy initializer to load from localStorage on the initial render
  const [savedState, setSavedState] = useState<SavedState>(() => {
    const defaultState: SavedState = {
      text: 'Sejak 1998, pertumbuhan ekonomi Indonesia mengalami fluktuasi yang signifikan akibat krisis moneter. Selain itu, menurut beberapa sejarawan, persebaran percetakan di Nusantara dimulai pada abad ke-19, yang menandai era baru dalam penyebaran informasi.',
      style: 'chicago',
      mode: 'default',
    };
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const loadedState = JSON.parse(savedStateJSON);
        // Ensure all keys are present, falling back to default if a key is missing
        return { ...defaultState, ...loadedState };
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage:", error);
    }
    return defaultState;
  });

  const [text, setText] = useState<string>(savedState.text);
  const [style, setStyle] = useState<CitationStyle>(savedState.style);
  const [mode, setMode] = useState<CitationMode>(savedState.mode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  
  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave: SavedState = { text, style, mode };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [text, style, mode]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateCitations(text, style, mode);
      setResponse(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            Generator Sitasi Otomatis
          </h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Didukung oleh Gemini AI untuk analisis dan referensi akademik.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-12rem)]">
          <div className="lg:h-full">
            <InputForm
              text={text}
              setText={setText}
              style={style}
              setStyle={setStyle}
              mode={mode}
              setMode={setMode}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:h-full">
             {error && (
              <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/50 p-6 rounded-lg shadow-lg text-red-700 dark:text-red-200">
                <div className="text-center">
                  <h3 className="font-bold">Terjadi Kesalahan</h3>
                  <p className="mt-2 text-sm">{error}</p>
                </div>
              </div>
            )}
            {!error && <OutputDisplay response={response} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;