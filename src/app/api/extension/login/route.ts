import { createAuditLog } from "@/lib/audit";
import { hashApiKey } from "@/lib/apiKey";
import { handleError, json, options } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { extensionLoginSchema } from "@/lib/schemas";
import { generateSessionToken, hashSessionToken } from "@/lib/sessionToken";

export async function OPTIONS() {
  return options();
}

export async function POST(request: Request) {
  try {
    const body = extensionLoginSchema.parse(await request.json());
    const keyHash = hashApiKey(body.apiKey);
    const apiKey = await getPrisma().apiKey.findFirst({
      where: {
        keyHash,
        isUsed: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: { familyMember: true },
    });
    if (!apiKey) return json({ error: "Invalid or expired API key" }, 401);

    const token = generateSessionToken();
    const session = await getPrisma().$transaction(async (tx) => {
      await tx.apiKey.update({ where: { id: apiKey.id }, data: { isUsed: true, usedAt: new Date() } });
      return tx.extensionSession.create({
        data: {
          familyMemberId: apiKey.familyMemberId,
          tokenHash: hashSessionToken(token),
          deviceName: body.deviceName,
          browserName: body.browserName,
          lastUsedAt: new Date(),
        },
        select: { id: true, deviceName: true, browserName: true, createdAt: true },
      });
    });

    await createAuditLog({
      adminId: apiKey.familyMember.adminId,
      actorType: "extension",
      actorName: apiKey.familyMember.name,
      action: "extension_login",
      familyMemberId: apiKey.familyMemberId,
      metadata: { sessionId: session.id },
    });

    return json({ sessionToken: token, session }, 201);
  } catch (error) {
    return handleError(error);
  }
}
