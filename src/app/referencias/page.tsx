import { Card } from "../../components/ui/Card";
import { ClipboardList } from "lucide-react";

export default function ReferenciasPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="bg-brand-dark-green text-brand-beige p-3 rounded-lg">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-dark-green">Como Funciona o App</h1>
          <p className="text-brand-gray mt-1">Base técnica e critérios de avaliação</p>
        </div>
      </div>

      <Card className="p-6 space-y-6 text-brand-gray">
        <section>
          <h2 className="text-xl font-bold text-brand-dark-green mb-3">Método EPMURAS Adaptado</h2>
          <p className="mb-2">
            Este checklist é baseado no consagrado método de avaliação visual <strong>EPMURAS</strong> (Estrutura, Precocidade, Musculosidade, Umbigo, Racial, Aprumos e Sexualidade).
          </p>
          <p>
            Tradicionalmente usado no melhoramento genético, o método foi adaptado neste aplicativo para a <strong>realidade comercial de compra e venda de gado</strong>, incluindo variáveis que impactam diretamente o bolso do produtor, como sanidade aparente, temperamento, e viabilidade econômica.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-dark-green mb-3">Estrutura Funcional</h2>
          <p>
            O aplicativo introduz o conceito de "Estrutura Funcional". Um animal extremamente grande (nota alta em Estrutura) mas muito tardio (nota baixa em Precocidade) é penalizado. Por outro lado, um animal equilibrado ganha bônus de funcionalidade.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-dark-green mb-3">Filtro Comercial & Vetos</h2>
          <p className="mb-2">
            Além da avaliação visual, o app considera critérios de comercialização. O preço deve sempre deixar margem para o objetivo traçado.
          </p>
          <p>
            O sistema de <strong>Vetos Automáticos</strong> serve como um bloqueio de segurança. Se um animal apresenta risco sanitário, reprodutivo ou comercial grave, a decisão será sempre "Não Comprar", independentemente de quão boa seja sua carcaça.
          </p>
        </section>

        <div className="mt-8 p-4 bg-brand-beige rounded-lg border border-brand-gold text-sm text-brand-brown">
          <p className="font-bold mb-1">Aviso de Isenção de Responsabilidade Técnica</p>
          <p>
            Este aplicativo é uma ferramenta de apoio à decisão visual e financeira. Ele <strong>não substitui</strong> a avaliação técnica de um Médico Veterinário ou Zootecnista. O checklist não substitui exames andrológicos, ginecológicos, testes sanitários, ou uma análise financeira completa da propriedade.
          </p>
        </div>
      </Card>
      
    </div>
  );
}
