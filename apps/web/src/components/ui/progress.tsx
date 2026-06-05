import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
}

export function Progress({ value, max = 100, className, color = 'bg-primary', showLabel }: ProgressProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted mt-1">{pct}%</span>
      )}
    </div>
  );
}
