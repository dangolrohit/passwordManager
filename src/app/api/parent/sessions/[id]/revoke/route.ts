import { createAuditLog } from "@/lib/audit";
import { requireParent } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, ctx: Ctx) {
  try {
    const user = await requireParent();
    const { id } = await ctx.params;
    const session = await getPrisma().extensionSession.findFirst({
      where: { id, familyMember: { adminId: user.id } },
      include: { familyMember: true },
    });
    if (!session) return json({ error: "Session not found" }, 404);
    const updated = await getPrisma().extensionSession.update({
      where: { id },
      data: { isActive: false, revokedAt: new Date() },
    });
    await createAuditLog({
      adminId: user.id,
      actorType: "parent",
      actorName: user.name,
      action: "extension_session_revoked",
      familyMemberId: session.familyMemberId,
      metadata: { sessionId: id },
    });
    return json({ session: updated });
  } catch (error) {
    return handleError(error);
  }
}
