// Career DNA Dimensions
export const CAREER_DNA_DIMENSIONS = [
  'frontend',
  'backend',
  'ai',
  'cloud',
  'devops',
  'leadership',
  'communication',
  'productThinking',
  'architecture',
  'data',
] as const;

export type CareerDnaDimension = (typeof CAREER_DNA_DIMENSIONS)[number];

export interface CareerDna {
  frontend: number;
  backend: number;
  ai: number;
  cloud: number;
  devops: number;
  leadership: number;
  communication: number;
  productThinking: number;
  architecture: number;
  data: number;
}

export interface CareerScoreBreakdown {
  overall: number;
  experience: number;
  skills: number;
  projectQuality: number;
  githubActivity: number;
  interviewPerformance: number;
  learningConsistency: number;
  peerPercentile: number;
}

export interface MarketValue {
  current: { min: number; max: number; median: number };
  potential: { min: number; max: number; median: number };
  currency: string;
  topCities: { city: string; median: number }[];
  topIndustries: { industry: string; median: number }[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: number;
  estimatedWeeks: number;
  salaryImpact: number;
}

export interface SkillGapAnalysis {
  targetRole: string;
  gaps: SkillGap[];
  roadmap: { phase: string; skills: string[]; weeks: number }[];
  estimatedCompletionWeeks: number;
  readinessScore: number;
}

export interface SimulationInput {
  scenario: string;
  duration?: string;
  location?: string;
  skills?: string[];
  role?: string;
}

export interface SimulationResult {
  scenario: string;
  salaryImpact: number;
  promotionProbability: number;
  interviewSuccessProbability: number;
  careerGrowthImpact: number;
  timeline: { month: number; role: string; salary: number }[];
  insights: string[];
}

export interface TimelineEntry {
  year: number;
  role: string;
  company?: string;
  salary?: number;
  confidence: number;
  isAlternate?: boolean;
  scenario?: string;
}

export interface InterviewPrediction {
  company: string;
  probability: number;
  reasoning: string;
  missingSkills: string[];
  strengths: string[];
}

export interface LearningROI {
  skill: string;
  salaryImpact: number;
  promotionImpact: number;
  marketDemand: number;
  totalROI: number;
  estimatedWeeks: number;
}

export interface CareerRisk {
  burnoutRisk: number;
  stagnationRisk: number;
  layoffVulnerability: number;
  skillObsolescenceRisk: number;
  recommendations: string[];
}

export interface CareerHealth {
  careerHealth: number;
  marketDemand: number;
  salaryGrowth: number;
  interviewReadiness: number;
  learningVelocity: number;
  promotionReadiness: number;
  risks: CareerRisk;
}

export interface JobMatch {
  company: string;
  role: string;
  location: string;
  salary: { min: number; max: number };
  matchScore: number;
  missingSkills: string[];
  strengths: string[];
  successProbability: number;
}

export interface AIAgentConfig {
  name: string;
  type: string;
  systemPrompt: string;
  capabilities: string[];
}

export const AI_AGENTS: AIAgentConfig[] = [
  {
    name: 'Career Coach',
    type: 'CAREER_COACH',
    systemPrompt: 'You are an expert career coach with deep knowledge of the user\'s Career Twin. Provide actionable, personalized career advice.',
    capabilities: ['Career planning', 'Goal setting', 'Progress tracking', 'Motivation'],
  },
  {
    name: 'Interview Coach',
    type: 'INTERVIEW_COACH',
    systemPrompt: 'You are an interview preparation expert. Help users ace technical and behavioral interviews based on their profile.',
    capabilities: ['Mock interviews', 'Question prep', 'Feedback analysis', 'Company-specific tips'],
  },
  {
    name: 'Salary Negotiator',
    type: 'SALARY_NEGOTIATOR',
    systemPrompt: 'You are a salary negotiation expert. Help users maximize their compensation using market data.',
    capabilities: ['Offer analysis', 'Negotiation scripts', 'Market benchmarking', 'Counter-offer strategy'],
  },
  {
    name: 'Job Hunter',
    type: 'JOB_HUNTER',
    systemPrompt: 'You are a job search strategist. Help users find and land their dream roles efficiently.',
    capabilities: ['Job matching', 'Application strategy', 'Networking tips', 'Referral optimization'],
  },
  {
    name: 'Resume Optimizer',
    type: 'RESUME_OPTIMIZER',
    systemPrompt: 'You are a resume optimization expert. Help users craft compelling resumes that pass ATS and impress recruiters.',
    capabilities: ['Resume review', 'ATS optimization', 'Impact statements', 'Format suggestions'],
  },
  {
    name: 'Learning Mentor',
    type: 'LEARNING_MENTOR',
    systemPrompt: 'You are a learning strategist. Help users choose the highest-ROI skills and create effective learning plans.',
    capabilities: ['Skill prioritization', 'Learning paths', 'Resource recommendations', 'Progress tracking'],
  },
  {
    name: 'Career Strategist',
    type: 'CAREER_STRATEGIST',
    systemPrompt: 'You are a long-term career strategist. Help users make strategic decisions about their career trajectory.',
    capabilities: ['Career pivots', 'Industry analysis', 'Risk assessment', 'Long-term planning'],
  },
];

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ShareCardData {
  type: 'career_dna' | 'timeline' | 'market_value' | 'career_score';
  title: string;
  data: Record<string, unknown>;
}
