import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAdmin();
    const apiKeys = await getPrisma().apiKey.findMany({
      where: { familyMember: { adminId: user.id } },
      select: {
        id: true,
        keyPrefix: true,
        isUsed: true,
        usedAt: true,
        expiresAt: true,
        createdAt: true,
        familyMember: { select: { id: true, name: true, relation: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return json({ apiKeys });
  } catch (error) {
    return handleError(error);
  }
}
