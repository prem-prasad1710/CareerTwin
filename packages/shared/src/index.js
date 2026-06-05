"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_AGENTS = exports.CAREER_DNA_DIMENSIONS = void 0;
exports.CAREER_DNA_DIMENSIONS = [
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
];
exports.AI_AGENTS = [
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
//# sourceMappingURL=index.js.map