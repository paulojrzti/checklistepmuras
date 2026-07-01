import Link from 'next/link';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClipboardList, History, ShieldAlert, CheckCircle, BarChart3, ChevronRight, Info } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-dark-green">
            Checklist EPMURAS
            <span className="block text-2xl sm:text-3xl text-brand-brown mt-2 font-medium">para Compra de Gado</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-brand-gray mx-auto">
            Avalie estrutura, precocidade, musculatura, umbigo, raça, aprumos, sexualidade e fatores comerciais antes de decidir se vale a pena comprar um animal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/avaliar" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-lg group">
              Começar Avaliação
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/historico" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full text-lg">
              <History className="mr-2 h-5 w-5" />
              Ver Histórico
            </Button>
          </Link>
          <Link href="/referencias" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full text-lg">
              <Info className="mr-2 h-5 w-5" />
              Como Funciona
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-12">
          
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-green-100 p-3 rounded-lg text-brand-dark-green">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark-green">Avaliação visual EPMURAS</h3>
            </div>
            <p className="text-brand-gray">
              Método consagrado adaptado para uma análise prática no curral. Sistema de pontuação objetivo com base no tipo comercial e funcionalidade.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-amber-100 p-3 rounded-lg text-brand-brown">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark-green">Ajuste por raça e objetivo</h3>
            </div>
            <p className="text-brand-gray">
              Não avalie um taurino como se fosse zebu. O app adapta os critérios visuais e orientações de acordo com o grupo racial e a sua finalidade de compra.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-red-100 p-3 rounded-lg text-brand-red">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark-green">Vetos automáticos</h3>
            </div>
            <p className="text-brand-gray">
              Identifique rapidamente características inaceitáveis. Um visual bom não paga o prejuízo de um animal doente, manco ou sem fertilidade comprovada.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-emerald-100 p-3 rounded-lg text-brand-green">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark-green">Resultado final de compra</h3>
            </div>
            <p className="text-brand-gray">
              Receba um parecer imediato, variando de "Não Comprar" a "Boa Compra", destacando os pontos fortes e os alertas para auxiliar na sua negociação.
            </p>
          </Card>

        </div>
        
      </div>
    </div>
  );
}
