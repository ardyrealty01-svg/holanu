import type { Env } from './index';

// ── CORS ──────────────────────────────────────────────
export function corsHeaders(env: Env, request?: Request): HeadersInit {
  let origin = '*';

  if (env.ENVIRONMENT !== 'development') {
    const reqOrigin  = request?.headers.get('Origin') ?? '';
    const allowed    = (env.CORS_ORIGIN ?? 'https://holanu.id').split(',').map(s => s.trim());
    origin           = allowed.includes(reqOrigin) ? reqOrigin : allowed[0];
  }

  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

export function okResponse(data: unknown, env: Env, status = 200, req?: Request): Response {
  return new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: corsHeaders(env, req),
  });
}

export function errorResponse(message: string, status = 400, env: Env, req?: Request): Response {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: corsHeaders(env, req),
  });
}

// ── JWT Verification (Clerk RS256) ───────────────────
export interface ClerkClaims {
  userId: string;
  role?:  string;
}

export async function verifyClerkToken(request: Request, env: Env): Promise<ClerkClaims | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const b64 = (s: string): string => {
      const pad = s.length % 4;
      return pad ? s + '='.repeat(4 - pad) : s;
    };
    const decode = (s: string) =>
      JSON.parse(new TextDecoder().decode(
        Uint8Array.from(atob(b64(s.replace(/-/g, '+').replace(/_/g, '/'))), c => c.charCodeAt(0))
      ));

    const header  = decode(parts[0]);
    const payload = decode(parts[1]);

    // Check expiry
    if ((payload.exp as number) < Math.floor(Date.now() / 1000)) return null;

    // Validate issuer (Clerk domain)
    const issuer = payload.iss as string;
    if (!issuer) return null;

    // Fetch Clerk JWKS (cached 1h by Cloudflare edge)
    const jwksRes = await fetch(`${issuer}/.well-known/jwks.json`);
    if (!jwksRes.ok) return null;

    const { keys } = await jwksRes.json() as { keys: JsonWebKey[] };
    const jwk = keys.find((k: any) => k.kid === header.kid);
    if (!jwk) return null;

    // Import RSA public key & verify
    const publicKey = await crypto.subtle.importKey(
      'jwk', jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['verify']
    );

    const sigInput = `${parts[0]}.${parts[1]}`;
    const sigBytes = Uint8Array.from(
      atob(b64(parts[2].replace(/-/g, '+').replace(/_/g, '/'))),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      sigBytes,
      new TextEncoder().encode(sigInput)
    );

    if (!valid) return null;

    // Clerk stores custom roles in publicMetadata (set via Clerk Dashboard or API)
    const role = (payload as any).public_metadata?.role
              ?? (payload as any).publicMetadata?.role
              ?? (payload as any).metadata?.role;

    return { userId: payload.sub as string, role };
  } catch (e) {
    console.error('JWT verify error:', e);
    return null;
  }
}

// ── Generate listing code: HOL-YGY-25-0089 ───────────
export function generateListingCode(city: string, sequence: number): string {
  const CITY_CODES: Record<string, string> = {
    'yogyakarta': 'YGY', 'sleman': 'YGY', 'bantul': 'YGY',
    'semarang':   'SMG', 'bandung': 'BDG', 'surabaya': 'SBY',
    'makassar':   'MKS', 'medan':   'MDN', 'jakarta':  'JKT',
    'bali':       'BAL', 'denpasar':'BAL',
  };
  const year     = new Date().getFullYear().toString().slice(-2);
  const cityKey  = city.toLowerCase().split(',')[0].trim();
  const cityCode = CITY_CODES[cityKey] ?? 'INA';
  const seq      = String(sequence).padStart(4, '0');
  return `HOL-${cityCode}-${year}-${seq}`;
}

// ── Pagination helper ─────────────────────────────────
export function paginate(url: URL) {
  const page  = Math.max(1, parseInt(url.searchParams.get('page')  ?? '1'));
  const limit = Math.min(50, parseInt(url.searchParams.get('limit') ?? '12'));
  return { page, limit, offset: (page - 1) * limit };
}
