export const demoDashboard = {
  user: { id: 'demo', name: 'Alex Chen', role: 'Software Engineer', company: 'Tech Corp', avatar: null },
  careerScore: {
    overall: 78, experience: 72, skills: 82, projectQuality: 85,
    githubActivity: 65, interviewPerformance: 70, learningConsistency: 75, peerPercentile: 68,
  },
  careerDna: {
    frontend: 92, backend: 78, ai: 45, cloud: 62, devops: 55,
    leadership: 30, communication: 65, productThinking: 48, architecture: 54, data: 58,
    strengths: ['Frontend: 92', 'Backend: 78', 'Communication: 65'],
    weaknesses: ['Leadership: 30', 'AI: 45', 'Product Thinking: 48'],
  },
  marketValue: {
    current: { min: 130000, max: 175000, median: 155000 },
    potential: { min: 175000, max: 235000, median: 205000 },
    currency: 'USD',
    topCities: [
      { city: 'San Francisco', median: 155000 },
      { city: 'New York', median: 140000 },
      { city: 'Bangalore', median: 2500000 },
      { city: 'Remote', median: 120000 },
    ],
    topIndustries: [
      { industry: 'AI/ML', median: 193750 },
      { industry: 'Fintech', median: 170500 },
      { industry: 'Technology', median: 155000 },
    ],
  },
  health: {
    careerHealth: 78, marketDemand: 78, salaryGrowth: 55,
    interviewReadiness: 70, learningVelocity: 50, promotionReadiness: 62,
    risks: {
      burnoutRisk: 35, stagnationRisk: 42, layoffVulnerability: 28,
      skillObsolescenceRisk: 38,
      recommendations: ['Invest in AI/ML skills to stay ahead of market trends', 'Increase open source contributions'],
    },
  },
  topLearningROI: [
    { skill: 'System Design', salaryImpact: 21, promotionImpact: 21, marketDemand: 85, totalROI: 58, estimatedWeeks: 8 },
    { skill: 'Machine Learning', salaryImpact: 25, promotionImpact: 24, marketDemand: 96, totalROI: 62, estimatedWeeks: 12 },
    { skill: 'AWS', salaryImpact: 15, promotionImpact: 23, marketDemand: 91, totalROI: 52, estimatedWeeks: 6 },
    { skill: 'Leadership', salaryImpact: 18, promotionImpact: 23, marketDemand: 90, totalROI: 50, estimatedWeeks: 10 },
    { skill: 'Redis', salaryImpact: 8, promotionImpact: 20, marketDemand: 80, totalROI: 38, estimatedWeeks: 3 },
  ],
  goals: [
    { id: '1', title: 'Reach Senior Engineer', targetRole: 'Senior Software Engineer', progress: 62 },
    { id: '2', title: 'Master System Design', targetRole: 'Staff Engineer', progress: 35 },
  ],
  recommendations: [
    { id: '1', title: 'Focus on System Design', content: 'Your biggest ROI skill gap is System Design. Dedicate 8 weeks to structured learning.', agent: 'LEARNING_MENTOR' },
    { id: '2', title: 'Interview Prep', content: 'Schedule 2 mock system design interviews before your next FAANG application.', agent: 'INTERVIEW_COACH' },
  ],
  recentLearning: [
    { id: '1', title: 'System Design Interview Guide', progress: 45, type: 'COURSE' },
    { id: '2', title: 'AWS Solutions Architect', progress: 20, type: 'CERTIFICATION' },
  ],
};

export const demoTimeline = {
  primary: [
    { year: 2026, role: 'SDE-2', salary: 155000, confidence: 90 },
    { year: 2028, role: 'Senior Engineer', salary: 195000, confidence: 78 },
    { year: 2031, role: 'Staff Engineer', salary: 260000, confidence: 66 },
    { year: 2034, role: 'Principal Engineer', salary: 340000, confidence: 54 },
  ],
  alternate: [
    { year: 2028, role: 'Senior Engineer (Startup)', company: 'High-growth Startup', salary: 201500, confidence: 65, scenario: 'startup_fast_track' },
    { year: 2030, role: 'Engineering Manager', company: 'Mid-size Tech Co', salary: 248000, confidence: 55, scenario: 'management_track' },
    { year: 2032, role: 'Principal Engineer', company: 'FAANG', salary: 341000, confidence: 40, scenario: 'ic_expert_track' },
  ],
};

