-- ============================================
--  HOLANU — Cloudflare D1 Database Schema
--  Jalankan: wrangler d1 execute holanu-db --file=schema.sql
-- ============================================

PRAGMA foreign_keys = ON;

-- ── 1. USERS ──────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  whatsapp      TEXT,
  password_hash TEXT,                       -- null jika OAuth
  role          TEXT NOT NULL DEFAULT 'buyer'
                CHECK(role IN ('buyer','owner','agent','admin')),
  display_role  TEXT DEFAULT 'agent',       -- tampil publik sebagai
  tier          INTEGER NOT NULL DEFAULT 1, -- 1=email, 2=KTP, 3=selfie
  paket         TEXT DEFAULT 'starter'
                CHECK(paket IN ('starter','pro','gold','platinum')),
  paket_expiry  TEXT,                       -- ISO date
  avatar_url    TEXT,
  bio           TEXT,
  city          TEXT,
  province      TEXT,
  instagram     TEXT,
  website       TEXT,
  is_verified   INTEGER DEFAULT 0,          -- badge terverifikasi
  is_active     INTEGER DEFAULT 1,
  is_banned     INTEGER DEFAULT 0,
  created_at    TEXT DEFAULT (datetime('now')),
  updated_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON users(whatsapp);

-- ── 2. LISTINGS ───────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  code            TEXT UNIQUE,              -- HOL-YGY-25-0089
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  sell_reason     TEXT,                     -- alasan jual/sewa

  -- Harga
  price           INTEGER NOT NULL,
  original_price  INTEGER,                  -- jika ada harga lama → HOT badge
  price_per_sqm   INTEGER,
  is_negotiable   INTEGER DEFAULT 1,

  -- Lokasi
  province        TEXT,
  city            TEXT,
  district        TEXT,                     -- kecamatan
  village         TEXT,                     -- kelurahan
  address         TEXT,
  latitude        REAL,
  longitude       REAL,

  -- Tipe & Spesifikasi
  property_type   TEXT NOT NULL
                  CHECK(property_type IN ('Rumah','Tanah','Kost','Hotel','Homestay','Villa','Ruko','Gudang','Lainnya')),
  offer_type      TEXT NOT NULL
                  CHECK(offer_type IN ('Dijual','Disewa','Dijual & Disewa')),
  bedrooms        INTEGER DEFAULT 0,
  bathrooms       INTEGER DEFAULT 0,
  carports        INTEGER DEFAULT 0,
  floors          INTEGER DEFAULT 1,
  land_area       INTEGER,                  -- m²
  building_area   INTEGER,                  -- m²
  front_width     INTEGER,                  -- meter

  -- Legalitas
  certificate     TEXT,                     -- Legalitas tanah: SHM Pekarangan, SHM Sawah, SHGB Keturunan, dll
  doc_status      TEXT DEFAULT 'on_hand'
                  CHECK(doc_status IN ('on_hand','on_bank','no_doc')),
  -- Harga sewa terpisah (untuk listing Dijual & Disewa)
  sewa_price      INTEGER,                  -- harga sewa per periode
  rent_period     TEXT DEFAULT 'bulan'
                  CHECK(rent_period IN ('bulan','tahun')),
  -- Legalitas usaha (JSON array: ["Izin Hotel","Izin Pemondokan"])
  legalitas_usaha TEXT DEFAULT '[]',

  condition       TEXT DEFAULT 'Baru'
                  CHECK(condition IN ('Baru','Bekas','Renovasi')),

  -- Fasilitas (JSON array)
  facilities      TEXT DEFAULT '[]',

  -- Media
  images          TEXT DEFAULT '[]',        -- JSON array of ImageKit URLs
  video_url       TEXT,
  virtual_tour    TEXT,

  -- Badge flags
  is_premium      INTEGER DEFAULT 0,
  is_featured     INTEGER DEFAULT 0,

  -- Status & Moderasi
  status          TEXT DEFAULT 'pending'
                  CHECK(status IN ('draft','pending','aktif','negosiasi','terjual','expired')),
  ai_flag         TEXT DEFAULT 'clean'
                  CHECK(ai_flag IN ('clean','warn','flagged')),
  reported_count  INTEGER DEFAULT 0,

  -- Stats
  views           INTEGER DEFAULT 0,
  inquiry_count   INTEGER DEFAULT 0,

  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  published_at    TEXT,
  expires_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_listings_user_id       ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status        ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON listings(property_type);
