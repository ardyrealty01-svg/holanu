import { SignUp } from '@clerk/nextjs';

export default function DaftarPage() {
  return (
    <div className="w-full max-w-4xl">
      <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-2xl border border-[#BFDBFE] shadow-sm overflow-hidden">

        {/* ── Kiri: Branding panel ── */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1D4ED8] p-10 flex-col justify-between hidden lg:flex">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h2 className="font-heading font-bold text-3xl text-white leading-tight mb-3">
              Mulai perjalanan<br />
              <span className="text-[#BAE6FD]">properti</span> Anda
            </h2>
            <p className="text-[#93C5FD] text-sm font-sans leading-relaxed">
              Bergabung dengan 10.000+ agen dan pemilik properti yang sudah mempercayai HOLANU.
            </p>
          </div>

          <div className="space-y-3 mt-10">
            {[
              '🏠 Pasang listing properti GRATIS',
              '📊 Dashboard analitik real-time',
              '💬 Lead langsung ke WhatsApp kamu',
              '🔒 Data aman & terverifikasi',
            ].map(t => (
              <div key={t} className="flex items-center gap-3">
                <span className="text-[#BAE6FD] text-sm font-sans">{t}</span>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[#93C5FD] text-xs font-sans">Sudah bergabung:</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex -space-x-2">
                {['AW','BS','CK','DP'].map(init => (
                  <div key={init} className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">{init}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#93C5FD] text-xs font-sans">10.000+ agen aktif</p>
            </div>
          </div>
        </div>

        {/* ── Kanan: Clerk SignUp form ── */}
        <div className="p-8 flex flex-col justify-center">

          {/* Mobile header */}
          <div className="mb-5 lg:hidden text-center">
            <h2 className="font-heading font-bold text-xl text-[#1E3A8A] mb-1">Daftar Gratis</h2>
            <p className="text-slate-500 text-sm font-sans">
              Sudah punya akun?{' '}
              <a href="/masuk" className="text-[#1D4ED8] font-semibold hover:underline">Masuk</a>
            </p>
          </div>

          {/* Info: WA diisi di profil */}
          <div className="mb-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-3 text-xs text-[#1E3A8A] font-sans">
            💡 Nomor WhatsApp bisa kamu lengkapi di{' '}
            <span className="font-semibold">Profil → Dashboard</span>{' '}
            setelah daftar selesai.
          </div>

          <SignUp
            routing="hash"
            appearance={{
              elements: {
                rootBox:                  'w-full',
                card:                     'shadow-none border-0 p-0 w-full',
                headerTitle:              'font-heading font-bold text-xl text-[#1E3A8A]',
                headerSubtitle:           'text-slate-500 font-sans text-sm',
                socialButtonsBlockButton: 'border border-[#BFDBFE] hover:bg-[#EFF6FF] font-sans text-sm',
                formButtonPrimary:        'bg-[#1D4ED8] hover:bg-[#1E40AF] font-sans font-semibold',
                footerActionLink:         'text-[#1D4ED8] hover:underline font-semibold',
                formFieldInput:           'border-[#BFDBFE] focus:border-[#1D4ED8] font-sans text-sm rounded-xl',
                formFieldLabel:           'text-[#1E3A8A] font-semibold text-xs font-sans',
                identityPreviewEditButton:'text-[#1D4ED8]',
                formResendCodeLink:       'text-[#1D4ED8]',
                // Hide phone number field visually (Clerk still controls requirement via Dashboard)
                phoneNumberField:         'hidden',
                phoneNumberFieldLabel:    'hidden',
                phoneNumberFieldInput:    'hidden',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
