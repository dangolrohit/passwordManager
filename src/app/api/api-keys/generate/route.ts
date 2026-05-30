import { createAuditLog } from "@/lib/audit";
import { generateApiKey, hashApiKey, keyPrefix } from "@/lib/apiKey";
import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { apiKeyGenerateSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const user = await requireAdmin();
    const body = apiKeyGenerateSchema.parse(await request.json());
    const member = await getPrisma().familyMember.findFirst({ where: { id: body.familyMemberId, adminId: user.id } });
    if (!member) return json({ error: "Family member not found" }, 404);

    const apiKey = generateApiKey();
    const record = await getPrisma().apiKey.create({
      data: {
        familyMemberId: member.id,
        keyHash: hashApiKey(apiKey),
        keyPrefix: keyPrefix(apiKey),
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
      select: { id: true, keyPrefix: true, isUsed: true, expiresAt: true, createdAt: true },
    });

    await createAuditLog({ adminId: user.id, actorType: "admin", actorName: user.name, action: "api_key_generated", familyMemberId: member.id });
    return json({ apiKey, record }, 201);
  } catch (error) {
    return handleError(error);
  }
}
