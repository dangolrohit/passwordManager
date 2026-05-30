import { requireAdmin } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAdmin();
    const prisma = getPrisma();
    const [totalPasswords, totalFamilyMembers, assignedPasswords, activeExtensionSessions, recentAuditLogs] =
      await Promise.all([
        prisma.passwordItem.count({ where: { adminId: user.id } }),
        prisma.familyMember.count({ where: { adminId: user.id } }),
        prisma.assignedPassword.count({ where: { assignedById: user.id } }),
        prisma.extensionSession.count({ where: { isActive: true, familyMember: { adminId: user.id } } }),
        prisma.auditLog.findMany({
          where: { adminId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, actorName: true, action: true, createdAt: true },
        }),
      ]);

    return json({ totalPasswords, totalFamilyMembers, assignedPasswords, activeExtensionSessions, recentAuditLogs });
  } catch (error) {
    return handleError(error);
  }
}
