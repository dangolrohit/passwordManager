import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { setAuthCookie, verifyPassword } from "@/lib/auth";
import { handleError, json } from "@/lib/http";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await getPrisma().user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return json({ error: "Invalid email or password" }, 401);
    }
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    const response = NextResponse.json({ user: safeUser });
    await setAuthCookie(response, safeUser);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
