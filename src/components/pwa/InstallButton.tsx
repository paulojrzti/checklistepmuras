"use client";

import { useState } from "react";
import { Smartphone, X, Share, MoreVertical, Download } from "lucide-react";
import { useInstall } from "./useInstall";

/**
 * Botão permanente "Instalar aplicativo" (home). Usa o prompt nativo quando
 * disponível; senão abre um passo a passo por plataforma. Some quando o app
 * já está instalado (modo standalone).
 */
export const InstallButton = () => {
  const { canPrompt, standalone, ios, promptInstall } = useInstall();
  const [showHelp, setShowHelp] = useState(false);

  if (standalone) return null;

  const handleClick = async () => {
    if (canPrompt) {
      const outcome = await promptInstall();
      if (outcome !== "accepted" && outcome === "unavailable") setShowHelp(true);
      return;
    }
    setShowHelp(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg border border-brand-dark-green/25 bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark-green hover:bg-brand-beige transition-colors shadow-sm"
      >
        <Smartphone className="h-4 w-4" />
        Instalar aplicativo no celular
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 print:hidden"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4 text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-brand-dark-green">Instalar o aplicativo</h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                aria-label="Fechar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-brand-gray/60 hover:bg-brand-beige transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {ios ? (
              <ol className="space-y-3 text-sm text-brand-gray">
                <li className="flex gap-3">
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white text-xs font-bold">1</span>
                  <span>
                    No Safari, toque no botão <Share className="inline h-4 w-4 mx-0.5 -mt-0.5 text-brand-dark-green" aria-label="Compartilhar" />
                    <strong> Compartilhar</strong> (na barra de baixo).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white text-xs font-bold">2</span>
                  <span>Role a lista e toque em <strong>“Adicionar à Tela de Início”</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white text-xs font-bold">3</span>
                  <span>Confirme em <strong>“Adicionar”</strong> — o ícone do EPMURAS aparece na sua tela inicial.</span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-sm text-brand-gray">
                <li className="flex gap-3">
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white text-xs font-bold">1</span>
                  <span>
                    Abra o menu <MoreVertical className="inline h-4 w-4 mx-0.5 -mt-0.5 text-brand-dark-green" aria-label="Menu" />
                    do navegador (canto superior direito).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white text-xs font-bold">2</span>
                  <span>Toque em <strong>“Instalar app”</strong> ou <strong>“Adicionar à tela inicial”</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white text-xs font-bold">3</span>
                  <span>Confirme — o ícone do EPMURAS aparece na sua tela inicial.</span>
                </li>
              </ol>
            )}

            <p className="flex items-center gap-2 rounded-lg bg-brand-cream border border-brand-gold/30 px-3 py-2 text-xs text-brand-brown">
              <Download className="h-4 w-4 shrink-0" />
              Depois de instalado, o app abre em tela cheia e funciona até sem sinal no curral.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
