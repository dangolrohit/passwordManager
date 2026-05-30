import { decryptPassword } from "@/lib/encryption";
import { buildAutofillHints } from "@/lib/autofill";
import { handleError, json, options } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { hashSessionToken } from "@/lib/sessionToken";

export async function OPTIONS() {
  return options();
}

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return json({ error: "Missing session token" }, 401);
    const session = await getPrisma().extensionSession.findFirst({
      where: { tokenHash: hashSessionToken(token), isActive: true },
      include: { familyMember: true },
    });
    if (!session) return json({ error: "Invalid session" }, 401);

    await getPrisma().extensionSession.update({ where: { id: session.id }, data: { lastUsedAt: new Date() } });
    const assignments = await getPrisma().assignedPassword.findMany({
      where: { familyMemberId: session.familyMemberId },
      include: { password: true },
      orderBy: { createdAt: "desc" },
    });

    const passwords = assignments.map(({ password }) => ({
      id: password.id,
      platformName: password.platformName,
      websiteUrl: password.websiteUrl,
      username: password.username,
      email: password.email,
      phone: password.phone,
      notes: password.notes,
      password: decryptPassword(password),
      autofill: buildAutofillHints({
        platformName: password.platformName,
        websiteUrl: password.websiteUrl,
      }),
      updatedAt: password.updatedAt,
    }));

    return json({ passwords });
  } catch (error) {
    return handleError(error);
  }
}
