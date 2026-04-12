const EMAIL = "natalia@melkher.com";

export function instagramUrl(): string {
  const u = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();
  return u || "https://www.instagram.com/nataliamelkher/";
}

export function facebookUrl(): string {
  return process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || mailtoSubject("Facebook");
}

export function youtubeUrl(): string {
  return process.env.NEXT_PUBLIC_YOUTUBE_URL?.trim() || mailtoSubject("YouTube");
}

export function tiktokUrl(): string {
  return process.env.NEXT_PUBLIC_TIKTOK_URL?.trim() || mailtoSubject("TikTok");
}

function mailtoSubject(subject: string): string {
  return `mailto:${EMAIL}?${new URLSearchParams({ subject: `Соцсеть: ${subject}` })}`;
}
