import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { familySchema } from "@/lib/schemas";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const user = await requireAdmin();
    const { id } = await ctx.params;
    const body = familySchema.parse(await request.json());
    const existing = await getPrisma().familyMember.findFirst({ where: { id, adminId: user.id } });
    if (!existing) return json({ error: "Family member not found" }, 404);
    const member = await getPrisma().familyMember.update({
      where: { id },
      data: { name: body.name, email: body.email || null, relation: body.relation },
    });
    return json({ member });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const user = await requireAdmin();
    const { id } = await ctx.params;
    const existing = await getPrisma().familyMember.findFirst({ where: { id, adminId: user.id } });
    if (!existing) return json({ error: "Family member not found" }, 404);
    await getPrisma().familyMember.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
