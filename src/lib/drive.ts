/**
 * Google Drive video linkini <iframe> üçün embed formasına çevirir.
 *
 * Qəbul edilən formatlar:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID
 *   FILE_ID (təkbaşına)
 *
 * Artıq /preview şəklindədirsə olduğu kimi qaytarılır.
 * Tanınmayan link null qaytarır — dərs panelində "video linki düzgün deyil" göstərilir.
 */
export function driveEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const url = raw.trim()
  if (!url) return null

  if (url.includes('drive.google.com') && url.includes('/preview')) return url

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
    /[?&]id=([a-zA-Z0-9_-]{10,})/,
    /^([a-zA-Z0-9_-]{20,})$/,
  ]

  for (const p of patterns) {
    const match = url.match(p)
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`
  }

  return null
}
