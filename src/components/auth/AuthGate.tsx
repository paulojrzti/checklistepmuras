"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, RefreshCw, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

const PUBLIC_PATHS = ["/login"];

const CenterCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center space-y-4">
      {children}
    </div>
  </div>
);

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { configured, loading, user, license, refreshLicense, signOut } = useAuth();

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const needsLogin = configured && !loading && !user && !isPublic;

  useEffect(() => {
    if (needsLogin) router.replace("/login");
  }, [needsLogin, router]);

  if (isPublic) return <>{children}</>;

  if (!configured) {
    return (
      <CenterCard>
        <ShieldAlert className="h-10 w-10 text-brand-yellow mx-auto" />
        <h2 className="font-display text-xl font-bold text-brand-dark-green">Configuração pendente</h2>
        <p className="text-sm text-brand-gray">
          As variáveis de ambiente do Supabase ainda não foram configuradas neste ambiente.
        </p>
      </CenterCard>
    );
  }

  if (loading || needsLogin) {
    return (
      <CenterCard>
        <Loader2 className="h-8 w-8 text-brand-dark-green mx-auto animate-spin" />
        <p className="text-sm text-brand-gray">Verificando seu acesso...</p>
      </CenterCard>
    );
  }

  if (user && (!license || license.status !== "active")) {
    return (
      <CenterCard>
        <ShieldAlert className="h-10 w-10 text-brand-red mx-auto" />
        <h2 className="font-display text-xl font-bold text-brand-dark-green">
          {license ? "Acesso revogado" : "Compra não encontrada"}
        </h2>
        <p className="text-sm text-brand-gray">
          {license
            ? "Esta conta teve o acesso revogado (reembolso ou cancelamento). Se você acredita que é um engano, fale com o suporte."
            : <>Não encontramos uma compra aprovada para <strong>{user.email}</strong>. Use o mesmo e-mail da compra na Hotmart. Se você comprou agora, aguarde 1 minuto e atualize.</>}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => refreshLicense()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-dark-green text-white px-4 py-2 text-sm font-semibold hover:bg-brand-deep-green transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Verificar novamente
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-brand-gray hover:bg-brand-beige transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </CenterCard>
    );
  }

  return <>{children}</>;
};
