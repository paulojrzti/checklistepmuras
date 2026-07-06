import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** true quando as variáveis de ambiente do Supabase estão configuradas. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/** Cliente Supabase para uso no navegador (auth + leitura da própria licença via RLS). */
export const createClient = () => createBrowserClient(supabaseUrl!, supabaseKey!);
