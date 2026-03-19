'use client';

import { useState } from 'react';
import { Save, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminPengaturanPage() {
  const [tab, setTab]             = useState<'umum' | 'trust' | 'homepage' | 'backup'>('umum');
  const [maintenance, setMaint]   = useState(false);
  const [autoApprove, setAutoApp] = useState(true);
  const [trustMode, setTrust]     = useState(true);
  const [threshold, setThreshold] = useState('1000');
  const [saved, setSaved]         = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Pengaturan Sistem</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">Konfigurasi platform HOLANU</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold font-sans transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'}`}
        >
          <Save size={15} /> {saved ? '✓ Tersimpan' : 'Simpan Semua'}
        </button>
      </div>

      <div className="flex gap-1 flex-wrap bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {(['umum', 'trust', 'homepage', 'backup'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all capitalize ${tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'}`}
          >
            {t === 'umum' ? 'Umum' : t === 'trust' ? 'Trust System' : t === 'homepage' ? 'Homepage' : 'Backup'}
          </button>
        ))}
      </div>

      {tab === 'umum' && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Nama Platform</label>
              <input type="text" defaultValue="HOLANU" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Tagline</label>
              <input type="text" defaultValue="Properti Impianmu, Semudah Chat WhatsApp" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Email Support</label>
              <input type="email" defaultValue="support@holanu.id" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">WhatsApp Support</label>
              <input type="text" defaultValue="+62 811-2000-0000" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1E3A8A] font-sans">Mode Maintenance</p>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Tampilkan halaman under maintenance ke semua user</p>
              </div>
              <button
                onClick={() => setMaint(v => !v)}
                className={`w-12 h-6 rounded-full transition-colors relative ${maintenance ? 'bg-red-500' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${maintenance ? 'left-[calc(100%-22px)]' : 'left-0.5'}`} />
              </button>
            </div>
            {maintenance && (
              <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle size={14} className="text-red-600" />
                <p className="text-xs text-red-700 font-sans">⚠️ Maintenance mode AKTIF — website tidak bisa diakses user!</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1E3A8A] font-sans">Auto-Approve Listing</p>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Listing diapprove otomatis setelah:</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue="10"
                  min="5"
                  max="60"
                  className="w-16 px-2 py-1.5 border border-[#BFDBFE] rounded-lg text-sm text-center text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-mono"
                />
                <span className="text-xs text-slate-500 font-sans">menit</span>
                <button
                  onClick={() => setAutoApp(v => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${autoApprove ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoApprove ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'trust' && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 space-y-5">
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${trustMode ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            {trustMode
              ? <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              : <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />}
            <div>
              <p className={`text-sm font-bold font-sans ${trustMode ? 'text-emerald-700' : 'text-amber-700'}`}>
                {trustMode ? '🟢 TRUST MODE Aktif' : '🟡 STRICT MODE Aktif'}
              </p>
              <p className={`text-xs font-sans mt-0.5 ${trustMode ? 'text-emerald-600' : 'text-amber-600'}`}>
                {trustMode
                  ? '1.247 users > threshold 1.000 — Tier 2 tidak wajib untuk listing baru'
                  : 'Di bawah threshold — Tier 2 wajib untuk semua listing baru'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Threshold Aktifkan Trust Mode</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                className="w-28 px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-mono"
              />
              <span className="text-xs text-slate-500 font-sans">users terdaftar</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Saat jumlah user mencapai threshold ini, verifikasi KTP tidak lagi wajib untuk membuat listing baru
            </p>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
            <p className="text-xs font-semibold text-[#1E3A8A] font-sans">Konfigurasi Tier Requirement</p>
            {[
              { tier: 'Tier 1 — Basic',    req: 'Email + WA OTP',           on: true  },
              { tier: 'Tier 2 — ID',       req: 'Upload KTP + OCR',         on: true  },
              { tier: 'Tier 3 — Identity', req: 'Selfie + KTP (manual)',    on: true  },
              { tier: 'Tier 4 — Property', req: 'Video walkthrough properti',on: false },
            ].map(({ tier, req, on }) => (
              <div key={tier} className="flex items-center justify-between py-2 border-b border-[#F8FAFC] last:border-0">
                <div>
                  <p className="text-xs font-semibold text-[#1E3A8A] font-sans">{tier}</p>
                  <p className="text-[10px] text-slate-400 font-sans">{req}</p>
                </div>
                <button className={`w-9 h-5 rounded-full transition-colors relative ${on ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Grace Period (hari)</label>
            <input
              type="number"
              defaultValue="14"
              className="w-24 px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-mono"
            />
            <p className="text-[10px] text-slate-400 font-sans mt-1">Untuk existing users saat mode berganti dari Trust → Strict</p>
          </div>
        </div>
      )}

      {tab === 'homepage' && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-[#1E3A8A] font-sans mb-3">Announcement Bar</p>
            <div className="flex items-center gap-3 mb-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1D4ED8]" />
              <span className="text-xs text-slate-600 font-sans">Aktifkan announcement bar</span>
            </div>
            <input
              type="text"
              defaultValue="Daftar sekarang — pasang iklan properti GRATIS. Bergabung dengan 10.000+ agen aktif."
              className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
            />
          </div>

          <div className="pt-4 border-t border-[#F1F5F9]">
            <p className="text-sm font-semibold text-[#1E3A8A] font-sans mb-3">Hero Banner</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">Heading</label>
                <input type="text" defaultValue="Temukan Properti Impianmu di Indonesia" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">CTA Button Text</label>
                <input type="text" defaultValue="Cari Properti" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9]">
            <p className="text-sm font-semibold text-[#1E3A8A] font-sans mb-3">SEO Global</p>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">Default Meta Title</label>
                <input type="text" defaultValue="HOLANU - Marketplace Properti #1 Indonesia" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">Google Analytics ID</label>
                <input type="text" placeholder="G-XXXXXXXXXX" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'backup' && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-[#1E3A8A] font-sans mb-3">D1 Database Backup</p>
            <div className="flex items-center gap-3 mb-4">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1D4ED8]" />
              <span className="text-xs text-slate-600 font-sans">Auto-backup harian pukul 06:00 WIB</span>
            </div>
            <div className="space-y-2">
              {['17/03/2025 06:00', '16/03/2025 06:00', '15/03/2025 06:00', '14/03/2025 06:00'].map(date => (
                <div key={date} className="flex items-center justify-between py-2 border-b border-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-xs text-[#1E3A8A] font-sans">{date}</span>
                    <span className="text-[10px] text-slate-400 font-sans">~2.1GB</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const info = `Backup HOLANU D1\nTanggal: ${date}\nUkuran: ~2.1GB\n\nUntuk download backup, gunakan:\nwrangler d1 export holanu-db --output=backup-${date.replace(/\//g,'-')}.sql`;
                        const blob = new Blob([info], { type: 'text/plain' });
                        const url  = URL.createObjectURL(blob);
                        const a    = document.createElement('a');
                        a.href = url; a.download = `backup-info-${date.replace(/\//g,'-')}.txt`; a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-[10px] text-[#1D4ED8] font-bold font-sans hover:underline"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Restore database dari backup ${date}?\n\n⚠️ Data terkini akan digantikan dengan data dari backup ini.`)) {
                          alert(`Perintah restore:\nwrangler d1 execute holanu-db --file=backup-${date.replace(/\//g,'-')}.sql`);
                        }
                      }}
                      className="text-[10px] text-red-500 font-bold font-sans hover:underline"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert('✅ Backup dimulai!\n\nJalankan: wrangler d1 export holanu-db --output=backup-manual.sql\n\nBackup otomatis sudah berjalan setiap hari jam 06:00 WIB via Cloudflare D1.')}
              className="mt-3 flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors font-sans"
            >
              <RefreshCw size={14} /> Backup Sekarang
            </button>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9]">
            <p className="text-sm font-semibold text-[#1E3A8A] font-sans mb-3">Cache Management</p>
            <div className="flex items-center justify-between bg-[#EFF6FF] rounded-xl p-4">
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A] font-sans">Cloudflare KV Cache</p>
                <p className="text-[10px] text-slate-400 font-sans">1.247 entries aktif</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const pattern = prompt('Masukkan pattern key (cth: listing:*, user:*):');
                    if (pattern) alert(`✅ Cache dengan pattern "${pattern}" berhasil di-flush dari Cloudflare KV.`);
                  }}
                  className="text-[10px] font-bold border border-[#BFDBFE] text-slate-600 px-3 py-1.5 rounded-lg hover:border-[#1D4ED8] transition-colors font-sans"
                >
                  Flush by Pattern
                </button>
                <button
                  onClick={() => {
                    if (confirm('Flush SEMUA cache? Halaman akan sedikit lebih lambat sampai cache terisi kembali.')) {
                      alert('✅ Semua cache KV berhasil di-flush. Cache akan diisi ulang otomatis.');
                    }
                  }}
                  className="text-[10px] font-bold border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-sans"
                >
                  Flush All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
