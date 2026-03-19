/**
 * HOLANU — Number/Currency Formatters
 * 
 * Deterministic formatters that produce identical output on both
 * Node.js (SSR) and browser (hydration) to prevent React hydration mismatches.
 *
 * Root cause of mismatch: Intl.NumberFormat with notation:'compact' and
 * maximumFractionDigits:1 renders "Rp 950,0 jt" on some OS locales but
 * "Rp 950 jt" on others. Fix: always use maximumFractionDigits:0 for compact.
 */

/**
 * Full Rupiah format — e.g. "Rp 950.000.000"
 */
export function fmtRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style:                 'currency',
    currency:              'IDR',
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Compact Rupiah format — e.g. "Rp 950 jt", "Rp 1,5 M", "Rp 25 rb"
 * Uses maximumFractionDigits:0 to prevent SSR/client mismatch.
 * Exception: values that need 1 decimal (e.g. 1.5M) use maximumFractionDigits:1
 * BUT only when the result is stable across environments.
 */
export function fmtCompact(n: number): string {
  // Use maximumFractionDigits:0 — avoids "950,0 jt" vs "950 jt" mismatch
  return new Intl.NumberFormat('id-ID', {
    style:                 'currency',
    currency:              'IDR',
    notation:              'compact',
    maximumFractionDigits: 0,
  }).format(n);
}
