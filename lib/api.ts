/**
 * HOLANU — API Client
 * Semua fetch ke Cloudflare Workers terpusat di sini
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://holanu-api.holanu-api.workers.dev';

// ── Types ──────────────────────────────────────────────
export interface Listing {
  id:             string;
  code:           string;
  user_id:        string;
  title:          string;
  description:    string | null;
  price:          number;
  original_price: number | null;
  province:       string | null;
  city:           string | null;
  district:       string | null;
  address:        string | null;
  property_type:  string;
  offer_type:     string;
  bedrooms:       number;
  bathrooms:      number;
  carports:       number;
  land_area:      number | null;
  building_area:  number | null;
  certificate:    string | null;
  condition:      string | null;
  facilities:     string;
  images:         string;
  is_premium:     number;
  is_featured:    number;
  status:         string;
  views:          number;
  inquiry_count:  number;
  agent_name:     string | null;
  agent_wa:       string | null;
  agent_verified: number;
  created_at:     string;
  published_at:   string | null;
}

export interface ListingsResponse {
  listings: Listing[];
  total:    number;
  limit:    number;
  offset:   number;
}

export interface ListingFilters {
  offer_type?:    string;
  property_type?: string;
  city?:          string;
  province?:      string;
  min_price?:     number;
  max_price?:     number;
  q?:             string;
  premium?:       boolean;
  user_id?:       string;   // filter listing per agen (dashboard)
  page?:          number;
  limit?:         number;
}

export interface Lead {
  name:             string;
  whatsapp:         string;
  domisili_kota?:   string;
  domisili_prov?:   string;
  pekerjaan?:       string;
  property_type?:   string;
  purpose?:         string;
  lokasi_incaran?:  string;
  lokasi_prov?:     string;
  min_bedrooms?:    number;
  min_land_area?:   number;
  budget_min?:      number;
  budget_max?:      number;
  payment_method?:  string;
  timeline?:        string;
  certificate?:     string;
  condition?:       string;
  facilities?:      string[];
  notes?:           string;
  source?:          'form' | 'popup' | 'listing_banner';
  referrer_listing?: string;
}

// ── Helper ────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string },
): Promise<T> {
  const { token, ...fetchOptions } = options ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> ?? {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(`${BASE}${path}`, { ...fetchOptions, headers });
  const json = await res.json() as { ok: boolean; data: T; error?: string };
  if (!json.ok) throw new Error(json.error ?? 'API error');
  return json.data;
}

// ── USER SYNC ──────────────────────────────────────────
// Dipanggil saat user pertama kali masuk dashboard
export async function syncUser(
  token: string,
  data: { name?: string; email?: string; whatsapp?: string; role?: string },
): Promise<{ synced: boolean; userId: string }> {
  return apiFetch('/api/users/sync', {
    method: 'POST',
    body:   JSON.stringify(data),
    token,
  });
}

// ── LISTINGS ──────────────────────────────────────────
export async function getListings(filters: ListingFilters = {}): Promise<ListingsResponse> {
  const params = new URLSearchParams();
  if (filters.offer_type)    params.set('offer_type',    filters.offer_type);
  if (filters.property_type) params.set('property_type', filters.property_type);
  if (filters.city)          params.set('city',          filters.city);
  if (filters.province)      params.set('province',      filters.province);
  if (filters.min_price)     params.set('min_price',     String(filters.min_price));
  if (filters.max_price)     params.set('max_price',     String(filters.max_price));
  if (filters.q)             params.set('q',             filters.q);
  if (filters.premium)       params.set('premium',       '1');
  if (filters.user_id)       params.set('user_id',       filters.user_id);
  if (filters.page)          params.set('page',          String(filters.page));
  if (filters.limit)         params.set('limit',         String(filters.limit));
  const qs = params.toString();
  return apiFetch<ListingsResponse>(`/api/listings${qs ? `?${qs}` : ''}`);
}

export async function getListing(id: string): Promise<Listing> {
  return apiFetch<Listing>(`/api/listings/${id}`);
}

export async function createListing(
  data: Record<string, unknown>,
  token: string,
): Promise<{ id: string; code: string }> {
  return apiFetch('/api/listings', { method: 'POST', body: JSON.stringify(data), token });
}

export async function updateListing(
  id: string,
  data: Record<string, unknown>,
  token: string,
): Promise<{ updated: boolean }> {
  return apiFetch(`/api/listings/${id}`, { method: 'PATCH', body: JSON.stringify(data), token });
}

export async function deleteListing(id: string, token: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/api/listings/${id}`, { method: 'DELETE', token });
}

/** Convert DB Listing → format komponen (backward compat) */
export function listingToProperty(l: Listing) {
  const images: string[] = (() => {
    try { return JSON.parse(l.images || '[]'); } catch { return []; }
  })();
  return {
    id:            l.id,
    title:         l.title,
    location:      [l.district, l.city].filter(Boolean).join(', ') || l.city || 'Indonesia',
    price:         l.price,
    originalPrice: l.original_price ?? null,
    pricePerSqm:   l.land_area ? Math.round(l.price / l.land_area) : undefined,
    area:          l.land_area ?? l.building_area ?? 0,
    image:         images[0] ?? '/images/listing-1.jpg',
    images:        images.length ? images : ['/images/listing-1.jpg'],
    propertyType:  l.property_type as any,
    offerType:     l.offer_type as any,
    bedrooms:      l.bedrooms,
    bathrooms:     l.bathrooms,
    carports:      l.carports,
    isFeatured:    l.is_featured === 1,
    isPremium:     l.is_premium  === 1,
    certificate:   l.certificate ?? undefined,
    condition:     l.condition   ?? undefined,
    agentName:     l.agent_name  ?? undefined,
    agentVerified: l.agent_verified === 1,
    agent_wa:      l.agent_wa    ?? undefined,
    views:         l.views,
    inquiry_count: l.inquiry_count,
    status:        l.status,
    code:          l.code,
  };
}

