
export type CitationStyle = 'chicago' | 'apa';
export type CitationMode = 'default' | 'islam';

export interface Claim {
  id: string;
  start: number;
  end: number;
  text: string;
  label: 'fakta' | 'opini' | 'ambigu';
  confidence: number;
}

export interface Reference {
  claimId: string;
  source: 'google_books' | 'crossref' | 'semanticscholar' | 'archive' | 'shamela';
  title: string;
  authors: string[];
  year: number;
  publisherOrJournal: string;
  id: string;
  url: string;
  page: string | null;
  snippet: string;
  score: number;
  extra?: {
    isbn?: string;
    doi?: string;
    volume?: string;
    issue?: string;
    islamic?: {
      kitab: string;
      bab: string;
      no: string;
      juz: string;
      grading: 'shahih' | 'hasan' | 'daif' | 'tidak tersedia';
    };
  };
}

export interface FormattedOutput {
  textWithSuperscriptHtml: string;
  footnotesHtml: string;
  bibliographyHtml: string;
}

export interface ExportData {
  ris: string;
  bibtex: string;
}

export interface ApiResponse {
  claims: Claim[];
  references: Reference[];
  warnings: string[];
  format: FormattedOutput;
  export: ExportData;
}
