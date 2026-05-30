import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

type AuditInput = {
  adminId: string;
  actorType: "admin" | "extension";
  actorName: string;
  action: string;
  passwordId?: string;
  familyMemberId?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createAuditLog(input: AuditInput) {
  return getPrisma().auditLog.create({
    data: {
      adminId: input.adminId,
      actorType: input.actorType,
      actorName: input.actorName,
      action: input.action,
      passwordId: input.passwordId,
      familyMemberId: input.familyMemberId,
      metadata: input.metadata,
    },
  });
}