// ── LEADS ─────────────────────────────────────────────
export async function submitLead(data: Lead): Promise<{ id: string }> {
  return apiFetch('/api/leads', { method: 'POST', body: JSON.stringify(data) });
}

// ── INQUIRIES ─────────────────────────────────────────
export type InquiryStage = 'baru' | 'dihubungi' | 'survey' | 'negosiasi' | 'deal' | 'gagal';

export interface Inquiry {
  id:            string;
  listing_id:    string;
  from_user:     string | null;
  name:          string;
  whatsapp:      string;
  message:       string | null;
  via:           string;
  stage:         InquiryStage;
  notes:         string | null;
  listing_title: string | null;
  listing_code:  string | null;
  created_at:    string;
  updated_at:    string;
}

export async function submitInquiry(data: {
  listing_id: string; name: string; whatsapp: string; message?: string; via?: string;
}): Promise<{ id: string }> {
  return apiFetch('/api/inquiries', { method: 'POST', body: JSON.stringify(data) });
}

export async function getInquiries(
  token: string,
  params?: { listing_id?: string; stage?: string; page?: number; limit?: number },
) {
  const qs = new URLSearchParams();
  if (params?.listing_id) qs.set('listing_id', params.listing_id);
  if (params?.stage)      qs.set('stage',      params.stage);
  if (params?.page)       qs.set('page',       String(params.page));
  if (params?.limit)      qs.set('limit',      String(params.limit));
  return apiFetch<{ inquiries: Inquiry[]; total: number }>(
    `/api/inquiries${qs.toString() ? `?${qs}` : ''}`,
    { token }
  );
}

export async function updateInquiry(
  id: string,
  data: { stage?: InquiryStage; notes?: string | null },
  token: string,
): Promise<{ updated: boolean }> {
  return apiFetch(`/api/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

// ── ADMIN ─────────────────────────────────────────────
export interface AdminUser {
  id:           string;
  name:         string;
  email:        string;
  role:         string;
  tier:         number;
  paket:        string;
  is_banned:    boolean;
  is_verified:  boolean;
  created_at:   string;
  _count?:      { listings: number };
}

export async function getAdminStats(token: string) {
  return apiFetch<{
    total_users:     number;
    active_listings: number;
    new_leads:       number;
    monthly_revenue: number;
  }>('/api/admin/stats', { token });
}

export async function getAdminUsers(token: string, limit = 100) {
  return apiFetch<{ users: AdminUser[]; total: number }>(
    `/api/users?limit=${limit}`,
    { token }
  );
}

export async function toggleUserBan(
  userId: string,
  action: 'ban' | 'unban',
  token: string,
): Promise<{ updated: boolean }> {
  return apiFetch(`/api/admin/users/${userId}/${action}`, {
    method: 'PATCH',
    token,
  });
}

export async function upgradeUserTier(
  userId: string,
  tier: number,
  token: string,
): Promise<{ updated: boolean }> {
  return apiFetch(`/api/admin/users/${userId}/tier`, {
    method: 'PATCH',
    body: JSON.stringify({ tier }),
    token,
  });
}

export async function getAdminLeads(token: string, page = 1) {
  return apiFetch<{ leads: any[]; total: number }>(
    `/api/admin/leads?page=${page}&limit=20`,
    { token }
  );
}
