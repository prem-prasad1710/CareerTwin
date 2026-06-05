'use client';

import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  data: Record<string, number>;
  className?: string;
}

const LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI/ML',
  cloud: 'Cloud',
  devops: 'DevOps',
  leadership: 'Leadership',
  communication: 'Communication',
  productThinking: 'Product',
  architecture: 'Architecture',
  data: 'Data',
};

export function CareerRadarChart({ data, className }: RadarChartProps) {
  const chartData = Object.entries(data)
    .filter(([key]) => key in LABELS)
    .map(([key, value]) => ({
      dimension: LABELS[key] || key,
      score: value,
      fullMark: 100,
    }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={320}>
        <RechartsRadar data={chartData} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#71717a', fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
