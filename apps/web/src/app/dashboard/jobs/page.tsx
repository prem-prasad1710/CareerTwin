'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { Modal } from '@/components/ui/modal';
import {
  useJobMatches, useApplications, useApplicationStats,
  useCreateApplication, useUpdateApplication, useDeleteApplication,
} from '@/hooks/use-career-api';
import { useToast } from '@/components/ui/toast';
import {
  Briefcase, Plus, Star, MapPin, DollarSign,
  TrendingUp, Trash2, ExternalLink, Kanban, LayoutList,
} from 'lucide-react';
import type { JobApplication, JobMatch } from '@/lib/api-types';
import { formatCurrency } from '@/lib/utils';

const STATUS_PIPELINE = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED'] as const;
type AppStatus = typeof STATUS_PIPELINE[number];

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'accent' }> = {
  APPLIED:   { label: 'Applied',      color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20',  variant: 'accent' },
  SCREENING: { label: 'Screening',    color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',    variant: 'warning' },
  INTERVIEW: { label: 'Interview',    color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20',  variant: 'accent' },
  OFFER:     { label: 'Offer! 🎉',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',variant: 'success' },
  REJECTED:  { label: 'Rejected',     color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',        variant: 'danger' },
};

const EMPTY_FORM = { company: '', role: '', location: '', salary: '', jobUrl: '', notes: '', status: 'APPLIED' };

type Tab = 'matches' | 'tracker';

export default function JobsPage() {
  const [tab, setTab] = useState<Tab>('matches');
  const [showModal, setShowModal] = useState(false);
  const [editApp, setEditApp] = useState<JobApplication | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: matches, isLoading: matchesLoading, isError: matchesError, error: matchesErr } = useJobMatches();
  const { data: apps, isLoading: appsLoading, isError: appsError, error: appsErr } = useApplications();
  const { data: stats } = useApplicationStats();
  const createApp = useCreateApplication();
  const updateApp = useUpdateApplication();
  const deleteApp = useDeleteApplication();
  const toast = useToast();

  const openCreate = () => { setEditApp(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (a: JobApplication) => {
    setEditApp(a);
    setForm({ company: a.company, role: a.role, location: a.location || '', salary: String(a.salary || ''), jobUrl: a.jobUrl || '', notes: a.notes || '', status: a.status });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      salary: form.salary ? Number(form.salary) : undefined,
    };
    try {
      if (editApp) {
        await updateApp.mutateAsync({ appId: editApp.id, data });
        toast.success('Application updated');
      } else {
        await createApp.mutateAsync(data);
        toast.success('Application added!', `${form.company} — ${form.role}`);
      }
      setShowModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (a: JobApplication) => {
    if (!confirm(`Remove ${a.company}?`)) return;
    await deleteApp.mutateAsync(a.id);
    toast.success('Application removed');
  };

  const handleStatusChange = async (a: JobApplication, status: AppStatus) => {
    await updateApp.mutateAsync({ appId: a.id, data: { status } });
    if (status === 'OFFER') toast.success('Offer received! 🎉', `${a.company} — ${a.role}`);
  };

  const addFromMatch = (m: JobMatch) => {
    setEditApp(null);
    setForm({ company: m.company, role: m.role, location: m.location, salary: String(Math.round((m.salary.min + m.salary.max) / 2)), jobUrl: '', notes: '', status: 'APPLIED' });
    setShowModal(true);
    setTab('tracker');
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              Job Center
            </h1>
            <p className="text-muted mt-1">AI job matches + application tracker</p>
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Track Application
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-xl w-fit">
          {[
            { id: 'matches' as Tab, label: 'AI Matches', icon: Star },
            { id: 'tracker' as Tab, label: 'My Applications', icon: Kanban },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tab === t.id ? 'tab-active font-medium' : 'text-muted hover:text-foreground'}`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.id === 'tracker' && stats?.total ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">{stats.total}</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* AI Matches */}
        {tab === 'matches' && (
          <QueryState isLoading={matchesLoading} isError={matchesError} error={matchesErr} isEmpty={!matches?.length} emptyMessage="No job matches yet. Complete your profile for personalized matches.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches?.map((job, i) => (
                <Card key={i} className="card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-indigo-400">
                      {job.company[0]}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">{job.matchScore}% match</span>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400">{job.successProbability}%</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-0.5">{job.role}</h3>
                  <p className="text-sm text-muted mb-3">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(job.salary.min)}–{formatCurrency(job.salary.max)}</span>
                  </div>
                  <Progress value={job.matchScore} className="mb-3" color="bg-indigo-500" />
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.strengths.slice(0, 3).map((s) => <Badge key={s} variant="success" className="text-[10px]">{s}</Badge>)}
                    {job.missingSkills.slice(0, 2).map((s) => <Badge key={s} variant="warning" className="text-[10px]">{s}</Badge>)}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => addFromMatch(job)}
                  >
                    + Track This Application
                  </Button>
                </Card>
              ))}
            </div>
          </QueryState>
        )}

        {/* Tracker */}
        {tab === 'tracker' && (
          <QueryState isLoading={appsLoading} isError={appsError} error={appsErr}>
            {/* Stats */}
            {stats && stats.total > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Applied', value: stats.total },
                  { label: 'In Interview', value: stats.interviewing, highlight: true },
                  { label: 'Offers', value: stats.offers, success: true },
                  { label: 'Response Rate', value: `${stats.responseRate}%` },
                ].map((s) => (
                  <Card key={s.label} className="text-center py-4">
                    <div className={`text-2xl font-bold mb-0.5 ${s.success ? 'text-emerald-400' : s.highlight ? 'gradient-text' : ''}`}>
                      {s.value}
                    </div>
                    <div className="text-xs text-muted">{s.label}</div>
                  </Card>
                ))}
              </div>
            )}

            {/* Kanban pipeline */}
            {apps && apps.length > 0 ? (
              <div className="space-y-6">
                {STATUS_PIPELINE.filter((s) => apps.some((a) => a.status === s)).map((status) => {
                  const group = apps.filter((a) => a.status === status);
                  if (!group.length) return null;
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <div key={status}>
                      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${cfg.color}`}>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${cfg.bg}`}>{cfg.label}</span>
                        <span className="text-muted font-normal">{group.length}</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.map((a) => (
                          <AppCard key={a.id} app={a} onEdit={openEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <LayoutList className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">No applications yet</h3>
                <p className="text-muted text-sm mb-6">Start tracking your job applications to see progress</p>
                <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add First Application</Button>
              </div>
            )}
          </QueryState>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editApp ? 'Edit Application' : 'Track New Application'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1.5">Company *</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Google" className="input-base" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Role *</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Software Engineer" className="input-base" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote / NYC" className="input-base" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-base">
                {STATUS_PIPELINE.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted block mb-1.5">Salary (annual)</label>
              <input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="120000" className="input-base" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Job URL</label>
            <input value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} placeholder="https://jobs.company.com/..." className="input-base" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Interview tips, contacts, timeline..." className="input-base resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit} disabled={!form.company.trim() || !form.role.trim()} className="flex-1">
              {createApp.isPending || updateApp.isPending ? 'Saving...' : editApp ? 'Update' : 'Add Application'}
            </Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function AppCard({
  app, onEdit, onDelete, onStatusChange,
}: {
  app: JobApplication;
  onEdit: (a: JobApplication) => void;
  onDelete: (a: JobApplication) => void;
  onStatusChange: (a: JobApplication, s: AppStatus) => void;
}) {
  const cfg = STATUS_CONFIG[app.status as AppStatus];
  const NEXT: Record<AppStatus, AppStatus | null> = {
    APPLIED: 'SCREENING', SCREENING: 'INTERVIEW', INTERVIEW: 'OFFER', OFFER: null, REJECTED: null,
  };
  const nextStatus = NEXT[app.status as AppStatus];

  return (
    <Card className="card-hover group">
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-white/10">
          {app.company[0]}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(app)} className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors">
            <TrendingUp className="w-3 h-3" />
          </button>
          {app.jobUrl && (
            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button onClick={() => onDelete(app)} className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className="font-medium text-sm">{app.role}</p>
      <p className="text-xs text-muted">{app.company}</p>
      {app.location && <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{app.location}</p>}
      {app.salary && (
        <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
          <DollarSign className="w-2.5 h-2.5" />
          {formatCurrency(app.salary)}
        </p>
      )}
      <p className="text-[10px] text-muted mt-2">{new Date(app.appliedAt).toLocaleDateString()}</p>
      {nextStatus && (
        <button
          onClick={() => onStatusChange(app, nextStatus)}
          className={`mt-2 w-full text-[10px] py-1.5 rounded-lg border transition-colors ${STATUS_CONFIG[nextStatus].bg} ${STATUS_CONFIG[nextStatus].color}`}
        >
          Move to {STATUS_CONFIG[nextStatus].label} →
        </button>
      )}
    </Card>
  );
}
