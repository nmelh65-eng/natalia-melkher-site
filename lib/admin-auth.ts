import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "dev-secret-change-me";
const PASSWORD = process.env.ADMIN_PASSWORD || "natalia2026";

function toBase64Url(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
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
  buf.forEach(b => binary += String.fromCharCode(b));
  const raw = btoa(binary);
  return raw.split("+").join("-").split("/").join("_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return uint8ToBase64Url(new Uint8Array(sig));
}

export async function createToken(): Promise<string> {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + 24 * 60 * 60 * 1000 });
  const b64 = toBase64Url(payload);
  const sig = await sign(b64);
  return b64 + "." + sig;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    const b64 = parts[0];
    const sig = parts[1];
    if (!b64 || !sig) return false;
    const expected = await sign(b64);
    if (expected !== sig) return false;
    const data = JSON.parse(fromBase64Url(b64));
    return Date.now() < data.exp;
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