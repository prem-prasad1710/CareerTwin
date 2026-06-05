'use client';

import { cn } from '@/lib/utils';
import { Card } from './card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
          {trend && (
            <p className={cn('text-xs mt-2 font-medium', trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
