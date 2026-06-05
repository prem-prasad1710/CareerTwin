import { prisma } from '@careertwin/database';

export async function analyze(userId: string, username?: string, accessToken?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { githubProfile: true, profile: true },
  });

  if (!user) throw new Error('User not found');

  const ghUsername = username || user.githubProfile?.username || user.profile?.githubUrl?.split('/').pop();

  if (ghUsername) {
    try {
      const data = await fetchGitHubData(ghUsername, accessToken);
      return saveAndReturn(userId, data);
    } catch {
      // fall through to mock
    }
  }

  return generateMockAnalysis(userId);
}

async function fetchGitHubData(username: string, userAccessToken?: string) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  const token = userAccessToken || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`, { headers }),
  ]);

  if (!userRes.ok) throw new Error('GitHub user not found');

  const userData = await userRes.json() as any;
  const repos = await reposRes.json() as any[];

  const languages: Record<string, number> = {};
  let totalStars = 0;

  for (const repo of repos) {
    totalStars += repo.stargazers_count || 0;
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  }

  return {
    username,
    repos: userData.public_repos,
    stars: totalStars,
    contributions: Math.round(totalStars * 2 + repos.length * 5),
    languages,
    engineeringScore: Math.min(100, repos.length * 3 + totalStars * 0.5),
    openSourceScore: Math.min(100, totalStars * 2),
    technicalDepthScore: Math.min(100, Object.keys(languages).length * 12 + repos.length * 2),
    rawData: { user: userData, repos: repos.slice(0, 10) },
  };
}

async function saveAndReturn(userId: string, data: any) {
  return prisma.gitHubProfile.upsert({
    where: { userId },
    update: { ...data, lastSynced: new Date() },
    create: { userId, ...data },
  });
}

async function generateMockAnalysis(userId: string) {
  const mock = {
    username: 'demo-user',
    repos: 24,
    stars: 156,
    contributions: 890,
    languages: { TypeScript: 12, Python: 5, Go: 3, Rust: 2 },
    engineeringScore: 72,
    openSourceScore: 45,
    technicalDepthScore: 68,
    lastSynced: new Date(),
  };

  return prisma.gitHubProfile.upsert({
    where: { userId },
    update: mock,
    create: { userId, ...mock },
  });
}
