import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function KebijakanPrivasiPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading font-bold text-3xl text-[#1E3A8A] mb-2">Kebijakan Privasi</h1>
        <p className="text-slate-400 text-sm font-sans mb-8">Terakhir diperbarui: 17 Maret 2025</p>

        <div className="space-y-6 text-slate-600 font-sans">
          {[
            {
              title: '1. Data yang Kami Kumpulkan',
              content: 'Kami mengumpulkan informasi yang Anda berikan secara langsung (nama, email, nomor WhatsApp, data properti), data penggunaan platform (halaman yang dikunjungi, listing yang dilihat), dan data teknis (IP address, jenis perangkat).',
            },
            {
              title: '2. Cara Kami Menggunakan Data',
              content: 'Data digunakan untuk: menyediakan dan meningkatkan layanan HOLANU, mengirimkan notifikasi relevan (listing baru, info transaksi), analitik platform, keamanan dan pencegahan penipuan, serta komunikasi layanan pelanggan.',
            },
            {
              title: '3. Berbagi Data',
              content: 'HOLANU tidak menjual data pribadi pengguna kepada pihak ketiga. Data dapat dibagikan dengan: penyedia layanan teknis (Cloudflare, ImageKit, Midtrans) untuk operasional platform, atau atas permintaan hukum yang sah.',
            },
            {
              title: '4. Keamanan Data',
              content: 'Kami menggunakan enkripsi SSL/TLS untuk semua transmisi data. Data disimpan di infrastruktur Cloudflare yang tersertifikasi. Akses ke data produksi dibatasi dan diaudit secara berkala.',
            },
            {
              title: '5. Hak Pengguna',
              content: 'Anda berhak untuk: mengakses data pribadi Anda, meminta koreksi data yang tidak akurat, meminta penghapusan akun dan data, dan menarik persetujuan penggunaan data kapan saja melalui pengaturan akun.',
            },
            {
              title: '6. Cookies & Analytics',
              content: 'HOLANU menggunakan Cloudflare Web Analytics yang privacy-friendly dan tidak menggunakan cookies tracking. Tidak ada cookie consent banner yang diperlukan karena kami tidak melacak pengguna lintas situs.',
            },
            {
              title: '7. Hubungi Kami',
              content: 'Pertanyaan tentang privasi data dapat disampaikan ke: privasi@holanu.id atau melalui formulir kontak di halaman Hubungi Kami.',
            },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-heading font-bold text-[#1E3A8A] text-base mb-2">{title}</h2>
              <p className="leading-relaxed text-sm">{content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
