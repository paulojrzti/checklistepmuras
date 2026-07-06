import { NextRequest } from "next/server";

/**
 * Webhook da Hotmart (Postback v2).
 *
 * Eventos relevantes:
 *  - PURCHASE_APPROVED / PURCHASE_COMPLETE  -> liberar licença
 *  - PURCHASE_REFUNDED / PURCHASE_CHARGEBACK / PURCHASE_CANCELED -> revogar licença
 *
 * Segurança: a Hotmart envia o token "hottok" no header X-HOTMART-HOTTOK.
 * Defina HOTMART_HOTTOK nas variáveis de ambiente do Vercel para ativar a
 * validação. Enquanto não estiver definida, o endpoint aceita e apenas
 * registra os eventos (fase de configuração).
 *
 * TODO (próxima etapa, quando os acessos do Supabase chegarem):
 *  - mapear data.product.id -> plano (simples | completo) via env
 *  - criar/ativar licença no Supabase em compra aprovada
 *  - revogar licença em reembolso/chargeback
 */

export async function GET() {
  return Response.json({
    service: "checklist-epmuras",
    webhook: "hotmart",
    status: "online",
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
  };

  console.log(
    `[hotmart-webhook] evento=${event} produto=${data.product?.id ?? "?"} (${data.product?.name ?? "?"}) comprador=${data.buyer?.email ?? "?"}`
  );

  // Por enquanto só confirma o recebimento; a criação/revogação de licenças
  // no Supabase entra na próxima etapa.
  return Response.json({ received: true, event });
}
