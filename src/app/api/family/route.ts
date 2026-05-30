import { createAuditLog } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { familySchema } from "@/lib/schemas";

export async function GET() {
  try {
    const user = await requireAdmin();
    const family = await getPrisma().familyMember.findMany({ where: { adminId: user.id }, orderBy: { createdAt: "desc" } });
    return json({ family });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin();
    const body = familySchema.parse(await request.json());
    const member = await getPrisma().familyMember.create({
      data: { adminId: user.id, name: body.name, email: body.email || null, relation: body.relation },
    });
    await createAuditLog({ adminId: user.id, actorType: "admin", actorName: user.name, action: "family_member_added", familyMemberId: member.id });
    return json({ member }, 201);
  } catch (error) {
    return handleError(error);
  }
}
