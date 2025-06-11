export interface TarotCard {
  name: string;
  suit: string;
  keywords: string[];
  upright: string;
  reversed: string;
  element?: string;
  image?: string;
  description?: string;
}

export interface Question {
  text: string;
  context: string;
  category: 'past' | 'present' | 'future' | 'general';
}

export interface AstroData {
  currentPhase: string;
  dominantElement: string;
  activeEnergy: string;
}

export type ReadingState = 'welcome' | 'card-selection' | 'questioning' | 'results';

export interface ReadingSession {
  id: string;
  timestamp: Date;
  cards: TarotCard[];
  responses: string[];
  insight: string;
}