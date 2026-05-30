import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAdmin();
    const logs = await getPrisma().auditLog.findMany({
      where: { adminId: user.id },
      select: {
        id: true,
        actorType: true,
        actorName: true,
        action: true,
        metadata: true,
        createdAt: true,
        password: { select: { id: true, platformName: true } },
        familyMember: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return json({ logs });
  } catch (error) {
    return handleError(error);
  }
}
