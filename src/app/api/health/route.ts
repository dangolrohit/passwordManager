import { json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    await Promise.race([
      getPrisma().$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database health check timed out")), 4000)),
    ]);

    return json({
      status: "ok",
      hosting: "online",
      database: "connected",
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return json(
      {
        status: "degraded",
        hosting: "online",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Database unavailable",
        checkedAt: new Date().toISOString(),
      },
      503,
    );
  }
}
