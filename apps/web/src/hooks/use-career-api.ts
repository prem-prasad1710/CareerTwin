'use client';

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCareerUser } from './use-career-user';
import type {
  DashboardData, SkillGapData, TimelineData, InterviewPrediction,
  JobMatch, LearningROI, CareerRisks, CareerMemory, UserProfile, CoachAgent, GitHubProfile,
} from '@/lib/api-types';

type CareerQueryResult<T> = UseQueryResult<T, Error> & { isLoading: boolean };

function useUserQuery<T>(
  queryKey: unknown[],
  queryFn: (userId: string) => Promise<T>,
): CareerQueryResult<T> {
  const { userId, isLoading: userLoading } = useCareerUser();
  const query = useQuery({
    queryKey: [...queryKey, userId],
    queryFn: () => queryFn(userId!),
    enabled: !!userId,
  });

  return {
    ...query,
    isLoading: userLoading || query.isLoading,
  } as CareerQueryResult<T>;
}

export function useDashboard() {
  return useUserQuery(['dashboard'], (id) => api.dashboard(id) as Promise<DashboardData>);
}

export function useCareerDna() {
  return useUserQuery(['career-dna'], (id) => api.careerDna(id) as Promise<DashboardData['careerDna']>);
}

export function useMarketValue() {
  return useUserQuery(['market-value'], (id) => api.marketValue(id) as Promise<DashboardData['marketValue']>);
}

export function useTimeline() {
  return useUserQuery(['timeline'], (id) => api.timeline(id) as Promise<TimelineData>);
}

export function useInterviewPredictions() {
  return useUserQuery(['interview-predictions'], (id) => api.interviewPredictions(id) as Promise<InterviewPrediction[]>);
}

export function useJobMatches() {
  return useUserQuery(['job-matches'], (id) => api.jobMatches(id) as Promise<JobMatch[]>);
}

export function useLearningRoi() {
  return useUserQuery(['learning-roi'], (id) => api.learningRoi(id) as Promise<LearningROI[]>);
}

export function useSkillGap(targetRole: string) {
  const { userId, isLoading: userLoading } = useCareerUser();
  const query = useQuery({
    queryKey: ['skill-gap', userId, targetRole],
    queryFn: () => api.skillGap(userId!, targetRole) as Promise<SkillGapData>,
    enabled: !!userId && !!targetRole,
  });
  return { ...query, isLoading: userLoading || query.isLoading } as CareerQueryResult<SkillGapData>;
}

export function useRisks() {
  return useUserQuery(['risks'], (id) => api.risks(id) as Promise<CareerRisks>);
}

export function useMemories() {
  return useUserQuery(['memories'], (id) => api.memories(id) as Promise<CareerMemory[]>);
}

export function useCoachAgents() {
  return useQuery({
    queryKey: ['coach-agents'],
    queryFn: () => api.coachAgents() as Promise<CoachAgent[]>,
  });
}

export function useUserProfile() {
  return useUserQuery(['user-profile'], (id) => api.user(id) as Promise<UserProfile>);
}

export function useUpdateProfile() {
  const { userId } = useCareerUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.updateProfile(userId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-profile', userId] }),
  });
}

export function useShareCard() {
  const { userId } = useCareerUser();
  return useMutation({
    mutationFn: (data: { type: string; title: string; data: Record<string, unknown> }) =>
      api.share(userId!, data),
  });
}

export function useGithubIntel() {
  return useUserQuery(['github'], (id) => api.github(id) as Promise<GitHubProfile>);
}
