'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QueryState, Spinner } from '@/components/ui/query-state';
import { Modal } from '@/components/ui/modal';
import { useMemories, useCreateMemory } from '@/hooks/use-career-api';
import { useCareerUserId } from '@/hooks/use-career-user';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { Brain, Search, Plus, Sparkles } from 'lucide-react';
import type { CareerMemory } from '@/lib/api-types';

const TYPE_COLORS: Record<string, 'success' | 'warning' | 'accent' | 'danger' | 'default'> = {
  INTERVIEW: 'accent',
  ACHIEVEMENT: 'success',
  LESSON: 'warning',
  PROMOTION: 'success',
  FAILURE: 'danger',
  PROJECT: 'default',
  NETWORKING: 'accent',
  FEEDBACK: 'warning',
  MILESTONE: 'success',
};

const MEMORY_TYPES = ['INTERVIEW', 'ACHIEVEMENT', 'LESSON', 'PROMOTION', 'FAILURE', 'PROJECT', 'NETWORKING', 'FEEDBACK', 'MILESTONE'];

const EMPTY_FORM = { type: 'LESSON', title: '', content: '', tags: '', occurredAt: new Date().toISOString().split('T')[0] };

export default function MemoryPage() {
  const userId = useCareerUserId();
  const { data: memories, isLoading, isError, error } = useMemories();
  const createMemory = useCreateMemory();
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CareerMemory[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSearch = async () => {
    if (!userId || !query.trim()) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const res = await api.searchMemories(userId, query) as { results: CareerMemory[] };
      setSearchResults(res.results);
    } catch { setSearchResults([]); }
    setSearching(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    try {
      await createMemory.mutateAsync({
        type: form.type,
        title: form.title,
        content: form.content,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        occurredAt: form.occurredAt,
      });
      toast.success('Memory saved!', form.title);
      setShowModal(false);
      setForm(EMPTY_FORM);
      setSearchResults(null);
    } catch {
      toast.error('Failed to save memory');
    }
  };

  const display = searchResults ?? memories ?? [];

  return (
    <>
      <QueryState isLoading={isLoading} isError={isError} error={error}>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                Career Memory
              </h1>
              <p className="text-muted mt-1">AI-searchable history of your career events and lessons</p>
            </div>
            <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 self-start sm:self-auto">
              <Plus className="w-4 h-4" /> Add Memory
            </Button>
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setSearchResults(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="What did I learn during my FAANG interview?"
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
              />
            </div>
            <Button onClick={handleSearch} disabled={searching} variant={searchResults !== null ? 'secondary' : 'primary'}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
            {searchResults !== null && (
              <Button variant="ghost" onClick={() => { setSearchResults(null); setQuery(''); }}>Clear</Button>
            )}
          </div>

          {/* Stats */}
          {memories && memories.length > 0 && searchResults === null && (
            <div className="flex flex-wrap gap-3">
              {Object.entries(
                memories.reduce<Record<string, number>>((acc, m) => ({ ...acc, [m.type]: (acc[m.type] || 0) + 1 }), {})
              ).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full text-xs">
                  <Badge variant={TYPE_COLORS[type] || 'default'} className="text-[10px] !px-1.5">{type}</Badge>
                  <span className="text-muted">×{count}</span>
                </div>
              ))}
            </div>
          )}

          {searching ? (
            <Spinner />
          ) : (
            <div className="relative">
              {display.length > 0 && <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-white/10 to-transparent" />}
              <div className="space-y-4">
                {display.map((memory, i) => (
                  <Card key={memory.id} className={`ml-4 card-hover animate-fade-in animation-delay-${Math.min(i * 100, 300)}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mt-2 -ml-[1.65rem] relative z-10 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={TYPE_COLORS[memory.type] || 'default'}>{memory.type}</Badge>
                          <span className="text-xs text-muted">{new Date(memory.occurredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h3 className="font-semibold mb-1">{memory.title}</h3>
                        <p className="text-sm text-muted leading-relaxed">{memory.content}</p>
                        {memory.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {memory.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted hover:bg-white/10 cursor-pointer" onClick={() => { setQuery(tag); }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {display.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-7 h-7 text-purple-400" />
                    </div>
                    <p className="text-muted">
                      {searchResults !== null ? `No memories found for "${query}"` : 'No memories yet — start logging your career journey!'}
                    </p>
                    {searchResults === null && (
                      <Button onClick={() => setShowModal(true)} className="mt-4" variant="secondary">
                        <Plus className="w-4 h-4 mr-2" />Add Your First Memory
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </QueryState>

      {/* Add Memory Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add Career Memory"
        description="Log a career event, lesson, or achievement"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-base">
                {MEMORY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Date</label>
              <input type="date" value={form.occurredAt} onChange={(e) => setForm({ ...form, occurredAt: e.target.value })} className="input-base" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Final round at Google — system design" className="input-base" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Details</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} placeholder="What happened? What did you learn? What would you do differently?" className="input-base resize-none" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="google, system-design, distributed-systems" className="input-base" />
          </div>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleCreate} disabled={!form.title.trim() || createMemory.isPending} className="flex-1">
              {createMemory.isPending ? 'Saving...' : 'Save Memory'}
            </Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
