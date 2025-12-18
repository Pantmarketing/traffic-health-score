import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, TrendingUp, Trash2, LogOut, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAudits } from '@/hooks/useAudits';
import { toast } from 'sonner';

function getVerdictColor(score: number) {
  if (score < 60) return 'text-destructive';
  if (score < 85) return 'text-warning';
  return 'text-success';
}

function getVerdictBg(score: number) {
  if (score < 60) return 'bg-destructive/10 border-destructive/20';
  if (score < 85) return 'bg-warning/10 border-warning/20';
  return 'bg-success/10 border-success/20';
}

function getVerdictLabel(score: number) {
  if (score < 60) return 'Crítico';
  if (score < 85) return 'Atenção';
  return 'Blindado';
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { audits, loading: auditsLoading, deleteAudit } = useAudits();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Até logo!');
    navigate('/auth');
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteAudit(id);
    if (error) {
      toast.error('Erro ao excluir auditoria');
    } else {
      toast.success('Auditoria excluída');
    }
  };

  if (authLoading || auditsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-wider text-foreground">
              TRAFFIC <span className="text-primary">INTELLIGENCE</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Minhas Auditorias</h1>
            <p className="text-muted-foreground mt-1">
              {audits.length} projeto{audits.length !== 1 ? 's' : ''} auditado
              {audits.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={() => navigate('/audit/new')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
          >
            <Plus className="w-5 h-5" />
            NOVA AUDITORIA
          </Button>
        </div>

        {audits.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhuma auditoria ainda
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece criando sua primeira auditoria de tráfego
            </p>
            <Button
              onClick={() => navigate('/audit/new')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar primeira auditoria
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="glass-card-hover p-6 cursor-pointer group"
                onClick={() => navigate(`/audit/${audit.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {audit.project_name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(audit.id);
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(audit.created_at).toLocaleDateString('pt-BR')}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {audit.channels.map((channel) => (
                    <span
                      key={channel}
                      className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground capitalize"
                    >
                      {channel === 'meta' ? 'Meta Ads' : 'Google Ads'}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <span className={`text-3xl font-bold tabular-nums ${getVerdictColor(audit.score)}`}>
                    {audit.score}%
                  </span>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium ${getVerdictBg(audit.score)} ${getVerdictColor(audit.score)}`}
                  >
                    {getVerdictLabel(audit.score)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
