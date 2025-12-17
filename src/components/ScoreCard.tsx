import { CircularProgress } from './CircularProgress';
import { AlertTriangle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Verdict, VerdictType } from '@/hooks/useAuditScore';

interface ScoreCardProps {
  percentage: number;
  checkedCount: number;
  totalCount: number;
  verdict: Verdict;
}

const verdictConfig: Record<
  VerdictType,
  { icon: typeof AlertTriangle; bgClass: string; borderClass: string; textClass: string }
> = {
  critical: {
    icon: XCircle,
    bgClass: 'bg-destructive/10',
    borderClass: 'border-destructive/30',
    textClass: 'text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-warning/10',
    borderClass: 'border-warning/30',
    textClass: 'text-warning',
  },
  success: {
    icon: CheckCircle2,
    bgClass: 'bg-success/10',
    borderClass: 'border-success/30',
    textClass: 'text-success',
  },
};

export function ScoreCard({ percentage, checkedCount, totalCount, verdict }: ScoreCardProps) {
  const config = verdictConfig[verdict.type];
  const VerdictIcon = config.icon;
  const showCTA = percentage < 85;

  return (
    <div className="glass-card p-6 space-y-6 sticky top-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-1">Saúde da Conta</h2>
        <p className="text-sm text-muted-foreground">
          {checkedCount} de {totalCount} itens verificados
        </p>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center py-4">
        <CircularProgress percentage={percentage} verdictType={verdict.type} />
      </div>

      {/* Verdict Card */}
      <div
        className={`p-4 rounded-lg border ${config.bgClass} ${config.borderClass} transition-all duration-300`}
      >
        <div className="flex items-center gap-3 mb-2">
          <VerdictIcon className={`w-5 h-5 ${config.textClass}`} />
          <span className={`font-bold text-lg ${config.textClass}`}>{verdict.title}</span>
        </div>
        <p className="text-sm text-muted-foreground">{verdict.description}</p>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Pontuação</span>
          <span className="font-semibold text-foreground tabular-nums">
            {percentage}/100
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className={`font-medium ${config.textClass}`}>
            {verdict.type === 'success'
              ? 'Otimizado'
              : verdict.type === 'warning'
              ? 'Parcial'
              : 'Crítico'}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      {showCTA && (
        <Button
          className="w-full gold-gradient text-primary-foreground font-semibold py-6 gold-glow hover:opacity-90 transition-opacity group"
          size="lg"
        >
          <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          SOLICITAR ANÁLISE DO ESPECIALISTA
        </Button>
      )}

      {/* Success Message */}
      {!showCTA && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Conta Blindada!</span>
          </div>
        </div>
      )}
    </div>
  );
}
