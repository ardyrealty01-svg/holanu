/**
 * HOLANU — Contact Constants
 * Ganti HOLANU_WA_NUMBER dengan nomor WhatsApp bisnis yang sebenarnya
 * sebelum deploy ke production.
 *
 * Format: 62 + nomor tanpa 0 di depan
 * Contoh: 628112345678 untuk nomor 0811-2345-678
 */
export const HOLANU_WA_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_WA ?? '6281120000000';

/** Buat URL WhatsApp dengan pesan opsional */
export function buildWaUrl(message?: string): string {
  const base = `https://wa.me/${HOLANU_WA_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
