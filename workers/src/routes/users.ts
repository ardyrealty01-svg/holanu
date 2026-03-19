/**
 * HOLANU — Users Route
 * POST /api/users/sync → sinkronisasi user Clerk ke D1 (dipanggil saat pertama login)
 * GET  /api/users/:id  → profil publik user/agen
 * GET  /api/users      → list users (admin)
 * PATCH /api/users/:id → update profil (butuh auth + kepemilikan)
 */
import type { Env } from '../index';
import { okResponse, errorResponse, paginate, verifyClerkToken } from '../utils';

export async function handleUsers(
  request: Request, env: Env, url: URL
): Promise<Response> {
  const method   = request.method;
  const segments = url.pathname.split('/').filter(Boolean);
  const id       = segments[2]; // bisa berisi 'sync' atau user_id
  const action   = segments[3];

  // ── POST /api/users/sync ── upsert user dari Clerk ke D1
  // Dipanggil dari dashboard saat user pertama kali login
  if (method === 'POST' && id === 'sync') {
    const claims = await verifyClerkToken(request, env);
    if (!claims) return errorResponse('Unauthorized', 401, env, request);

    const body = await request.json() as any;
    const userId = claims.userId; // ID dari Clerk JWT (terpercaya)

    // Cek apakah user sudah ada
    const existing = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first();

    if (!existing) {
      // Buat user baru dengan Clerk user ID sebagai primary key
      // SECURITY: Never allow 'admin' role via API — only safe roles
      const safeRole  = ['owner', 'buyer'].includes(body.role) ? body.role : 'owner';
      // email NOT NULL — use userId-based placeholder for OAuth users without email
      const safeEmail = body.email?.trim() || `${userId}@clerk.local`;
      await env.DB.prepare(`
        INSERT INTO users (id, name, email, whatsapp, role, display_role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        userId,
        body.name     ?? 'User HOLANU',
        safeEmail,
        body.whatsapp ?? null,
        safeRole,
        'agent',
      ).run();
    } else {
      // Update nama/email jika berubah di Clerk
      if (body.name || body.email) {
        await env.DB.prepare(`
          UPDATE users SET
            name = COALESCE(?, name),
            email = COALESCE(?, email),
            updated_at = datetime('now')
          WHERE id = ?
        `).bind(body.name ?? null, body.email ?? null, userId).run();
      }
    }

    return okResponse({ synced: true, userId }, env, 200, request);
  }

  // ── POST /api/users ── register manual (legacy / non-Clerk)
  if (method === 'POST' && !id) {
    const body = await request.json() as any;
    if (!body.email || !body.name) {
      return errorResponse('Nama dan email wajib diisi', 400, env, request);
    }
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(body.email).first();
    if (existing) return errorResponse('Email sudah terdaftar', 409, env, request);

    const newId = crypto.randomUUID();
    // SECURITY: Never allow 'admin' role via API
    const safeRole = ['owner', 'buyer'].includes(body.role) ? body.role : 'buyer';
    await env.DB.prepare(`
      INSERT INTO users (id, name, email, whatsapp, password_hash, role, display_role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId, body.name, body.email, body.whatsapp ?? null,
      body.password_hash ?? null,
      safeRole,
      safeRole === 'owner' ? 'agent' : safeRole,
    ).run();

    return okResponse({ id: newId }, env, 201, request);
  }

  // ── GET /api/users/:id ── profil publik
  if (method === 'GET' && id && id !== 'sync') {
    const user = await env.DB.prepare(`
      SELECT id, name, email, whatsapp, role, display_role,
             tier, paket, paket_expiry, avatar_url, bio,
             city, province, instagram, website, is_verified, created_at
      FROM users WHERE id = ?
    `).bind(id).first();

    if (!user) return errorResponse('User tidak ditemukan', 404, env, request);
    return okResponse(user, env, 200, request);
  }

  // ── GET /api/users ── list (admin only)
  if (method === 'GET' && !id) {
    const claims = await verifyClerkToken(request, env);
    if (!claims || claims.role !== 'admin') {
      return errorResponse('Forbidden — admin only', 403, env, request);
    }

    const { limit, offset } = paginate(url);
    const role   = url.searchParams.get('role');
    const search = url.searchParams.get('q');
    const tier   = url.searchParams.get('tier');

    const filters: string[] = [];
    const params:  unknown[] = [];
    if (role)   { filters.push('role = ?');  params.push(role); }
    if (tier)   { filters.push('tier = ?');  params.push(+tier); }
    if (search) {
      filters.push('(name LIKE ? OR email LIKE ? OR whatsapp LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [rows, countRow] = await Promise.all([
      env.DB.prepare(`
        SELECT id, name, email, whatsapp, role, display_role,
               tier, paket, is_verified, is_banned, created_at
        FROM users ${where}
        ORDER BY created_at DESC LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),
      env.DB.prepare(`SELECT COUNT(*) as total FROM users ${where}`)
        .bind(...params).first<{ total: number }>(),
    ]);

    return okResponse({ users: rows.results, total: countRow?.total ?? 0 }, env, 200, request);
  }

  // ── PATCH /api/users/:id ── update profil (butuh auth + kepemilikan)
  if (method === 'PATCH' && id) {
    const claims = await verifyClerkToken(request, env);
    if (!claims) return errorResponse('Unauthorized', 401, env, request);
    if (claims.userId !== id && claims.role !== 'admin') {
      return errorResponse('Forbidden', 403, env, request);
    }

    const body    = await request.json() as Record<string, unknown>;
    const ALLOWED = ['name','whatsapp','bio','city','province','instagram','website','avatar_url'];
    const fields  = Object.keys(body).filter(k => ALLOWED.includes(k));
    if (!fields.length) return errorResponse('Tidak ada field valid', 400, env, request);

    const sets   = fields.map(k => `${k} = ?`).join(', ');
    const values = fields.map(k => body[k]);

    await env.DB.prepare(
      `UPDATE users SET ${sets}, updated_at=datetime('now') WHERE id=?`
    ).bind(...values, id).run();

    return okResponse({ updated: true }, env, 200, request);
  }

  return errorResponse('Method tidak diizinkan', 405, env, request);
}
