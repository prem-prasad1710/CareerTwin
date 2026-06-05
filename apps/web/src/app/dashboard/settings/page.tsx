'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Link2, Code2, Globe, FileText } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> Settings
        </h1>
        <p className="text-muted mt-1">Manage your profile, integrations, and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your basic career information</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Current Role', value: 'Software Engineer' },
            { label: 'Company', value: 'Tech Corp' },
            { label: 'Location', value: 'San Francisco, CA' },
            { label: 'Experience', value: '3 years' },
            { label: 'Target Role', value: 'Senior Software Engineer' },
            { label: 'Dream Company', value: 'Google' },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs text-muted">{field.label}</label>
              <input
                defaultValue={field.value}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          ))}
        </div>
        <Button className="mt-4">Save Profile</Button>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Link2 className="w-5 h-5" /> Integrations</CardTitle>
          <CardDescription>Connect external profiles to enrich your Career Twin</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {[
            { name: 'GitHub', icon: Code2, status: 'Connected', username: 'demo-user' },
            { name: 'LinkedIn', icon: Globe, status: 'Not Connected', username: null },
            { name: 'Resume', icon: FileText, status: 'Not Uploaded', username: null },
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <integration.icon className="w-5 h-5 text-muted" />
                <div>
                  <p className="font-medium text-sm">{integration.name}</p>
                  {integration.username && <p className="text-xs text-muted">@{integration.username}</p>}
                </div>
              </div>
              <Badge variant={integration.status === 'Connected' ? 'success' : 'default'}>
                {integration.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Preferences</CardTitle>
          <CardDescription>Configure AI provider and agent behavior</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted">Preferred AI Provider</label>
            <select className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none">
              <option>OpenAI GPT-4o</option>
              <option>Claude Sonnet</option>
              <option>Google Gemini</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Default AI Agent</label>
            <select className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none">
              <option>Career Coach</option>
              <option>Interview Coach</option>
              <option>Learning Mentor</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
