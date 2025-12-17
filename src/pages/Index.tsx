import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { AuditCard } from '@/components/AuditCard';
import { ScoreCard } from '@/components/ScoreCard';
import { useAuditScore } from '@/hooks/useAuditScore';
import { RotateCcw, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [activeNav, setActiveNav] = useState('auditoria');
  const {
    categories,
    toggleItem,
    percentage,
    checkedCount,
    totalCount,
    verdict,
    resetAll,
  } = useAuditScore();

  const handleReset = () => {
    resetAll();
    toast.success('Checklist reiniciado com sucesso');
  };

  const handleExport = () => {
    toast.info('Exportando relatório...');
  };

  const handleShare = () => {
    toast.info('Link de compartilhamento copiado!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar activeItem={activeNav} onItemClick={setActiveNav} />

        {/* Main Content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-4rem)]">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                Auditoria de Tráfego Pago
              </h2>
              <p className="text-muted-foreground">
                Verifique a saúde das suas campanhas e otimize seus resultados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audit Cards - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                  <AuditCard
                    key={category.id}
                    category={category}
                    onToggle={toggleItem}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Score Card - Right sidebar */}
            <div className="lg:col-span-1">
              <ScoreCard
                percentage={percentage}
                checkedCount={checkedCount}
                totalCount={totalCount}
                verdict={verdict}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
