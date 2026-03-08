import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "dev-secret-change-me";
const PASSWORD = process.env.ADMIN_PASSWORD || "natalia2026";

// Simple HMAC-based token (no external deps needed beyond Node built-ins)
async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Buffer.from(sig).toString("base64url");
}

async function verify(payload: string, sig: string): Promise<boolean> {
  const expected = await sign(payload);
  return expected === sig;
}

export async function createToken(): Promise<string> {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + 24 * 60 * 60 * 1000 });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = await sign(b64);
  return b64 + "." + sig;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return false;
    const ok = await verify(b64, sig);
    if (!ok) return false;
    const { exp } = JSON.parse(Buffer.from(b64, "base64url").toString());
    return Date.now() < exp;
  } catch { return false; }
}

export function checkPassword(pwd: string): boolean {
  return pwd === PASSWORD;
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get("admin-token")?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch { return false; }
}
