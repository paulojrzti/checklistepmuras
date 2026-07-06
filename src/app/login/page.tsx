"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Loader2 } from "lucide-react";
import { createClient, isSupabaseConfigured } from "../../utils/supabase/client";

const inputClass = "w-full p-2.5 border border-gray-300 rounded-lg bg-white text-brand-gray placeholder:text-gray-400 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors shadow-sm";
const labelClass = "text-sm font-semibold text-brand-dark-green";

type Mode = "login" | "signup" | "forgot" | "reset";

const friendlyError = (message: string): string => {
  if (/invalid login credentials/i.test(message)) return "E-mail ou senha incorretos.";
  if (/user already registered/i.test(message)) return "Este e-mail já tem conta — use a aba Entrar.";
  if (/password should be at least/i.test(message)) return "A senha precisa ter no mínimo 6 caracteres.";
  if (/email not confirmed/i.test(message)) return "Confirme seu e-mail antes de entrar (verifique a caixa de entrada e o spam).";
  if (/rate limit/i.test(message)) return "Muitas tentativas — aguarde alguns minutos e tente de novo.";
  return message;
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), []);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Sessão já ativa -> vai para o app. Link de recuperação -> formulário de nova senha.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await fn();
    } catch (e) {
      setError(friendlyError(e instanceof Error ? e.message : "Algo deu errado. Tente novamente."));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (mode === "login") {
      run(async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/");
      });
    } else if (mode === "signup") {
      run(async () => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.replace("/");
        } else {
          setNotice("Conta criada! Enviamos um link de confirmação para o seu e-mail — clique nele e depois entre.");
          setMode("login");
        }
      });
    } else if (mode === "forgot") {
      run(async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setNotice("Se este e-mail tiver conta, você vai receber um link para redefinir a senha.");
        setMode("login");
      });
    } else {
      run(async () => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.replace("/");
      });
    }
  };

  if (!supabase) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-brand-gray">Supabase ainda não configurado neste ambiente.</p>
      </div>
    );
  }

  const titles: Record<Mode, { title: string; button: string }> = {
    login: { title: "Entrar", button: "Entrar" },
    signup: { title: "Primeiro acesso", button: "Criar meu acesso" },
    forgot: { title: "Recuperar senha", button: "Enviar link de recuperação" },
    reset: { title: "Nova senha", button: "Salvar nova senha" },
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 page-wash">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex bg-brand-dark-green text-brand-beige p-3 rounded-xl ring-1 ring-brand-gold/40 shadow-md mb-3">
            <ClipboardList className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-dark-green">Checklist EPMURAS</h1>
          <p className="text-sm text-brand-gold font-semibold uppercase tracking-wider mt-1">Compra de Gado</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {(mode === "login" || mode === "signup") && (
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-brand-beige p-1 mb-5">
              {(["login", "signup"] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setError(null); }}
                  className={`rounded-md py-2 text-sm font-semibold transition-colors ${
                    mode === m ? "bg-white text-brand-dark-green shadow-sm" : "text-brand-gray/70 hover:text-brand-dark-green"
                  }`}
                >
                  {m === "login" ? "Entrar" : "Primeiro acesso"}
                </button>
              ))}
            </div>
          )}

          <h2 className="font-display text-xl font-bold text-brand-dark-green mb-1">{titles[mode].title}</h2>
          {mode === "signup" && (
            <p className="text-xs text-brand-gray/80 mb-4">
              Use o <strong>mesmo e-mail da compra na Hotmart</strong> — é ele que libera o seu acesso.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {mode !== "reset" && (
              <div className="space-y-1.5">
                <label className={labelClass}>E-mail</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            )}
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <label className={labelClass}>{mode === "reset" ? "Nova senha" : "Senha"}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className={inputClass}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            )}

            {error && <p className="text-sm text-brand-red font-medium">{error}</p>}
            {notice && <p className="text-sm text-brand-green font-medium">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-dark-green text-white py-2.5 text-sm font-semibold hover:bg-brand-deep-green transition-colors shadow-md shadow-brand-dark-green/20 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {titles[mode].button}
            </button>
          </form>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(null); }}
              className="mt-4 text-xs font-semibold text-brand-brown hover:text-brand-gold transition-colors"
            >
              Esqueci minha senha
            </button>
          )}
          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              className="mt-4 text-xs font-semibold text-brand-brown hover:text-brand-gold transition-colors"
            >
              Voltar para o login
            </button>
          )}
        </div>

        <p className="text-center text-xs text-brand-gray/60 mt-4">
          Comprou e não consegue acessar? Fale com o suporte pelo e-mail da sua compra.
        </p>
      </div>
    </div>
  );
}
