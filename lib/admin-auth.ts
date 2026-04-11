import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

function getAdminSecret(): string | null {
  const s = process.env.ADMIN_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "production") return null;
  return "dev-insecure-admin-secret";
}

function getExpectedPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  if (p !== undefined && p !== "") return p;
  if (process.env.NODE_ENV === "production") return null;
  return "natalia2026";
}

function toBase64Url(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const raw = btoa(binary);
  return raw.split("+").join("-").split("/").join("_").replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
  const padded = b64.split("-").join("+").split("_").join("/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function uint8ToBase64Url(buf: Uint8Array): string {
  let binary = "";
  buf.forEach((b) => (binary += String.fromCharCode(b)));
  const raw = btoa(binary);
  return raw.split("+").join("-").split("/").join("_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return uint8ToBase64Url(new Uint8Array(sig));
}

export async function createToken(): Promise<string> {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + 24 * 60 * 60 * 1000,
  });
  const b64 = toBase64Url(payload);
  const sig = await sign(b64, secret);
  return b64 + "." + sig;
}

export async function verifyToken(token: string): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;

  try {
    const parts = token.split(".");
    const b64 = parts[0];
    const sig = parts[1];
    if (!b64 || !sig) return false;
    const expected = await sign(b64, secret);
    if (expected.length !== sig.length) return false;
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(sig, "utf8");
    if (!timingSafeEqual(a, b)) return false;
    const data = JSON.parse(fromBase64Url(b64));
    return Date.now() < data.exp;
  } catch {
    return false;
  }
}

export function checkPassword(pwd: string): boolean {
  const expected = getExpectedPassword();
  if (expected === null) return false;
  const a = Buffer.from(pwd, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get("admin-token")?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch {
    return false;
  }
}
