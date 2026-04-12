type Bucket = { count: number; resetTime: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PATCH_PER_HOUR = 240;

/** Лимит PATCH /api/works (просмотры/лайки) с одного IP за час. */
export function allowWorksPatch(ip: string): boolean {
  const now = Date.now();
  const record = buckets.get(ip);

  if (!record || now > record.resetTime) {
    buckets.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_PATCH_PER_HOUR) {
    return false;
  }

  record.count += 1;
  return true;
}
