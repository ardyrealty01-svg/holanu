-- ============================================================
-- HOLANU — Migration: Update Legalitas Fields
-- Jalankan hanya jika D1 database SUDAH ada dan sudah berisi data
-- 
-- wrangler d1 execute holanu-db --file=migration_legalitas.sql --remote
-- ============================================================

-- 1. Hapus CHECK constraint certificate lama dan ganti kolom baru
--    (SQLite tidak bisa ALTER COLUMN, jadi kita gunakan pendekatan kolom baru)
ALTER TABLE listings ADD COLUMN sewa_price      INTEGER;
ALTER TABLE listings ADD COLUMN rent_period     TEXT DEFAULT 'bulan';
ALTER TABLE listings ADD COLUMN legalitas_usaha TEXT DEFAULT '[]';

-- 2. Update doc_status yang NULL menjadi default
UPDATE listings SET doc_status = 'on_hand' WHERE doc_status IS NULL;

-- 3. Update nilai certificate lama ke nilai baru yang lebih deskriptif
--    (opsional - untuk konsistensi data existing)
UPDATE listings SET certificate = 'SHM Pekarangan' WHERE certificate = 'SHM';
UPDATE listings SET certificate = 'SHGB Keturunan' WHERE certificate = 'HGB';
UPDATE listings SET certificate = 'SHGB Keturunan' WHERE certificate = 'SHGB';
UPDATE listings SET certificate = 'PPJB / Girik / Letter C / Lainnya' WHERE certificate IN ('Girik','AJB','Lainnya');

-- Selesai. Verifikasi dengan:
-- SELECT certificate, doc_status, sewa_price, rent_period FROM listings LIMIT 5;
