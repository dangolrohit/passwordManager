import crypto from "crypto";

export function generateApiKey() {
  return `fpm_${crypto.randomBytes(32).toString("base64url")}`;
}

export function hashApiKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function keyPrefix(key: string) {
  return key.slice(0, 12);
}
