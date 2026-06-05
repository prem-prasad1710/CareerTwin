'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCareerUserId } from './use-career-user';

export function useDashboard() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => api.dashboard(userId!),
    enabled: !!userId,
  });
}

export function useCareerDna() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['career-dna', userId],
    queryFn: () => api.careerDna(userId!),
    enabled: !!userId,
  });
}

export function useMarketValue() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['market-value', userId],
    queryFn: () => api.marketValue(userId!),
    enabled: !!userId,
  });
}

export function useTimeline() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['timeline', userId],
    queryFn: () => api.timeline(userId!),
    enabled: !!userId,
  });
}

export function useInterviewPredictions() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['interview-predictions', userId],
    queryFn: () => api.interviewPredictions(userId!),
    enabled: !!userId,
  });
}

export function useJobMatches() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['job-matches', userId],
    queryFn: () => api.jobMatches(userId!),
    enabled: !!userId,
  });
}

export function useLearningRoi() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['learning-roi', userId],
    queryFn: () => api.learningRoi(userId!),
    enabled: !!userId,
  });
}

export function useSkillGap(targetRole: string) {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['skill-gap', userId, targetRole],
    queryFn: () => api.skillGap(userId!, targetRole),
    enabled: !!userId && !!targetRole,
  });
}

export function useRisks() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['risks', userId],
    queryFn: () => api.risks(userId!),
    enabled: !!userId,
  });
}

export function useMemories() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['memories', userId],
    queryFn: () => api.memories(userId!),
    enabled: !!userId,
  });
}

export function useCoachAgents() {
  return useQuery({
    queryKey: ['coach-agents'],
    queryFn: () => api.coachAgents(),
  });
}

export function useUserProfile() {
  const userId = useCareerUserId();
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => api.user(userId!),
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
    queryFn: () => api.github(userId!),
    enabled: !!userId,
  });
}
