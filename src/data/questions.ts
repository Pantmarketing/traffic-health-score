
export type ActionPlan = {
  title: string;
  description: string;
};

export type QuestionOption = {
  label: string;
  score: number;
  actionPlan?: ActionPlan;
};

export type Question = {
  id: string;
  category: 'Meta Ads' | 'Google Ads' | 'Geral';
  text: string;
  tooltip: string;
  options: QuestionOption[];
};

export type BusinessModelQuestions = {
  [key: string]: Question[];
};

const defaultDontKnowActionPlan: ActionPlan = {
  title: "Ponto Cego na Gestão",
  description: "Desculpa Comum: 'A agência cuida disso, não preciso olhar.' ### Veredito Técnico: A falta de clareza sobre este dado indica perda de controle estratégico. Você está delegando seu lucro sem auditoria.",
};

const productsQuestions: Question[] = [
  // Bloco A: Meta Ads (Andromeda / Escala)
  {
    id: 'product_data_consistency',
    category: 'Meta Ads',
    text: "O valor total de vendas que a agência mostra no relatório é muito maior do que o que caiu no seu sistema de pagamento?",
    tooltip: "Compare o 'Valor de Conversão' do Meta com o seu faturamento real bruto vindo dos anúncios. Discrepâncias acima de 20% indicam API mal configurada.",
    options: [
      { label: "Batem quase 100%", score: 100 },
      { label: "Existe uma pequena diferença (até 15%)", score: 60 },
      { 
        label: "A diferença é enorme (acima de 30%)", 
        score: 10,
        actionPlan: {
          title: "Consistência de Dados",
          description: "Desculpa: \"O rastreio do iPhone (iOS14) se perde e o sistema tenta estimar, por isso nunca bate.\" ### Realidade: A API de Conversão não está enviando os parâmetros de servidor. A IA está \"cega\" e gastando verba com quem clica mas não tem cartão na mão."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_scaling_ceiling',
    category: 'Meta Ads',
    text: "Quando você pede para dobrar o investimento, o custo por venda sobe tanto que o lucro da operação desaparece?",
    tooltip: "Analise se o seu CPA (Custo por Aquisição) se mantém estável ou se explode ao aumentar o orçamento diário.",
    options: [
      { label: "Escalamos mantendo o lucro", score: 100 },
      { label: "O custo sobe um pouco, mas aceitável", score: 50 },
      { 
        label: "O custo explode e o lucro some", 
        score: 10,
        actionPlan: {
          title: "Teto de Escala",
          description: "Desculpa: \"O algoritmo precisa de mais tempo para aprender com o novo orçamento.\" ### Realidade: Sua conta sofre de Fragmentação de Verba. Em vez de consolidar dados, a agência cria dezenas de testes pequenos que nunca saem da fase de aprendizado."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
    {
    id: 'product_creative_lifecycle',
    category: 'Meta Ads',
    text: "Sua agência diz que precisa trocar os vídeos e fotos toda semana porque 'o público cansou' dos anúncios?",
    tooltip: "Verifique se a 'Frequência' do anúncio está alta (acima de 3) ou se o custo só subiu sem motivo aparente.",
    options: [
      { label: "Nossos anúncios duram meses com lucro", score: 100 },
      { label: "Trocamos a cada 15 ou 30 dias", score: 40 },
      { 
        label: "Trocamos toda semana (o custo sobe rápido)", 
        score: 10,
        actionPlan: {
          title: "Vida Útil do Criativo",
          description: "Desculpa: \"Os anúncios saturaram, o público não aguenta mais ver a mesma oferta.\" ### Realidade: Eles não estão usando DCO (Criativos Dinâmicos). A IA não consegue testar variações de títulos e ângulos sozinha, forçando trocas manuais que resetam a inteligência da conta."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_cart_quality',
    category: 'Meta Ads',
    text: "Você tem um volume alto de 'Inícios de Finalização de Compra', mas pouquíssimas vendas convertidas?",
    tooltip: "Veja a taxa de abandono de carrinho. Se for maior que 80%, há um erro de sinalização de intenção.",
    options: [
      { label: "Conversão alta de quem inicia o checkout", score: 100 },
      { label: "Muitos abandonos, mas fazemos remarketing", score: 40 },
      { 
        label: "Volume alto de carrinho, mas ninguém compra", 
        score: 10,
        actionPlan: {
          title: "Qualidade do Carrinho",
          description: "Desculpa: \"Seu frete está caro ou o cliente está apenas pesquisando para comprar depois.\" ### Realidade: O sinal de otimização está errado. A agência está pedindo ao Meta para buscar \"quem adiciona ao carrinho\" (barato) em vez de \"quem compra\" (caro), poluindo seu pixel com curiosos."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_nonexistent_rebuy',
    category: 'Meta Ads',
    text: "Seus anúncios aparecem mais para quem já comprou de você do que para clientes novos (gerando desperdício)?",
    tooltip: "Verifique se a agência exclui a lista de clientes atuais das campanhas de aquisição.",
    options: [
      { label: "Excluímos clientes antigos das campanhas", score: 100 },
      { label: "Não excluímos, mas o ROAS é alto", score: 30 },
      { 
        label: "Gastamos muito anunciando para quem já comprou", 
        score: 10,
        actionPlan: {
          title: "Re-compra Inexistente",
          description: "Desculpa: \"É importante reforçar a marca para quem já conhece para eles não esquecerem.\" ### Realidade: Estão \"roubando\" seu lucro orgânico. Você está pagando por um clique de alguém que já compraria de você naturalmente, apenas para inflar o ROI do relatório."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  // Bloco B: Google Ads (Intenção / Shopping)
  {
    id: 'product_brand_cannibalization',
    category: 'Google Ads',
    text: "Mais de 50% das suas vendas no Google vêm de pessoas que digitaram o NOME da sua empresa na busca?",
    tooltip: "Olhe os 'Termos de Pesquisa'. Se o seu nome domina as vendas, você está pagando por tráfego que seria gratuito.",
    options: [
      { label: "O lucro vem majoritariamente de termos genéricos", score: 100 },
      { label: "Metade das vendas vem pelo nosso nome", score: 40 },
      { 
        label: "Quase todas as vendas são de quem já nos busca", 
        score: 10,
        actionPlan: {
          title: "Canibalização de Marca",
          description: "Desculpa: \"Precisamos proteger seu nome para os concorrentes não aparecerem em cima de você.\" ### Realidade: A agência está escondendo a incapacidade de trazer clientes novos através de termos genéricos (ex: \"comprar camiseta\") usando o seu tráfego de marca para salvar o ROAS."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_search_term_junk',
    category: 'Google Ads',
    text: "Você já encontrou seus anúncios aparecendo para palavras como 'grátis', 'vagas de emprego' ou nomes de concorrentes muito mais baratos?",
    tooltip: "Vá em 'Palavras-chave' > 'Termos de Pesquisa'. Filtre por custo e veja o que as pessoas realmente digitaram.",
    options: [
      { label: "Meus termos são limpos e qualificados", score: 100 },
      { label: "Vejo alguns termos ruins de vez em quando", score: 40 },
      { 
        label: "Tem muito lixo e palavras irrelevantes", 
        score: 10,
        actionPlan: {
          title: "Lixo em Termos de Busca",
          description: "Desculpa: \"O Google mudou a correspondência das palavras e agora ele entrega termos semelhantes para dar volume.\" ### Realidade: Falta de Higiene de Conta. Cerca de 20% do seu orçamento é jogado no lixo por falta de listas negativas e scripts de negativação automática."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_pmax_blindspot',
    category: 'Google Ads',
    text: "A sua campanha de Performance Max gasta muito, mas você não sabe onde o anúncio apareceu (YouTube, Sites de Jogos ou Busca)?",
    tooltip: "A Performance Max é uma 'Caixa Preta'. Se não houver exclusão de canais, você pode estar aparecendo em apps de jogos para crianças.",
    options: [
      { label: "Sei onde apareço e controlo as exclusões", score: 100 },
      { label: "Sei por alto, mas confio no Google", score: 30 },
      { 
        label: "Não faço ideia de onde meus anúncios saem", 
        score: 10,
        actionPlan: {
          title: "Ponto Cego da PMax",
          description: "Desculpa: \"O Google usa inteligência artificial para decidir onde o anúncio converte melhor.\" ### Realidade: O Google prioriza gastar sua verba onde é mais barato para ele (Display/YouTube), mesmo que o lead seja horrível, para \"bater a meta\" de gasto diário."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_margin_efficiency',
    category: 'Google Ads',
    text: "A agência foca em bater um 'valor total de vendas' no Google, sem considerar se você teve lucro real após descontar o custo do produto?",
    tooltip: "Você usa a estratégia de tROAS (ROAS Desejado) baseada na sua margem real?",
    options: [
      { label: "Otimizamos para o lucro líquido por venda", score: 100 },
      { label: "Otimizamos para o ROAS (valor bruto)", score: 50 },
      { 
        label: "Otimizamos apenas para vender mais (faturamento)", 
        score: 10,
        actionPlan: {
          title: "Eficiência de Margem",
          description: "Desculpa: \"Nosso foco é escalar o faturamento, a margem é um controle interno seu.\" ### Realidade: Você pode estar vendendo muito e ficando mais pobre. Sem alinhar o Smart Bidding com a margem, o Google busca vendas caras que destroem seu lucro líquido."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
    {
    id: 'product_merchant_center_health',
    category: 'Google Ads',
    text: "Seus produtos vivem sendo reprovados ou o Google Shopping parou de entregar do nada?",
    tooltip: "Verifique se há erros de 'Feed de Dados' ou discrepância de preço entre o site e o anúncio.",
    options: [
      { label: "Feed sempre limpo e sem reprovações", score: 100 },
      { label: "Algumas reprovações ocasionais", score: 40 },
      { 
        label: "Constantemente temos produtos fora do ar", 
        score: 10,
        actionPlan: {
          title: "Saúde do Merchant Center",
          description: "Desculpa: \"O Google está cada vez mais rigoroso com as políticas, é um problema técnico do site.\" ### Realidade: Falta de gestão de Ativos. Agências de tráfego ignoram o GMC (Merchant Center), mas ele é o coração do e-commerce. Se o feed está sujo, seu custo por clique sobe 30%."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  // Bloco C: Geral (Blindagem / Gestão)
  {
    id: 'product_data_ownership',
    category: 'Geral',
    text: "Se você demitisse a agência agora, você continuaria com o acesso administrativo e o histórico de todas as contas?",
    tooltip: "Nunca aceite que as contas de anúncios fiquem no CNPJ ou e-mail da agência.",
    options: [
      { label: "Tenho acesso administrativo e total controle", score: 100 },
      { label: "Tenho acesso, mas não entendo nada", score: 50 },
      { 
        label: "Não tenho acesso ou as contas são da agência", 
        score: 0,
        actionPlan: {
          title: "Propriedade de Dados (Sequestro de Ativos)",
          description: "Desculpa: \"Nós usamos nossa conta de agência para facilitar a gestão.\" ### Realidade: Se os ativos não estão no seu nome, você não tem um negócio, tem um hobby caro. Você está construindo o ativo da agência, não o seu."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_utm_taxonomy',
    category: 'Geral',
    text: "No seu sistema interno (CRM/Bling/Shopify), você consegue ver exatamente de qual CAMPANHA e ANÚNCIO veio o pedido que saiu agora?",
    tooltip: "Clique no link do seu anúncio. Se não houver utm_source e utm_campaign, seu rastreio é amador.",
    options: [
      { label: "Rastreio 100% da jornada no meu sistema", score: 100 },
      { label: "Rastreio básico (apenas a fonte)", score: 40 },
      { 
        label: "Não usamos rastreio/UTMs nos links", 
        score: 10,
        actionPlan: {
          title: "Taxonomia de UTMs",
          description: "Desculpa: \"O importante é que está vendendo, não precisa detalhar tanto.\" ### Realidade: Impossível escalar o que não se pode medir com precisão. Você está otimizando no escuro."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_loading_latency',
    category: 'Geral',
    text: "Sua página demora mais de 3 segundos para abrir completamente no 4G de um celular médio?",
    tooltip: "Páginas lentas aumentam o CPC. O Google e Meta te punem cobrando mais caro por cada clique se sua experiência for ruim.",
    options: [
      { label: "Site voa, carrega em menos de 2 segundos", score: 100 },
      { label: "É aceitável, mas poderia melhorar", score: 50 },
      { 
        label: "Site lento, demora a abrir no celular", 
        score: 10,
        actionPlan: {
          title: "Latência de Carregamento",
          description: "Desculpa: \"Temos muitas imagens, é normal ser lento.\" ### Realidade: Cada segundo de atraso custa conversões e aumenta o custo por clique. A velocidade da página é uma alavanca de lucro direto."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'product_profit_window',
    category: 'Geral',
    text: "A agência avalia o resultado dos anúncios apenas pelo que vendeu HOJE, ignorando o que vendeu 7 dias depois do clique?",
    tooltip: "Ciclos de decisão de compra demoram. Avaliar o dia atual é ignorar o comportamento real do consumidor.",
    options: [
      { label: "Analisamos o resultado após 7 dias do clique", score: 100 },
      { label: "Olhamos o resultado de ontem para decidir hoje", score: 30 },
      { 
        label: "Não temos janela definida, é no 'feeling'", 
        score: 0,
        actionPlan: {
          title: "Janela de Lucro",
          description: "Desculpa: \"Precisamos de agilidade, se não vendeu hoje, não vende mais.\" ### Realidade: Tomada de decisão por impulso/sorte. Você está 'matando' anúncios lucrativos que venderiam nos próximos dias."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
    {
    id: 'product_stock_sync',
    category: 'Geral',
    text: "Já aconteceu de você gastar verba anunciando um produto que estava sem estoque ou com link quebrado?",
    tooltip: "Isso indica falta de integração entre a operação de tráfego e o seu ERP/Site.",
    options: [
      { label: "100% automatizado, anúncio pausa sem estoque", score: 100 },
      { label: "Fazemos manual, mas às vezes falha", score: 40 },
      { 
        label: "Já gastamos muito anunciando o que não tinha", 
        score: 10,
        actionPlan: {
          title: "Sincronia de Estoque",
          description: "Desculpa: \"O controle de estoque é uma responsabilidade interna sua.\" ### Realidade: Queima de verba por falta de comunicação. A agência sênior audita o funil completo, incluindo a disponibilidade do produto."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  }
];

const servicesMetaAdsQuestions: Question[] = [
  // Bloco A: Meta Ads (Andromeda / Atração de Leads)
  {
    id: 'service_leads_sync',
    category: 'Meta Ads',
    text: "O número de leads que a agência reporta no Facebook é muito maior do que o número de contatos que realmente chegam no seu CRM ou WhatsApp?",
    tooltip: "Compare os 'Leads' do Gerenciador com os contatos reais recebidos. Se houver perda maior que 20%, seus dados estão vazando.",
    options: [
      { label: "Números batem quase 100%", score: 100 },
      { label: "Perda pequena (até 15%)", score: 60 },
      { 
        label: "Perda alta (muitos leads somem)", 
        score: 10,
        actionPlan: {
          title: "Sincronia de Leads",
          description: "Desculpa: \"O Facebook marca o clique no formulário, mas o usuário pode não ter completado o envio ou a internet dele caiu.\" ### Realidade: Falha de integração via API/Webhook. Você está pagando por leads que se perdem no caminho e a IA acha que está acertando o alvo."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_scaling_fear',
    category: 'Meta Ads',
    text: "Quando você pede para aumentar a verba para captar mais clientes, o custo por lead sobe tanto que a conta deixa de fechar?",
    tooltip: "Verifique se o Custo por Lead (CPL) dobra quando você aumenta o investimento em 50%.",
    options: [
      { label: "Escalamos mantendo o CPL estável", score: 100 },
      { label: "O custo sobe um pouco, mas ainda lucramos", score: 50 },
      { 
        label: "O custo explode e paramos de escalar", 
        score: 10,
        actionPlan: {
          title: "O Medo da Escala",
          description: "Desculpa: \"O mercado ficou mais caro e o público para o seu serviço é limitado.\" ### Realidade: Falha na Arquitetura Andromeda. Sua conta está fragmentada em muitos públicos pequenos. A IA não tem volume de dados para otimizar a escala."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_approach_fatigue',
    category: 'Meta Ads',
    text: "Sua agência diz que precisa de novos vídeos toda semana porque 'o público já viu tudo' e os leads pararam de chegar?",
    tooltip: "Verifique se a agência usa apenas um ângulo de venda (ex: só fala de preço) em vez de testar novas dores do cliente.",
    options: [
      { label: "Nossos anúncios duram meses ativos", score: 100 },
      { label: "Trocamos a cada 15 ou 30 dias", score: 40 },
      { 
        label: "Trocamos toda semana por queda de performance", 
        score: 10,
        actionPlan: {
          title: "Fadiga de Abordagem",
          description: "Desculpa: \"O criativo cansou, precisamos de algo novo para chamar atenção.\" ### Realidade: Falha de Ângulo Psicológico. Eles estão mudando o vídeo, mas a mensagem é a mesma. Sem um framework de testes de \"Big Idea\", você fica escravo da produção de conteúdo."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_curiosity_filter',
    category: 'Meta Ads',
    text: "Os leads que chegam pelo Meta parecem pessoas que 'clicaram sem querer' ou que não têm o perfil ideal para o seu serviço?",
    tooltip: "Analise a qualidade dos comentários e a primeira resposta do lead.",
    options: [
      { label: "Leads muito qualificados e prontos", score: 100 },
      { label: "Metade é boa, metade é curiosa", score: 40 },
      { 
        label: "A maioria é desqualificada/curiosa", 
        score: 10,
        actionPlan: {
          title: "Filtro de Curiosos",
          description: "Desculpa: \"O Facebook é rede social, as pessoas são mais dispersas mesmo, é volume.\" ### Realidade: A agência está otimizando para o evento mais \"barato\" (clique) e não para o sinal de \"intenção de compra\". Seu pixel está sendo treinado para achar gente desocupada."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_crm_omission',
    category: 'Meta Ads',
    text: "Sua agência sabe quais leads realmente fecharam contrato ou eles só se importam com o 'Custo por Lead'?",
    tooltip: "Verifique se existe um fluxo de dados voltando do seu comercial para o gestor de tráfego.",
    options: [
      { label: "Eles sabem o ROI real de cada venda", score: 100 },
      { label: "Eles sabem quem agendou, mas não quem pagou", score: 40 },
      { 
        label: "Eles só entregam o lead e tchau", 
        score: 10,
        actionPlan: {
          title: "Omissão de CRM",
          description: "Desculpa: \"Nosso papel termina na entrega do lead qualificado.\" ### Realidade: Operação Refém do Volume. Sem saber quem comprou, a IA não consegue aprender a buscar \"perfis de compradores\", apenas \"perfis de clicadores\"."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  }
];

// ... (Código anterior: Tipos, defaultDontKnowActionPlan, productsQuestions e servicesMetaAdsQuestions)

// Continuação: Bloco B e C de Serviços
const servicesGoogleAndGeneralQuestions: Question[] = [
  // Bloco B: Google Ads (Sinais de Intenção para Serviços)
  {
    id: 'service_google_zombie_leads',
    category: 'Google Ads',
    text: "Seu time comercial reclama que os leads vindos do Google 'não atendem o telefone' ou dizem que 'não preencheram nada'?",
    tooltip: "Isso ocorre quando o anúncio aparece em locais errados ou para intenções de busca baratas.",
    options: [
      { label: "Leads atendem e sabem do que se trata", score: 100 },
      { label: "Alguns atendem, outros somem", score: 40 },
      {
        label: "Grande parte parece 'zumbi' (não responde)",
        score: 10,
        actionPlan: {
          title: "Leads 'Zumbis'",
          description: "Desculpa: \"O Google entregou o lead, se ele não atende é um problema de comportamento do consumidor.\" ### Realidade: Falha de Sinais de Intenção. A agência não negativou termos de \"pesquisa informativa\" e você está atraindo gente que quer \"dicas grátis\" e não contratar um serviço."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_google_brand_hijack',
    category: 'Google Ads',
    text: "Se você parar de anunciar o seu próprio nome no Google, suas vendas caem drasticamente?",
    tooltip: "Verifique se a agência gasta boa parte da verba em palavras-chave que são o nome da sua empresa.",
    options: [
      { label: "Vendemos muito para quem não nos conhecia", score: 100 },
      { label: "Metade das vendas vem pelo nosso nome", score: 40 },
      {
        label: "Quase todo o resultado vem de quem já nos buscava",
        score: 10,
        actionPlan: {
          title: "Sequestro de Marca",
          description: "Desculpa: \"Precisamos proteger sua marca contra a concorrência.\" ### Realidade: Eles estão usando o seu tráfego orgânico para \"maquiar\" o relatório. Você está pagando por clientes que já iriam até você de qualquer forma."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_google_display_blindspot',
    category: 'Google Ads',
    text: "Você já viu seus anúncios aparecendo em sites de jogos infantis ou blogs que não têm nada a ver com seu serviço?",
    tooltip: "Olhe em 'Onde os anúncios foram exibidos'. Se houver muitos canais de 'Mobile App', seu dinheiro está sendo drenado.",
    options: [
      { label: "Controle total de onde apareço", score: 100 },
      { label: "Confio na automação do Google", score: 30 },
      {
        label: "Já vi anúncios em sites muito estranhos",
        score: 10,
        actionPlan: {
          title: "Ponto Cego da Rede de Display",
          description: "Desculpa: \"O Google usa IA para encontrar o seu cliente onde quer que ele esteja navegando.\" ### Realidade: Dreno de Verba. O Google empurra sua verba para sites de cliques acidentais (como jogos de criança) para gastar seu orçamento diário rapidamente."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_google_blind_bidding',
    category: 'Google Ads',
    text: "A agência prioriza 'Maximizar Cliques' mesmo você precisando de contatos qualificados (Leads)?",
    tooltip: "Verifique se a estratégia de lances é focada em volume de acesso ou em conversões reais.",
    options: [
      { label: "Focamos em Conversão/tCPA", score: 100 },
      { label: "Focamos em cliques para 'dar volume'", score: 30 },
      {
        label: "Não sei qual estratégia usamos",
        score: 10,
        actionPlan: {
          title: "Estratégia de Lance Cega",
          description: "Desculpa: \"Precisamos de volume de cliques para a conta ganhar relevância antes de focar em leads.\" ### Realidade: Erro de Alinhamento de Smart Bidding. Você está comprando o lixo do leilão (gente que clica mas não converte) enquanto seus concorrentes sêniores levam os melhores clientes."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_lp_abyss',
    category: 'Google Ads',
    text: "Sua agência sugere mudanças no seu site/landing page para melhorar a conversão ou eles dizem que 'o site é problema seu'?",
    tooltip: "O tráfego só leva o cavalo até a água. Se a página não converte, a agência deveria ser a primeira a te avisar.",
    options: [
      { label: "Fazemos testes constantes na página", score: 100 },
      { label: "Eles sugerem mudanças de vez em quando", score: 50 },
      {
        label: "Nunca mexemos na página, o foco é só no anúncio",
        score: 10,
        actionPlan: {
          title: "Abismo da Página de Destino",
          description: "Desculpa: \"Nosso trabalho é trazer as pessoas, se elas não convertem o problema é o seu site ou seu preço.\" ### Realidade: Falha de Visão Macro. Tráfego sênior audita o funil inteiro. Se eles ignoram a página, estão apenas jogando gasolina em um motor furado."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  // Bloco C: Geral (Blindagem Operacional e Estratégica)
  {
    id: 'service_sales_loop',
    category: 'Geral',
    text: "Sua equipe de marketing/tráfego se reúne semanalmente com o seu comercial para avaliar quais leads da semana passada viraram venda?",
    tooltip: "Sem o feedback do comercial, o gestor de tráfego otimiza a conta no escuro, podendo trazer volume sem qualidade.",
    options: [
      { label: "Reuniões semanais e alinhamento total", score: 100 },
      { label: "Conversas informais via WhatsApp", score: 40 },
      {
        label: "Nunca nos reunimos para falar de qualidade",
        score: 10,
        actionPlan: {
          title: "Alinhamento de Vendas (Feedback Loop)",
          description: "Desculpa: \"O tráfego está entregando o CPL (Custo por Lead) dentro da meta, a conversão final depende do seu vendedor.\" ### Realidade: Abismo Operacional. Se o gestor não sabe quem comprou, ele continua gastando verba com o perfil de público errado."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_attribution_origin',
    category: 'Geral',
    text: "Quando uma venda de alto valor é fechada, você consegue saber exatamente qual anúncio ou palavra-chave atraiu esse cliente inicialmente?",
    tooltip: "Serviços têm ciclos longos. Rastrear a origem real (UTM) é a única forma de saber onde colocar mais dinheiro com segurança.",
    options: [
      { label: "Rastreio 100% via CRM ou UTM", score: 100 },
      { label: "Pergunto ao cliente 'onde nos conheceu'", score: 30 },
      {
        label: "Não tenho ideia de qual anúncio trouxe qual venda",
        score: 10,
        actionPlan: {
          title: "Origem da Venda (Atribuição)",
          description: "Desculpa: \"O rastreio em serviços é difícil porque o cliente clica no anúncio mas fecha no WhatsApp/Telefone.\" ### Realidade: Cegueira Estratégica. Falta de configuração de parâmetros UTM. Você está escalando no 'feeling' e não em dados reais de lucro."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_asset_ownership',
    category: 'Geral',
    text: "O seu Pixel, a Conta de Anúncios e o histórico de dados estão vinculados ao SEU CNPJ e e-mail, ou estão na conta da agência?",
    tooltip: "Se os ativos forem da agência, você perde toda a 'inteligência' da conta caso decida trocar de equipe.",
    options: [
      { label: "Tudo no meu nome e tenho acesso total", score: 100 },
      {
        label: "Está no nome da agência, mas tenho acesso",
        score: 20,
        actionPlan: {
            title: "Propriedade de Ativos (Risco)",
            description: "Desculpa: \"Nós usamos nossa conta de agência porque temos suporte prioritário do Google/Meta.\" ### Realidade: Você está em risco. Idealmente os ativos devem ser seus."
        }
      },
      {
        label: "Não tenho acesso ou não sei onde está",
        score: 0,
        actionPlan: {
          title: "Propriedade de Ativos (Sequestro)",
          description: "Desculpa: \"Nós usamos nossa conta de agência porque temos suporte prioritário do Google/Meta.\" ### Realidade: Sequestro de Ativos. Eles estão construindo o patrimônio de dados deles com o SEU dinheiro. Se você sair, volta à estaca zero."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_site_latency',
    category: 'Geral',
    text: "Sua página de captura (Landing Page) abre instantaneamente no celular ou o cliente desiste antes dela carregar?",
    tooltip: "Páginas lentas aumentam o seu Custo por Clique (CPC). O algoritmo te pune cobrando mais caro se sua página for lenta.",
    options: [
      { label: "Abre instantaneamente (menos de 2s)", score: 100 },
      { label: "Carrega razoavelmente bem", score: 50 },
      {
        label: "É lenta, eu mesmo sinto que demora",
        score: 10,
        actionPlan: {
          title: "Velocidade e Latência",
          description: "Desculpa: \"O site está normal, o problema é que o 4G no Brasil é instável.\" ### Realidade: Dreno Técnico. Cada segundo de demora na página de serviços custa cerca de 20% de taxa de conversão. Você está pagando por cliques que nunca viram leads."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'service_cac_survival',
    category: 'Geral',
    text: "Sua agência sabe qual é o seu CAC (Custo de Aquisição) máximo para que sua empresa não tenha prejuízo no final do mês?",
    tooltip: "O gestor precisa saber até quanto pode pagar em um cliente para manter sua margem de lucro saudável.",
    options: [
      { label: "Temos o CAC calculado e metas claras", score: 100 },
      { label: "Temos uma ideia por alto do custo", score: 40 },
      {
        label: "Eles nunca perguntaram sobre minhas margens",
        score: 10,
        actionPlan: {
          title: "Métrica de Sobrevivência (CAC)",
          description: "Desculpa: \"Nosso foco é trazer o máximo de leads possível pelo menor preço, a margem é um controle seu.\" ### Realidade: Gestão por Sorte. Sem saber o CAC limite, a agência pode estar escalando uma operação que, na verdade, está te dando prejuízo a cada venda."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  }
];

const accessQuestions: Question[] = [
  // Bloco A: Meta Ads (Andromeda / Escala de Audiência)
  {
    id: 'access_meta_scale_stress',
    category: 'Meta Ads',
    text: "Quando você aumenta a verba para acelerar a venda de ingressos ou assinaturas, o custo por venda dispara agressivamente?",
    tooltip: "Operações de Acesso dependem de volume. Se o custo dobra ao aumentar a verba, sua conta não tem 'Engenharia de Escala'.",
    options: [
      { label: "Escalamos mantendo o lucro estável", score: 100 },
      { label: "O custo sobe um pouco, mas é aceitável", score: 50 },
      {
        label: "O custo explode e paramos de investir",
        score: 10,
        actionPlan: {
          title: "Estresse de Escala",
          description: "Desculpa: \"O público está ficando saturado com a proximidade da data ou do lançamento.\" ### Realidade: Falha na Arquitetura Andromeda. Sua conta está fragmentada e a IA não consegue consolidar o aprendizado para encontrar novos compradores em massa."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_meta_remarketing_efficiency',
    category: 'Meta Ads',
    text: "Você sente que está pagando para mostrar anúncios para pessoas que já compraram o ingresso ou já assinaram seu produto?",
    tooltip: "Verifique se a agência usa 'Listas de Exclusão'. Pagar por um clique de quem já é cliente é desperdício puro de caixa.",
    options: [
      { label: "Excluímos 100% dos compradores ativos", score: 100 },
      { label: "Excluímos alguns, mas ainda há falhas", score: 40 },
      {
        label: "Aparecemos direto para quem já comprou",
        score: 10,
        actionPlan: {
          title: "Eficiência de Remarketing",
          description: "Desculpa: \"É importante manter o 'branding' mesmo para quem já comprou para gerar desejo.\" ### Realidade: Dreno de Verba Ativo. Eles estão usando seu orçamento de aquisição para inflar métricas com pessoas que já converteram, mascarando a falta de novos clientes."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_meta_angle_fatigue',
    category: 'Meta Ads',
    text: "Sua agência propõe mudanças na oferta e no 'gancho' do vídeo ou eles apenas trocam a cor do botão e o título do anúncio?",
    tooltip: "Em eventos e assinaturas, o que vende é o ângulo psicológico. Mudar apenas o design é ignorar o marketing real.",
    options: [
      { label: "Testamos novos ângulos toda semana", score: 100 },
      { label: "Trocamos o design, mas a mensagem é a mesma", score: 40 },
      {
        label: "Raramente mudamos a estratégia da oferta",
        score: 10,
        actionPlan: {
          title: "Fadiga de Ângulo",
          description: "Desculpa: \"O design atual está com um CTR (taxa de clique) bom, não precisamos mexer na oferta.\" ### Realidade: Inércia Criativa. Eles estão otimizando para o clique e não para a conversão. Sem testar novos ângulos, o seu custo por venda vai subir até o evento quebrar."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_meta_decision_window',
    category: 'Meta Ads',
    text: "A equipe de tráfego avalia o sucesso das campanhas apenas pelo que vendeu hoje ou eles respeitam o tempo que o cliente leva para decidir assinar?",
    tooltip: "No modelo de assinatura ou evento, o cliente raramente compra no primeiro clique. Avaliar apenas o dia atual é tomar decisões precipitadas.",
    options: [
      { label: "Respeitamos a janela de 7 a 28 dias", score: 100 },
      {
        label: "Olhamos apenas o resultado das últimas 24h",
        score: 20,
        actionPlan: {
            title: "Janela de Decisão (Risco)",
            description: "Desculpa: \"Precisamos de resultados imediatos.\" ### Realidade: Risco de matar campanhas boas cedo demais."
        }
      },
      {
        label: "Não temos uma janela de análise definida",
        score: 10,
        actionPlan: {
          title: "Janela de Decisão",
          description: "Desculpa: \"Precisamos de resultados imediatos para justificar o investimento diário.\" ### Realidade: Gestão Ansiosa. Ao pausar anúncios baseados apenas no resultado de 24h, você está \"matando\" suas melhores campanhas antes que elas completem o ciclo de venda."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_meta_conversion_signal',
    category: 'Meta Ads',
    text: "Seu sistema de checkout (onde o cliente paga) está 100% integrado ao Meta para avisar à IA quem pagou no PIX ou Boleto?",
    tooltip: "Se a IA só sabe quem clicou e não quem pagou, ela vai te entregar 'geradores de boletos' em vez de compradores reais.",
    options: [
      { label: "API de conversão ativa com dados de pagamento", score: 100 },
      { label: "Marcamos apenas o acesso à página de 'Obrigado'", score: 40 },
      {
        label: "Não temos integração de servidor/API",
        score: 10,
        actionPlan: {
          title: "Sinal de Conversão",
          description: "Desculpa: \"O rastreio via navegador é suficiente para o nosso volume atual.\" ### Realidade: Dreno de Inteligência. Sem a API de Conversão enviando o sinal do banco para o Meta, você está jogando 30% da verba no lixo com públicos errados."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  // Bloco B: Google Ads (Intenção de Acesso / Busca por Experiência)
  {
    id: 'access_google_intent_pollution',
    category: 'Google Ads',
    text: "Seus anúncios aparecem para pessoas buscando por conteúdos 'grátis' ou 'pirataria' do seu curso/evento?",
    tooltip: "Olhe os 'Termos de Pesquisa'. Se encontrar essas palavras, você está pagando por cliques de quem nunca vai abrir a carteira.",
    options: [
      { label: "Termos limpos e 100% qualificados", score: 100 },
      { label: "Aparecem alguns termos ruins às vezes", score: 40 },
      {
        label: "Vejo muito lixo nos relatórios de busca",
        score: 10,
        actionPlan: {
          title: "Poluição de Intenção",
          description: "Desculpa: \"O Google entrega esses termos por causa da 'Correspondência Ampla' para dar volume.\" ### Realidade: Falta de Higiene de Conta. A agência não utiliza scripts de negativação nem listas de palavras proibidas, jogando 15% da verba no lixo."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_google_brand_hijack',
    category: 'Google Ads',
    text: "Se você pesquisar o nome da sua comunidade/evento agora, o primeiro anúncio é o seu e ele gasta a maior parte da sua verba?",
    tooltip: "Se a agência foca a verba no seu próprio nome, eles estão pagando por alguém que já ia entrar no seu site de qualquer jeito.",
    options: [
      { label: "Focamos em atrair quem não nos conhece", score: 100 },
      {
        label: "Gastamos muito no nosso próprio nome",
        score: 20,
        actionPlan: {
          title: "Sequestro de Tráfego de Marca",
          description: "Desculpa: \"Temos que proteger sua marca para que os concorrentes não roubem seus clientes.\" ### Realidade: Maquiagem de ROI. Eles estão usando seu tráfego gratuito para inflar os números do relatório e esconder que não conseguem trazer gente nova."
        }
      },
      {
        label: "Não sei para quais palavras aparecemos",
        score: 10,
        actionPlan: {
             title: "Sequestro de Tráfego de Marca (Cegueira)",
             description: "Desculpa: \"É automático.\" ### Realidade: Você pode estar perdendo verba para sua própria marca."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_google_pmax_blindspot',
    category: 'Google Ads',
    text: "Sua agência te mostra exatamente em quais sites ou canais do YouTube os seus anúncios de Performance Max estão aparecendo?",
    tooltip: "A PMax pode estar jogando seu dinheiro em sites de notícias falsas ou apps de jogos infantis se não for monitorada.",
    options: [
      { label: "Temos relatórios de exclusão de canais", score: 100 },
      { label: "Confiamos 100% na IA do Google", score: 30 },
      {
        label: "Não sabemos onde o Google nos coloca",
        score: 10,
        actionPlan: {
          title: "Ponto Cego da PMax",
          description: "Desculpa: \"O Google decide automaticamente o melhor lugar para converter o cliente.\" ### Realidade: Vazamento de Caixa Ativo. Sem listas de exclusão, seu anúncio de assinatura aparece em vídeos de desenho animado, gerando cliques acidentais e desperdício de verba."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_google_oci_quality',
    category: 'Google Ads',
    text: "Você atrai muitos inscritos para seus eventos ou testes grátis, mas a taxa de conversão para o plano pago é baixíssima?",
    tooltip: "Verifique se o Google está otimizando para o clique no botão de 'Inscrição' ou se ele recebe o dado de quem realmente pagou.",
    options: [
      { label: "Inscritos altamente qualificados", score: 100 },
      { label: "Volume alto, mas conversão final baixa", score: 40 },
      {
        label: "Muitos leads 'fake' ou desocupados",
        score: 10,
        actionPlan: {
          title: "Qualidade de Inscritos (OCI)",
          description: "Desculpa: \"O Google está entregando o custo por lead (CPL) barato, o problema é o seu processo de vendas/comunidade.\" ### Realidade: Falta de OCI (Importação de Conversão Offline). O Google está viciado em achar gente que \"se inscreve em tudo\", mas não gasta dinheiro. Sem enviar os dados de pagamento de volta para o Google, a IA nunca aprenderá a achar compradores reais."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_google_peak_bidding',
    category: 'Google Ads',
    text: "O custo por venda (CPA) da sua assinatura ou ingresso sobe de forma descontrolada nos dias de maior movimento ou fechamento de lote?",
    tooltip: "Analise se a agência trava o valor máximo por conversão (tCPA) ou se deixa o Google gastar livremente no leilão.",
    options: [
      { label: "Custo estável mesmo no pico", score: 100 },
      { label: "O custo sobe, mas ainda dá lucro", score: 40 },
      {
        label: "O custo por venda inviabiliza o lucro",
        score: 10,
        actionPlan: {
          title: "Estratégia de Lance em Picos",
          description: "Desculpa: \"O leilão fica muito mais disputado nessas datas e os preços sobem para todo mundo.\" ### Realidade: Falta de Alinhamento de Smart Bidding. A agência não configurou limites de lance baseados na sua margem, deixando o Google \"dar o lance que quiser\" apenas para gastar sua verba."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  // Bloco C: Geral (Blindagem de Recorrência e Eventos)
  {
    id: 'access_general_intel_ownership',
    category: 'Geral',
    text: "Se você encerrar com a agência hoje, você perde o acesso aos públicos que visitaram seu site ou se inscreveram nos seus eventos?",
    tooltip: "Esses dados (audiências personalizadas) são o maior ativo da sua empresa. Se estiverem na conta da agência, você está 'Refém'.",
    options: [
      { label: "Sou dono das contas e tenho acesso total", score: 100 },
      { label: "A agência gerencia, mas eu tenho login", score: 50 },
      {
        label: "Não tenho acesso ou as contas são deles",
        score: 0,
        actionPlan: {
          title: "Propriedade da Inteligência",
          description: "Desculpa: \"Nós usamos nossa estrutura para facilitar a gestão técnica.\" ### Realidade: Sequestro de Ativos. Eles estão construindo o negócio deles com o seu dinheiro. Se você sair, terá que começar a treinar a IA do zero."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_general_journey_attribution',
    category: 'Geral',
    text: "Você consegue saber se uma assinatura nova veio do primeiro vídeo que o cliente viu ou se ele só comprou após o remarketing?",
    tooltip: "Verifique se as suas UTMs e o seu Checkout mostram o caminho completo do cliente.",
    options: [
      { label: "Rastreio total da jornada do cliente", score: 100 },
      { label: "Sei apenas de onde veio o último clique", score: 40 },
      {
        label: "Não tenho ideia de qual anúncio trouxe a venda",
        score: 10,
        actionPlan: {
          title: "Atribuição de Jornada",
          description: "Desculpa: \"O cliente vê no Instagram e compra pesquisando no Google depois, é impossível rastrear tudo.\" ### Realidade: Cegueira Operacional. Sem engenharia de atribuição, você pode estar cortando verba de anúncios que \"plantam a semente\" e gastando tudo em remarketing, o que fará suas vendas secarem em 30 dias."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_general_checkout_health',
    category: 'Geral',
    text: "Seu checkout (página de pagamento) carrega instantaneamente ou o cliente desiste antes mesmo de ver os campos do cartão?",
    tooltip: "Teste a velocidade do seu checkout no celular. Cada segundo de espera derruba a conversão de acessos em 20%.",
    options: [
      { label: "Checkout voa, abre em menos de 2s", score: 100 },
      { label: "Carrega razoavelmente bem", score: 50 },
      {
        label: "É lento e trava as vezes",
        score: 10,
        actionPlan: {
          title: "Saúde Técnica do Checkout",
          description: "Desculpa: \"O tráfego está bom, se as pessoas não pagam é porque o público está sem dinheiro.\" ### Realidade: Dreno por Atrito. Você está pagando caro pelo clique, mas perdendo o cliente na \"porta da loja\" por uma falha técnica que a agência deveria ter auditado."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_general_equity_ltv',
    category: 'Geral',
    text: "Sua agência sabe quanto tempo, em média, um assinante fica pagando sua comunidade antes de cancelar (Churn)?",
    tooltip: "Sem saber o Lifetime Value (LTV), você não sabe se pode pagar R$ 10 ou R$ 100 por um novo membro.",
    options: [
      { label: "Métricas de retenção claras e monitoradas", score: 100 },
      { label: "Sei o custo do lead, mas não a retenção", score: 40 },
      {
        label: "Não controlamos o tempo de permanência",
        score: 10,
        actionPlan: {
          title: "Estratégia de Equity (LTV/CAC)",
          description: "Desculpa: \"Nosso trabalho é trazer gente nova, o que acontece depois da venda não é marketing.\" ### Realidade: Visão Tática Amadora. Tráfego de recorrência sênior exige visão financeira. Se eles não olham o LTV, estão apenas \"trocando dinheiro\" e impedindo o crescimento real do seu patrimônio."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'access_general_capi_resilience',
    category: 'Geral',
    text: "Sua nota de 'Qualidade de Correspondência do Evento' no Meta é superior a 6.0/10?",
    tooltip: "Vá no Gerenciador de Eventos > Visão Geral. Se a nota estiver baixa, seu pixel está morrendo.",
    options: [
      { label: "Sinais acima de 6.0/10", score: 100 },
      {
        label: "Sinais baixos ou instáveis",
        score: 20,
        actionPlan: {
             title: "Resiliência de Sinais (Risco)",
             description: "Desculpa: \"O pixel padrão é suficiente.\" ### Realidade: Perda de dados."
        }
      },
      {
        label: "Não temos API de Conversão ativa",
        score: 0,
        actionPlan: {
          title: "Resiliência de Sinais (CAPI)",
          description: "Desculpa: \"Configuramos o pixel padrão, é o máximo que o sistema permite hoje.\" ### Realidade: Fundação Frágil. Sem uma infraestrutura de dados robusta (CAPI), sua operação de assinaturas é um castelo de areia que vai desmoronar na próxima atualização do sistema."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  }
];

const audienceQuestions: Question[] = [
  // Bloco A: Meta Ads (Audiência / Vitrine)
  {
    id: 'audience_meta_retention_quality',
    category: 'Meta Ads',
    text: "Seu número de seguidores cresce com os anúncios, mas quando você posta um conteúdo orgânico ou uma 'Publi', parece que está falando sozinho(a)?",
    tooltip: "Se você ganha 1.000 seguidores mas suas visualizações nos Stories continuam as mesmas, você está injetando 'público morto'.",
    options: [
      { label: "Crescemos com público qualificado que interage", score: 100 },
      { label: "O número cresce, mas o engajamento é instável", score: 50 },
      {
        label: "Temos muitos seguidores novos, mas o engajamento só cai",
        score: 10,
        actionPlan: {
          title: "Qualidade da Base e Retenção",
          description: "Desculpa: \"O Instagram entregou menos esse mês para todo mundo.\" ### Realidade: Poluição de Audiência. Sua agência está focando no \"seguidor barato\" (trash traffic). Eles buscam perfis desocupados que clicam em qualquer coisa, mas não têm poder de compra."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_meta_discovery_ceiling',
    category: 'Meta Ads',
    text: "Ao aumentar o investimento para atrair novos seguidores ou cliques, o custo por resultado sobe tanto que a conta deixa de valer a pena?",
    tooltip: "Verifique se o seu custo para atrair gente nova (CPC) dobra quando você tenta escalar o orçamento diário.",
    options: [
      { label: "Escalamos mantendo o custo estável", score: 100 },
      { label: "O custo sobe um pouco, mas ainda compensa", score: 50 },
      {
        label: "O custo explode e paramos de investir",
        score: 10,
        actionPlan: {
          title: "Teto de Descoberta",
          description: "Desculpa: \"Sua audiência já está saturada nesse nicho, precisamos mudar o tema do conteúdo.\" ### Realidade: Falha na Arquitetura Andromeda. Sua conta está fragmentada em públicos minúsculos. A IA não consegue consolidar dados suficientes para encontrar novas fatias de mercado."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_meta_creative_fatigue',
    category: 'Meta Ads',
    text: "Sua agência pede novos conteúdos quase diariamente alegando que os anúncios atuais 'pararam de entregar' ou saturaram?",
    tooltip: "Verifique se o CPM (custo por mil impressões) sobe sem parar, indicando que a IA não tem variações de ângulo para trabalhar.",
    options: [
      { label: "Nossos anúncios duram semanas ou meses", score: 100 },
      { label: "Trocamos a cada 7 ou 15 dias", score: 40 },
      {
        label: "Trocamos quase todo dia por queda de performance",
        score: 10,
        actionPlan: {
          title: "Fadiga de Criativos",
          description: "Desculpa: \"O público de redes sociais consome conteúdo muito rápido e enjoa.\" ### Realidade: Falta de um framework de Creative Sandboxing. Eles estão testando anúncios no lugar errado e \"queimando\" materiais que poderiam durar meses."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_meta_quality_filter',
    category: 'Meta Ads',
    text: "Você recebe muitos seguidores ou cliques de perfis que parecem falsos, robôs ou pessoas fora do seu idioma/região?",
    tooltip: "Analise a qualidade dos perfis que interagem com seus anúncios de vitrine.",
    options: [
      { label: "Público altamente qualificado e real", score: 100 },
      { label: "Aparecem alguns perfis estranhos às vezes", score: 40 },
      {
        label: "A maioria parece fake ou desinteressada",
        score: 10,
        actionPlan: {
          title: "Filtro de Qualidade de Audiência",
          description: "Desculpa: \"Isso é um efeito colateral normal em campanhas de grande alcance.\" ### Realidade: Dreno de Verba por Posicionamento. A agência não desativou a \"Audience Network\", onde seu dinheiro é gasto em sites e aplicativos de baixa qualidade."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_meta_attribution_window',
    category: 'Meta Ads',
    text: "A agência desliga ou altera seus anúncios se eles não gerarem cliques ou vendas nas primeiras 24 horas?",
    tooltip: "Gestores amadores tentam 'vencer o algoritmo' mexendo na conta a todo momento.",
    options: [
      { label: "Respeitamos a janela de aprendizado da IA", score: 100 },
      {
        label: "Fazemos alterações rápidas para 'testar'",
        score: 20,
        actionPlan: {
            title: "Janela de Atribuição (Risco)",
            description: "Desculpa: \"Agilidade é tudo.\" ### Realidade: Mudanças bruscas resetam a IA."
        }
      },
      {
        label: "Não temos critério, mudamos no 'feeling'",
        score: 10,
        actionPlan: {
          title: "Janela de Atribuição de Influência",
          description: "Desculpa: \"Temos que agir rápido e pausar o que não deu ROI imediato.\" ### Realidade: Ignorância Técnica. O Meta leva até 7 dias para processar dados. Desligar em 24h impede que o sistema otimize sua vitrine, garantindo que você nunca escale."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  // Bloco B: Google Ads
  {
    id: 'audience_google_brand_hijack',
    category: 'Google Ads',
    text: "Se você pesquisar o seu próprio nome agora, o primeiro anúncio é o seu e ele gasta a maior parte da sua verba diária no Google?",
    tooltip: "Se o seu nome ou o nome do seu canal domina as vendas, você está pagando por um tráfego que seria seu de graça.",
    options: [
      { label: "Focamos em atrair quem não nos conhece", score: 100 },
      {
        label: "Gastamos muito no nosso próprio nome",
        score: 20,
        actionPlan: {
            title: "Sequestro de Marca (Risco)",
            description: "Desculpa: \"Proteção de marca.\" ### Realidade: Canibalização do orgânico."
        }
      },
      {
        label: "Quase tudo vem de quem já me busca",
        score: 10,
        actionPlan: {
          title: "Sequestro de Tráfego de Marca",
          description: "Desculpa: \"Precisamos blindar o seu nome para que os concorrentes não roubem sua audiência fiel.\" ### Realidade: Maquiagem de ROI. A agência está \"viciada\" em usar sua fama atual para inflar os números do relatório."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_google_search_hygiene',
    category: 'Google Ads',
    text: "Você já encontrou seus anúncios aparecendo para buscas como 'grátis', 'vagas', 'PDF' ou nomes de concorrentes muito mais baratos?",
    tooltip: "Encontrar palavras irrelevantes significa que seu dinheiro está sendo drenado por falta de limpeza na conta.",
    options: [
      { label: "Meus termos são limpos e qualificados", score: 100 },
      { label: "Aparecem alguns termos ruins às vezes", score: 40 },
      {
        label: "Tem muito lixo e palavras irrelevantes",
        score: 10,
        actionPlan: {
          title: "Higiene de Termos de Busca",
          description: "Desculpa: \"A inteligência do Google traz esses termos para dar volume.\" ### Realidade: Vazamento de Caixa por Negligência. Cerca de 20% do seu orçamento mensal é jogado fora porque a agência não utiliza scripts de negativação automática."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_google_youtube_blindspot',
    category: 'Google Ads',
    text: "Você sabe exatamente em quais canais do YouTube os seus vídeos de indicação aparecem ou confia cegamente na 'IA do Google'?",
    tooltip: "Se houver muitos canais infantis, seu bônus de afiliado está sendo queimado por cliques de crianças.",
    options: [
      { label: "Temos relatórios e exclusões de canais", score: 100 },
      { label: "Sei por alto, mas confio no Google", score: 30 },
      {
        label: "Não tenho ideia de onde meus anúncios saem",
        score: 10,
        actionPlan: {
          title: "Ponto Cego do YouTube e Display",
          description: "Desculpa: \"A IA encontra o seu cliente ideal mesmo que ele esteja em um site de entretenimento ou jogo.\" ### Realidade: Poluição de Vitrine. O Google empurra sua verba para locais de cliques acidentais apenas para gastar seu orçamento diário rápido."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_google_blind_bidding',
    category: 'Google Ads',
    text: "A agência utiliza a estratégia 'Maximizar Cliques' mesmo quando o seu objetivo é vender um produto indicado ou ganhar seguidores?",
    tooltip: "Estratégias de clique buscam volume barato, não intenção real. Verifique se o foco está em 'Vendas' ou 'Conversões'.",
    options: [
      { label: "Focamos 100% em conversão/venda", score: 100 },
      { label: "Focamos em cliques para 'dar volume'", score: 30 },
      {
        label: "Não sei qual estratégia usamos",
        score: 10,
        actionPlan: {
          title: "Estratégia de Lance às Cegas",
          description: "Desculpa: \"Precisamos de volume inicial para que a conta ganhe relevância.\" ### Realidade: Compra de Tráfego de Baixo Valor. Você está comprando o lixo do leilão (pessoas que clicam em tudo, mas não compram nada)."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_google_extensions',
    category: 'Google Ads',
    text: "Seu anúncio na busca do Google ocupa um espaço grande com links extras e frases de destaque, ou é apenas um texto curto?",
    tooltip: "Anúncios completos com 'Recursos' (Extensões) aumentam a taxa de clique e baixam o seu custo.",
    options: [
      { label: "Anúncio completo e robusto", score: 100 },
      { label: "É um texto simples e padrão", score: 40 },
      {
        label: "Nunca reparei no tamanho do anúncio",
        score: 10,
        actionPlan: {
          title: "Extensões e Ativos de Autoridade",
          description: "Desculpa: \"O formato simples é mais direto e costuma converter melhor.\" ### Realidade: Preguiça Operacional. Sem configurar ativos de anúncio, sua nota de qualidade cai, fazendo você pagar mais caro pelo mesmo clique que um concorrente sênior."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  // Bloco C: Geral
  {
    id: 'audience_general_intel_ownership',
    category: 'Geral',
    text: "Se você mudar de agência amanhã, você perde as listas de todas as pessoas que já interagiram com sua vitrine ou visitaram seu site?",
    tooltip: "Suas listas de público e o Pixel são o seu maior patrimônio digital. Se estiverem na conta da agência, a inteligência do seu negócio pertence a eles.",
    options: [
      { label: "Sou dono de tudo e tenho acesso total", score: 100 },
      {
        label: "Tenho acesso, mas está no BM da agência",
        score: 20,
        actionPlan: {
             title: "Propriedade da Inteligência (Risco)",
             description: "Desculpa: \"Facilidade de gestão.\" ### Realidade: Sequestro de Ativos."
        }
      },
      {
        label: "Não tenho acesso ou as contas são deles",
        score: 0,
        actionPlan: {
          title: "Propriedade da Inteligência",
          description: "Desculpa: \"Gerenciamos por nossa estrutura de agência para facilitar a parte técnica.\" ### Realidade: Sequestro de Ativos. Eles estão construindo o patrimônio de dados e inteligência deles com o SEU dinheiro."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_general_forensic_attribution',
    category: 'Geral',
    text: "Você consegue saber qual POST ou VÍDEO específico gerou a venda de afiliado ou a publicidade que caiu hoje?",
    tooltip: "Sem parâmetros de rastreio (UTM) configurados, você está escalando no 'feeling'.",
    options: [
      { label: "Rastreio total da jornada via CRM/UTM", score: 100 },
      {
        label: "Sei apenas a rede social de origem",
        score: 30,
        actionPlan: {
            title: "Atribuição Forense (Risco)",
            description: "Desculpa: \"Limitação da plataforma.\" ### Realidade: Falta de rastreio granular."
        }
      },
      {
        label: "Não faço ideia de onde veio a venda",
        score: 10,
        actionPlan: {
          title: "Atribuição Forense (UTMs)",
          description: "Desculpa: \"O painel de parceiro/afiliado não mostra de onde veio o clique original.\" ### Realidade: Caos de Atribuição. Falta de taxonomia de dados. Você não consegue auditar qual conteúdo é realmente lucrativo."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_general_showcase_speed',
    category: 'Geral',
    text: "O seu link de indicação abre instantaneamente ou você sente que as pessoas desistem porque a página demora a carregar?",
    tooltip: "Páginas lentas aumentam drasticamente o seu custo por clique. Cada segundo de espera custa cerca de 20% de lucro líquido.",
    options: [
      { label: "Abre instantaneamente (menos de 2s)", score: 100 },
      { label: "Carrega razoavelmente bem", score: 50 },
      {
        label: "É muito lento e trava as vezes",
        score: 10,
        actionPlan: {
          title: "Velocidade da Vitrine",
          description: "Desculpa: \"O site está normal, o problema é o servidor do parceiro indicado ou a instabilidade do 4G.\" ### Realidade: Dreno por Atrito. Você está pagando caro pelo clique, mas perdendo o cliente na \"porta da loja\" por uma falha técnica."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_general_ltv_vision',
    category: 'Geral',
    text: "A agência analisa se as pessoas que você atrai hoje compram de você novamente no futuro ou focam apenas no lucro da primeira venda?",
    tooltip: "Sem monitorar a retenção (LTV), você não sabe se sua vitrine é sustentável ou se está apenas 'trocando dinheiro'.",
    options: [
      { label: "Monitoramos recompra e retenção", score: 100 },
      {
        label: "Focamos apenas na primeira venda",
        score: 40,
        actionPlan: {
             title: "Visão de LTV (Risco)",
             description: "Desculpa: \"Foco em novos clientes.\" ### Realidade: Ignorar LTV impede crescimento."
        }
      },
      {
        label: "Não olhamos métricas de lucro futuro",
        score: 10,
        actionPlan: {
          title: "Visão de Valor de Vida (LTV)",
          description: "Desculpa: \"Nosso papel é trazer o cliente pela primeira vez.\" ### Realidade: Visão Tática Curta. Operação amadora focada apenas no ROI diário. Se a agência ignora o lucro futuro, você nunca terá uma operação madura."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  },
  {
    id: 'audience_general_partnership_loop',
    category: 'Geral',
    text: "Existe um alinhamento semanal sobre quais 'Publis' ou conteúdos orgânicos deram mais lucro para ajustar a mira dos anúncios?",
    tooltip: "Sem esse loop de feedback, a agência nunca saberá qual tipo de 'vitrine' o seu público prefere consumir de verdade.",
    options: [
      { label: "Alinhamento total e reuniões semanais", score: 100 },
      {
        label: "Conversamos informalmente por WhatsApp",
        score: 40,
        actionPlan: {
             title: "Feedback Loop (Risco)",
             description: "Desculpa: \"Tráfego é separado.\" ### Realidade: Perda de inteligência orgânica."
        }
      },
      {
        label: "Nunca nos falamos sobre qualidade do conteúdo",
        score: 10,
        actionPlan: {
          title: "Feedback Loop de Parcerias",
          description: "Desculpa: \"O tráfego pago funciona de forma independente do que você posta no seu perfil orgânico.\" ### Realidade: Abismo Operacional. Falha grave de comunicação estratégica. Você está pagando uma agência que ignora a sua maior força de vendas: a sua própria audiência."
        }
      },
      { label: "Não sei informar", score: 0, actionPlan: defaultDontKnowActionPlan }
    ]
  }
];

export const auditQuestions: BusinessModelQuestions = {
  Produtos: productsQuestions, // Definido anteriormente no seu código
  Serviços: [...servicesMetaAdsQuestions, ...servicesGoogleAndGeneralQuestions],
  Acesso: accessQuestions,
  Audiência: audienceQuestions
};