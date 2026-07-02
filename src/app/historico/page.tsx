"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHistoryStore } from "../../store/useHistoryStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Download,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Tag,
  XCircle,
  Eye,
  Calendar,
  Scale,
  Calculator,
  Handshake,
} from "lucide-react";
import {
  getDecision,
  getDecisionText,
  calculateEpmurasScore,
  calculateCommercialScore,
  calculateFinalScore,
} from "../../utils/calculations";
import { displayKg, displayBRL } from "../../utils/pricing";
import { ResultView, ScoreRing } from "../../components/result/ResultView";
import { AnimalEvaluation, Decision } from "../../types/checklist";

const decisionStyles: Record<Decision, { label: string; badge: string; score: string; ring: string }> = {
  boa_compra: {
    label: "Boa Compra",
    badge: "bg-green-100 text-brand-green border border-green-200",
    score: "text-brand-green",
    ring: "#237A57",
  },
  comprar_com_cautela: {
    label: "Comprar com Cautela",
    badge: "bg-amber-100 text-brand-yellow border border-amber-200",
    score: "text-brand-yellow",
    ring: "#B7791F",
  },
  comprar_com_desconto: {
    label: "Comprar com Desconto",
    badge: "bg-orange-100 text-brand-brown border border-orange-200",
    score: "text-brand-brown",
    ring: "#7A4E22",
  },
  nao_comprar: {
    label: "Não Comprar",
    badge: "bg-red-100 text-brand-red border border-red-200",
    score: "text-brand-red",
    ring: "#B42318",
  },
};

const sexLabel: Record<string, string> = {
  macho: "Macho",
  femea: "Fêmea",
  nao_informado: "N/A",
};

type SortOption = "recentes" | "antigas" | "maior_nota" | "menor_nota";

