
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ActionPlan } from "@/data/questions";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingDown, AlertTriangle, ShieldAlert, MessageSquare, BookOpen, FileDown, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces --- //

interface EnrichedRisk {
  questionText: string;
  userAnswerText: string;
  actionPlan: ActionPlan;
}

interface AuditData {
  score: number;
  risks: (ActionPlan | EnrichedRisk)[];
  totalQuestions: number;
  createdAt?: Date;
}

// --- Telas e Componentes --- //

const analysisMessages = [
  "Analisando suas respostas...",
  "Cruzando dados com nossos benchmarks de mercado...",
  "Identificando pontos cegos na sua operação...",
  "Calculando a saúde da sua aquisição de clientes...",
  "Montando seu diagnóstico final...",
];

const AnalysisLoadingScreen = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % analysisMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-6"></div>
      <h1 className="text-xl font-bold text-white mb-2">Aguarde, nosso sistema está pensando...</h1>
      <p className="text-gray-400 transition-opacity duration-500">
        {analysisMessages[currentMessageIndex]}
      </p>
    </div>
  );
};

const healthLevelsDetails = [
    { label: "Blindado", description: "Operação de Elite, sem pontos cegos críticos identificados. Seu nível de maturidade em tráfego é alto.", icon: ShieldCheck, color: "text-green-400" },
    { label: "Ineficiente", description: "A operação funciona, mas possui falhas que travam a escala e podem se agravar, gerando risco de estagnação.", icon: TrendingDown, color: "text-yellow-400" },
    { label: "Vulnerável", description: "Os problemas encontrados já representam um dreno de caixa ativo. A operação está em risco real e perdendo dinheiro.", icon: AlertTriangle, color: "text-orange-400" },
    { label: "Refém", description: "Cenário crítico. A operação depende de fatores que não controla e a lucratividade está seriamente comprometida.", icon: ShieldAlert, color: "text-red-400" },
];

// Mostra apenas a explicação do nível atual
const DiagnosisExplanation = ({ health }) => (
    <section>
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-primary" />
            Entendendo seu Diagnóstico
        </h2>
        <Card className="p-6 glass-card border-white/10">
            <div className="flex items-start gap-4">
                <health.icon className={cn("w-6 h-6 mt-1 flex-shrink-0", health.color)} />
                <div>
                    <h3 className={cn("font-bold", health.color)}>{health.label}</h3>
                    <p className="text-gray-400 text-sm">{health.description}</p>
                </div>
            </div>
        </Card>
    </section>
);

