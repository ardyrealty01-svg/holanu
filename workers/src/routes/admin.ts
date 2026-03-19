/**
 * HOLANU — Admin Routes
 * Semua endpoint /api/admin/* memerlukan role admin
 */
import type { Env } from '../index';
import { okResponse, errorResponse, paginate, verifyClerkToken } from '../utils';

export async function handleAdmin(
  request: Request, env: Env, url: URL
): Promise<Response> {
  // ── Auth: wajib login & harus admin ──
  const claims = await verifyClerkToken(request, env);
  if (!claims)               return errorResponse('Unauthorized', 401, env, request);
  if (claims.role !== 'admin') return errorResponse('Forbidden — admin only', 403, env, request);

  const method   = request.method;
  const segments = url.pathname.split('/').filter(Boolean);
  const resource = segments[2]; // stats | users | listings | leads

  // ── GET /api/admin/stats ──
  if (method === 'GET' && resource === 'stats') {
    const [users, listings, leads, revenue] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as n FROM users').first<{ n: number }>(),
      env.DB.prepare("SELECT COUNT(*) as n FROM listings WHERE status = 'aktif'").first<{ n: number }>(),
      env.DB.prepare("SELECT COUNT(*) as n FROM buyer_leads WHERE status = 'baru'").first<{ n: number }>(),
      env.DB.prepare(
        "SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE status='paid' AND strftime('%Y-%m',created_at)=strftime('%Y-%m','now')"
      ).first<{ total: number }>(),
    ]);
    return okResponse({
      total_users:      users?.n     ?? 0,
      active_listings:  listings?.n  ?? 0,
      new_leads:        leads?.n     ?? 0,
      monthly_revenue:  revenue?.total ?? 0,
    }, env, 200, request);
  }

  // ── GET /api/admin/leads ──
  if (method === 'GET' && resource === 'leads') {
    const { limit, offset } = paginate(url);
    const rows  = await env.DB.prepare(
      'SELECT * FROM buyer_leads ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();
    const count = await env.DB.prepare('SELECT COUNT(*) as n FROM buyer_leads').first<{ n: number }>();
    return okResponse({ leads: rows.results, total: count?.n ?? 0 }, env, 200, request);
  }

  // ── GET /api/admin/listings ── semua listing (termasuk pending)
  if (method === 'GET' && resource === 'listings') {
    const { limit, offset } = paginate(url);
    const status = url.searchParams.get('status') ?? 'pending';
    const rows   = await env.DB.prepare(
      'SELECT l.*, u.name AS agent_name FROM listings l LEFT JOIN users u ON u.id=l.user_id WHERE l.status=? ORDER BY l.created_at DESC LIMIT ? OFFSET ?'
    ).bind(status, limit, offset).all();
    const count  = await env.DB.prepare('SELECT COUNT(*) as n FROM listings WHERE status=?').bind(status).first<{n:number}>();
    return okResponse({ listings: rows.results, total: count?.n ?? 0 }, env, 200, request);
  }

  // ── PATCH /api/admin/listings/:id/approve|reject ──
  if (method === 'PATCH' && resource === 'listings') {
    const listingId = segments[3];
    const action    = segments[4];
    if (action === 'approve') {
      await env.DB.prepare(
        "UPDATE listings SET status='aktif', published_at=datetime('now') WHERE id=?"
      ).bind(listingId).run();
      return okResponse({ approved: true }, env, 200, request);
    }
    if (action === 'reject') {
      await env.DB.prepare("UPDATE listings SET status='draft' WHERE id=?").bind(listingId).run();
      return okResponse({ rejected: true }, env, 200, request);
    }
  }

  // ── PATCH /api/admin/users/:id/ban|unban|tier ──
  if (method === 'PATCH' && resource === 'users') {
    const userId = segments[3];
    const action = segments[4];
    if (action === 'ban') {
      await env.DB.prepare('UPDATE users SET is_banned=1 WHERE id=?').bind(userId).run();
      return okResponse({ banned: true }, env, 200, request);
    }
    if (action === 'unban') {
      await env.DB.prepare('UPDATE users SET is_banned=0 WHERE id=?').bind(userId).run();
      return okResponse({ unbanned: true }, env, 200, request);
    }
    if (action === 'tier') {
      const body = await request.json() as any;
      await env.DB.prepare('UPDATE users SET tier=? WHERE id=?').bind(body.tier, userId).run();
      return okResponse({ tier_updated: true }, env, 200, request);
    }
  }

  return errorResponse('Admin endpoint tidak ditemukan', 404, env, request);
}
