import React, { useState } from 'react';
import type { ApiResponse, Claim, Reference } from '../types';
import ClipboardIcon from './icons/ClipboardIcon';
import AlertIcon from './icons/AlertIcon';
import DownloadIcon from './icons/DownloadIcon';
import SearchIcon from './icons/SearchIcon';

interface OutputDisplayProps {
  response: ApiResponse | null;
}

type Tab = 'hasil' | 'klaim' | 'referensi' | 'ekspor';

const OutputDisplay: React.FC<OutputDisplayProps> = ({ response }) => {
  const [activeTab, setActiveTab] = useState<Tab>('hasil');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: 'ris' | 'bibtex') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (content: string, type: 'ris' | 'bibtex') => {
    const filename = `citations.${type}`;
    const contentType = type === 'ris' ? 'application/x-research-info-systems' : 'application/x-bibtex';
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGoogleSearch = (ref: Reference) => {
    // Check if it's an Islamic source. The presence of the 'islamic' extra data is a reliable indicator.
    const isIslamicSource = ref.source === 'shamela' || ref.extra?.islamic;

    // Construct the query. For Islamic sources, we assume the title/author are in Arabic or transliteration.
    // We prioritize specific fields like 'kitab' for Islamic sources.
    const queryParts = [
      `"${ref.title}"`,
      ...ref.authors,
      isIslamicSource ? ref.extra?.islamic?.kitab : `"${ref.publisherOrJournal}"`
    ];

    const query = queryParts.filter(Boolean).join(' '); // Filter out any null/undefined parts and join

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-gray-500 dark:text-gray-400">
        Hasil akan ditampilkan di sini.
      </div>
    );
  }

  const getLabelColor = (label: Claim['label']) => {
    switch (label) {
      case 'fakta': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'opini': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ambigu': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hasil', label: 'Hasil' },
    { id: 'klaim', label: `Klaim (${response.claims.length})` },
    { id: 'referensi', label: `Referensi (${response.references.length})` },
    { id: 'ekspor', label: 'Ekspor' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'hasil':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Teks dengan Sitasi</h3>
              <div
                className="prose dark:prose-invert prose-sm max-w-none p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                dangerouslySetInnerHTML={{ __html: response.format.textWithSuperscriptHtml }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Catatan Kaki</h3>
              <div
                className="prose dark:prose-invert prose-sm max-w-none p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                dangerouslySetInnerHTML={{ __html: response.format.footnotesHtml }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Daftar Pustaka</h3>
              <div
                className="prose dark:prose-invert prose-sm max-w-none p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                dangerouslySetInnerHTML={{ __html: response.format.bibliographyHtml }}
              />
            </div>
          </div>
        );
      case 'klaim':
        return (
          <div className="space-y-3">
            {response.claims.map((claim) => (
              <div key={claim.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="italic text-gray-700 dark:text-gray-300">"{claim.text}"</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className={`px-2.5 py-0.5 rounded-full font-medium ${getLabelColor(claim.label)}`}>
                    {claim.label}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Keyakinan: {(claim.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'referensi':
        return (
          <div className="space-y-4">
            {response.references.map((ref, index) => (
              <div key={`${ref.claimId}-${index}`} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h4 className="font-semibold text-gray-800 dark:text-white">{ref.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{ref.authors.join(', ')} ({ref.year})</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{ref.publisherOrJournal}</p>
                <p className="mt-2 text-sm italic bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-gray-700 dark:text-gray-300">"{ref.snippet}"</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Skor: <span className="font-medium text-blue-600 dark:text-blue-400">{(ref.score * 100).toFixed(0)}%</span></span>
                  <span className="text-gray-500 dark:text-gray-400">Sumber: <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">{ref.source}</span></span>
                  {ref.page && <span className="text-gray-500 dark:text-gray-400">Halaman: {ref.page}</span>}
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Lihat Sumber
                  </a>
                  <button 
                      onClick={() => handleGoogleSearch(ref)} 
                      title="Cari di Google"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                      <SearchIcon className="h-3 w-3" />
                      <span>Cari Google</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'ekspor':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">RIS Format</h3>
              <div className="relative">
                <pre className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all max-h-60 overflow-y-auto pr-12">
                  <code>{response.export.ris}</code>
                </pre>
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                  <button onClick={() => handleCopy(response.export.ris, 'ris')} title="Salin RIS" className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      {copied === 'ris' ? 'Disalin!' : <ClipboardIcon className="h-4 w-4" />}
                  </button>
                  <button onClick={() => handleDownload(response.export.ris, 'ris')} title="Unduh .ris" className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      <DownloadIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">BibTeX Format</h3>
              <div className="relative">
                <pre className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all max-h-60 overflow-y-auto pr-12">
                  <code>{response.export.bibtex}</code>
                </pre>
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                    <button onClick={() => handleCopy(response.export.bibtex, 'bibtex')} title="Salin BibTeX" className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        {copied === 'bibtex' ? 'Disalin!' : <ClipboardIcon className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDownload(response.export.bibtex, 'bibtex')} title="Unduh .bib" className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      <DownloadIcon className="h-4 w-4" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {response.warnings && response.warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/50 border-b border-yellow-200 dark:border-yellow-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertIcon className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Peringatan</h3>
              <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                <ul className="list-disc list-inside space-y-1">
                  {response.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6 flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputDisplay;