// Seção acionável com base nos pontos cegos
const ActionableInsights = ({ risks }) => {
    if (risks.length === 0) return null;

    const getActionableQuestion = (title: string) => {
        const questionMap = {
            "Rastreio Quebrado": "No seu relatório as vendas estão ótimas, mas no meu banco caiu muito menos. Por que o rastreio de vocês está tão longe da minha realidade?",
            "O Medo da Escala": "Sempre que eu peço para investir mais, o lucro some porque a venda fica cara demais. A conta está mal organizada ou chegamos no teto?",
            "Cansaço de Criativos": "Vocês pedem vídeo novo toda semana dizendo que o público cansou. O problema é o vídeo ou vocês não estão testando títulos e textos diferentes para o mesmo vídeo?",
            "Qualidade do Carrinho": "Tem muita gente colocando produto no carrinho e não comprando. Os anúncios estão atraindo compradores de verdade ou só gente curiosa que não tem dinheiro?",
            "Remarketing Ineficiente": "Eu e meus clientes estamos vendo nossos próprios anúncios de venda. Por que estou pagando para anunciar para quem já é meu cliente em vez de buscar gente nova?",
            "Sequestro de Marca": "A maioria das vendas do Google vem de quem digitou o nome da minha loja. Eu não estou pagando por um cliente que já ia me achar de graça no orgânico?",
            "Caça-Palavras": "Vi que estamos aparecendo para palavras como 'grátis' ou 'vagas de emprego'. Por que estamos jogando dinheiro fora com esses cliques que não compram?",
            "Guerra de Posicionamento": "Onde exatamente nossos anúncios estão aparecendo? Não quero meu dinheiro indo para sites de fofoca ou aplicativos de jogos infantis.",
            "Métricas de Vaidade": "O faturamento no relatório está alto, mas no final do mês não sobra dinheiro. Podemos ajustar os anúncios para focar em lucro real e não só em volume de vendas?",
            "Catálogo Sujo": "Notei que vários produtos estão fora do ar no Google Shopping por erro técnico. Quem está cuidando para que o anúncio não pare por bobeira de preço ou estoque?",
            "Propriedade Intelectual": "Se a gente parar de trabalhar hoje, as contas de anúncios e todo o histórico ficam comigo ou estão no nome da agência? Quero ter certeza que o acesso é meu.",
            "Ponto Cego na Gestão": "Quando sai uma venda aqui, eu não consigo saber de qual anúncio ela veio. Por que o rastreio não está configurado para me mostrar o que funciona?",
            "Velocidade e Latência": "Sinto o site lento no celular. O quanto essa demora está fazendo eu perder vendas e deixando o anúncio mais caro para mim?",
            "Ansiedade de Performance": "Vocês desligam anúncios que não venderam em 24 horas. O cliente não leva alguns dias para decidir? Não estamos matando anúncios que dariam lucro depois?",
            "Sincronia de Estoque": "Gastamos dinheiro anunciando um produto que já tinha acabado no estoque. Como vocês garantem que o anúncio pare na hora que o produto acabar?",
        };
        return questionMap[title] || `Como podemos melhorar nossa abordagem em relação a '${title}' para otimizar os resultados?`;
    };

    return (
        <section>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ClipboardList className="text-primary" />
                Como Cobrar sua Agência/Gestor
            </h2>
            <Card className="p-6 glass-card border-white/10">
                <p className="text-gray-400 text-sm mb-6">Use os pontos abaixo para iniciar uma conversa produtiva e baseada em dados com sua equipe de marketing.</p>
                <ul className="space-y-4 list-disc list-inside text-gray-300">
                    {risks.map((riskItem, index) => {
                         const title = 'actionPlan' in riskItem ? (riskItem as EnrichedRisk).actionPlan.title : (riskItem as ActionPlan).title;
                         return <li key={index}>{getActionableQuestion(title)}</li>;
                    })}
                </ul>
            </Card>
        </section>
    );
};

