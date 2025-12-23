export type ActionPlan = {
  title: string;
  description: string;
  severity: 'high' | 'medium';
};

export type Question = {
  id: string;
  category: string;
  text: string;
  options: {
    label: string;
    score: number; // 0 = bom, 1 = ruim (risco)
    actionPlan?: ActionPlan; // Só existe se a resposta for ruim
  }[];
};

export const questions: Question[] = [
  {
    id: 'acesso_conta',
    category: 'Propriedade',
    text: 'Você tem acesso Admin à sua conta de anúncios e ao Business Manager?',
    options: [
      { label: 'Sim, tenho acesso total.', score: 0 },
      {
        label: 'Não, a conta é da agência/gestor.',
        score: 1,
        actionPlan: {
          title: 'PROTOCOLO DE PROPRIEDADE',
          description: 'Você está construindo casa em terreno alugado. Solicite acesso Admin Imediato ao BM. Se negarem, notifique quebra de contrato. O ativo de dados deve ser SEU.',
          severity: 'high'
        }
      }
    ]
  },
  {
    id: 'relatorios',
    category: 'Transparência',
    text: 'O que a agência destaca no topo do relatório mensal?',
    options: [
      { label: 'Lucro Líquido, ROI ou Receita.', score: 0 },
      {
        label: 'Alcance, Cliques ou Curtidas.',
        score: 1,
        actionPlan: {
          title: 'PROTOCOLO ANTI-VAIDADE',
          description: 'Sua equipe otimiza para ego, não para bolso. Proíba métricas de vaidade nos reports. Exija foco em DRE (Investimento vs Retorno Real).',
          severity: 'medium'
        }
      }
    ]
  },
  {
    id: 'criativos',
    category: 'Proatividade',
    text: 'Quando foi a última vez que ELES pediram novos criativos (vídeos/fotos)?',
    options: [
      { label: 'Neste mês / Semana passada.', score: 0 },
      {
        label: 'Faz mais de 2 meses ou nunca pedem.',
        score: 1,
        actionPlan: {
          title: 'SLA DE OXIGENAÇÃO',
          description: 'Sua conta está morrendo por inanição. Institua a regra: 3 novos testes de criativos por semana obrigatoriamente, ou troque a equipe.',
          severity: 'high'
        }
      }
    ]
  }
];
