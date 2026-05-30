import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";

const COOKIE_NAME = "family_pm_session";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAuthToken(user: AuthUser) {
  return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role === "MEMBER" ? "MEMBER" : "ADMIN",
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = await verifyAuthToken(token);
  if (!decoded) return null;

  const user = await getPrisma().user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
}

export async function requireParent() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Response("Unauthorized", { status: 401 });
  }
  return user;
}

export async function setAuthCookie(response: NextResponse, user: AuthUser) {
  const token = await createAuthToken(user);
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function authFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return token ? verifyAuthToken(token) : null;
}
