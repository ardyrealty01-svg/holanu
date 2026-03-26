import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format waktu relatif: "Baru saja", "2 jam lalu", "3 hari lalu" */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Baru saja';
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

/** Buat link WhatsApp dari nomor Indonesia */
export function buildWaLink(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, '');
  const number = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  return `https://wa.me/${number}`;
}

/** Ambil inisial dari nama: "Ahmad Fajar" → "AF" */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
