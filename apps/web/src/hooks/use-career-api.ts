'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCareerUserId } from './use-career-user';
import type {
  DashboardData, SkillGapData, TimelineData, InterviewPrediction,
  JobMatch, LearningROI, CareerRisks, CareerMemory, UserProfile, CoachAgent, GitHubProfile,
} from '@/lib/api-types';

export function useDashboard() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => api.dashboard(userId!) as Promise<DashboardData>,
    enabled: !!userId,
  });
}

export function useCareerDna() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['career-dna', userId],
    queryFn: () => api.careerDna(userId!) as Promise<DashboardData['careerDna']>,
    enabled: !!userId,
  });
}

export function useMarketValue() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['market-value', userId],
    queryFn: () => api.marketValue(userId!) as Promise<DashboardData['marketValue']>,
    enabled: !!userId,
  });
}

export function useTimeline() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['timeline', userId],
    queryFn: () => api.timeline(userId!) as Promise<TimelineData>,
    enabled: !!userId,
  });
}

export function useInterviewPredictions() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['interview-predictions', userId],
    queryFn: () => api.interviewPredictions(userId!) as Promise<InterviewPrediction[]>,
    enabled: !!userId,
  });
}

export function useJobMatches() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['job-matches', userId],
    queryFn: () => api.jobMatches(userId!) as Promise<JobMatch[]>,
    enabled: !!userId,
  });
}

export function useLearningRoi() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['learning-roi', userId],
    queryFn: () => api.learningRoi(userId!) as Promise<LearningROI[]>,
    enabled: !!userId,
  });
}

export function useSkillGap(targetRole: string) {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['skill-gap', userId, targetRole],
    queryFn: () => api.skillGap(userId!, targetRole) as Promise<SkillGapData>,
    enabled: !!userId && !!targetRole,
  });
}

export function useRisks() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['risks', userId],
    queryFn: () => api.risks(userId!) as Promise<CareerRisks>,
    enabled: !!userId,
  });
}

export function useMemories() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['memories', userId],
    queryFn: () => api.memories(userId!) as Promise<CareerMemory[]>,
    enabled: !!userId,
  });
}

export function useCoachAgents() {
  return useQuery({
    queryKey: ['coach-agents'],
    queryFn: () => api.coachAgents() as Promise<CoachAgent[]>,
  });
}

export function useUserProfile() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => api.user(userId!) as Promise<UserProfile>,
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const userId = useCareerUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.updateProfile(userId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-profile', userId] }),
  });
}

export function useShareCard() {
  const userId = useCareerUserId();
  return useMutation({
    mutationFn: (data: { type: string; title: string; data: Record<string, unknown> }) =>
      api.share(userId!, data),
  });
}

export function useGithubIntel() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['github', userId],
    queryFn: () => api.github(userId!) as Promise<GitHubProfile>,
    enabled: !!userId,
  });
}
