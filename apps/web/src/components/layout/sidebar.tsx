'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Dna, DollarSign, FlaskConical, TrendingUp,
  Clock, MessageSquare, Briefcase, GraduationCap, Settings,
  Share2, Brain, Shield, Target, LogOut, BookOpen, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/career-dna', label: 'Career DNA', icon: Dna },
  { href: '/dashboard/market-value', label: 'Market Value', icon: DollarSign },
  { href: '/dashboard/simulator', label: 'Simulator', icon: FlaskConical },
  { href: '/dashboard/predictions', label: 'Predictions', icon: TrendingUp },
  { href: '/dashboard/timeline', label: 'Timeline', icon: Clock },
  { href: '/dashboard/coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/dashboard/jobs', label: 'Job Tracker', icon: Briefcase },
  { href: '/dashboard/learning', label: 'Learning', icon: GraduationCap },
  { href: '/dashboard/goals', label: 'Goals', icon: Target },
  { href: '/dashboard/memory', label: 'Career Memory', icon: Brain },
  { href: '/dashboard/risks', label: 'Risk Detector', icon: Shield },
  { href: '/dashboard/share', label: 'Share Cards', icon: Share2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn('sidebar-overlay md:hidden', open && 'open')}
        onClick={onClose}
      />

      <aside className={cn(
        'fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-sidebar flex flex-col z-50 transition-transform duration-300',
        'sidebar-fixed md:translate-x-0',
        open && 'translate-x-0',
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight">CareerTwin</h1>
              <p className="text-[10px] text-muted">AI Career Intelligence</p>
            </div>
          </Link>
          <button onClick={onClose} className="md:hidden text-muted hover:text-foreground p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium border border-primary/10'
                    : 'text-muted hover:text-foreground hover:bg-white/[0.04]',
                )}
              >
                <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-primary')} />
                <span className="truncate">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {session?.user && (
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2.5">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{session.user.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="status-dot online" />
                    <p className="text-[10px] text-muted capitalize">{session.user.provider || 'user'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
