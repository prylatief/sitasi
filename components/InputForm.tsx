
import React from 'react';
import type { CitationStyle, CitationMode } from '../types';

interface InputFormProps {
  text: string;
  setText: (text: string) => void;
  style: CitationStyle;
  setStyle: (style: CitationStyle) => void;
  mode: CitationMode;
  setMode: (mode: CitationMode) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  text,
  setText,
  style,
  setStyle,
  mode,
  setMode,
  onSubmit,
  isLoading,
}) => {

  const handleStyleChange = (newStyle: CitationStyle) => {
    setStyle(newStyle);
  };
  
  const handleModeChange = (newMode: CitationMode) => {
    setMode(newMode);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Teks Input</h2>
      <div className="flex-grow flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Masukkan paragraf berbahasa Indonesia di sini (60-5000 karakter)..."
          className="w-full flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gaya Sitasi</label>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleStyleChange('chicago')}
                className={`flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-l-md transition ${style === 'chicago' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                Chicago
              </button>
              <button
                type="button"
                onClick={() => handleStyleChange('apa')}
                className={`flex-1 px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300 dark:border-gray-600 rounded-r-md transition ${style === 'apa' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                APA
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode</label>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleModeChange('default')}
                className={`flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-l-md transition ${mode === 'default' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                Default
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('islam')}
                className={`flex-1 px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300 dark:border-gray-600 rounded-r-md transition ${mode === 'islam' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                Islam
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={onSubmit}
          disabled={isLoading || text.length < 60 || text.length > 5000}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center transition"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </>
          ) : (
            'Hasilkan Sitasi'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
