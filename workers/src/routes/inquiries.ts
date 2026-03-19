/**
 * HOLANU — Inquiries Route
 * POST /api/inquiries  → calon pembeli kirim pesan ke agen
 * GET  /api/inquiries  → agen lihat pesan masuk (butuh auth)
 * PATCH /api/inquiries/:id → update stage (butuh auth)
 */
import type { Env } from '../index';
import { okResponse, errorResponse, paginate, verifyClerkToken } from '../utils';

export async function handleInquiries(
  request: Request, env: Env, url: URL
): Promise<Response> {
  const method   = request.method;
  const segments = url.pathname.split('/').filter(Boolean);
  const id       = segments[2];

  // ── POST /api/inquiries ── calon pembeli kirim pesan (public)
  if (method === 'POST' && !id) {
    const body = await request.json() as any;
    if (!body.listing_id || !body.name || !body.whatsapp) {
      return errorResponse('listing_id, name, dan whatsapp wajib diisi', 400, env, request);
    }

    const newId = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO inquiries (id, listing_id, from_user, name, whatsapp, message, via)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId, body.listing_id, body.from_user ?? null,
      body.name, body.whatsapp, body.message ?? null, body.via ?? 'whatsapp',
    ).run();

    await env.DB.prepare(
      'UPDATE listings SET inquiry_count = inquiry_count + 1 WHERE id = ?'
    ).bind(body.listing_id).run();

    return okResponse({ id: newId }, env, 201, request);
  }

  // ── GET /api/inquiries ── list untuk agen (butuh auth)
  if (method === 'GET' && !id) {
    const claims = await verifyClerkToken(request, env);
    if (!claims) return errorResponse('Unauthorized', 401, env, request);

    const { limit, offset } = paginate(url);
    const listingId = url.searchParams.get('listing_id');
    const stage     = url.searchParams.get('stage');

    const filters: string[] = [];
    const params:  unknown[] = [];
    if (listingId) { filters.push('i.listing_id = ?'); params.push(listingId); }
    if (stage)     { filters.push('i.stage = ?');      params.push(stage); }

    // Agen hanya bisa lihat inquiry untuk listing miliknya (kecuali admin)
    if (claims.role !== 'admin') {
      filters.push('l.user_id = ?');
      params.push(claims.userId);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [rows, countRow] = await Promise.all([
      env.DB.prepare(`
        SELECT i.*, l.title AS listing_title, l.code AS listing_code
        FROM inquiries i
        LEFT JOIN listings l ON l.id = i.listing_id
        ${where}
        ORDER BY i.created_at DESC
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),

      env.DB.prepare(`
        SELECT COUNT(*) as total FROM inquiries i
        LEFT JOIN listings l ON l.id = i.listing_id
        ${where}
      `).bind(...params).first<{ total: number }>(),
    ]);

    return okResponse({
      inquiries: rows.results,
      total:     countRow?.total ?? 0,
    }, env, 200, request);
  }

  // ── PATCH /api/inquiries/:id ── update stage (butuh auth)
  if (method === 'PATCH' && id) {
    const claims = await verifyClerkToken(request, env);
    if (!claims) return errorResponse('Unauthorized', 401, env, request);

    const body = await request.json() as any;
    await env.DB.prepare(
      `UPDATE inquiries SET stage=?, notes=?, updated_at=datetime('now') WHERE id=?`
    ).bind(body.stage ?? 'baru', body.notes ?? null, id).run();
    return okResponse({ updated: true }, env, 200, request);
  }

  return errorResponse('Method tidak diizinkan', 405, env, request);
}
