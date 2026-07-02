"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEvaluationStore } from "../../store/useEvaluationStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { MaskedNumberInput } from "../../components/ui/MaskedNumberInput";
import { StepLayout, EvaluationStepper, WizardSidebar, AnswerCard, GuidanceCard } from "../../components/wizard/WizardComponents";
import { PhotoField } from "../../components/wizard/PhotoField";
import { ResultView } from "../../components/result/ResultView";
import { epmurasQuestions, commercialQuestions } from "../../data/questions";
import { breedGroupsInfo } from "../../data/breeds";
import { objectiveInfo } from "../../data/objectives";
import { vetosList } from "../../data/vetos";
import { getBreedGuidance, getObjectiveGuidance } from "../../utils/calculations";
import { BreedGroup, PurchaseObjective } from "../../types/checklist";
import {
  AlertCircle,
  Printer,
  Save,
  Tag,
  Target,
  Activity,
  Layers,
  Filter,
  ShieldAlert,
  Award,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Calculator
} from "lucide-react";

const inputClass = "w-full p-2.5 border border-gray-300 rounded-lg bg-white text-brand-gray placeholder:text-gray-400 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors shadow-sm";
const labelClass = "text-sm font-semibold text-brand-dark-green";

const stepIcons: Record<number, React.ReactNode> = {
  1: <Tag className="h-6 w-6" />,
  2: <Target className="h-6 w-6" />,
  3: <Activity className="h-6 w-6" />,
  4: <Layers className="h-6 w-6" />,
  5: <Filter className="h-6 w-6" />,
  6: <ShieldAlert className="h-6 w-6" />,
  7: <Award className="h-6 w-6" />,
};

