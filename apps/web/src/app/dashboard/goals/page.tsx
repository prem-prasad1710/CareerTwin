'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { Modal } from '@/components/ui/modal';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/use-career-api';
import { useToast } from '@/components/ui/toast';
import { Target, Plus, Pencil, Trash2, CheckCircle, Pause, PlayCircle, TrendingUp } from 'lucide-react';
import type { CareerGoal } from '@/lib/api-types';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', variant: 'success' as const, icon: PlayCircle, color: 'text-emerald-400' },
  COMPLETED: { label: 'Completed', variant: 'default' as const, icon: CheckCircle, color: 'text-indigo-400' },
  PAUSED: { label: 'Paused', variant: 'warning' as const, icon: Pause, color: 'text-amber-400' },
  ABANDONED: { label: 'Abandoned', variant: 'danger' as const, icon: Trash2, color: 'text-red-400' },
};

const EMPTY_FORM = { title: '', description: '', targetRole: '', targetDate: '', progress: 0, status: 'ACTIVE' };

export default function GoalsPage() {
  const { data: goals, isLoading, isError, error } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CareerGoal | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (g: CareerGoal) => {
    setEditing(g);
    setForm({
      title: g.title,
      description: g.description || '',
      targetRole: g.targetRole || '',
      targetDate: g.targetDate ? new Date(g.targetDate).toISOString().split('T')[0] : '',
      progress: g.progress,
      status: g.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateGoal.mutateAsync({ goalId: editing.id, data: form });
        toast.success('Goal updated!');
      } else {
        await createGoal.mutateAsync(form);
        toast.success('Goal created!', 'Keep going — you got this!');
      }
      setShowModal(false);
    } catch {
      toast.error('Something went wrong', 'Please try again');
    }
  };

  const handleDelete = async (g: CareerGoal) => {
    if (!confirm(`Delete "${g.title}"?`)) return;
    try {
      await deleteGoal.mutateAsync(g.id);
      toast.success('Goal removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleProgress = async (g: CareerGoal, delta: number) => {
    const progress = Math.max(0, Math.min(100, g.progress + delta));
    const status = progress === 100 ? 'COMPLETED' : g.status;
    await updateGoal.mutateAsync({ goalId: g.id, data: { progress, status } });
    if (progress === 100) toast.success('Goal completed! 🎉', 'Amazing work!');
  };

  const active = goals?.filter((g) => g.status === 'ACTIVE') ?? [];
  const completed = goals?.filter((g) => g.status === 'COMPLETED') ?? [];
  const paused = goals?.filter((g) => g.status === 'PAUSED') ?? [];

  return (
    <>
      <QueryState isLoading={isLoading} isError={isError} error={error}>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Career Goals
              </h1>
              <p className="text-muted mt-1">Track your career milestones and progress</p>
            </div>
            <Button onClick={openCreate} className="flex items-center gap-2 self-start sm:self-auto">
              <Plus className="w-4 h-4" /> New Goal
            </Button>
          </div>

          {/* Stats */}
          {goals && goals.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total', value: goals.length, icon: '🎯' },
                { label: 'Active', value: active.length, icon: '🚀' },
                { label: 'Completed', value: completed.length, icon: '✅' },
                { label: 'Avg Progress', value: `${Math.round((goals.reduce((s, g) => s + g.progress, 0) / goals.length) || 0)}%`, icon: '📈' },
              ].map((s) => (
                <Card key={s.label} className="text-center py-5">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs text-muted mt-0.5">{s.label}</div>
                </Card>
              ))}
            </div>
          )}

          {/* Active Goals */}
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Active Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {active.map((g) => <GoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={handleDelete} onProgress={handleProgress} />)}
              </div>
            </div>
          )}

          {/* Paused */}
          {paused.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Paused</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paused.map((g) => <GoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={handleDelete} onProgress={handleProgress} />)}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completed.map((g) => <GoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={handleDelete} onProgress={handleProgress} />)}
              </div>
            </div>
          )}

          {/* Empty */}
          {(!goals || goals.length === 0) && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted text-sm mb-6">Set your first career goal and start tracking progress</p>
              <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Create Your First Goal</Button>
            </div>
          )}
        </div>
      </QueryState>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Goal' : 'New Career Goal'}
        description={editing ? 'Update your goal details' : 'Define what you want to achieve'}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted block mb-1.5">Goal Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Become a Staff Engineer at a top tech company"
              className="input-base"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does success look like?"
              rows={3}
              className="input-base resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1.5">Target Role</label>
              <input
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                placeholder="Staff Engineer"
                className="input-base"
              />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Target Date</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="input-base"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Progress — {form.progress}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>
          {editing && (
            <div>
              <label className="text-xs text-muted block mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-base"
              >
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="COMPLETED">Completed</option>
                <option value="ABANDONED">Abandoned</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!form.title.trim() || createGoal.isPending || updateGoal.isPending}
              className="flex-1"
            >
              {createGoal.isPending || updateGoal.isPending ? 'Saving...' : editing ? 'Update Goal' : 'Create Goal'}
            </Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function GoalCard({
  goal, onEdit, onDelete, onProgress,
}: {
  goal: CareerGoal;
  onEdit: (g: CareerGoal) => void;
  onDelete: (g: CareerGoal) => void;
  onProgress: (g: CareerGoal, delta: number) => void;
}) {
  const cfg = STATUS_CONFIG[goal.status];
  const StatusIcon = cfg.icon;
  const daysLeft = goal.targetDate
    ? Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / 86_400_000))
    : null;

  return (
    <Card className="card-hover gradient-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
          <Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(goal)} className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(goal)} className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold mb-1 leading-snug">{goal.title}</h3>
      {goal.description && <p className="text-xs text-muted mb-3">{goal.description}</p>}

      <div className="flex items-center gap-2 mb-3">
        {goal.targetRole && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            → {goal.targetRole}
          </span>
        )}
        {daysLeft !== null && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${daysLeft <= 30 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-muted border-white/10'}`}>
            {daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Progress</span>
          <span className="font-semibold">{goal.progress}%</span>
        </div>
        <Progress value={goal.progress} color={goal.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'} />
      </div>

      {goal.status === 'ACTIVE' && goal.progress < 100 && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onProgress(goal, 10)}
            className="text-xs flex-1 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
          >
            +10%
          </button>
          <button
            onClick={() => onProgress(goal, 25)}
            className="text-xs flex-1 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
          >
            +25%
          </button>
          <button
            onClick={() => onProgress(goal, 100 - goal.progress)}
            className="text-xs flex-1 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            Complete ✓
          </button>
        </div>
      )}
    </Card>
  );
}
