import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { handleError } from "@/lib/http";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const passwordHash = await hashPassword(body.password);
    const user = await getPrisma().user.create({
      data: { name: body.name, email: body.email.toLowerCase(), passwordHash, role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true },
    });
    const response = NextResponse.json({ user }, { status: 201 });
    await setAuthCookie(response, user);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