// --- Componente Principal --- //

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
          const data = docSnap.data() as AuditData;
          if (!data.totalQuestions || data.totalQuestions === 0) data.totalQuestions = 15;
          setAudit(data);
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching audit:", error);
      } finally {
        setTimeout(() => setLoading(false), 5000);
      }
    };
    fetchAudit();
  }, [id, navigate]);

  if (loading) return <AnalysisLoadingScreen />;
  if (!audit) return null;

  const getHealthLevel = (score: number, totalQuestions: number, risks: (ActionPlan | EnrichedRisk)[]) => {
    if (risks.length === 0) return healthLevelsDetails[0];
    const maxScore = totalQuestions * 100;
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 70) return healthLevelsDetails[1];
    if (percentage >= 50) return healthLevelsDetails[2];
    return healthLevelsDetails[3];
  };

  const health = getHealthLevel(audit.score, audit.totalQuestions, audit.risks);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
        <style jsx global>{`
            @media print {
                body {
                    background-color: white;
                    color: black;
                }
                .no-print {
                    display: none;
                }
                .printable-area {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    color: black;
                }
                .glass-card {
                    background-color: #f3f4f6 !important;
                    border: 1px solid #e5e7eb !important;
                    color: black;
                }
                .text-white, .text-gray-300, .text-gray-400 {
                    color: black !important;
                }
                .text-primary { color: #5D45FD !important; }
                .text-green-400 { color: #10B981 !important; }
                .text-yellow-400 { color: #F59E0B !important; }
                .text-orange-400 { color: #F97316 !important; }
                .text-red-400 { color: #EF4444 !important; }
                .border-white/10, .border-l-2 { border-color: #d1d5db !important; }
            }
        `}</style>
      <Header className="no-print" />
      <main id="report" className="container max-w-3xl pt-24 pb-12 space-y-10 printable-area">
        <section className="text-center">
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold text-white">Diagnóstico da Operação</h1>
            <Button onClick={handlePrint} variant="outline" className="no-print ml-4">
                <FileDown className="h-4 w-4 mr-2" />
                Baixar Relatório
            </Button>
          </div>
          <p className="text-gray-400 mb-6">Esta é a saúde atual da sua aquisição de clientes.</p>
          <div className={cn("inline-flex flex-col items-center gap-2 px-8 py-4 rounded-xl border", health.color.replace('text', 'bg') + '/10', health.color, "border-current/20")}>
            <health.icon className="w-8 h-8" />
            <span className="text-2xl font-bold uppercase tracking-wider">{health.label}</span>
          </div>
        </section>

        <DiagnosisExplanation health={health} />

        <section>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShieldAlert className="text-primary" />
                Pontos Cegos Encontrados
            </h2>
            <div className="grid gap-6">
                {audit.risks.length > 0 ? (
                    audit.risks.map((riskItem, index) => {
                        const isEnriched = 'actionPlan' in riskItem;
                        const title = isEnriched ? (riskItem as EnrichedRisk).actionPlan.title : (riskItem as ActionPlan).title;
                        const description = isEnriched ? (riskItem as EnrichedRisk).actionPlan.description : (riskItem as ActionPlan).description;
                        const [excuse, reality] = description.split('###');

                        return (
                            <Card key={index} className="bg-[#1A1F2C] border-white/10 flex flex-col p-6 glass-card">
                                <h3 className="text-lg font-bold text-primary mb-5">Ponto Cego: {title}</h3>
                                
                                {isEnriched && (
                                    <div className="mb-4 border-l-2 border-gray-600 pl-4">
                                        <p className="text-sm text-gray-400 font-bold mb-2">O CENÁRIO:</p>
                                        <p className='text-gray-300'>{(riskItem as EnrichedRisk).questionText}</p>
                                        <p className="text-sm text-gray-400 font-bold mt-3 mb-2">SUA RESPOSTA:</p>
                                        <p className='text-yellow-300 italic'>{(riskItem as EnrichedRisk).userAnswerText}</p>
                                    </div>
                                )}

                                <div className="mb-4 border-l-2 border-yellow-500/30 pl-4">
                                    <p className="text-sm text-gray-400 font-bold mb-2">A DESCULPA COMUM:</p>
                                    <p className='text-gray-300 italic'>{excuse.replace(/Desculpa Comum:|Desculpa:/, '').trim()}</p>
                                </div>
                                <div className="border-l-2 border-green-400/30 pl-4">
                                    <p className="text-sm text-green-400 font-bold mb-2">O VEREDITO TÉCNICO:</p>
                                    <p className='text-gray-300'>{reality.replace(/Veredito Técnico:|Realidade:/, '').trim()}</p>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <Card className="p-8 text-center bg-green-500/5 border-green-500/20">
                        <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Operação Blindada!</h3>
                        <p className="text-gray-400">Não encontramos pontos cegos críticos. Parabéns! Use a função de PDF para salvar este atestado de maturidade.</p>
                    </Card>
                )}
            </div>
        </section>

        <ActionableInsights risks={audit.risks} />

        <Card className="p-8 glass-card border-primary/20 text-center no-print">
            <h3 className="text-2xl font-bold text-white mb-4">Sua operação pode gerar mais caixa.</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                O diagnóstico é o primeiro passo. Nossos especialistas podem construir a arquitetura de sinais ideal para o seu negócio e destravar seu lucro em 45 dias.
            </p>
            <Button size="lg" onClick={() => { const url = 'https://wa.me/5512991071986?text=Olá!%20Fiz%20a%20auditoria%20e%20gostaria%20de%20agendar%20a%20auditoria%20de%20inteligência.'; window.open(url, '_blank'); }} className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 shadow-lg shadow-primary/20">
                <MessageSquare className="mr-2 h-5 w-5" />
                SOLICITAR AUDITORIA DE INTELIGÊNCIA AO VIVO
            </Button>
        </Card>
      </main>
    </div>
  );
};

export default AuditDetail;
