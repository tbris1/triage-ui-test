export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Scenario {
  id: string;
  patient_name?: string;
  yaml_path?: string;
  title: string;
  description: string;
  initialPrompt: string;
  correctTriage: 'emergency' | 'urgent' | 'non-urgent';
  learningPoints: string[];
}

export interface TriageDecision {
  level: 'emergency' | 'urgent' | 'non-urgent';
  reasoning: string;
}

export interface Session {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  messages: Message[];
  triageDecision?: TriageDecision;
  isCorrect?: boolean;
  score?: number;
  startTime: Date;
  endTime?: Date;
}
