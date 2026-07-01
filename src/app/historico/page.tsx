"use client";

import { useState, useEffect } from "react";
import { useHistoryStore } from "../../store/useHistoryStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { History, Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { getDecision, getDecisionText } from "../../utils/calculations";

export default function HistoricoPage() {
  const { evaluations, removeEvaluation } = useHistoryStore();
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-8 text-center text-brand-gray">Carregando histórico...</div>;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="bg-brand-dark-green text-brand-beige p-3 rounded-lg">
          <History className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-dark-green">Histórico</h1>
          <p className="text-brand-gray mt-1">Suas avaliações salvas localmente</p>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-brand-dark-green">Nenhuma avaliação encontrada</h3>
          <p className="text-brand-gray mt-2 mb-6">
            Suas avaliações salvas aparecerão aqui.
          </p>
          <Button onClick={() => window.location.href = '/avaliar'}>
            Fazer Primeira Avaliação
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evalItem) => {
            const decision = getDecision(evalItem);
            const decisionText = getDecisionText(decision, Object.values(evalItem.vetos).some(v => v));
            const date = new Date(evalItem.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            return (
              <Card key={evalItem.id} className="overflow-hidden">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-brand-dark-green">
                        {evalItem.animalName || "Animal sem identificação"}
                      </h3>
                      {evalItem.lot && (
                        <Badge>Lote {evalItem.lot}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-brand-gray">
                      {evalItem.breedGroup.replace(/_/g, ' ').toUpperCase()} • {evalItem.objective.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">{date}</p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <Badge variant={decision === "boa_compra" ? "success" : decision === "comprar_com_cautela" ? "warning" : decision === "comprar_com_desconto" ? "warning" : "danger"}>
                      {decision.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(evalItem.id)}>
                        {expandedId === evalItem.id ? "Ocultar" : "Detalhes"}
                        {expandedId === evalItem.id ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => removeEvaluation(evalItem.id)} aria-label="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {expandedId === evalItem.id && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t bg-gray-50 text-sm">
                    <div className="mt-4 p-3 bg-white rounded border">
                      <p className="font-semibold text-brand-dark-green mb-1">Decisão Final:</p>
                      <p className="text-brand-gray">{decisionText}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="font-semibold text-brand-dark-green mb-2">Dados Básicos</p>
                        <ul className="space-y-1 text-brand-gray">
                          <li><strong>Sexo:</strong> {evalItem.sex}</li>
                          <li><strong>Idade:</strong> {evalItem.approximateAge || 'N/A'}</li>
                          <li><strong>Peso:</strong> {evalItem.weight || 'N/A'}</li>
                          <li><strong>Preço:</strong> {evalItem.price || 'N/A'}</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-dark-green mb-2">Resumo de Respostas (EPMURAS)</p>
                        <ul className="space-y-1 text-brand-gray grid grid-cols-2 gap-x-2">
                          <li>E: {evalItem.answers.estrutura}</li>
                          <li>P: {evalItem.answers.precocidade}</li>
                          <li>M: {evalItem.answers.musculosidade}</li>
                          <li>U: {evalItem.answers.umbigo}</li>
                          <li>R: {evalItem.answers.racial}</li>
                          <li>A: {evalItem.answers.aprumos}</li>
                          <li>S: {evalItem.answers.sexualidade}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
