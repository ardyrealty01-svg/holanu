/**
 * HOLANU — Upload Route
 * GET /api/upload → kembalikan ImageKit auth signature untuk client-side upload
 */
import type { Env } from '../index';
import { okResponse, errorResponse, verifyClerkToken } from '../utils';

export async function handleUpload(
  request: Request, env: Env, url: URL
): Promise<Response> {
  if (request.method !== 'GET') {
    return errorResponse('Method tidak diizinkan', 405, env, request);
  }

  // Butuh login untuk upload
  const claims = await verifyClerkToken(request, env);
  if (!claims) return errorResponse('Unauthorized', 401, env, request);

  const key = env.IMAGEKIT_PRIVATE_KEY ?? '';
  if (!key)  return errorResponse('ImageKit private key tidak dikonfigurasi', 500, env, request);

  // Generate auth signature untuk ImageKit upload dari client
  const token  = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 3600; // 1 jam

  const keyData = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  );
  const sigBuffer = await crypto.subtle.sign(
    'HMAC', keyData, new TextEncoder().encode(`${token}${expire}`)
  );
  const signature = Array.from(new Uint8Array(sigBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  return okResponse({
    token,
    expire,
    signature,
    publicKey:   env.IMAGEKIT_PUBLIC_KEY ?? '',
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT ?? '',
  }, env, 200, request);
}
