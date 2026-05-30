import { createAuditLog } from "@/lib/audit";
import { requireParent } from "@/lib/auth";
import { encryptPassword } from "@/lib/encryption";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/schemas";

type Ctx = { params: Promise<{ id: string }> };

const select = {
  id: true,
  platformName: true,
  websiteUrl: true,
  username: true,
  email: true,
  phone: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(_: Request, ctx: Ctx) {
  try {
    const user = await requireParent();
    const { id } = await ctx.params;
    const password = await getPrisma().passwordItem.findFirst({ where: { id, adminId: user.id }, select });
    return password ? json({ password }) : json({ error: "Password not found" }, 404);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const user = await requireParent();
    const { id } = await ctx.params;
    const body = passwordSchema.parse(await request.json());
    const existing = await getPrisma().passwordItem.findFirst({ where: { id, adminId: user.id }, select: { id: true } });
    if (!existing) return json({ error: "Password not found" }, 404);
    const updated = await getPrisma().passwordItem.update({
      where: { id },
      data: {
        platformName: body.platformName,
        websiteUrl: body.websiteUrl,
        username: body.username || null,
        email: body.email || null,
        phone: body.phone || null,
        notes: body.notes || null,
        ...encryptPassword(body.password),
      },
      select,
    });
    await createAuditLog({ adminId: user.id, actorType: "parent", actorName: user.name, action: "password_updated", passwordId: id });
    return json({ password: updated });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const user = await requireParent();
    const { id } = await ctx.params;
    const existing = await getPrisma().passwordItem.findFirst({ where: { id, adminId: user.id }, select: { id: true } });
    if (!existing) return json({ error: "Password not found" }, 404);
    await getPrisma().passwordItem.delete({ where: { id } });
    await createAuditLog({ adminId: user.id, actorType: "parent", actorName: user.name, action: "password_deleted", passwordId: id });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
