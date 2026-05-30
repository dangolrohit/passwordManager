import { requireParent } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const user = await requireParent();
    const { id } = await ctx.params;
    const assignment = await getPrisma().assignedPassword.findFirst({ where: { id, assignedById: user.id } });
    if (!assignment) return json({ error: "Assignment not found" }, 404);
    await getPrisma().assignedPassword.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
