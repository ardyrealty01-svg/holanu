import type { Env } from '../index';
import { okResponse, errorResponse, paginate, generateListingCode, verifyClerkToken } from '../utils';

// Kolom yang boleh di-update oleh agen (allowlist mencegah column injection)
const PATCH_ALLOWED = [
  'title', 'description', 'sell_reason',
  'price', 'original_price', 'is_negotiable',
  'sewa_price', 'rent_period',
  'province', 'city', 'district', 'village', 'address', 'latitude', 'longitude',
  'property_type', 'offer_type',
  'bedrooms', 'bathrooms', 'carports', 'floors',
  'land_area', 'building_area', 'front_width',
  'certificate', 'doc_status', 'legalitas_usaha', 'condition',
  'facilities', 'images', 'video_url', 'virtual_tour',
  'status',
];

export async function handleListings(
  request: Request, env: Env, url: URL
): Promise<Response> {
  const method   = request.method;
  const segments = url.pathname.split('/').filter(Boolean);
  const id       = segments[2];
  const action   = segments[3];

  // ── GET /api/listings ── list with filters (public)
  if (method === 'GET' && !id) {
    const { limit, offset } = paginate(url);
    const filters: string[] = [];
    const params:  unknown[] = [];

    const offerType    = url.searchParams.get('offer_type');
    const propertyType = url.searchParams.get('property_type');
    const city         = url.searchParams.get('city');
    const province     = url.searchParams.get('province');
    const minPrice     = url.searchParams.get('min_price');
    const maxPrice     = url.searchParams.get('max_price');
    const search       = url.searchParams.get('q');
    const isPremium    = url.searchParams.get('premium');
    const userId       = url.searchParams.get('user_id'); // untuk dashboard agen

    // Jika ada user_id, tampilkan semua status listing milik user tsb
    // Jika tidak, tampilkan hanya listing aktif (publik)
    if (userId) {
      filters.push('l.user_id = ?');
      params.push(userId);
    } else {
      filters.push("l.status = 'aktif'");
    }

    if (offerType)    { filters.push('l.offer_type = ?');    params.push(offerType); }
    if (propertyType) { filters.push('l.property_type = ?'); params.push(propertyType); }
    if (city)         { filters.push('l.city LIKE ?');       params.push(`%${city}%`); }
    if (province)     { filters.push('l.province = ?');      params.push(province); }
    if (minPrice)     { filters.push('l.price >= ?');        params.push(+minPrice); }
    if (maxPrice)     { filters.push('l.price <= ?');        params.push(+maxPrice); }
    if (isPremium)    { filters.push('l.is_premium = 1'); }
    if (search) {
      filters.push('(l.title LIKE ? OR l.description LIKE ? OR l.code LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = filters.length ? filters.join(' AND ') : '1=1';

    const [rows, countRow] = await Promise.all([
      env.DB.prepare(`
        SELECT l.*, u.name AS agent_name, u.is_verified AS agent_verified
        FROM listings l
        LEFT JOIN users u ON u.id = l.user_id
        WHERE ${where}
        ORDER BY l.is_premium DESC, l.is_featured DESC, l.published_at DESC
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),

      env.DB.prepare(`SELECT COUNT(*) as total FROM listings l WHERE ${where}`)
        .bind(...params).first<{ total: number }>(),
    ]);

    return okResponse({
      listings: rows.results,
      total:    countRow?.total ?? 0,
      limit, offset,
    }, env, 200, request);
  }

  // ── GET /api/listings/:id ── detail (public)
  if (method === 'GET' && id && !action) {
    const listing = await env.DB.prepare(`
      SELECT l.*, u.name AS agent_name, u.whatsapp AS agent_wa,
             u.is_verified AS agent_verified, u.avatar_url AS agent_avatar
      FROM listings l
      LEFT JOIN users u ON u.id = l.user_id
      WHERE l.id = ? OR l.code = ?
    `).bind(id, id).first();

    if (!listing) return errorResponse('Listing tidak ditemukan', 404, env, request);

    await env.DB.prepare('UPDATE listings SET views = views + 1 WHERE id = ?')
      .bind((listing as any).id).run();

    return okResponse(listing, env, 200, request);
  }

  // ── POST /api/listings ── create (butuh auth)
  if (method === 'POST' && !id) {
    const claims = await verifyClerkToken(request, env);
    if (!claims) return errorResponse('Unauthorized', 401, env, request);

    const body   = await request.json() as any;

    // ── Validasi wajib (mencegah D1 NOT NULL error) ──
    if (!body.title?.trim())        return errorResponse('title wajib diisi', 400, env, request);
    if (!body.price || isNaN(+body.price) || +body.price <= 0)
                                    return errorResponse('price harus angka > 0', 400, env, request);
    if (!body.property_type?.trim()) return errorResponse('property_type wajib diisi', 400, env, request);
    if (!body.offer_type?.trim())   return errorResponse('offer_type wajib diisi', 400, env, request);

    const newId  = crypto.randomUUID();

    // Generate kode listing (atomic-safe: pakai timestamp + random suffix)
    const countRow = await env.DB.prepare('SELECT COUNT(*) as n FROM listings').first<{ n: number }>();
    let code = generateListingCode(body.city ?? 'indonesia', (countRow?.n ?? 0) + 1);

    // Pastikan kode unik (retry jika collision)
    const existing = await env.DB.prepare('SELECT id FROM listings WHERE code = ?').bind(code).first();
    if (existing) {
      code = generateListingCode(body.city ?? 'indonesia', (countRow?.n ?? 0) + 2 + Math.floor(Math.random() * 100));
    }

    // Gunakan userId dari token (bukan dari body) untuk keamanan
    const userId = claims.userId;

    await env.DB.prepare(`
      INSERT INTO listings (
        id, code, user_id, title, description, sell_reason,
        price, original_price, is_negotiable,
        sewa_price, rent_period,
        province, city, district, village, address, latitude, longitude,
        property_type, offer_type,
        bedrooms, bathrooms, carports, floors, land_area, building_area, front_width,
        certificate, doc_status, legalitas_usaha, condition, facilities, images, video_url, virtual_tour,
        is_premium, is_featured, status, published_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      newId, code, userId, body.title, body.description ?? null, body.sell_reason ?? null,
      body.price, body.original_price ?? null, body.is_negotiable ?? 1,
      body.sewa_price ?? null, body.rent_period ?? 'bulan',
      body.province ?? null, body.city ?? null, body.district ?? null,
      body.village ?? null, body.address ?? null, body.latitude ?? null, body.longitude ?? null,
      body.property_type, body.offer_type,
      body.bedrooms ?? 0, body.bathrooms ?? 0, body.carports ?? 0,
      body.floors ?? 1, body.land_area ?? null, body.building_area ?? null, body.front_width ?? null,
      body.certificate ?? null, body.doc_status ?? 'on_hand',
      JSON.stringify(body.legalitas_usaha ?? []),
      body.condition ?? 'Baru',
      JSON.stringify(body.facilities ?? []),
      JSON.stringify(body.images ?? []),
      body.video_url ?? null, body.virtual_tour ?? null,
      0, 0, 'aktif', null
    ).run();

    // Set published_at via separate UPDATE so datetime('now') runs as SQL function
    await env.DB.prepare(
      `UPDATE listings SET published_at = datetime('now') WHERE id = ?`
    ).bind(newId).run();

    return okResponse({ id: newId, code }, env, 201, request);
  }

  // ── PATCH /api/listings/:id ── update (butuh auth + kepemilikan)
  if (method === 'PATCH' && id && !action) {
    const claims = await verifyClerkToken(request, env);
    if (!claims) return errorResponse('Unauthorized', 401, env, request);

    // Cek kepemilikan listing (kecuali admin)
    if (claims.role !== 'admin') {
      const listing = await env.DB.prepare('SELECT user_id FROM listings WHERE id = ?')
        .bind(id).first<{ user_id: string }>();
      if (!listing) return errorResponse('Listing tidak ditemukan', 404, env, request);
      if (listing.user_id !== claims.userId) return errorResponse('Forbidden', 403, env, request);
    }

    const body   = await request.json() as Record<string, unknown>;
    // ALLOWLIST — cegah column injection
    const fields = Object.keys(body).filter(k => PATCH_ALLOWED.includes(k));
    if (!fields.length) return errorResponse('Tidak ada field valid yang diupdate', 400, env, request);

    const sets   = fields.map(k => `${k} = ?`).join(', ');
    const values = fields.map(k => body[k]);

    await env.DB.prepare(
      `UPDATE listings SET ${sets}, updated_at = datetime('now') WHERE id = ?`
    ).bind(...values, id).run();

    return okResponse({ updated: true }, env, 200, request);
  }

  // ── DELETE /api/listings/:id ── hapus (butuh auth + kepemilikan)
  if (method === 'DELETE' && id) {
    const claims = await verifyClerkToken(request, env);
    if (!claims) return errorResponse('Unauthorized', 401, env, request);

    if (claims.role !== 'admin') {
      const listing = await env.DB.prepare('SELECT user_id FROM listings WHERE id = ?')
        .bind(id).first<{ user_id: string }>();
      if (!listing) return errorResponse('Listing tidak ditemukan', 404, env, request);
      if (listing.user_id !== claims.userId) return errorResponse('Forbidden', 403, env, request);
    }

    await env.DB.prepare('DELETE FROM listings WHERE id = ?').bind(id).run();
    return okResponse({ deleted: true }, env, 200, request);
  }

  return errorResponse('Method tidak diizinkan', 405, env, request);
}
