import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const user = await requireAdmin();
    const { id } = await ctx.params;
    const key = await getPrisma().apiKey.findFirst({ where: { id, familyMember: { adminId: user.id } } });
    if (!key) return json({ error: "API key not found" }, 404);
    await getPrisma().apiKey.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
