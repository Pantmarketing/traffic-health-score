import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions, ActionPlan } from "@/data/questions";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

const NewAudit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const calculateResults = () => {
    let score = 0;
    const risks: ActionPlan[] = [];

    questions.forEach((q) => {
      const answerIndex = answers[q.id];
      const selectedOption = q.options[answerIndex];
      
      score += selectedOption.score;
      if (selectedOption.actionPlan) {
        risks.push(selectedOption.actionPlan);
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
        answers,
        risks,
        score,
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

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl pt-24 pb-12">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Pergunta {currentStep + 1} de {questions.length}
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

        <Card className="p-8 glass-card border-white/10">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
              {currentQuestion.category}
            </span>
            <h2 className="text-2xl font-bold text-white leading-tight">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={cn(
                  "w-full p-4 text-left rounded-xl transition-all duration-200 border-2",
                  answers[currentQuestion.id] === index
                    ? "border-primary bg-primary/5 text-white"
                    : "border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            
            {currentStep === questions.length - 1 && answers[currentQuestion.id] !== undefined && (
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
      </main>
    </div>
  );
};

export default NewAudit;
