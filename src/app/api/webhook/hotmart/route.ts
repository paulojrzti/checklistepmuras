import { NextRequest } from "next/server";
import { createAdminClient } from "../../../../utils/supabase/admin";

/**
 * Webhook da Hotmart (Postback v2).
 *
 * Compra aprovada/completa -> cria/ativa a licença do comprador.
 * Reembolso/chargeback/cancelamento -> revoga a licença.
 *
 * Segurança: valida o token X-HOTMART-HOTTOK (env HOTMART_HOTTOK).
 * O plano é definido pelo ID do produto:
 *   HOTMART_PRODUCT_ID_SIMPLES  -> plan "simples"
 *   HOTMART_PRODUCT_ID_COMPLETO -> plan "completo"
 * Produto não mapeado: assume "completo" e registra aviso (fase de configuração).
 */

const ACTIVATE_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOKE_EVENTS = new Set(["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "PURCHASE_CANCELED"]);

const resolvePlan = (productId: string): "simples" | "completo" => {
  if (productId && productId === process.env.HOTMART_PRODUCT_ID_SIMPLES) return "simples";
  if (productId && productId === process.env.HOTMART_PRODUCT_ID_COMPLETO) return "completo";
  console.warn(`[hotmart-webhook] produto ${productId} não mapeado nas envs — assumindo plano "completo"`);
  return "completo";
};

export async function GET() {
  return Response.json({
    service: "checklist-epmuras",
    webhook: "hotmart",
    status: "online",
    supabase: createAdminClient() ? "conectado" : "aguardando SUPABASE_SECRET_KEY",
  });
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.HOTMART_HOTTOK;
  const receivedToken = request.headers.get("x-hotmart-hottok");

  if (expectedToken && receivedToken !== expectedToken) {
    console.warn("[hotmart-webhook] hottok inválido — requisição rejeitada");
    return Response.json({ error: "invalid token" }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const event = typeof payload.event === "string" ? payload.event : "UNKNOWN";
  const data = (payload.data ?? {}) as {
    buyer?: { email?: string };
    product?: { id?: number | string; name?: string };
    purchase?: { transaction?: string };
  };

  const email = data.buyer?.email?.trim().toLowerCase();
  const productId = String(data.product?.id ?? "");
  const transaction = data.purchase?.transaction ?? null;

  console.log(
    `[hotmart-webhook] evento=${event} produto=${productId || "?"} (${data.product?.name ?? "?"}) comprador=${email ?? "?"}`
  );

  const isActivate = ACTIVATE_EVENTS.has(event);
  const isRevoke = REVOKE_EVENTS.has(event);

  // Eventos que não mexem em licença (pedido de reembolso, aguardando pagamento etc.)
  if (!isActivate && !isRevoke) {
    return Response.json({ received: true, event, action: "none" });
  }

  if (!email) {
    console.warn("[hotmart-webhook] evento sem e-mail do comprador — ignorado");
    return Response.json({ received: true, event, action: "none", reason: "no buyer email" });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    console.error("[hotmart-webhook] SUPABASE_SECRET_KEY não configurada — licença NÃO processada");
    return Response.json({ received: true, event, action: "skipped", reason: "supabase not configured" });
  }

  if (isActivate) {
    const plan = resolvePlan(productId);
    const { data: existing } = await supabase
      .from("licenses")
      .select("id, plan")
      .ilike("email", email)
      .maybeSingle();

    // Upgrade nunca rebaixa: quem já tem "completo" não volta para "simples"
    const finalPlan = existing?.plan === "completo" ? "completo" : plan;

    const { error } = await supabase.from("licenses").upsert(
      {
        email,
        plan: finalPlan,
        status: "active",
        hotmart_transaction: transaction,
        hotmart_product_id: productId || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error(`[hotmart-webhook] erro ao ativar licença de ${email}: ${error.message}`);
      return Response.json({ error: "license upsert failed" }, { status: 500 });
    }

    console.log(`[hotmart-webhook] licença ATIVADA: ${email} (plano ${finalPlan})`);
    return Response.json({ received: true, event, action: "activated", plan: finalPlan });
  }

  // Revogação
  const { error } = await supabase
    .from("licenses")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .ilike("email", email);

  if (error) {
    console.error(`[hotmart-webhook] erro ao revogar licença de ${email}: ${error.message}`);
    return Response.json({ error: "license revoke failed" }, { status: 500 });
  }

  console.log(`[hotmart-webhook] licença REVOGADA: ${email} (evento ${event})`);
  return Response.json({ received: true, event, action: "revoked" });
}
