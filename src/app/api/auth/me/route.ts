import { getCurrentUser } from "@/lib/auth";
import { json } from "@/lib/http";

export async function GET() {
  const user = await getCurrentUser();
  return json({ user });
}
