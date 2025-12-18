import { useEffect, useState } from 'react';

export type VerdictType = 'critical' | 'warning' | 'success';

export interface CircularProgressProps {
  percentage: number;
  verdict: VerdictType;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  percentage,
  verdict,
  size = 200,
  strokeWidth = 12,
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getStrokeColor = () => {
    switch (verdict) {
      case 'critical':
        return 'hsl(var(--destructive))';
      case 'warning':
        return 'hsl(var(--warning))';
      case 'success':
        return 'hsl(var(--success))';
      default:
        return 'hsl(var(--primary))';
    }
  };

  const getGlowColor = () => {
    switch (verdict) {
      case 'critical':
        return 'drop-shadow(0 0 20px hsl(var(--destructive) / 0.5))';
      case 'warning':
        return 'drop-shadow(0 0 20px hsl(var(--warning) / 0.5))';
      case 'success':
        return 'drop-shadow(0 0 20px hsl(var(--success) / 0.5))';
      default:
        return 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))';
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: getGlowColor() }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-foreground tabular-nums">
          {animatedPercentage}
        </span>
        <span className="text-lg text-muted-foreground font-medium">%</span>
      </div>
    </div>
  );
}
