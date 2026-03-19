import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function SyaratKetentuanPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading font-bold text-3xl text-[#1E3A8A] mb-2">Syarat & Ketentuan</h1>
        <p className="text-slate-400 text-sm font-sans mb-8">Terakhir diperbarui: 17 Maret 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-slate-600 font-sans">
          {[
            {
              title: '1. Penerimaan Syarat',
              content: 'Dengan mengakses atau menggunakan platform HOLANU, Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak menyetujui syarat ini, mohon untuk tidak menggunakan layanan kami.',
            },
            {
              title: '2. Penggunaan Platform',
              content: 'HOLANU adalah platform marketplace properti yang menyediakan ruang bagi pengguna untuk memasang dan mencari listing properti. HOLANU tidak bertindak sebagai agen properti dan tidak bertanggung jawab atas transaksi yang terjadi antara pengguna.',
            },
            {
              title: '3. Akun Pengguna',
              content: 'Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda. Setiap aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya. Laporkan segera jika terjadi akses tidak sah.',
            },
            {
              title: '4. Konten Listing',
              content: 'Pengguna yang memasang listing bertanggung jawab atas keakuratan informasi yang disampaikan. HOLANU berhak menghapus listing yang melanggar ketentuan, mengandung informasi palsu, atau tidak sesuai dengan kebijakan platform.',
            },
            {
              title: '5. Pembayaran & Subscription',
              content: 'Pembayaran diproses melalui Midtrans dan tunduk pada kebijakan pembayaran mereka. HOLANU tidak menyimpan data kartu kredit pengguna. Refund diproses sesuai kebijakan yang berlaku.',
            },
            {
              title: '6. Privasi Data',
              content: 'Penggunaan data pribadi Anda diatur dalam Kebijakan Privasi kami. Dengan menggunakan layanan HOLANU, Anda menyetujui pengumpulan dan penggunaan data sesuai Kebijakan Privasi tersebut.',
            },
            {
              title: '7. Perubahan Syarat',
              content: 'HOLANU berhak mengubah Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui email atau notifikasi dalam aplikasi. Penggunaan berkelanjutan setelah perubahan berarti Anda menyetujui syarat yang diperbarui.',
            },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-heading font-bold text-[#1E3A8A] text-base mb-2">{title}</h2>
              <p className="leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
