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

  const getRiskLevel = (score: number) => {
    if (score === 0) return { label: "Baixo", color: "text-green-500", icon: CheckCircle, bg: "bg-green-500/10" };
    if (score === 1) return { label: "Médio", color: "text-yellow-500", icon: AlertTriangle, bg: "bg-yellow-500/10" };
    return { label: "Refém", color: "text-red-500", icon: ShieldAlert, bg: "bg-red-500/10" };
  };

  const risk = getRiskLevel(audit.score);

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
            
            <div className="grid gap-4">
              {audit.risks.length > 0 ? (
                audit.risks.map((riskItem, index) => (
                  <Card key={index} className="bg-[#1A1F2C] border-none overflow-hidden flex">
                    <div className={cn(
                      "w-2",
                      riskItem.severity === 'high' ? "bg-red-500" : "bg-yellow-500"
                    )} />
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2">{riskItem.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{riskItem.description}</p>
                    </div>
                  </Card>
                ))
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
            <h3 className="text-2xl font-bold text-white mb-4">Precisa recuperar o controle do seu lucro?</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Nossos especialistas podem analisar seu caso individualmente e ajudar na implementação dos protocolos de segurança.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8">
              <MessageSquare className="mr-2 h-5 w-5" />
              SOLICITAR AJUDA DO ESPECIALISTA
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuditDetail;
