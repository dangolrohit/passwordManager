import crypto from "crypto";

export function generateSessionToken() {
  return `fps_${crypto.randomBytes(36).toString("base64url")}`;
}

export function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
