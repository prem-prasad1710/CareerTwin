export interface DashboardData {
  user: { id: string; name: string; role: string; company: string; avatar: string | null };
  careerScore: {
    overall: number; experience: number; skills: number; projectQuality: number;
    githubActivity: number; interviewPerformance: number; learningConsistency: number; peerPercentile: number;
  };
  careerDna: Record<string, number | string[]> & { strengths?: string[]; weaknesses?: string[] };
  marketValue: {
    current: { min: number; max: number; median: number };
    potential: { min: number; max: number; median: number };
    currency: string;
    topCities: { city: string; median: number }[];
    topIndustries: { industry: string; median: number }[];
  };
  health: {
    careerHealth: number; marketDemand: number; salaryGrowth: number;
    interviewReadiness: number; learningVelocity: number; promotionReadiness: number;
    risks: CareerRisks;
  };
  topLearningROI: LearningROI[];
  goals: { id: string; title: string; targetRole: string; progress: number }[];
  recommendations: unknown[];
  recentLearning: unknown[];
  risks: CareerRisks;
}

export interface CareerRisks {
  burnoutRisk: number; stagnationRisk: number; layoffVulnerability: number;
  skillObsolescenceRisk: number; recommendations: string[];
}

export interface LearningROI {
  skill: string; salaryImpact: number; promotionImpact: number;
  marketDemand: number; totalROI: number; estimatedWeeks: number;
}

export interface SkillGapData {
  targetRole: string;
  gaps: { skill: string; currentLevel: number; requiredLevel: number; estimatedWeeks: number; priority: number }[];
  readinessScore: number;
  estimatedCompletionWeeks: number;
}

export interface TimelineData {
  primary: { year: number; role: string; salary?: number; confidence: number; company?: string }[];
  alternate: { year: number; role: string; salary?: number; confidence: number; scenario?: string; company?: string }[];
}

export interface InterviewPrediction {
  company: string; probability: number; reasoning: string; missingSkills: string[]; strengths: string[];
}

export interface JobMatch {
  company: string; role: string; location: string;
  salary: { min: number; max: number }; matchScore: number;
  missingSkills: string[]; strengths: string[]; successProbability: number;
}

export interface CareerMemory {
  id: string; type: string; title: string; content: string; tags: string[]; occurredAt: string;
}

export interface GitHubProfile {
  username: string; repos: number; stars: number; engineeringScore: number;
  openSourceScore: number; technicalDepthScore: number;
}

export interface UserProfile {
  id: string; firstName: string; lastName: string; email: string;
  profile: {
    currentRole: string; currentCompany: string; location: string;
    targetRole: string; yearsExperience: number; githubUrl: string;
  };
  githubProfile: GitHubProfile | null;
}

export interface CoachAgent {
  name: string; type: string; capabilities: string[];
}
