'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueryState } from '@/components/ui/query-state';
import { useUserProfile, useUpdateProfile, useGithubIntel } from '@/hooks/use-career-api';
import { useCareerUser } from '@/hooks/use-career-user';
import { Settings, Link2, Globe, Code2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: profile, isLoading, isError, error } = useUserProfile();
  const { data: github } = useGithubIntel();
  const updateProfile = useUpdateProfile();
  const { provider } = useCareerUser();
  const [form, setForm] = useState({ currentRole: '', currentCompany: '', location: '', targetRole: '', yearsExperience: 0 });

  useEffect(() => {
    if (profile?.profile) {
      setForm({
        currentRole: profile.profile.currentRole || '',
        currentCompany: profile.profile.currentCompany || '',
        location: profile.profile.location || '',
        targetRole: profile.profile.targetRole || '',
        yearsExperience: profile.profile.yearsExperience || 0,
      });
    }
  }, [profile]);

  const handleSave = () => updateProfile.mutate(form);

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="w-8 h-8 text-primary" /> Settings</h1>
          <p className="text-muted mt-1">Manage your profile and integrations</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Your career information</CardDescription></CardHeader>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Current Role', key: 'currentRole' },
              { label: 'Company', key: 'currentCompany' },
              { label: 'Location', key: 'location' },
              { label: 'Target Role', key: 'targetRole' },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs text-muted">{field.label}</label>
                <input value={form[field.key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50" />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted">Years Experience</label>
              <input type="number" value={form.yearsExperience}
                onChange={(e) => setForm({ ...form, yearsExperience: parseFloat(e.target.value) })}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <Button className="mt-4" onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isSuccess ? 'Saved!' : updateProfile.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="w-5 h-5" /> Connected Accounts</CardTitle></CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3"><Code2 className="w-5 h-5" /><div><p className="font-medium text-sm">GitHub</p>
                {github && <p className="text-xs text-muted">@{github.username} · {github.repos} repos · Score: {github.engineeringScore}</p>}</div></div>
              <Badge variant={provider === 'github' || github ? 'success' : 'default'}>{provider === 'github' || github ? 'Connected' : 'Not Connected'}</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3"><Globe className="w-5 h-5" /><p className="font-medium text-sm">Google</p></div>
              <Badge variant={provider === 'google' ? 'success' : 'default'}>{provider === 'google' ? 'Connected' : 'Not Connected'}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </QueryState>
  );
}
