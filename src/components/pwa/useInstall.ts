"use client";

import { useCallback, useEffect, useState } from "react";

export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __epmurasInstallEvent?: BeforeInstallPromptEvent;
  }
}

export const isIos = () =>
  typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

const checkStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true);

/**
 * Estado compartilhado de instalação do PWA. O evento beforeinstallprompt é
 * capturado por um script inline no layout (window.__epmurasInstallEvent),
 * então ele existe mesmo que tenha disparado antes do React montar.
 */
export const useInstall = () => {
  const [canPrompt, setCanPrompt] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setStandalone(checkStandalone());
    setIos(isIos());

    const update = () => setCanPrompt(Boolean(window.__epmurasInstallEvent));
    update();
    window.addEventListener("epmuras-install-ready", update);

    const onInstalled = () => {
      window.__epmurasInstallEvent = undefined;
      setCanPrompt(false);
      setStandalone(true);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("epmuras-install-ready", update);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    const ev = window.__epmurasInstallEvent;
    if (!ev) return "unavailable";
    try {
      await ev.prompt();
      const choice = await ev.userChoice;
      // O evento só pode ser usado uma vez
      window.__epmurasInstallEvent = undefined;
      setCanPrompt(false);
      return choice.outcome;
    } catch {
      window.__epmurasInstallEvent = undefined;
      setCanPrompt(false);
      return "unavailable";
    }
  }, []);

  return { canPrompt, standalone, ios, promptInstall };
};
