"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "epmuras-install-dismissed";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  // iOS Safari
  (navigator as unknown as { standalone?: boolean }).standalone === true;

export const InstallPrompt = () => {
  const { user } = useAuth();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  // Registra o service worker (offline no curral + instalabilidade)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;
    setDismissed(false);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS não tem prompt de instalação — mostramos as instruções
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua)) setShowIos(true);

    const onInstalled = () => {
      localStorage.setItem(DISMISS_KEY, "1");
      setInstallEvent(null);
      setShowIos(false);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    dismiss();
  };

  // Só para usuário logado, fora do modo instalado, e com algo para oferecer
  if (!user || dismissed || (!installEvent && !showIos)) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-sm z-40 print:hidden">
      <div className="rounded-2xl bg-brand-dark-green text-white shadow-xl shadow-brand-dark-green/30 p-4 flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" className="h-11 w-11 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Instale o app no seu celular</p>
          {installEvent ? (
            <>
              <p className="text-xs text-white/80 mt-0.5">
                Acesso direto da tela inicial, em tela cheia — pronto para usar no curral.
              </p>
              <button
                type="button"
                onClick={install}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-brand-gold text-white px-3.5 py-2 text-xs font-bold hover:brightness-110 transition"
              >
                <Download className="h-3.5 w-3.5" />
                Adicionar à tela inicial
              </button>
            </>
          ) : (
            <p className="text-xs text-white/80 mt-0.5">
              Toque em <Share className="inline h-3.5 w-3.5 mx-0.5 -mt-0.5" aria-label="Compartilhar" /> (Compartilhar)
              e depois em <strong>“Adicionar à Tela de Início”</strong>.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar aviso de instalação"
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
