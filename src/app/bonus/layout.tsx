"use client";

import Link from "next/link";
import { Lock, RefreshCw, Sparkles, GraduationCap, Calculator, Handshake, Briefcase } from "lucide-react";
import { useAuth } from "../../components/auth/AuthProvider";

const lockedFeatures = [
  { icon: GraduationCap, label: "Mini Treinamento do Sistema" },
  { icon: Calculator, label: "Calculadora de Preço Máximo" },
  { icon: Handshake, label: "Kit de Negociação Técnica" },
  { icon: Briefcase, label: "Kit Consultor: Como Cobrar" },
];

export default function BonusLayout({ children }: { children: React.ReactNode }) {
  const { license, refreshLicense } = useAuth();
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_COMPLETO_URL;

  // Plano completo (ou auth ainda não resolvida — o AuthGate cuida disso) passa direto
  if (!license || license.plan === "completo") return <>{children}</>;

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8 page-wash flex items-center">
      <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 text-center space-y-5">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold mx-auto">
          <Lock className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark-green">Área exclusiva do plano Completo</h1>
          <p className="text-sm text-brand-gray mt-2 max-w-md mx-auto">
            Seu acesso atual é o <strong>Checklist EPMURAS</strong> (plano simples). Os 4 bônus abaixo fazem parte
            do plano Completo:
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-md mx-auto">
          {lockedFeatures.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 rounded-lg bg-brand-cream border border-brand-gold/30 px-3 py-2.5">
              <Icon className="h-4 w-4 text-brand-brown shrink-0" />
              <span className="text-xs font-semibold text-brand-dark-green">{label}</span>
            </li>
          ))}
        </ul>

        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-dark-green text-white px-6 py-3 text-sm font-bold hover:bg-brand-deep-green transition-colors shadow-md shadow-brand-dark-green/20"
          >
            <Sparkles className="h-4 w-4" />
            Desbloquear os 4 bônus agora
          </a>
        ) : (
          <p className="text-xs text-brand-gray/70">Fale com o suporte para fazer o upgrade para o plano Completo.</p>
        )}

        <div className="pt-1">
          <button
            type="button"
            onClick={() => refreshLicense()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-brown hover:text-brand-gold transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Já comprei o Completo — verificar meu acesso
          </button>
        </div>

        <p className="text-xs text-brand-gray/60">
          <Link href="/" className="underline hover:text-brand-dark-green">Voltar para o início</Link>
        </p>
      </div>
    </div>
  );
}
