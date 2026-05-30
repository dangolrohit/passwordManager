import { requireParent } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const user = await requireParent();
    const { id } = await ctx.params;
    const key = await getPrisma().apiKey.findFirst({ where: { id, familyMember: { adminId: user.id } } });
    if (!key) return json({ error: "API key not found" }, 404);
    await getPrisma().apiKey.delete({ where: { id } });
    await createAuditLog({
      adminId: user.id,
      actorType: "parent",
      actorName: user.name,
      action: "api_key_revoked",
      familyMemberId: key.familyMemberId,
      metadata: { apiKeyId: id },
    });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
