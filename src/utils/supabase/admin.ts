import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente administrativo (server-only, usa a chave secreta e ignora RLS).
 * Usado pelo webhook da Hotmart para criar/revogar licenças.
 * Retorna null se as variáveis de ambiente ainda não estiverem configuradas.
 */
export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) return null;

  return createSupabaseClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
