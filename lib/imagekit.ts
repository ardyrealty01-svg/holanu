/**
 * HOLANU — ImageKit.io Integration
 * Auto-convert to WebP + CDN delivery
 */

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
const PUBLIC_KEY   = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;

export interface UploadResult {
  url:       string;   // CDN URL (WebP auto-converted)
  fileId:    string;
  name:      string;
  width:     number;
  height:    number;
  size:      number;
  thumbnail: string;   // 400x300 thumbnail URL
}

/**
 * Upload file ke ImageKit langsung dari browser (client-side)
 * Menggunakan authenticated upload dengan signature dari Workers
 */
export async function uploadToImageKit(
  file: File,
  folder = 'listings',
  onProgress?: (pct: number) => void,
  token?: string,
): Promise<UploadResult> {

  // 1. Minta auth signature dari Workers API (butuh Clerk JWT token)
  const authRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'https://holanu-api.holanu-api.workers.dev'}/api/upload`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  if (!authRes.ok) throw new Error(`Gagal mendapatkan upload signature (${authRes.status})`);
  const { data: auth } = await authRes.json() as { data: { token: string; expire: number; signature: string; publicKey: string } };

  // 2. Build FormData untuk ImageKit upload API
  const form = new FormData();
  form.append('file',               file);
  form.append('fileName',           `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
  form.append('folder',             `/holanu/${folder}`);
  form.append('publicKey',          auth.publicKey || PUBLIC_KEY);
  form.append('signature',          auth.signature);
  form.append('expire',             String(auth.expire));
  form.append('token',              auth.token);
  // Auto-convert ke WebP via transformation
  form.append('useUniqueFileName',  'true');
  form.append('responseFields',     'url,fileId,name,width,height,size');

  // 3. Upload ke ImageKit
  onProgress?.(10);

  const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body:   form,
  });

  onProgress?.(90);

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`ImageKit upload gagal: ${err}`);
  }

  const result = await uploadRes.json();
  onProgress?.(100);

  // 4. Return URL dengan transformasi WebP + ukuran optimal
  const baseUrl = result.url;

  return {
    url:       transformUrl(baseUrl, { format: 'webp', quality: 85 }),
    fileId:    result.fileId,
    name:      result.name,
    width:     result.width  ?? 0,
    height:    result.height ?? 0,
    size:      result.size   ?? 0,
    thumbnail: transformUrl(baseUrl, { width: 400, height: 300, format: 'webp', quality: 75 }),
  };
}

/**
 * Generate transformed URL ImageKit
 * Contoh: /tr:w-400,h-300,f-webp,q-75/
 */
export function transformUrl(
  url: string,
  opts: { width?: number; height?: number; format?: string; quality?: number }
): string {
  const parts: string[] = [];
  if (opts.width)   parts.push(`w-${opts.width}`);
  if (opts.height)  parts.push(`h-${opts.height}`);
  if (opts.format)  parts.push(`f-${opts.format}`);
  if (opts.quality) parts.push(`q-${opts.quality}`);
  if (!parts.length) return url;

  const endpoint = URL_ENDPOINT ?? process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? '';
  if (!endpoint || !url.includes(endpoint)) return url; // safety guard
  const path = url.replace(endpoint, '');
  return `${endpoint}/tr:${parts.join(',')}${path}`;
}

/**
 * Validasi file sebelum upload
 */
export function validateImageFile(file: File): string | null {
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  const MAX_MB  = 10;

  if (!ALLOWED.includes(file.type)) {
    return `Format tidak didukung. Gunakan JPG, PNG, atau WebP.`;
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return `Ukuran file terlalu besar. Maksimal ${MAX_MB}MB.`;
  }
  return null;
}
