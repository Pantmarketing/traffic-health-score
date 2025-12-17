import { ClipboardCheck, History, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: typeof ClipboardCheck;
}

const navItems: NavItem[] = [
  { id: 'auditoria', label: 'Auditoria', icon: ClipboardCheck },
  { id: 'historico', label: 'Histórico', icon: History },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export function Sidebar({ activeItem = 'auditoria', onItemClick }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border/50 bg-sidebar h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 border border-primary/30 text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Versão Premium</p>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-full gold-gradient animate-shimmer" />
          </div>
        </div>
      </div>
    </aside>
  );
}
