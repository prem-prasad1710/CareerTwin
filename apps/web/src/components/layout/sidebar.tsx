'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Dna, DollarSign, FlaskConical, TrendingUp,
  Clock, MessageSquare, Briefcase, GraduationCap, Settings,
  Share2, Brain, Shield, Target, LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/career-dna', label: 'Career DNA', icon: Dna },
  { href: '/dashboard/market-value', label: 'Market Value', icon: DollarSign },
  { href: '/dashboard/simulator', label: 'Simulator', icon: FlaskConical },
  { href: '/dashboard/predictions', label: 'Predictions', icon: TrendingUp },
  { href: '/dashboard/timeline', label: 'Timeline', icon: Clock },
  { href: '/dashboard/coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/dashboard/jobs', label: 'Job Matches', icon: Briefcase },
  { href: '/dashboard/learning', label: 'Learning', icon: GraduationCap },
  { href: '/dashboard/memory', label: 'Career Memory', icon: Brain },
  { href: '/dashboard/risks', label: 'Risk Detector', icon: Shield },
  { href: '/dashboard/share', label: 'Share Cards', icon: Share2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-sidebar flex flex-col z-50">
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">CareerTwin</h1>
            <p className="text-[10px] text-muted">AI Career Intelligence</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted hover:text-foreground hover:bg-white/5',
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-3">
        {session?.user && (
          <div className="glass rounded-xl p-3">
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-lg" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {session.user.name?.[0] || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{session.user.name}</p>
                <p className="text-[10px] text-muted truncate capitalize">{session.user.provider || 'user'}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