CREATE INDEX IF NOT EXISTS idx_listings_offer_type    ON listings(offer_type);
CREATE INDEX IF NOT EXISTS idx_listings_city          ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_price         ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_code          ON listings(code);

-- ── 3. BUYER LEADS (Form Konsultasi) ──────
CREATE TABLE IF NOT EXISTS buyer_leads (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),

  -- Identitas
  name            TEXT NOT NULL,
  whatsapp        TEXT NOT NULL,
  domisili_kota   TEXT,
  domisili_prov   TEXT,
  pekerjaan       TEXT,

  -- Kebutuhan Properti
  property_type   TEXT,                     -- tipe yang dicari
  purpose         TEXT,                     -- hunian/investasi/usaha
  lokasi_incaran  TEXT,                     -- kota/kec incaran
  lokasi_prov     TEXT,
  min_bedrooms    INTEGER,
  min_land_area   INTEGER,
  min_build_area  INTEGER,

  -- Finansial
  budget_min      INTEGER,
  budget_max      INTEGER,
  payment_method  TEXT,                     -- cash/kpr/bertahap
  has_salary_slip INTEGER DEFAULT 0,
  no_active_kpr   INTEGER DEFAULT 0,
  need_kpr_help   INTEGER DEFAULT 0,
  timeline        TEXT,                     -- kapan rencana beli

  -- Preferensi
  certificate     TEXT,
  condition       TEXT,
  facilities      TEXT DEFAULT '[]',        -- JSON array
  notes           TEXT,

  -- Status admin
  status          TEXT DEFAULT 'baru'
                  CHECK(status IN ('baru','diproses','selesai')),
  admin_notes     TEXT,

  -- Source
  source          TEXT DEFAULT 'form'
                  CHECK(source IN ('form','popup','listing_banner')),
  referrer_listing TEXT,                    -- id listing kalau dari banner

  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON buyer_leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_status   ON buyer_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created  ON buyer_leads(created_at);

-- ── 4. INQUIRIES (Pesan Masuk ke Agen) ────
CREATE TABLE IF NOT EXISTS inquiries (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  listing_id  TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  from_user   TEXT REFERENCES users(id),    -- null jika guest
  name        TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  message     TEXT,
  via         TEXT DEFAULT 'whatsapp'
              CHECK(via IN ('whatsapp','direct','email')),
  stage       TEXT DEFAULT 'baru'
              CHECK(stage IN ('baru','dihubungi','survey','negosiasi','deal','gagal')),
  notes       TEXT,                         -- catatan internal agen
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_stage   ON inquiries(stage);

-- ── 5. TRANSACTIONS ───────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT NOT NULL REFERENCES users(id),
  product     TEXT NOT NULL,               -- paket/boost/featured/dll
  amount      INTEGER NOT NULL,
  method      TEXT,                        -- qris/va-bca/gopay/dll
  status      TEXT DEFAULT 'pending'
              CHECK(status IN ('pending','paid','failed','refund')),
  midtrans_id TEXT,
  midtrans_token TEXT,
  created_at  TEXT DEFAULT (datetime('now')),
  paid_at     TEXT
);

CREATE INDEX IF NOT EXISTS idx_transactions_user   ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ── 6. FAVORITES (Properti Tersimpan) ─────
CREATE TABLE IF NOT EXISTS favorites (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, listing_id)
);

-- ── 7. LISTING REPORTS ─────────────────────
CREATE TABLE IF NOT EXISTS listing_reports (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id    TEXT REFERENCES users(id),
  reason     TEXT NOT NULL,
  status     TEXT DEFAULT 'pending'
              CHECK(status IN ('pending','resolved','dismissed')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- ── 8. AUDIT LOG ──────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  admin_id   TEXT REFERENCES users(id),
  action     TEXT NOT NULL,                -- BAN_USER, APPROVE_LISTING, dll
  target     TEXT,                         -- id entitas yang dikenai aksi
  meta       TEXT DEFAULT '{}',            -- JSON detail tambahan
  ip         TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
