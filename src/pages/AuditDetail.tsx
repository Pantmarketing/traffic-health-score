
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ActionPlan } from "@/data/questions";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ShieldAlert, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditData {
  score: number;
  risks: ActionPlan[];
  createdAt: any;
}

const AuditDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "audits", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAudit(docSnap.data() as AuditData);
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching audit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!audit) return null;

  const getRiskLevel = (score: number, totalQuestions: number) => {
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    if (percentage < 30) return { label: "Baixo", color: "text-green-500", icon: CheckCircle, bg: "bg-green-500/10" };
    if (percentage < 60) return { label: "Médio", color: "text-yellow-500", icon: AlertTriangle, bg: "bg-yellow-500/10" };
    return { label: "Refém", color: "text-red-500", icon: ShieldAlert, bg: "bg-red-500/10" };
  };

  // A pontuação agora é relativa ao número de riscos.
  const risk = getRiskLevel(audit.score, audit.risks.length);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Seu Diagnóstico de Tráfego</h1>
          <div className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-full border", risk.bg, risk.color, "border-current/20")}>
            <risk.icon className="w-6 h-6" />
            <span className="text-xl font-bold uppercase tracking-wider">Nível de Risco: {risk.label}</span>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <ShieldAlert className="text-primary" />
              Plano de Ação Imediato
            </h2>
            
            <div className="grid gap-6">
              {audit.risks.length > 0 ? (
                audit.risks.map((riskItem, index) => {
                  const [excuse, reality] = riskItem.description.split('###');
                  const severity = audit.score < 50 ? 'high' : 'medium'; // Lógica de severidade

                  return (
                    <Card key={index} className="bg-[#1A1F2C] border-white/10 overflow-hidden flex flex-col">
                       <div className="p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">{riskItem.title}</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 font-bold mb-2">DESCULPA COMUM:</p>
                            <p className='text-gray-300'>{excuse.replace('Desculpa Comum: ','')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-green-400 font-bold mb-2">VEREDITO TÉCNICO:</p>
                            <p className='text-gray-300'>{reality.replace('Veredito Técnico: ','')}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-full h-2 mt-auto",
                        severity === 'high' ? "bg-red-500" : "bg-yellow-500"
                      )} />
                    </Card>
                  )
                })
              ) : (
                <Card className="p-8 text-center bg-green-500/5 border-green-500/20">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Sua agência está aprovada!</h3>
                  <p className="text-gray-400">Não encontramos riscos críticos na sua operação atual.</p>
                </Card>
              )}
            </div>
          </section>

          <Card className="p-8 glass-card border-primary/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Pronto para implementar um sistema de tráfego inteligente?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Sua operação pode ser refém de uma gestão técnica defasada. Nossos especialistas podem construir a arquitetura de sinais ideal para o seu negócio e destravar seu lucro.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8">
              <MessageSquare className="mr-2 h-5 w-5" />
              SOLICITAR AUDITORIA DE INTELIGÊNCIA AO VIVO
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuditDetail;
