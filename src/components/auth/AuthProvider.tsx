"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "../../utils/supabase/client";
import { scopeStoresToUser } from "../../store/scopeStoresToUser";

export type License = {
  id: string;
  email: string;
  plan: "simples" | "completo";
  status: "active" | "revoked";
};

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  user: User | null;
  license: License | null;
  refreshLicense: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  configured: false,
  loading: true,
  user: null,
  license: null,
  refreshLicense: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), []);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const scopedForRef = useRef<string | null>(null);

  // Aponta o localStorage (avaliações, rascunho, progresso) para o usuário logado
  const applyStorageScope = useCallback(async (u: User | null) => {
    const key = u?.id ?? "anon";
    if (scopedForRef.current === key) return;
    scopedForRef.current = key;
    await scopeStoresToUser(u?.id ?? null);
  }, []);

  const fetchLicense = useCallback(
    async (email: string | undefined) => {
      if (!supabase || !email) {
        setLicense(null);
        return;
      }
      const { data } = await supabase
        .from("licenses")
        .select("id, email, plan, status")
        .ilike("email", email)
        .maybeSingle();
      setLicense((data as License) ?? null);
    },
    [supabase]
  );

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      await applyStorageScope(sessionUser);
      await fetchLicense(sessionUser?.email);
      if (!cancelled) setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      await applyStorageScope(sessionUser);
      await fetchLicense(sessionUser?.email);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase, fetchLicense, applyStorageScope]);

  const value: AuthContextValue = {
    configured: isSupabaseConfigured,
    loading,
    user,
    license,
    refreshLicense: async () => fetchLicense(user?.email),
    signOut: async () => {
      await supabase?.auth.signOut();
      setUser(null);
      setLicense(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
