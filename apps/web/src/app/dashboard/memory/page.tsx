'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QueryState, Spinner } from '@/components/ui/query-state';
import { useMemories } from '@/hooks/use-career-api';
import { useCareerUserId } from '@/hooks/use-career-user';
import { api } from '@/lib/api';
import { Brain, Search } from 'lucide-react';
import type { CareerMemory } from '@/lib/api-types';

const TYPE_COLORS: Record<string, 'success' | 'warning' | 'accent' | 'danger' | 'default'> = {
  INTERVIEW: 'accent', ACHIEVEMENT: 'success', LESSON: 'warning', PROMOTION: 'success', FAILURE: 'danger', PROJECT: 'default',
};

export default function MemoryPage() {
  const userId = useCareerUserId();
  const { data: memories, isLoading, isError, error } = useMemories();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CareerMemory[] | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!userId || !query) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const res = await api.searchMemories(userId, query) as { results: typeof searchResults };
      setSearchResults(res.results);
    } catch { setSearchResults([]); }
    setSearching(false);
  };

  const display = searchResults ?? memories ?? [];

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Brain className="w-8 h-8 text-primary" /> Career Memory</h1>
          <p className="text-muted mt-1">Searchable history of your career events and lessons</p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What did I learn during my Paytm interview?"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50" />
          </div>
          <Button onClick={handleSearch} disabled={searching}>{searching ? 'Searching...' : 'Search'}</Button>
        </div>
        {searching ? <Spinner /> : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-4">
              {display.map((memory) => (
                <Card key={memory.id} className="ml-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2 -ml-[1.65rem] relative z-10" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={TYPE_COLORS[memory.type] || 'default'}>{memory.type}</Badge>
                        <span className="text-xs text-muted">{new Date(memory.occurredAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold">{memory.title}</h3>
                      <p className="text-sm text-muted mt-1">{memory.content}</p>
                      <div className="flex gap-1 mt-2">{memory.tags?.map((tag) => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted">#{tag}</span>)}</div>
                    </div>
                  </div>
                </Card>
              ))}
              {display.length === 0 && <p className="text-muted text-center py-8">No memories found</p>}
            </div>
          </div>
        )}
      </div>
    </QueryState>
  );
}
