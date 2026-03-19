import { redirect } from 'next/navigation';

/**
 * /dashboard/pengaturan → redirect ke /dashboard/profil
 * Pengaturan dikelola bersama Profil
 */
export default function PengaturanPage() {
  redirect('/dashboard/profil');
}
