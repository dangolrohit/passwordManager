import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export function options() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export function handleError(error: unknown) {
  if (error instanceof Response) {
    return json({ error: error.statusText || "Unauthorized" }, error.status);
  }

  if (error instanceof ZodError) {
    return json({ error: "Invalid input", details: error.flatten() }, 400);
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  if (message.includes("Can't reach database server") || message.includes("Environment variable not found: DATABASE_URL")) {
    return json(
      {
        error:
          "Database is not connected. Set DATABASE_URL in .env, run npm run prisma:migrate, then restart npm run dev.",
      },
      503,
    );
  }

  if (message.includes("Invalid `") && message.includes("Prisma")) {
    return json({ error: "Database request failed. Check your database connection and schema migrations." }, 500);
  }

  return json({ error: message }, 500);
}
