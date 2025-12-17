import { Shield, Target, Search, DollarSign } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { AuditCategory } from '@/hooks/useAuditScore';

interface AuditCardProps {
  category: AuditCategory;
  onToggle: (categoryId: string, itemId: string) => void;
  index: number;
}

const iconMap = {
  shield: Shield,
  target: Target,
  search: Search,
  dollar: DollarSign,
};

export function AuditCard({ category, onToggle, index }: AuditCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] || Shield;
  const checkedCount = category.items.filter((item) => item.checked).length;
  const totalCount = category.items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div
      className="glass-card-hover p-6 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{category.title}</h3>
            <p className="text-xs text-muted-foreground">
              {checkedCount}/{totalCount} verificados
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-4">
        {category.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
          >
            <label
              htmlFor={item.id}
              className="text-sm text-secondary-foreground cursor-pointer flex-1 pr-4 group-hover:text-foreground transition-colors"
            >
              {item.label}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                +{item.points}pts
              </span>
              <Switch
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => onToggle(category.id, item.id)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
