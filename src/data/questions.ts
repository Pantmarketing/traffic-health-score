export interface Question {
  id: string;
  label: string;
  points: number;
}

export interface QuestionGroup {
  id: string;
  title: string;
  icon: 'shield' | 'meta' | 'google' | 'dollar';
  channel: 'general' | 'meta' | 'google';
  questions: Question[];
}

export const questionGroups: QuestionGroup[] = [
  {
    id: 'blindagem',
    title: 'Blindagem',
    icon: 'shield',
    channel: 'general',
    questions: [
      { id: 'pixel_instalado', label: 'Pixel e Tag instalados?', points: 10 },
      { id: 'api_conversoes', label: 'API de Conversões (CAPI) ativa?', points: 10 },
      { id: 'deduplicacao', label: 'Deduplicação configurada?', points: 10 },
      { id: 'dominios_verificados', label: 'Domínios verificados?', points: 10 },
    ],
  },
  {
    id: 'meta_ads',
    title: 'Meta Ads',
    icon: 'meta',
    channel: 'meta',
    questions: [
      { id: 'advantage_separado', label: 'Campanhas Advantage+ separadas?', points: 10 },
      { id: 'exclusao_compradores', label: 'Exclusão de compradores feita?', points: 10 },
      { id: 'frequencia_controlada', label: 'Frequência controlada (< 3.0)?', points: 10 },
      { id: 'mix_criativos', label: 'Mix de criativos (Vídeo/Img) ativo?', points: 10 },
    ],
  },
  {
    id: 'google_ads',
    title: 'Google Ads',
    icon: 'google',
    channel: 'google',
    questions: [
      { id: 'display_desativado', label: 'Rede de Display desativada no Search?', points: 10 },
      { id: 'termos_negativados', label: 'Termos de pesquisa negativados?', points: 10 },
      { id: 'conversoes_fundo_funil', label: 'Conversões focadas em Lead/Compra?', points: 10 },
      { id: 'indice_qualidade', label: 'Índice de Qualidade > 7?', points: 10 },
    ],
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    icon: 'dollar',
    channel: 'general',
    questions: [
      { id: 'pausa_automatica', label: 'Regra de pausa automática ativa?', points: 10 },
      { id: 'orcamento_pareto', label: 'Orçamento 80/20 (Pareto)?', points: 10 },
    ],
  },
];

export function getFilteredGroups(channels: string[]): QuestionGroup[] {
  return questionGroups.filter((group) => {
    if (group.channel === 'general') return true;
    return channels.includes(group.channel);
  });
}

export function calculateScore(answers: Record<string, boolean>, channels: string[]): number {
  const filteredGroups = getFilteredGroups(channels);
  let totalPoints = 0;
  let earnedPoints = 0;

  filteredGroups.forEach((group) => {
    group.questions.forEach((question) => {
      totalPoints += question.points;
      if (answers[question.id]) {
        earnedPoints += question.points;
      }
    });
  });

  if (totalPoints === 0) return 0;
  return Math.round((earnedPoints / totalPoints) * 100);
}
