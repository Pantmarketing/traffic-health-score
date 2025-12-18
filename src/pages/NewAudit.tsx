import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Zap, Shield, Target, Search, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useAudits } from '@/hooks/useAudits';
import { questionGroups, getFilteredGroups, calculateScore } from '@/data/questions';
import { CircularProgress } from '@/components/CircularProgress';
import { toast } from 'sonner';

const iconMap = {
  shield: Shield,
  meta: Target,
  google: Search,
  dollar: DollarSign,
};

type Step = 1 | 2 | 3;

export default function NewAudit() {
  const { user, loading: authLoading } = useAuth();
  const { createAudit } = useAudits();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [projectName, setProjectName] = useState('');
  const [channels, setChannels] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const filteredGroups = getFilteredGroups(channels);
  const score = calculateScore(answers, channels);

  const handleChannelToggle = (channel: string) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const handleAnswerToggle = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!projectName.trim()) {
        toast.error('Digite o nome do projeto');
        return;
      }
      if (channels.length === 0) {
        toast.error('Selecione pelo menos um canal');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3) as Step);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const { error } = await createAudit(projectName, channels, answers, score);
    
    if (error) {
      toast.error('Erro ao salvar auditoria');
    } else {
      toast.success('Auditoria salva com sucesso!');
      navigate('/dashboard');
    }
    setIsSubmitting(false);
  };

  const getVerdict = () => {
    if (score < 60) return { label: 'CRÍTICO', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', desc: 'Risco de Bloqueio/Prejuízo' };
    if (score < 85) return { label: 'ATENÇÃO', color: 'text-warning', bg: 'bg-warning/10 border-warning/20', desc: 'Otimização Necessária' };
    return { label: 'BLINDADO', color: 'text-success', bg: 'bg-success/10 border-success/20', desc: 'Pronto para Escala' };
  };

  const verdict = getVerdict();

  if (authLoading) {
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
              Nova Auditoria
            </span>
          </div>

          <div className="w-20" />
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 rounded-full transition-all ${
                    step > s ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 mt-2 text-sm text-muted-foreground">
          <span className={step >= 1 ? 'text-foreground' : ''}>Configuração</span>
          <span className={step >= 2 ? 'text-foreground' : ''}>Checklist</span>
          <span className={step >= 3 ? 'text-foreground' : ''}>Resultado</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Step 1: Configuration */}
        {step === 1 && (
          <div className="glass-card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Configuração do Projeto
            </h2>
            <p className="text-muted-foreground mb-8">
              Defina o nome e os canais que serão auditados
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome do Projeto
                </label>
                <Input
                  placeholder="Ex: Campanha Black Friday 2024"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Quais canais vamos auditar?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={channels.includes('meta')}
                      onCheckedChange={() => handleChannelToggle('meta')}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Meta Ads</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={channels.includes('google')}
                      onCheckedChange={() => handleChannelToggle('google')}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Google Ads</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
              >
                Próximo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Checklist */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Checklist de Auditoria
              </h2>
              <p className="text-muted-foreground">
                Marque os itens que estão implementados corretamente
              </p>
            </div>

            {filteredGroups.map((group, index) => {
              const Icon = iconMap[group.icon];
              return (
                <div
                  key={group.id}
                  className="glass-card-hover p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {group.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {group.questions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <label
                          htmlFor={question.id}
                          className="text-sm text-secondary-foreground cursor-pointer flex-1 pr-4"
                        >
                          {question.label}
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-medium">
                            +{question.points}pts
                          </span>
                          <Switch
                            id={question.id}
                            checked={answers[question.id] || false}
                            onCheckedChange={() => handleAnswerToggle(question.id)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
              >
                Ver Resultado
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Resultado da Auditoria
              </h2>
              <p className="text-muted-foreground">{projectName}</p>
            </div>

            <div className="glass-card p-8">
              <div className="flex flex-col items-center">
                <CircularProgress
                  percentage={score}
                  verdict={score < 60 ? 'critical' : score < 85 ? 'warning' : 'success'}
                />

                <div
                  className={`mt-8 px-6 py-3 rounded-full border ${verdict.bg}`}
                >
                  <span className={`font-bold text-lg ${verdict.color}`}>
                    {verdict.label}
                  </span>
                </div>

                <p className="mt-4 text-muted-foreground text-center">
                  {verdict.desc}
                </p>

                {score < 85 && (
                  <Button
                    className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg animate-pulse-glow"
                  >
                    SOLICITAR ANÁLISE DO ESPECIALISTA
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-success hover:bg-success/90 text-foreground font-semibold gap-2"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Auditoria'}
                <Check className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
