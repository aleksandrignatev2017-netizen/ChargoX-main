export interface PlanStep {
  action: string;
  detail: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp?: string;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'html' | 'css' | 'javascript' | 'json';
  content: string;
}

export interface AppVersion {
  version: number;
  prompt: string;
  previewHtml: string;
  timestamp: string;
  files: FileItem[];
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
}

export interface AppDeployment {
  id: string;
  slug: string;
  projectId?: string;
  name: string;
  prompt?: string;
  summary?: string;
  status: 'published' | 'deleted';
  deployedAt: string;
  deletedAt?: string;
  views: number;
  publicUrl: string;
}

export interface AppProject {
  id: string;
  name: string;
  prompt: string;
  summary: string;
  category?: 'Game' | 'Productivity' | 'SaaS' | 'Audio/3D' | 'E-commerce' | 'Utility';
  tags?: string[];
  createdAt: string;
  files: FileItem[];
  previewHtml: string;
  planSteps: PlanStep[];
  suggestions: string[];
  versionHistory?: AppVersion[];
  sourceType?: 'scratch' | 'github' | 'upload';
  sourceUrl?: string;
  repoFullName?: string;
  deployment?: AppDeployment;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  planSteps?: PlanStep[];
  filesCreated?: string[];
  appName?: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'fullscreen';
export type StudioTab = 'preview' | 'code' | 'logs';

export interface SessionTokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  callCount: number;
  lastTurnInputTokens?: number;
  lastTurnOutputTokens?: number;
}

export interface AppRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'design' | 'performance' | 'audio' | 'data';
  prompt: string;
  impact: 'High' | 'Medium' | 'Quick Win';
}
