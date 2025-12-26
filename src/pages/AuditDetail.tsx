
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
        const questionMap: Record<string, string> = {
            // Bloco 1: E-commerce e Gestão (Simples e Direto)
            "Consistência de Dados": "No seu relatório as vendas estão ótimas, mas no meu banco caiu muito menos. Por que o rastreio de vocês está tão longe da minha realidade?",
            "Teto de Escala": "Sempre que eu peço para investir mais, o lucro some porque a venda fica cara demais. A conta está mal organizada ou chegamos no teto?",
            "Vida Útil do Criativo": "Vocês pedem vídeo novo toda semana dizendo que o público cansou. O problema é o vídeo ou vocês não estão testando títulos e textos diferentes para o mesmo vídeo?",
            "Qualidade do Carrinho": "Tem muita gente colocando produto no carrinho e não comprando. Os anúncios estão atraindo compradores de verdade ou só gente curiosa que não tem dinheiro?",
            "Re-compra Inexistente": "Eu e meus clientes estamos vendo nossos próprios anúncios de venda. Por que estou pagando para anunciar para quem já é meu cliente em vez de buscar gente nova?",
            "Canibalização de Marca": "A maioria das vendas do Google vem de quem digitou o nome da minha loja. Eu não estou pagando por um cliente que já ia me achar de graça no orgânico?",
            "Lixo em Termos de Busca": "Vi que estamos aparecendo para palavras como 'grátis' ou 'vagas de emprego'. Por que estamos jogando dinheiro fora com esses cliques que não compram?",
            "Ponto Cego da PMax": "Onde exatamente nossos anúncios estão aparecendo? Não quero meu dinheiro indo para sites de fofoca ou aplicativos de jogos infantis.",
            "Eficiência de Margem": "O faturamento no relatório está alto, mas no final do mês não sobra dinheiro. Podemos ajustar os anúncios para focar em lucro real e não só em volume de vendas?",
            "Saúde do Merchant Center": "Notei que vários produtos estão fora do ar no Google Shopping por erro técnico. Quem está cuidando para que o anúncio não pare por bobeira de preço ou estoque?",
            "Propriedade de Dados (Sequestro de Ativos)": "Se a gente parar de trabalhar hoje, as contas de anúncios e todo o histórico ficam comigo ou estão no nome da agência? Quero ter certeza que o acesso é meu.",
            "Propriedade Intelectual": "Se a gente parar de trabalhar hoje, as contas de anúncios e todo o histórico ficam comigo ou estão no nome da agência? Quero ter certeza que o acesso é meu.",
            "Taxonomia de UTMs": "Quando sai uma venda aqui, eu não consigo saber de qual anúncio ela veio. Por que o rastreio não está configurado para me mostrar o que funciona?",
            "Ponto Cego na Gestão": "Quando sai uma venda aqui, eu não consigo saber de qual anúncio ela veio. Por que o rastreio não está configurado para me mostrar o que funciona?",
            "Latência de Carregamento": "Sinto o site lento no celular. O quanto essa demora está fazendo eu perder vendas e deixando o anúncio mais caro para mim?",
            "Janela de Lucro": "Vocês desligam anúncios que não venderam em 24 horas. O cliente não leva alguns dias para decidir? Não estamos matando anúncios que dariam lucro depois?",
            "Sincronia de Estoque": "Gastamos dinheiro anunciando um produto que já tinha acabado no estoque. Como vocês garantem que o anúncio pare na hora que o produto acabar?",

            // Bloco 2: Serviços, Leads e Performance (Simples e Direto)
            "Sincronia de Leads": "No Facebook diz que chegaram 100 leads, mas no meu WhatsApp só apareceram 60. Para onde foram os outros? Tem algum erro de ligação entre os sistemas?",
            "O Medo da Escala": "Por que o preço de cada lead dobra quando tentamos investir mais? O nosso público é tão pequeno assim ou a conta está desorganizada e sobreposta?",
            "Fadiga de Abordagem": "Vocês dizem que o vídeo cansou, mas a mensagem é sempre a mesma. Não devíamos testar uma conversa ou oferta diferente antes de eu gastar tempo gravando tudo de novo?",
            "Filtro de Curiosos": "Estão chegando muitos 'curiosos' que só fazem perder meu tempo. Podemos colocar alguma pergunta ou filtro no anúncio para barrar quem não tem perfil de compra?",
            "Omissão de CRM": "Vocês sabem quais dos leads que vocês enviaram realmente fecharam contrato? Como vocês melhoram os anúncios se não sabem quem me deu lucro de verdade?",
            "Leads 'Zumbis'": "Muitos leads do Google dizem que 'não preencheram nada'. Estamos aparecendo para quem quer coisa grátis ou para quem realmente quer contratar meu serviço?",
            "Sequestro de Marca": "Estou pagando para aparecer quando buscam meu nome. Se eu parar, o cliente não me acharia no link gratuito logo abaixo? Não estamos jogando dinheiro fora com quem já me conhece?",
            "Ponto Cego da Rede de Display": "Vi meu anúncio em um site de joguinhos e em canais infantis no YouTube. Por que meu dinheiro está indo para lá se o meu cliente é um adulto/decisor?",
            "Estratégia de Lance Cega": "Estamos focados em 'ganhar cliques' ou em 'ganhar clientes'? De que adianta ter mil acessos no site se ninguém me chama no WhatsApp no final do dia?",
            "Abismo da Página de Destino": "Se o problema de não vender é o meu site, por que vocês não me avisaram antes? O que exatamente eu preciso mudar na página para o anúncio de vocês funcionar?",
            "Alinhamento de Vendas (Feedback Loop)": "Quando vamos sentar para eu te falar quais leads foram bons? Vocês precisam saber quem comprou para parar de gastar com o público que não fecha negócio.",
            "Origem da Venda (Atribuição)": "Fechei um contrato ótimo hoje, mas não sei qual anúncio trouxe esse cliente. Como vamos investir mais no que funciona se não temos esse rastreio configurado?",
            "Propriedade de Ativos (Risco)": "As contas de anúncios e o 'Pixel' estão no meu e-mail ou no de vocês? Quero garantir que, se a gente parar de trabalhar, o histórico de inteligência continue comigo.",
            "Propriedade de Ativos (Sequestro)": "As contas de anúncios e o 'Pixel' estão no meu e-mail ou no de vocês? Quero garantir que, se a gente parar de trabalhar, o histórico de inteligência continue comigo.",
            "Velocidade e Latência": "Minha página de vendas demora para abrir no celular. Quantos clientes estamos perdendo no meio do caminho e quanto isso está encarecendo o meu anúncio?",
            "Métrica de Sobrevivência (CAC)": "Vocês sabem até quanto eu posso pagar por um cliente para eu não ter prejuízo no final do mês? Como vocês controlam os lances sem saber a minha margem?",

            // Bloco 3: Infoprodutos, Assinaturas e Eventos (Simples e Direto)
            "Estresse de Escala": "Sempre que tento investir mais para vender mais ingressos/vagas, o custo por venda dispara. Nossa conta está organizada para crescer ou estamos apenas saturando o mesmo público?",
            "Eficiência de Remarketing": "Por que meus alunos ou assinantes ativos continuam vendo anúncios para comprar o que já têm? Não estamos jogando dinheiro fora por não excluir essas pessoas?",
            "Fadiga de Ângulo": "Vocês estão apenas trocando a imagem ou estão testando novos motivos para a pessoa comprar? Mudar só a cor do botão não vai convencer quem ainda não comprou.",
            "Janela de Decisão": "Vocês desligam anúncios que não venderam em 24h. Mas o cliente não leva uns dias para decidir assinar? Não estamos matando anúncios que trariam lucro depois?",
            "Sinal de Conversão": "O Facebook sabe quem realmente pagou no PIX ou Boleto? Se ele só vê o clique no checkout e não o dinheiro no banco, ele vai continuar me trazendo quem não paga.",
            "Poluição de Intenção": "Meus anúncios estão aparecendo para quem busca 'de graça' ou 'pirata'. Por que não bloqueamos essas palavras para parar de dar dinheiro para quem nunca vai pagar?",
            "Sequestro de Tráfego de Marca": "Quase todas as vendas do Google vêm de quem já buscou pelo nome do meu curso. Por que estou pagando por esse cliente se ele já me conhecia e ia me achar de qualquer jeito?",
            "Sequestro de Tráfego de Marca (Cegueira)": "Quase todas as vendas do Google vêm de quem já buscou pelo nome do meu curso. Por que estou pagando por esse cliente se ele já me conhecia e ia me achar de qualquer jeito?",
            "Ponto Cego do YouTube e Display": "Vi meu anúncio de curso em vídeo de criancinha no YouTube. Criança não tem cartão de crédito. Como fazemos para meu dinheiro parar de vazar para esses canais?",
            "Qualidade de Inscritos (OCI)": "Temos muitos inscritos 'grátis', mas ninguém vira aluno pago. Como estamos avisando ao Google para parar de buscar 'caçadores de brinde' e focar em quem tem dinheiro?",
            "Estratégia de Lance em Picos": "Nos dias de encerramento, o custo por venda sobe tanto que o lucro some. Por que não colocamos um limite de preço para o Google não dar lances malucos no leilão?",
            "Propriedade da Inteligência": "Se eu mudar de agência, eu perco as listas de quem visitou meu site ou se inscreveu nos eventos? Quem é o dono dessa 'inteligência' toda, eu ou vocês?",
            "Atribuição de Jornada": "A venda veio do primeiro vídeo que a pessoa viu ou só do anúncio de 'última chance'? Se a gente não souber o caminho todo, vamos acabar pausando o que traz gente nova.",
            "Saúde Técnica do Checkout": "A página de pagamento está demorando para abrir no celular. Vocês já testaram isso? Estou pagando pelo clique e perdendo o aluno no último segundo por causa de lentidão.",
            "Estratégia de Equity (LTV/CAC)": "Vocês sabem quanto tempo um assinante fica pagando antes de cancelar? Quero anúncios que tragam clientes fiéis, e não gente que assina e sai no primeiro mês.",
            "Resiliência de Sinais (Risco)": "Ouvi dizer que se o rastreio não for de alta qualidade, perdemos 30% dos dados de venda. Como está a 'nota' de qualidade dos nossos dados hoje?",
            "Resiliência de Sinais (CAPI)": "Ouvi dizer que se o rastreio não for de alta qualidade, perdemos 30% dos dados de venda. Como está a 'nota' de qualidade dos nossos dados hoje?",
            "Qualidade da Base e Retenção": "Vocês sabem quanto tempo um assinante fica pagando antes de cancelar? Quero anúncios que tragam clientes fiéis, e não gente que assina e sai no primeiro mês.",
            "Janela de Decisão (Risco)": "Vocês desligam anúncios que não venderam em 24h. Mas o cliente não leva uns dias para decidir assinar? Não estamos matando anúncios que trariam lucro depois?",

            // Bloco 4: Audiência, Vitrine e Autoridade (Simples e Direto)
            "Filtro de Qualidade de Audiência": "O número de seguidores está subindo, mas ninguém comenta ou vê meus Stories. Estamos atraindo pessoas de verdade que gostam do meu conteúdo ou só 'perfis vazios' para inflar o número?",
            "Teto de Descoberta": "Sempre que investimos mais para crescer, o seguidor fica muito mais caro. Nossa conta está bagunçada ou o público que vocês escolheram é pequeno demais para a gente crescer?",
            "Fadiga de Criativos": "Vocês pedem vídeos novos quase todo dia. O problema é o meu vídeo ou vocês não estão testando textos e títulos diferentes para o mesmo vídeo antes de descartar?",
            "Ponto Cego do YouTube e Display (Social)": "Quero que meus anúncios apareçam só no Instagram e Facebook. Podemos tirar nosso dinheiro de sites e aplicativos de joguinhos onde as pessoas clicam sem querer?",
            "Janela de Atribuição (Risco)": "Se o Instagram leva alguns dias para entender quem gosta do meu perfil, por que vocês desligam os anúncios em 24h? Não estamos impedindo a inteligência da conta de funcionar?",
            "Sequestro de Marca (Risco)": "Estamos pagando para aparecer para quem já digita meu nome no Google. Essas pessoas não me achariam de graça no link logo abaixo? Por que gastar com quem já me conhece?",
            "Higiene de Termos de Busca": "Vi que estamos pagando por cliques de quem busca 'coisa grátis' ou 'PDF'. Como vocês estão limpando essas palavras para eu parar de dar dinheiro para quem não quer comprar?",
            "Estratégia de Lance às Cegas": "Eu prefiro 10 clientes do que 1000 curiosos. Estamos dizendo para o Google buscar quem realmente compra ou ele só está me entregando cliques baratos de qualquer pessoa?",
            "Extensões e Ativos de Autoridade": "Meu anúncio no Google parece muito pequeno perto dos concorrentes. Não podemos colocar mais links, frases e informações para ele ocupar mais espaço e atrair mais gente?",
            "Propriedade da Inteligência (Risco)": "Se eu mudar de agência amanhã, eu perco a lista de todas as pessoas que já visitaram meu perfil ou site? Quero ter certeza que essa inteligência é minha e está na minha conta.",
            "Atribuição Forense (Risco)": "Eu não sei qual vídeo ou post gerou a venda de hoje. Como vamos saber onde colocar mais dinheiro se não temos um rastreio que me diga exatamente de onde veio o cliente?",
            "Atribuição Forense (UTMs)": "Eu não sei qual vídeo ou post gerou a venda de hoje. Como vamos saber onde colocar mais dinheiro se não temos um rastreio que me diga exatamente de onde veio o cliente?",
            "Velocidade da Vitrine": "Meus links demoram muito para abrir no celular. Quantas pessoas estão desistindo no meio do caminho por causa dessa lentidão? Como isso afeta o preço do meu anúncio?",
            "Visão de LTV (Risco)": "Vocês olham se o cliente que vocês trazem volta a comprar de mim depois? Eu quero atrair pessoas que se tornem clientes fiéis, e não gente que compra uma vez e some.",
            "Visão de Valor de Vida (LTV)": "Vocês olham se o cliente que vocês trazem volta a comprar de mim depois? Eu quero atrair pessoas que se tornem clientes fiéis, e não gente que compra uma vez e some.",
            "Feedback Loop (Risco)": "Meus vídeos que funcionam bem no meu perfil não estão sendo usados nos anúncios. Por que vocês não aproveitam o que eu já sei que o meu público gosta para vender mais?",
            "Feedback Loop de Parcerias": "Meus vídeos que funcionam bem no meu perfil não estão sendo usados nos anúncios. Por que vocês não aproveitam o que eu já sei que o meu público gosta para vender mais?",
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
