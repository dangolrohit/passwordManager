import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAdmin();
    const sessions = await getPrisma().extensionSession.findMany({
      where: { familyMember: { adminId: user.id } },
      select: {
        id: true,
        deviceName: true,
        browserName: true,
        isActive: true,
        revokedAt: true,
        createdAt: true,
        lastUsedAt: true,
        familyMember: { select: { id: true, name: true, relation: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return json({ sessions });
  } catch (error) {
    return handleError(error);
  }
}
