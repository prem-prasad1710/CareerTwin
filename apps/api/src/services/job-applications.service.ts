import { prisma } from '@careertwin/database';

export async function getApplications(userId: string) {
  return prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { appliedAt: 'desc' },
  });
}

export async function createApplication(userId: string, data: {
  company: string;
  role: string;
  location?: string;
  salary?: number;
  jobUrl?: string;
  notes?: string;
  status?: string;
}) {
  return prisma.jobApplication.create({
    data: {
      userId,
      company: data.company,
      role: data.role,
      location: data.location,
      salary: data.salary,
      jobUrl: data.jobUrl,
      notes: data.notes,
      status: (data.status as any) ?? 'APPLIED',
    },
  });
}

export async function updateApplication(appId: string, userId: string, data: {
  status?: string;
  notes?: string;
  salary?: number;
  matchScore?: number;
}) {
  return prisma.jobApplication.update({
    where: { id: appId, userId },
    data: {
      status: data.status as any,
      notes: data.notes,
      salary: data.salary,
      matchScore: data.matchScore,
    },
  });
}

export async function deleteApplication(appId: string, userId: string) {
  return prisma.jobApplication.delete({ where: { id: appId, userId } });
}

export async function getStats(userId: string) {
  const apps = await prisma.jobApplication.findMany({ where: { userId } });
  const total = apps.length;
  const applied = apps.filter((a) => a.status === 'APPLIED').length;
  const screening = apps.filter((a) => a.status === 'SCREENING').length;
  const interviewing = apps.filter((a) => a.status === 'INTERVIEW').length;
  const offers = apps.filter((a) => a.status === 'OFFER').length;
  const rejected = apps.filter((a) => a.status === 'REJECTED').length;
  const responseRate = total > 0 ? Math.round(((total - applied) / total) * 100) : 0;
  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;
  return { total, applied, screening, interviewing, offers, rejected, responseRate, successRate };
}
