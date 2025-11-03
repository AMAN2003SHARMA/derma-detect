export interface PossibleCondition {
  name: string;
  confidence_score: number;
  description: string;
  symptoms?: string[];
  treatment_suggestions?: string;
}

export interface AnalysisReport {
  id: string;
  date: string;
  image: string; // base64 string of the image
  possible_conditions: PossibleCondition[];
  disclaimer: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  name: string;
  email: string;
}