export default function AvaliarPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { currentStep, evaluation, setStep, nextStep, prevStep, updateField, updateAnswer, updateVeto, resetEvaluation } = useEvaluationStore();
  const { addEvaluation } = useHistoryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  if (!mounted) return <div className="p-8 text-center">Carregando...</div>;

  const handleSaveAndExit = () => {
    addEvaluation(evaluation);
    router.push("/historico");
  };

  const handlePrint = () => {
    window.print();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepLayout title="1. Identificação" subtitle="Dados básicos do animal" icon={stepIcons[1]}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className={labelClass}>Nome ou Brinco <span className="text-brand-red">*</span></label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Ex: Nelore 1024"
                  value={evaluation.animalName || ''}
                  onChange={e => updateField('animalName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Lote (opcional)</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Ex: Lote 5"
                  value={evaluation.lot || ''}
                  onChange={e => updateField('lot', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Sexo <span className="text-brand-red">*</span></label>
                <select
                  className={inputClass}
                  value={evaluation.sex}
                  onChange={e => updateField('sex', e.target.value as any)}
                >
                  <option value="nao_informado">Não informado</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Idade Aproximada</label>
                <MaskedNumberInput
                  suffix="meses"
                  placeholder="Ex: 24"
                  value={evaluation.approximateAge || ''}
                  onChange={v => updateField('approximateAge', v)}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Peso Estimado</label>
                <MaskedNumberInput
                  suffix="kg"
                  placeholder="Ex: 450"
                  value={evaluation.weight || ''}
                  onChange={v => updateField('weight', v)}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Preço</label>
                <MaskedNumberInput
                  prefix="R$"
                  placeholder="Ex: 3.500"
                  value={evaluation.price || ''}
                  onChange={v => updateField('price', v)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className={labelClass}>Foto do Animal</label>
                <PhotoField
                  value={evaluation.photo}
                  onChange={photo => updateField('photo', photo)}
                />
              </div>
            </div>
          </StepLayout>
        );
      case 2:
        return (
          <StepLayout title="2. Raça e Objetivo" subtitle="Selecione para ajustar as orientações (Obrigatório)" icon={stepIcons[2]}>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className={labelClass}>Grupo Racial</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(breedGroupsInfo).map(([key, info]) => (
                    <Card
                      key={key}
                      hoverable
                      selected={evaluation.breedGroup === key}
                      onClick={() => updateField('breedGroup', key as BreedGroup)}
                      className={`p-3 text-sm text-center transition-colors ${evaluation.breedGroup === key ? 'text-brand-dark-green font-bold' : 'text-brand-gray font-medium'}`}
                    >
                      {info.label}
                    </Card>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className={labelClass}>Objetivo de Compra</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(objectiveInfo).map(([key, info]) => (
                    <Card
                      key={key}
                      hoverable
                      selected={evaluation.objective === key}
                      onClick={() => updateField('objective', key as PurchaseObjective)}
                      className={`p-3 text-sm text-center transition-colors ${evaluation.objective === key ? 'text-brand-dark-green font-bold' : 'text-brand-gray font-medium'}`}
                    >
                      {info.label}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </StepLayout>
        );
      case 3:
      case 4:
      case 5:
        // Steps 3, 4, 5 handle specific questions
        const isStep3 = currentStep === 3;
        const isStep4 = currentStep === 4;

        let questionsToRender = [];
        let stepTitle = "";
        let stepSub = "";

        if (isStep3) {
          questionsToRender = epmurasQuestions.slice(0, 3);
          stepTitle = "3. E, P, M";
          stepSub = "Estrutura, Precocidade e Musculosidade";
        } else if (isStep4) {
          questionsToRender = epmurasQuestions.slice(3, 7);
          stepTitle = "4. U, R, A, S";
          stepSub = "Umbigo, Racial, Aprumos e Sexualidade";
        } else {
          questionsToRender = commercialQuestions;
          stepTitle = "5. Filtro Comercial";
          stepSub = "Avaliação de mercado, sanidade e temperamento";
        }

        return (
          <StepLayout title={stepTitle} subtitle={stepSub} icon={stepIcons[currentStep]}>
            <div className="space-y-4 mb-6">
              {(isStep3 || isStep4) && evaluation.breedGroup !== 'nao_informado' && (
                <GuidanceCard title="Foco Racial" text={getBreedGuidance(evaluation.breedGroup)} />
              )}
              {currentStep === 5 && evaluation.objective !== 'nao_informado' && (
                <GuidanceCard title="Foco do Objetivo" text={getObjectiveGuidance(evaluation.objective)} />
              )}
            </div>

            <div className="space-y-10">
              {questionsToRender.map((q) => {
                const currentAnswer = evaluation.answers[q.key as keyof typeof evaluation.answers];
                const isRacialCruzado = q.key === 'racial' && evaluation.breedGroup === 'cruzado_comercial';

                return (
                  <div key={q.key} className="space-y-3">
                    <h3 className="font-semibold text-lg text-brand-dark-green">
                      {isRacialCruzado ? "Uniformidade e tipo comercial" : q.question}
                    </h3>
                    {isRacialCruzado && (
                      <p className="text-sm text-brand-brown mb-2 bg-brand-beige p-2.5 rounded-lg">
                        Para cruzados, não avalie pureza racial. Avalie padronização, tipo de carcaça, adaptação e aceitação comercial.
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(['bom', 'medio', 'ruim'] as const).map(level => (
                        <AnswerCard
                          key={level}
                          title={level}
                          points={q.answers[level].points}
                          description={q.answers[level].text}
                          selected={currentAnswer === level}
                          onClick={() => updateAnswer(q.key as any, level)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </StepLayout>
        );
      case 6:
        return (
          <StepLayout title="6. Vetos Automáticos" subtitle="Marque se o animal apresentar alguma condição crítica" icon={stepIcons[6]}>
            <GuidanceCard title="Atenção" text="Se qualquer veto for verdadeiro, a decisão final será 'Não comprar', independente da pontuação." />

            <div className="space-y-3">
              {vetosList.map((veto) => (
                <Card
                  key={veto.key}
                  hoverable
                  onClick={() => updateVeto(veto.key as any, !evaluation.vetos[veto.key as keyof typeof evaluation.vetos])}
                  className={`p-4 flex items-start gap-3 transition-colors ${evaluation.vetos[veto.key as keyof typeof evaluation.vetos] ? 'bg-red-50 border-red-200' : 'bg-white'}`}
                >
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded text-brand-red focus:ring-brand-red cursor-pointer"
                      checked={evaluation.vetos[veto.key as keyof typeof evaluation.vetos]}
                      readOnly
                    />
                  </div>
                  <span className={`text-sm ${evaluation.vetos[veto.key as keyof typeof evaluation.vetos] ? 'text-red-800 font-medium' : 'text-brand-gray'}`}>
                    {veto.text}
                  </span>
                </Card>
              ))}
            </div>
          </StepLayout>
        );
      case 7:
        // Check if all answered
        const allAnswered = Object.values(evaluation.answers).every(a => a !== 'nao_informado');
        if (!allAnswered) {
          return (
            <StepLayout title="Resultado Final" icon={stepIcons[7]}>
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-brand-yellow mx-auto mb-4" />
                <h3 className="text-xl font-bold text-brand-dark-green">Avaliação Incompleta</h3>
                <p className="text-brand-gray mt-2">
                  Complete todos os itens EPMURAS e do Filtro Comercial para gerar a nota.
                </p>
                <Button className="mt-6" onClick={() => setStep(3)}>Voltar para perguntas</Button>
              </Card>
            </StepLayout>
          );
        }

        return (
          <StepLayout title="7. Resultado Final" icon={stepIcons[7]}>
            <div className="space-y-6">
              <ResultView evaluation={evaluation} />

              {/* Actions for Step 7 */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 pt-6 print:hidden">
                <Button size="lg" onClick={handleSaveAndExit}>
                  <Save className="mr-2 h-5 w-5" /> Salvar Avaliação
                </Button>
                <Button variant="secondary" size="lg" onClick={() => router.push('/bonus/calculadora')}>
                  <Calculator className="mr-2 h-5 w-5" /> Calcular Preço Máximo
                </Button>
                <Button variant="outline" size="lg" onClick={handlePrint}>
                  <Printer className="mr-2 h-5 w-5" /> Imprimir / PDF
                </Button>
                <Button variant="ghost" size="lg" onClick={() => { resetEvaluation(); router.push('/'); }}>
                  Nova Avaliação
                </Button>
              </div>
            </div>
          </StepLayout>
        );
      default:
        return null;
    }
  };

  // Validation to proceed
  const canProceed = () => {
    if (currentStep === 1) {
      return !!evaluation.animalName?.trim() && evaluation.sex !== 'nao_informado';
    }
    if (currentStep === 2) {
      return evaluation.breedGroup !== 'nao_informado' && evaluation.objective !== 'nao_informado';
    }
    return true;
  };

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 page-wash">
      <div className="flex gap-6 items-start">
        <WizardSidebar currentStep={currentStep} totalSteps={7} onStepClick={setStep} />

        <div className="flex-1 min-w-0">
          <EvaluationStepper currentStep={currentStep} totalSteps={7} />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 print:border-none print:shadow-none print:p-0">
            {renderStepContent()}
          </div>

          {currentStep < 7 && (
            <div className="flex justify-between items-center print:hidden">
              <Button
                variant="outline"
                className="bg-white"
                onClick={currentStep === 1 ? () => router.push('/') : prevStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveAndExit} className="hidden sm:inline-flex bg-white">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </Button>
                <Button onClick={nextStep} disabled={!canProceed()} className="shadow-md shadow-brand-dark-green/20">
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