export const demoInterviewPredictions = [
  { company: 'Paytm', probability: 72, reasoning: 'Strong match for Paytm. Your skills in React, Node.js align well.', missingSkills: [], strengths: ['React', 'Node.js'] },
  { company: 'Razorpay', probability: 65, reasoning: 'Moderate chance at Razorpay. Strengthen System Design to improve odds.', missingSkills: ['System Design'], strengths: ['Node.js', 'PostgreSQL'] },
  { company: 'Microsoft', probability: 52, reasoning: 'Moderate chance. Focus on System Design and Algorithms.', missingSkills: ['System Design'], strengths: ['TypeScript'] },
  { company: 'Amazon', probability: 48, reasoning: 'Challenging but achievable. Build 2-3 months of targeted preparation.', missingSkills: ['System Design', 'Leadership'], strengths: ['TypeScript'] },
  { company: 'Google', probability: 38, reasoning: 'Focus on Algorithms, System Design, Data Structures preparation.', missingSkills: ['Algorithms', 'System Design'], strengths: ['TypeScript'] },
];

export const demoJobMatches = [
  { company: 'Vercel', role: 'Frontend Engineer', location: 'Remote', salary: { min: 150000, max: 220000 }, matchScore: 88, missingSkills: [], strengths: ['React', 'Next.js', 'TypeScript'], successProbability: 75 },
  { company: 'Stripe', role: 'Full Stack Engineer', location: 'San Francisco', salary: { min: 180000, max: 280000 }, matchScore: 76, missingSkills: ['PostgreSQL'], strengths: ['React', 'Node.js'], successProbability: 65 },
  { company: 'Razorpay', role: 'Senior Backend Engineer', location: 'Bangalore', salary: { min: 3500000, max: 5500000 }, matchScore: 68, missingSkills: ['System Design'], strengths: ['Node.js'], successProbability: 58 },
  { company: 'Google', role: 'Senior Software Engineer', location: 'Mountain View', salary: { min: 200000, max: 350000 }, matchScore: 52, missingSkills: ['Algorithms', 'System Design'], strengths: ['TypeScript'], successProbability: 44 },
];

export const demoMemories = [
  { id: '1', type: 'INTERVIEW', title: 'Google L4 Interview', content: 'Passed 3/5 rounds. System design was the weak point.', tags: ['google', 'system-design'], occurredAt: '2025-11-15' },
  { id: '2', type: 'ACHIEVEMENT', title: 'Promoted to SDE-2', content: 'Promoted after leading the payments microservice rewrite.', tags: ['promotion'], occurredAt: '2025-06-01' },
  { id: '3', type: 'LESSON', title: 'Paytm Interview Learnings', content: 'Focus on practical problem-solving over theoretical knowledge.', tags: ['paytm', 'interview'], occurredAt: '2025-09-20' },
];

export const demoAgents = [
  { name: 'Career Coach', type: 'CAREER_COACH', capabilities: ['Career planning', 'Goal setting'] },
  { name: 'Interview Coach', type: 'INTERVIEW_COACH', capabilities: ['Mock interviews', 'Question prep'] },
  { name: 'Salary Negotiator', type: 'SALARY_NEGOTIATOR', capabilities: ['Offer analysis', 'Negotiation scripts'] },
  { name: 'Job Hunter', type: 'JOB_HUNTER', capabilities: ['Job matching', 'Application strategy'] },
  { name: 'Resume Optimizer', type: 'RESUME_OPTIMIZER', capabilities: ['Resume review', 'ATS optimization'] },
  { name: 'Learning Mentor', type: 'LEARNING_MENTOR', capabilities: ['Skill prioritization', 'Learning paths'] },
  { name: 'Career Strategist', type: 'CAREER_STRATEGIST', capabilities: ['Career pivots', 'Long-term planning'] },
];
