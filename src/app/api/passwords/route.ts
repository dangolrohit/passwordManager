import { createAuditLog } from "@/lib/audit";
import { requireParent } from "@/lib/auth";
import { encryptPassword } from "@/lib/encryption";
import { handleError, json, options } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/schemas";

const publicPasswordSelect = {
  id: true,
  platformName: true,
  websiteUrl: true,
  username: true,
  email: true,
  phone: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  assignments: { select: { id: true, familyMember: { select: { id: true, name: true, relation: true } } } },
};

export async function OPTIONS() {
  return options();
}

export async function GET() {
  try {
    const user = await requireParent();
    const passwords = await getPrisma().passwordItem.findMany({
      where: { adminId: user.id },
      select: publicPasswordSelect,
      orderBy: { createdAt: "desc" },
    });
    return json({ passwords });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireParent();
    const body = passwordSchema.parse(await request.json());
    const encrypted = encryptPassword(body.password);
    const password = await getPrisma().passwordItem.create({
      data: {
        adminId: user.id,
        platformName: body.platformName,
        websiteUrl: body.websiteUrl,
        username: body.username || null,
        email: body.email || null,
        phone: body.phone || null,
        notes: body.notes || null,
        ...encrypted,
      },
      select: publicPasswordSelect,
    });
    await createAuditLog({ adminId: user.id, actorType: "parent", actorName: user.name, action: "password_created", passwordId: password.id });
    return json({ password }, 201);
  } catch (error) {
    return handleError(error);
  }
}
