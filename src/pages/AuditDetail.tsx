import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Zap, Shield, Target, Search, DollarSign, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { questionGroups, getFilteredGroups } from '@/data/questions';
import { CircularProgress } from '@/components/CircularProgress';
import type { Audit } from '@/hooks/useAudits';

const iconMap = {
  shield: Shield,
  meta: Target,
  google: Search,
  dollar: DollarSign,
};

export default function AuditDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAudit = async () => {
      if (!id || !user) return;

      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        navigate('/dashboard');
        return;
      }

      setAudit(data as Audit);
      setLoading(false);
    };

    if (user) {
      fetchAudit();
    }
  }, [id, user, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!audit) return null;

  const filteredGroups = getFilteredGroups(audit.channels);
  const verdict = audit.score < 60 
    ? { label: 'CRÍTICO', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20' }
    : audit.score < 85 
    ? { label: 'ATENÇÃO', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' }
    : { label: 'BLINDADO', color: 'text-success', bg: 'bg-success/10 border-success/20' };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-wider text-foreground">
              {audit.project_name}
            </span>
          </div>

          <div className="w-20" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Score Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-24">
              <div className="flex flex-col items-center">
                <CircularProgress
                  percentage={audit.score}
                  verdict={audit.score < 60 ? 'critical' : audit.score < 85 ? 'warning' : 'success'}
                />

                <div className={`mt-6 px-4 py-2 rounded-full border ${verdict.bg}`}>
                  <span className={`font-bold ${verdict.color}`}>
                    {verdict.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(audit.created_at).toLocaleDateString('pt-BR')}
                </div>

                <div className="flex gap-2 mt-4">
                  {audit.channels.map((channel) => (
                    <span
                      key={channel}
                      className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground capitalize"
                    >
                      {channel === 'meta' ? 'Meta Ads' : 'Google Ads'}
                    </span>
                  ))}
                </div>

                {audit.score < 85 && (
                  <Button className="mt-8 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    SOLICITAR ANÁLISE
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Checklist Details */}
          <div className="lg:col-span-2 space-y-6">
            {filteredGroups.map((group, index) => {
              const Icon = iconMap[group.icon];
              const approvedCount = group.questions.filter(
                (q) => audit.answers[q.id]
              ).length;

              return (
                <div
                  key={group.id}
                  className="glass-card p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {group.title}
                      </h3>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {approvedCount}/{group.questions.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.questions.map((question) => {
                      const isChecked = audit.answers[question.id];
                      return (
                        <div
                          key={question.id}
                          className={`flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${
                            isChecked
                              ? 'bg-success/10 border border-success/20'
                              : 'bg-destructive/10 border border-destructive/20'
                          }`}
                        >
                          <span className="text-sm text-foreground">
                            {question.label}
                          </span>
                          <div
                            className={`p-1 rounded-full ${
                              isChecked ? 'bg-success/20' : 'bg-destructive/20'
                            }`}
                          >
                            {isChecked ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <X className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
