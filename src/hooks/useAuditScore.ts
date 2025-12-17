import { useState, useMemo } from 'react';

export interface AuditItem {
  id: string;
  label: string;
  checked: boolean;
  points: number;
}

export interface AuditCategory {
  id: string;
  title: string;
  icon: string;
  items: AuditItem[];
}

const initialCategories: AuditCategory[] = [
  {
    id: 'blindagem',
    title: 'Blindagem',
    icon: 'shield',
    items: [
      { id: 'pixel', label: 'Pixel e Tag instalados?', checked: false, points: 10 },
      { id: 'capi', label: 'API de Conversões (CAPI) ativa?', checked: false, points: 10 },
      { id: 'dedup', label: 'Deduplicação configurada?', checked: false, points: 8 },
      { id: 'domains', label: 'Domínios verificados?', checked: false, points: 7 },
    ],
  },
  {
    id: 'meta',
    title: 'Meta Ads',
    icon: 'target',
    items: [
      { id: 'advantage', label: 'Campanhas Advantage+ separadas?', checked: false, points: 8 },
      { id: 'exclusion', label: 'Exclusão de compradores feita?', checked: false, points: 7 },
      { id: 'frequency', label: 'Frequência controlada (< 3.0)?', checked: false, points: 8 },
      { id: 'creatives', label: 'Mix de criativos (Vídeo/Img) ativo?', checked: false, points: 7 },
    ],
  },
  {
    id: 'google',
    title: 'Google Ads',
    icon: 'search',
    items: [
      { id: 'display', label: 'Rede de Display desativada no Search?', checked: false, points: 8 },
      { id: 'negative', label: 'Termos de pesquisa negativados?', checked: false, points: 7 },
      { id: 'conversions', label: 'Conversões focadas em Lead/Compra?', checked: false, points: 8 },
      { id: 'quality', label: 'Índice de Qualidade > 7?', checked: false, points: 7 },
    ],
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    icon: 'dollar',
    items: [
      { id: 'pause', label: 'Regra de pausa automática ativa?', checked: false, points: 8 },
      { id: 'pareto', label: 'Orçamento 80/20 (Pareto)?', checked: false, points: 7 },
    ],
  },
];

export type VerdictType = 'critical' | 'warning' | 'success';

export interface Verdict {
  type: VerdictType;
  title: string;
  description: string;
}

export function useAuditScore() {
  const [categories, setCategories] = useState<AuditCategory[]>(initialCategories);

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  const { score, maxScore, percentage, checkedCount, totalCount } = useMemo(() => {
    let currentScore = 0;
    let maxPossible = 0;
    let checked = 0;
    let total = 0;

    categories.forEach((category) => {
      category.items.forEach((item) => {
        maxPossible += item.points;
        total += 1;
        if (item.checked) {
          currentScore += item.points;
          checked += 1;
        }
      });
    });

    return {
      score: currentScore,
      maxScore: maxPossible,
      percentage: maxPossible > 0 ? Math.round((currentScore / maxPossible) * 100) : 0,
      checkedCount: checked,
      totalCount: total,
    };
  }, [categories]);

  const verdict: Verdict = useMemo(() => {
    if (percentage < 60) {
      return {
        type: 'critical',
        title: 'CRÍTICO',
        description: 'Risco de Bloqueio/Prejuízo',
      };
    }
    if (percentage < 85) {
      return {
        type: 'warning',
        title: 'ATENÇÃO',
        description: 'Otimização Necessária',
      };
    }
    return {
      type: 'success',
      title: 'BLINDADO',
      description: 'Pronto para Escala',
    };
  }, [percentage]);

  const resetAll = () => {
    setCategories(initialCategories);
  };

  return {
    categories,
    toggleItem,
    score,
    maxScore,
    percentage,
    checkedCount,
    totalCount,
    verdict,
    resetAll,
  };
}
