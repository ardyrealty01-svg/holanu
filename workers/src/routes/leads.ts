/**
 * HOLANU — Leads Route
 * POST /api/leads          → submit form konsultasi (public — no auth needed)
 * GET  /api/leads          → list leads (admin only)
 * GET  /api/leads/:id      → detail lead (admin only)
 * PATCH /api/leads/:id     → update status (admin only)
 */
import type { Env } from '../index';
import { okResponse, errorResponse, paginate, verifyClerkToken } from '../utils';

export async function handleLeads(
  request: Request, env: Env, url: URL
): Promise<Response> {
  const method   = request.method;
  const segments = url.pathname.split('/').filter(Boolean);
  const id       = segments[2];

  // ── POST /api/leads ── public — siapapun boleh submit konsultasi
  if (method === 'POST' && !id) {
    const body = await request.json() as any;

    if (!body.name || !body.whatsapp) {
      return errorResponse('Nama dan WhatsApp wajib diisi', 400, env, request);
    }

    // Sanitasi nomor WA
    const wa = String(body.whatsapp).replace(/\D/g, '');
    if (wa.length < 8 || wa.length > 15) {
      return errorResponse('Nomor WhatsApp tidak valid', 400, env, request);
    }

    const newId = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO buyer_leads (
        id, name, whatsapp, domisili_kota, domisili_prov, pekerjaan,
        property_type, purpose, lokasi_incaran, lokasi_prov,
        min_bedrooms, min_land_area, min_build_area,
        budget_min, budget_max, payment_method,
        has_salary_slip, no_active_kpr, need_kpr_help, timeline,
        certificate, condition, facilities, notes,
        source, referrer_listing
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      newId,
      body.name.trim(),
      wa,
      body.domisili_kota   ?? null,
      body.domisili_prov   ?? null,
      body.pekerjaan       ?? null,
      body.property_type   ?? null,
      body.purpose         ?? null,
      body.lokasi_incaran  ?? null,
      body.lokasi_prov     ?? null,
      body.min_bedrooms    ?? null,
      body.min_land_area   ?? null,
      body.min_build_area  ?? null,
      body.budget_min      ?? null,
      body.budget_max      ?? null,
      body.payment_method  ?? null,
      body.has_salary_slip ? 1 : 0,
      body.no_active_kpr   ? 1 : 0,
      body.need_kpr_help   ? 1 : 0,
      body.timeline        ?? null,
      body.certificate     ?? null,
      body.condition       ?? null,
      JSON.stringify(body.facilities ?? []),
      body.notes           ?? null,
      body.source          ?? 'form',
      body.referrer_listing ?? null,
    ).run();

    return okResponse({ id: newId, message: 'Konsultasi berhasil dikirim!' }, env, 201, request);
  }

  // ── Semua endpoint di bawah: admin only ──
  const claims = await verifyClerkToken(request, env);
  if (!claims)               return errorResponse('Unauthorized', 401, env, request);
  if (claims.role !== 'admin') return errorResponse('Forbidden — admin only', 403, env, request);

  // ── GET /api/leads ── list all leads
  if (method === 'GET' && !id) {
    const { limit, offset } = paginate(url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('q');

    const filters: string[] = [];
    const params:  unknown[] = [];

    if (status) { filters.push('status = ?'); params.push(status); }
    if (search) {
      filters.push('(name LIKE ? OR whatsapp LIKE ? OR lokasi_incaran LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [rows, countRow] = await Promise.all([
      env.DB.prepare(`
        SELECT * FROM buyer_leads ${where}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),
      env.DB.prepare(`SELECT COUNT(*) as total FROM buyer_leads ${where}`)
        .bind(...params).first<{ total: number }>(),
    ]);

    return okResponse({
      leads: rows.results,
      total: countRow?.total ?? 0,
      limit, offset,
    }, env, 200, request);
  }

  // ── GET /api/leads/:id ── detail
  if (method === 'GET' && id) {
    const lead = await env.DB.prepare('SELECT * FROM buyer_leads WHERE id = ?')
      .bind(id).first();
    if (!lead) return errorResponse('Lead tidak ditemukan', 404, env, request);
    return okResponse(lead, env, 200, request);
  }

  // ── PATCH /api/leads/:id ── update status
  if (method === 'PATCH' && id) {
    const body = await request.json() as any;
    await env.DB.prepare(`
      UPDATE buyer_leads
      SET status = ?, admin_notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(body.status ?? 'baru', body.admin_notes ?? null, id).run();
    return okResponse({ updated: true }, env, 200, request);
  }

  return errorResponse('Method tidak diizinkan', 405, env, request);
}
