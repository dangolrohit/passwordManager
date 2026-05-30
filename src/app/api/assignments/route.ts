import { createAuditLog } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { assignmentSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const user = await requireAdmin();
    const assignments = await getPrisma().assignedPassword.findMany({
      where: { assignedById: user.id },
      include: {
        password: { select: { id: true, platformName: true, websiteUrl: true, username: true, email: true } },
        familyMember: { select: { id: true, name: true, relation: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return json({ assignments });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin();
    const body = assignmentSchema.parse(await request.json());
    const member = await getPrisma().familyMember.findFirst({ where: { id: body.familyMemberId, adminId: user.id } });
    if (!member) return json({ error: "Family member not found" }, 404);

    const ownedPasswords = await getPrisma().passwordItem.findMany({
      where: { id: { in: body.passwordIds }, adminId: user.id },
      select: { id: true },
    });

    await getPrisma().assignedPassword.createMany({
      data: ownedPasswords.map((password) => ({
        passwordId: password.id,
        familyMemberId: body.familyMemberId,
        assignedById: user.id,
      })),
      skipDuplicates: true,
    });

    await createAuditLog({
      adminId: user.id,
      actorType: "admin",
      actorName: user.name,
      action: "password_assigned",
      familyMemberId: body.familyMemberId,
      metadata: { passwordIds: ownedPasswords.map((item) => item.id) },
    });

    return json({ ok: true, assigned: ownedPasswords.length }, 201);
  } catch (error) {
    return handleError(error);
  }
}
