export enum AgentRole {
  OVERSEER = 'OVERSEER',
  ENGINEER = 'ENGINEER',
  ANALYST = 'ANALYST',
  USER = 'USER'
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: 'idle' | 'busy' | 'offline';
  capabilities: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface MetricPoint {
  time: string;
  load: number;
  tokens: number;
}