export default function HistoricoPage() {
  const router = useRouter();
  const { evaluations, removeEvaluation } = useHistoryStore();
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("recentes");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = evaluations.filter(e =>
      !term ||
      (e.animalName || "").toLowerCase().includes(term) ||
      (e.lot || "").toLowerCase().includes(term)
    );
    return [...list].sort((a, b) => {
      switch (sort) {
        case "antigas":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "maior_nota":
          return calculateFinalScore(b) - calculateFinalScore(a);
        case "menor_nota":
          return calculateFinalScore(a) - calculateFinalScore(b);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [evaluations, search, sort]);

  if (!mounted) return <div className="p-8 text-center text-brand-gray">Carregando histórico...</div>;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const counts = evaluations.reduce(
    (acc, e) => {
      acc[getDecision(e)]++;
      return acc;
    },
    { boa_compra: 0, comprar_com_cautela: 0, comprar_com_desconto: 0, nao_comprar: 0 } as Record<Decision, number>
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(evaluations, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avaliacoes-epmuras-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryItems = [
    { icon: ClipboardList, iconBg: "bg-brand-green/30 text-emerald-200", value: evaluations.length, label: "Avaliações realizadas" },
    { icon: CheckCircle2, iconBg: "bg-emerald-500/25 text-emerald-300", value: counts.boa_compra, label: "Boas compras" },
    { icon: AlertCircle, iconBg: "bg-amber-500/25 text-amber-300", value: counts.comprar_com_cautela, label: "Com cautela" },
    { icon: Tag, iconBg: "bg-orange-500/25 text-orange-300", value: counts.comprar_com_desconto, label: "Com desconto" },
    { icon: XCircle, iconBg: "bg-red-500/25 text-red-300", value: counts.nao_comprar, label: "Não comprar" },
  ];

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 page-wash">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-brand-dark-green text-brand-beige p-3 rounded-xl shadow-md">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark-green">Histórico</h1>
            <p className="text-brand-gray mt-0.5">Suas avaliações salvas localmente</p>
          </div>
        </div>

        {evaluations.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar avaliação..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-brand-gray placeholder:text-gray-400 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors shadow-sm"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-sm text-brand-gray focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors shadow-sm"
            >
              <option value="recentes">Mais recentes</option>
              <option value="antigas">Mais antigas</option>
              <option value="maior_nota">Maior pontuação</option>
              <option value="menor_nota">Menor pontuação</option>
            </select>
          </div>
        )}
      </div>

      {evaluations.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-brand-dark-green">Nenhuma avaliação encontrada</h3>
          <p className="text-brand-gray mt-2 mb-6">
            Suas avaliações salvas aparecerão aqui.
          </p>
          <Button onClick={() => router.push('/avaliar')}>
            Fazer Primeira Avaliação
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-6 items-start">
          {/* Summary sidebar */}
          <aside className="rounded-2xl bg-brand-dark-green text-white p-5 shadow-lg shadow-brand-dark-green/20 lg:sticky lg:top-24">
            <h3 className="font-bold text-brand-beige mb-4">Resumo do Histórico</h3>
            <ul className="space-y-4">
              {summaryItems.map(({ icon: Icon, iconBg, value, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xl font-bold leading-none">{value}</span>
                    <span className="block text-xs text-white/70 mt-0.5">{label}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleExport}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-beige text-brand-dark-green font-semibold text-sm py-2.5 hover:bg-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Exportar todas
            </button>
          </aside>

          {/* Evaluation cards */}
          <div className="space-y-4 min-w-0">
            {filtered.length === 0 && (
              <Card className="p-8 text-center text-brand-gray">
                Nenhuma avaliação corresponde à busca.
              </Card>
            )}
            {filtered.map((evalItem: AnimalEvaluation) => {
              const decision = getDecision(evalItem);
              const style = decisionStyles[decision];
              const hasVeto = Object.values(evalItem.vetos).some(v => v);
              const decisionText = getDecisionText(decision, hasVeto);
              const epmurasScore = calculateEpmurasScore(evalItem);
              const commercialScore = calculateCommercialScore(evalItem);
              const finalScore = calculateFinalScore(evalItem);
              const expanded = expandedId === evalItem.id;
              const date = new Date(evalItem.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              const initial = (evalItem.animalName || "?").charAt(0).toUpperCase();

              return (
                <Card key={evalItem.id} className="overflow-hidden">
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 md:items-center">
                    {/* Identity */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {evalItem.photo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={evalItem.photo}
                          alt={`Foto de ${evalItem.animalName || 'animal'}`}
                          className="shrink-0 h-12 w-12 rounded-full object-cover ring-2 ring-brand-dark-green/20"
                        />
                      ) : (
                        <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark-green text-brand-beige font-display text-xl font-bold">
                          {initial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-brand-dark-green truncate">
                          {evalItem.animalName || "Animal sem identificação"}
                        </h3>
                        <p className="text-xs font-semibold text-brand-gray/80 uppercase tracking-wide mt-0.5">
                          {evalItem.breedGroup.replace(/_/g, ' ')} • {evalItem.objective.replace(/_/g, ' ')}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-gray/80 mt-2">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{date}</span>
                          <span>{sexLabel[evalItem.sex] ?? evalItem.sex}</span>
                          {evalItem.weight && <span className="inline-flex items-center gap-1"><Scale className="h-3.5 w-3.5" />{displayKg(evalItem.weight)}</span>}
                          {evalItem.price && <span className="inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{displayBRL(evalItem.price)}</span>}
                          {evalItem.lot && <span className="inline-flex items-center gap-1">Lote: {evalItem.lot}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4 md:gap-5 shrink-0">
                      <div className="text-center">
                        <span className={`inline-block text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${style.badge}`}>
                          {style.label}
                        </span>
                        <p className="text-xs text-brand-gray/70 mt-2">Pontuação Final</p>
                        <p className="leading-none mt-0.5">
                          <span className={`text-3xl font-bold ${style.score}`}>{finalScore}</span>
                          <span className="text-sm text-gray-400"> /50</span>
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        <ScoreRing score={finalScore} max={50} color={style.ring} />
                        <div className="text-xs space-y-1">
                          <p><span className="text-brand-gray/70">EPMURAS</span> <strong className="text-brand-dark-green">{epmurasScore}/34</strong></p>
                          <p><span className="text-brand-gray/70">Comercial</span> <strong className="text-brand-dark-green">{commercialScore}/16</strong></p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col items-center gap-2 md:border-l md:border-gray-200 md:pl-4">
                        <Button variant="outline" size="sm" className="bg-white" onClick={() => toggleExpand(evalItem.id)}>
                          <Eye className="mr-1.5 h-4 w-4" />
                          {expanded ? "Ocultar" : "Ver Detalhes"}
                          {expanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                        </Button>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/bonus/calculadora?avaliacao=${evalItem.id}`}
                            aria-label="Calcular preço máximo"
                            title="Calcular preço máximo"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-gold/50 text-brand-brown hover:bg-brand-cream transition-colors"
                          >
                            <Calculator className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeEvaluation(evalItem.id)}
                            aria-label="Excluir avaliação"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-brand-red hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-4 border-t border-gray-200 bg-brand-cream/60 text-sm space-y-4">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="font-semibold text-brand-dark-green mb-1">Decisão Final:</p>
                        <p className="text-brand-gray">{decisionText}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/bonus/calculadora?avaliacao=${evalItem.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-dark-green text-white px-3 py-2 text-xs font-semibold hover:bg-brand-deep-green transition-colors"
                        >
                          <Calculator className="h-3.5 w-3.5" />
                          Calcular preço máximo
                        </Link>
                        <Link
                          href={`/bonus/negociacao?avaliacao=${evalItem.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-dark-green/30 bg-white text-brand-dark-green px-3 py-2 text-xs font-semibold hover:bg-brand-beige transition-colors"
                        >
                          <Handshake className="h-3.5 w-3.5" />
                          Kit de negociação
                        </Link>
                      </div>

                      <ResultView evaluation={evalItem} compact />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
