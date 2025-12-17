import { Activity, User, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gold-gradient gold-glow">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">
              <span className="gold-text">TRAFFIC</span>
              <span className="text-foreground ml-1">INTELLIGENCE</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Audit System
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="ml-2 pl-4 border-l border-border/50 flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Premium</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
