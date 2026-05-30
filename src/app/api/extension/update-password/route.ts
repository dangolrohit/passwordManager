import { createAuditLog } from "@/lib/audit";
import { encryptPassword } from "@/lib/encryption";
import { handleError, json, options } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { extensionPasswordUpdateSchema } from "@/lib/schemas";
import { hashSessionToken } from "@/lib/sessionToken";

export async function OPTIONS() {
  return options();
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return json({ error: "Missing session token" }, 401);

    const body = extensionPasswordUpdateSchema.parse(await request.json());
    const session = await getPrisma().extensionSession.findFirst({
      where: { tokenHash: hashSessionToken(token), isActive: true },
      include: { familyMember: true },
    });
    if (!session) return json({ error: "Invalid session" }, 401);

    const assignment = await getPrisma().assignedPassword.findFirst({
      where: { familyMemberId: session.familyMemberId, passwordId: body.passwordId },
      include: { password: true },
    });
    if (!assignment) return json({ error: "Password is not assigned to this session" }, 403);

    await getPrisma().passwordItem.update({ where: { id: body.passwordId }, data: encryptPassword(body.password) });
    await createAuditLog({
      adminId: session.familyMember.adminId,
      actorType: "extension",
      actorName: session.familyMember.name,
      action: "extension_password_updated",
      passwordId: body.passwordId,
      familyMemberId: session.familyMemberId,
    });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
