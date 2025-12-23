
export type ActionPlan = {
  title: string;
  description: string;
  severity: 'high' | 'medium';
};

export type Question = {
  id: string;
  category: 'Meta' | 'Google' | 'Geral';
  text: string;
  options: {
    label: string;
    score: number; // 0 = bom, 1 = ruim (risco)
    actionPlan?: ActionPlan; // Só existe se a resposta for ruim
  }[];
};

export const questions: Question[] = [
  // Categoria Meta Ads
  {
    id: 'signal_resilience',
    category: 'Meta',
    text: 'Seu Gerenciador reporta uma discrepância de vendas maior que 20% em relação ao seu faturamento real?',
    options: [
      { label: 'Não, os números são próximos.', score: 0 },
      {
        label: 'Sim, a discrepância é maior que 20%.',
        score: 1,
        actionPlan: {
          title: 'EMQ (Signal Resilience)',
          description: `Desculpa Comum: "O iOS 14 quebrou o rastreio, os números nunca batem."###Veredito Técnico: Sua CAPI (API de Conversão) está mal configurada. Sem os parâmetros fbc e fbp via servidor, a IA trabalha no escuro e encarece seu CPA.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'creative_sandboxing',
    category: 'Meta',
    text: 'Sua equipe coloca novos anúncios diretamente nas campanhas que já estão gerando lucro?',
    options: [
      { label: 'Não, eles usam uma campanha de teste separada.', score: 0 },
      {
        label: 'Sim, eles testam tudo na campanha principal.',
        score: 1,
        actionPlan: {
          title: 'Creative Sandboxing',
          description: `Desculpa Comum: "Estamos aproveitando o aprendizado da campanha principal."###Veredito Técnico: Isso causa poluição de sinal na IA Advantage+. O aprendizado deve ser isolado em um ambiente de Sandbox antes da escala.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'verba_fragmentation',
    category: 'Meta',
    text: 'Sua conta possui mais de 5 conjuntos de anúncios ativos com verbas pequenas?',
    options: [
      { label: 'Não, a verba é consolidada em poucos conjuntos.', score: 0 },
      {
        label: 'Sim, temos muitos conjuntos com pouca verba.',
        score: 1,
        actionPlan: {
          title: 'Fragmentação de Verba',
          description: `Desculpa Comum: "Estamos testando vários públicos diferentes simultaneamente."###Veredito Técnico: Fragmentação impede a IA de sair da 'Fase de Aprendizado'. Você precisa de consolidação (Power 5) para ganhar eficiência.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'latency_window',
    category: 'Meta',
    text: 'Anúncios são pausados pela equipe se não venderem nas primeiras 24 ou 48 horas?',
    options: [
      { label: 'Não, eles respeitam a janela de atribuição completa.', score: 0 },
      {
        label: 'Sim, eles pausam rapidamente o que não \'performa\'.',
        score: 1,
        actionPlan: {
          title: 'Janela de Latência',
          description: `Desculpa Comum: "Estamos cortando o que não funciona para economizar verba."###Veredito Técnico: Ignorância da janela de atribuição de 7 dias pós-iOS14. Você está 'matando' anúncios que venderam, mas cujos dados ainda não voltaram via API.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'cpm_fatigue',
    category: 'Meta',
    text: 'Seu custo por mil impressões (CPM) sobe semanalmente sem alteração na oferta?',
    options: [
      { label: 'Não, o CPM está estável ou otimizado.', score: 0 },
      {
        label: 'Sim, meu CPM está sempre subindo.',
        score: 1,
        actionPlan: {
          title: 'CPM Fatigue Index',
          description: `Desculpa Comum: "O leilão do Facebook ficou mais caro para todo mundo."###Veredito Técnico: Falta de DCO (Dynamic Creative Optimization). A agência está mudando a cor do banner quando deveria mudar o ângulo psicológico da oferta.`,
          severity: 'high'
        }
      }
    ]
  },
  // Categoria Google Ads
  {
    id: 'oci',
    category: 'Google',
    text: 'O Google entrega volume de leads, mas seu comercial diz que 70% são curiosos ou desqualificados?',
    options: [
      { label: 'Não, os leads geralmente são de boa qualidade.', score: 0 },
      {
        label: 'Sim, a maioria dos leads é desqualificada.',
        score: 1,
        actionPlan: {
          title: 'OCI (Offline Conversion Import)',
          description: `Desculpa Comum: "Nosso trabalho é trazer o contato, o fechamento é com o seu comercial."###Veredito Técnico: Falta de integração OCI. O Google não sabe quem comprou no seu CRM e continua gastando sua verba para atrair quem apenas clica.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'pmax_cannibalization',
    category: 'Google',
    text: 'Suas vendas na rede de pesquisa caíram drasticamente após ativarem a Performance Max?',
    options: [
      { label: 'Não, as campanhas funcionam bem em conjunto.', score: 0 },
      {
        label: 'Sim, a PMax parece ter \'roubado\' as vendas da pesquisa.',
        score: 1,
        actionPlan: {
          title: 'Canibalização de PMax',
          description: `Desculpa Comum: "A PMax é o novo padrão do Google e performa melhor sozinha."###Veredito Técnico: O Google está roubando seu tráfego orgânico e de marca para inflar os números da PMax. Você está pagando caro por clientes que já iam comprar.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'customer_match',
    category: 'Google',
    text: 'Sua conta utiliza sua lista de e-mails de clientes atuais para buscar novos compradores?',
    options: [
      { label: 'Sim, usamos a lista para criar públicos semelhantes.', score: 0 },
      {
        label: 'Não, não usamos nossa lista de clientes.',
        score: 1,
        actionPlan: {
          title: 'Customer Match Tier 1',
          description: `Desculpa Comum: "Não precisamos de listas, a IA do Google já entende o público."###Veredito Técnico: Desperdício de First-party data. Sem dar o padrão de quem já comprou, o algoritmo gasta seu dinheiro tentando "adivinhar" o alvo.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'bidding_alignment',
    category: 'Google',
    text: 'A agência foca em \'Maximizar Cliques\' em vez de tROAS (Retorno Desejado)?',
    options: [
      { label: 'Não, o foco é em ROAS ou CPA alvo.', score: 0 },
      {
        label: 'Sim, o foco é sempre em cliques e volume.',
        score: 1,
        actionPlan: {
          title: 'Bidding Strategy Alignment',
          description: `Desculpa Comum: "Precisamos de volume de cliques para alimentar a conta antes de focar em lucro."###Veredito Técnico: Desalinhamento com a Margem de Contribuição. Você está comprando cliques de quem 'clica em tudo', em vez de comprar a intenção de quem 'compra tudo'.`,
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'negative_intelligence',
    category: 'Google',
    text: 'Você encontra termos irrelevantes (como \'grátis\' ou \'vagas\') nos relatórios de busca?',
    options: [
      { label: 'Não, os termos de pesquisa são geralmente relevantes.', score: 0 },
      {
        label: 'Sim, vejo muitos termos ruins.',
        score: 1,
        actionPlan: {
          title: 'Negative Intelligence',
          description: `Desculpa Comum: "O Google ampliou a correspondência de palavras, é impossível negativar tudo."###Veredito Técnico: Inexistência de Scripts de Negativação Dinâmica. Cerca de 15% do seu caixa está sendo drenado por lixo de pesquisa.`,
          severity: 'high'
        }
      }
    ]
  },
  // Categoria Geral
  {
    id: 'utm_taxonomy',
    category: 'Geral',
    text: 'Você consegue rastrear exatamente qual anúncio gerou o lucro de hoje no seu CRM?',
    options: [
      { label: 'Sim, tenho rastreamento claro do funil completo.', score: 0 },
      {
        label: 'Não, é um \'buraco negro\', não sei de onde vêm as vendas.',
        score: 1,
        actionPlan: {
          title: 'Taxonomia UTM',
          description: 'Veredito Técnico: O rastreamento UTM inadequado impede a otimização baseada em lucro real. É impossível escalar o que não se pode medir com precisão.',
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'strategy_vs_equity',
    category: 'Geral',
    text: 'A agência ignora o LTV (valor do cliente no tempo) e foca apenas no custo por lead diário?',
    options: [
      { label: 'Não, consideramos o LTV nas nossas estratégias.', score: 0 },
      {
        label: 'Sim, o foco é apenas no custo de aquisição imediato.',
        score: 1,
        actionPlan: {
          title: 'Strategy vs. Equity',
          description: 'Veredito Técnico: Focar apenas no CPA de curto prazo destrói a margem a longo prazo. A otimização deve ser pelo LTV/CAC, não apenas pelo custo do lead.',
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'data_ownership',
    category: 'Geral',
    text: 'Seus Pixels e Contas de Anúncios estão vinculados ao seu e-mail ou ao Business Manager da agência?',
    options: [
      { label: 'Estão no meu Business Manager, eu sou o dono.', score: 0 },
      {
        label: 'Estão no Business Manager da agência.',
        score: 1,
        actionPlan: {
          title: 'Data Ownership',
          description: 'Veredito Técnico: Se os ativos de dados (pixel, contas) não estão no seu BM, você não tem um negócio, tem um hobby caro. Você está construindo o ativo da agência, não o seu.',
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'lcp_latency',
    category: 'Geral',
    text: 'Sua página de destino demora mais de 3 segundos para carregar no 4G?',
    options: [
      { label: 'Não, a página carrega rapidamente.', score: 0 },
      {
        label: 'Sim, a página é lenta.',
        score: 1,
        actionPlan: {
          title: 'LCP & Latência',
          description: 'Veredito Técnico: Cada segundo de atraso no carregamento aumenta a taxa de rejeição e o custo por resultado. Otimizar a velocidade da página é uma alavanca de lucro direto.',
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'feedback_loop',
    category: 'Geral',
    text: 'Marketing e Vendas se reúnem semanalmente para auditar a qualidade real dos leads gerados?',
    options: [
      { label: 'Sim, há uma reunião semanal de alinhamento.', score: 0 },
      {
        label: 'Não, eles quase não se falam.',
        score: 1,
        actionPlan: {
          title: 'Feedback Loop',
          description: 'Veredito Técnico: Sem um loop de feedback entre marketing e vendas, a otimização de tráfego opera no vácuo, gerando leads que não se convertem em clientes e desperdiçando orçamento.',
          severity: 'high'
        }
      }
    ]
  }
];
