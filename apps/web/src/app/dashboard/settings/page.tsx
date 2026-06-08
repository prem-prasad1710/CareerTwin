'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueryState } from '@/components/ui/query-state';
import { useUserProfile, useUpdateProfile, useGithubIntel } from '@/hooks/use-career-api';
import { useCareerUser } from '@/hooks/use-career-user';
import { useToast } from '@/components/ui/toast';
import { Settings, Link2, Globe, Code2, User, Briefcase, MapPin, Star, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { data: profile, isLoading, isError, error } = useUserProfile();
  const { data: github } = useGithubIntel();
  const updateProfile = useUpdateProfile();
  const { provider } = useCareerUser();
  const toast = useToast();

  const [form, setForm] = useState({
    currentRole: '', currentCompany: '', location: '',
    targetRole: '', yearsExperience: 0, bio: '', headline: '',
    githubUrl: '', linkedinUrl: '',
  });

  useEffect(() => {
    if (profile?.profile) {
      setForm({
        currentRole: profile.profile.currentRole || '',
        currentCompany: profile.profile.currentCompany || '',
        location: profile.profile.location || '',
        targetRole: profile.profile.targetRole || '',
        yearsExperience: profile.profile.yearsExperience || 0,
        bio: (profile.profile as any).bio || '',
        headline: (profile.profile as any).headline || '',
        githubUrl: profile.profile.githubUrl || '',
        linkedinUrl: (profile.profile as any).linkedinUrl || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      toast.success('Profile saved!', 'Your changes have been applied');
    } catch {
      toast.error('Failed to save', 'Please try again');
    }
  };

  const field = (label: string, key: keyof typeof form, placeholder = '', type = 'text') => (
    <div>
      <label className="text-xs text-muted block mb-1.5">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
        placeholder={placeholder}
        className="input-base"
      />
    </div>
  );

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-muted mt-1">Manage your profile and connected accounts</p>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-4 h-4 text-primary" />Personal Info</CardTitle>
            <CardDescription>Basic profile information</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('Headline', 'headline', 'Senior Software Engineer at Google')}
              {field('Location', 'location', 'San Francisco, CA')}
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Brief professional summary..."
                rows={3}
                className="input-base resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Career Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-400" />Career Details</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Current Role', 'currentRole', 'Software Engineer')}
            {field('Company', 'currentCompany', 'Acme Corp')}
            {field('Target Role', 'targetRole', 'Staff Engineer')}
            {field('Years of Experience', 'yearsExperience', '3', 'number')}
          </div>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Link2 className="w-4 h-4 text-emerald-400" />Social Links</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('GitHub URL', 'githubUrl', 'https://github.com/username')}
            {field('LinkedIn URL', 'linkedinUrl', 'https://linkedin.com/in/username')}
          </div>
        </Card>

        <Button onClick={handleSave} disabled={updateProfile.isPending} className="w-full sm:w-auto">
          {updateProfile.isPending ? 'Saving...' : 'Save All Changes'}
        </Button>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-400" />Connected Accounts</CardTitle>
            <CardDescription>OAuth providers and integrations</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <ConnectedAccount
              icon={<Code2 className="w-4 h-4" />}
              name="GitHub"
              connected={provider === 'github' || !!github}
              detail={github ? `@${github.username} · ${github.repos} repos · Score: ${github.engineeringScore}` : provider === 'github' ? 'Connected via OAuth' : undefined}
            />
            <ConnectedAccount
              icon={<Globe className="w-4 h-4" />}
              name="Google"
              connected={provider === 'google'}
              detail={provider === 'google' ? 'Signed in with Google' : undefined}
            />
          </div>
        </Card>

        {/* GitHub Intel */}
        {github && (
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" />GitHub Intelligence</CardTitle>
              <CardDescription>Analyzed from your public repositories</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Repos', value: github.repos },
                { label: 'Stars', value: github.stars },
                { label: 'Engineering Score', value: `${github.engineeringScore}/100` },
                { label: 'Open Source Score', value: `${github.openSourceScore}/100` },
                { label: 'Technical Depth', value: `${github.technicalDepthScore}/100` },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.03]">
                  <div className="text-xl font-bold gradient-text">{s.value}</div>
                  <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </QueryState>
  );
}

function ConnectedAccount({ icon, name, connected, detail }: {
  icon: React.ReactNode; name: string; connected: boolean; detail?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{icon}</div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          {detail && <p className="text-xs text-muted">{detail}</p>}
        </div>
      </div>
      <Badge variant={connected ? 'success' : 'default'}>{connected ? 'Connected' : 'Not Connected'}</Badge>
    </div>
  );
}
