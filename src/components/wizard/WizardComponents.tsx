import React from 'react';
import { Card } from '../ui/Card';
import { Info } from 'lucide-react';

export const GuidanceCard = ({ title, text }: { title: string; text: string }) => {
  if (!text) return null;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start mb-6">
      <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        {title && <h4 className="font-semibold text-brand-dark-green text-sm mb-1">{title}</h4>}
        <p className="text-sm text-brand-gray">{text}</p>
      </div>
    </div>
  );
};

export const AnswerCard = ({ 
  title, 
  points, 
  description, 
  selected, 
  onClick 
}: { 
  title: string; 
  points: number; 
  description: string; 
  selected: boolean; 
  onClick: () => void 
}) => {
  return (
    <Card 
      hoverable 
      selected={selected} 
      onClick={onClick}
      className={`p-4 flex flex-col h-full transition-all ${selected ? 'border-brand-dark-green ring-2 ring-brand-dark-green bg-green-50' : 'border-gray-200 hover:border-brand-dark-green/50 hover:bg-gray-50'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-brand-dark-green capitalize">{title}</h4>
        <span className="text-xs font-semibold bg-gray-100 text-brand-gray px-2 py-1 rounded-full">
          {points} pts
        </span>
      </div>
      <p className="text-sm text-brand-gray flex-grow">{description}</p>
    </Card>
  );
};

export const StepLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h2 className="text-2xl font-bold text-brand-dark-green">{title}</h2>
      {subtitle && <p className="text-brand-gray mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export const EvaluationStepper = ({ currentStep, totalSteps = 7 }: { currentStep: number, totalSteps?: number }) => {
  return (
    <div className="w-full mb-8 print:hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Etapa {currentStep} de {totalSteps}</span>
        <span className="text-xs text-brand-gray">{Math.round((currentStep / totalSteps) * 100)}% concluído</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-brand-dark-green h-2 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
