const API_BASE =
  typeof window !== 'undefined'
    ? '/api/proxy/v1'
    : process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:4000/api/v1';

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  dashboard: (userId: string) => fetchAPI(`/dashboard/${userId}`),
  careerDna: (userId: string) => fetchAPI(`/career-dna/${userId}`),
  careerScore: (userId: string) => fetchAPI(`/career-score/${userId}`),
  marketValue: (userId: string) => fetchAPI(`/market-value/${userId}`),
  skillGap: (userId: string, targetRole: string) =>
    fetchAPI(`/skill-gap/${userId}?targetRole=${encodeURIComponent(targetRole)}`),
  simulate: (userId: string, input: Record<string, unknown>) =>
    fetchAPI(`/simulator/${userId}`, { method: 'POST', body: JSON.stringify(input) }),
  simulationHistory: (userId: string) => fetchAPI(`/simulator/${userId}/history`),
  timeline: (userId: string) => fetchAPI(`/timeline/${userId}`),
  interviewPredictions: (userId: string) => fetchAPI(`/interview/${userId}/predictions`),
  memories: (userId: string) => fetchAPI(`/memory/${userId}`),
  searchMemories: (userId: string, query: string) =>
    fetchAPI(`/memory/${userId}/search?q=${encodeURIComponent(query)}`),
  coachChat: (userId: string, messages: { role: string; content: string }[], agent?: string) =>
    fetchAPI(`/coach/${userId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ messages, agent }),
    }),
  coachAgents: () => fetchAPI('/coach/agents'),
  jobMatches: (userId: string) => fetchAPI(`/job-match/${userId}`),
  learningRoi: (userId: string) => fetchAPI(`/learning-roi/${userId}`),
  github: (userId: string) => fetchAPI(`/github/${userId}`),
  linkedin: (userId: string) => fetchAPI(`/linkedin/${userId}`),
  risks: (userId: string) => fetchAPI(`/risk/${userId}`),
  health: (userId: string) => fetchAPI(`/health/${userId}`),
  share: (userId: string, data: { type: string; title: string; data: Record<string, unknown> }) =>
    fetchAPI(`/share/${userId}`, { method: 'POST', body: JSON.stringify(data) }),
  user: (userId: string) => fetchAPI(`/users/${userId}`),
  syncUser: (data: Record<string, unknown>) =>
    fetchAPI('/users/sync', { method: 'POST', body: JSON.stringify(data) }),
  updateProfile: (userId: string, data: Record<string, unknown>) =>
    fetchAPI(`/users/${userId}/profile`, { method: 'PUT', body: JSON.stringify(data) }),
};
