
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auditQuestions as allQuestions, ActionPlan } from "@/data/questions";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info, Store, Briefcase, Users, Radio } from "lucide-react";

// --- Interfaces --- //
type Stage = 'businessModel' | 'channel' | 'questions';
type Channel = 'Meta Ads' | 'Google Ads' | 'Ambos';
type BusinessModel = 'Produtos' | 'Serviços' | 'Acesso' | 'Audiência';

interface EnrichedRisk {
  questionText: string;
  userAnswerText: string;
  actionPlan: ActionPlan;
}

const businessModels = [
  {
    name: 'Produtos' as BusinessModel,
    description: 'O cliente paga e vira dono do item (Físico ou Digital). E-commerce, delivery ou infoprodutos.',
    icon: Store,
  },
  {
    name: 'Serviços' as BusinessModel,
    description: 'O cliente paga pelo seu tempo ou intelecto. Consultorias, agências ou profissionais liberais.',
    icon: Briefcase,
  },
  {
    name: 'Acesso' as BusinessModel,
    description: 'O valor está em participar ou pertencer. Eventos, assinaturas, comunidades ou ingressos.',
    icon: Users,
  },
  {
    name: 'Audiência' as BusinessModel,
    description: 'Você vende a atenção do seu público. Publicidade, patrocínios ou afiliados.',
    icon: Radio,
  },
];

const NewAudit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stage, setStage] = useState<Stage>('businessModel');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = useMemo(() => {
    if (!selectedBusinessModel) return [];
    const modelQuestions = allQuestions[selectedBusinessModel] || [];
    if (!selectedChannel) return []; 
    if (selectedChannel === 'Ambos') {
      return modelQuestions;
    }
    return modelQuestions.filter(q => q.category === selectedChannel || q.category === 'Geral');
  }, [selectedBusinessModel, selectedChannel]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const calculateResults = () => {
    let score = 0;
    const risks: EnrichedRisk[] = [];

    questions.forEach((q) => {
      const answerIndex = answers[q.id];
      if (answerIndex === undefined) return;

      const selectedOption = q.options[answerIndex];
      score += selectedOption.score;
      
      if (selectedOption.actionPlan) {
        risks.push({
          questionText: q.text,
          userAnswerText: selectedOption.label,
          actionPlan: selectedOption.actionPlan,
        });
      }
    });

    return { score, risks };
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const { score, risks } = calculateResults();
      const auditData = {
        userId: user.uid,
        businessModel: selectedBusinessModel,
        channel: selectedChannel,
        answers,
        risks, // Agora salva o objeto de risco enriquecido
        score,
        totalQuestions: questions.length,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "audits"), auditData);
      
      toast({
        title: "Auditoria finalizada",
        description: "Seu diagnóstico está pronto.",
      });

      navigate(`/audit/${docRef.id}`);
    } catch (error) {
      console.error("Error saving audit:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível processar sua auditoria.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderBusinessModelSelection = () => (
     <main className="container max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white leading-tight mb-4">Primeiro, qual o seu modelo de negócio?</h2>
        <p className="text-gray-400 mb-10">Essa escolha personaliza o diagnóstico para a sua realidade.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessModels.map((model) => {
                const Icon = model.icon;
                return (
                    <Card 
                        key={model.name} 
                        onClick={() => {
                            setSelectedBusinessModel(model.name);
                            setStage('channel');
                        }}
                        className="p-6 text-left glass-card border-white/10 hover:border-primary/80 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform"/>
                            <h3 className="text-xl font-bold text-white">{model.name}</h3>
                        </div>
                        <p className="text-gray-400">{model.description}</p>
                    </Card>
                )
            })}
        </div>
     </main>
  );

  const renderChannelSelection = () => (
    <main className="container max-w-2xl text-center">
      <Card className="p-8 glass-card border-white/10">
        <h2 className="text-2xl font-bold text-white leading-tight mb-6">
          Quais canais compõem sua operação hoje?
        </h2>
        <div className="space-y-4">
          <Button onClick={() => { setSelectedChannel('Meta Ads'); setStage('questions'); }} className="w-full" size="lg">Meta Ads</Button>
          <Button onClick={() => { setSelectedChannel('Google Ads'); setStage('questions'); }} className="w-full" size="lg">Google Ads</Button>
          <Button onClick={() => { setSelectedChannel('Ambos'); setStage('questions'); }} className="w-full" size="lg">Ambos</Button>
        </div>
        <Button variant="link" onClick={() => setStage('businessModel')} className="mt-4 text-gray-400">Voltar</Button>
      </Card>
    </main>
  );

  const renderQuestions = () => {
    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

    return (
      <main className="container max-w-2xl pt-24 pb-12">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQuestion && (
            <Card className="p-8 glass-card border-white/10">
              <div className="mb-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
                    {currentQuestion.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white leading-tight">
                      {currentQuestion.text}
                    </h2>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="w-5 h-5 text-gray-400 hover:text-primary"/>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <p>{currentQuestion.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                  </div>
              </div>

              <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={cn(
                          "w-full p-4 text-left rounded-xl transition-all duration-200 border-2",
                          answers[currentQuestion.id] === index
                            ? (option.label === "Não sei informar" ? "border-yellow-500 bg-yellow-500/5 text-white" : "border-primary bg-primary/5 text-white")
                            : (option.label === "Não sei informar" ? "border-dashed border-white/10 bg-transparent text-gray-500 hover:bg-white/5" : "border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10")
                        )}
                    >
                        {option.label}
                    </button>
                  ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                      if(currentQuestionIndex === 0) {
                          setStage('channel');
                      } else {
                          setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                      }
                  }}
                >
                  Voltar
                </Button>
                
                {currentQuestionIndex === questions.length - 1 && answers[currentQuestion.id] !== undefined && (
                  <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90"
                  >
                      {isSubmitting ? "Processando..." : "Ver Diagnóstico"}
                  </Button>
                )}
              </div>
            </Card>
        )}
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Header />
      {stage === 'businessModel' && renderBusinessModelSelection()}
      {stage === 'channel' && renderChannelSelection()}
      {stage === 'questions' && renderQuestions()}
    </div>
  );
};

export default NewAudit;
