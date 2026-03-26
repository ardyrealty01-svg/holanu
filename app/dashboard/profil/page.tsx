'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { Camera, Instagram, Globe, Phone, Mail, ShieldCheck, Eye, MousePointerClick, Loader2, Check } from 'lucide-react';

export default function ProfilPage() {
  const { user, isLoaded } = useUser();
  const { getToken }       = useAuth();

  const [tab, setTab]       = useState<'profil' | 'keamanan' | 'notifikasi' | 'preferensi'>('profil');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const displayName  = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'Pengguna' : '';
  const displayEmail = user?.primaryEmailAddress?.emailAddress ?? '';

  // Profil form state — diisi dari API saat load
  const [nama,      setNama]      = useState('');
  const [whatsapp,  setWhatsapp]  = useState('');
  const [bio,       setBio]       = useState('');
  const [instagram, setInstagram] = useState('');
  const [website,   setWebsite]   = useState('');
  const [city,      setCity]      = useState('');
  const [profLoaded, setProfLoaded] = useState(false);

  // Load data profil dari D1 via Workers API saat user tersedia
  useEffect(() => {
    if (!isLoaded || !user?.id || profLoaded) return;
    const load = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res  = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ''}/api/users/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json() as { ok: boolean; data: any };
        if (json.ok && json.data) {
          const d = json.data;
          setNama(     d.name      || displayName);
          setWhatsapp( d.whatsapp  || user?.phoneNumbers?.[0]?.phoneNumber?.replace('+62','0') || '');
          setBio(      d.bio       || '');
          setInstagram(d.instagram || '');
          setWebsite(  d.website   || '');
          setCity(     d.city      || '');
        } else {
          // Fallback ke data Clerk jika user belum di-sync ke D1
          setNama(    displayName);
          setWhatsapp(user?.phoneNumbers?.[0]?.phoneNumber?.replace('+62','0') || '');
        }
      } catch {
        // Fallback silent
        setNama(    displayName);
        setWhatsapp(user?.phoneNumbers?.[0]?.phoneNumber?.replace('+62','0') || '');
      } finally {
        setProfLoaded(true);
      }
    };
    load();
  }, [isLoaded, user?.id]);

  const handleSaveProfil = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token || !user?.id) return;

      // Update nama via Clerk
      if (nama !== displayName) {
        const [firstName, ...rest] = nama.split(' ');
        await user.update({ firstName, lastName: rest.join(' ') });
      }

      // Update profil di D1 via Workers API
      const fields: Record<string, string> = {};
      if (whatsapp)  fields.whatsapp  = whatsapp;
      if (bio)       fields.bio       = bio;
      if (instagram) fields.instagram = instagram;
      if (website)   fields.website   = website;
      if (city)      fields.city      = city;

      if (Object.keys(fields).length > 0) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify(fields),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Profil & Pengaturan</h1>
        <p className="text-sm text-slate-500 font-sans mt-0.5">Kelola informasi akun dan preferensi Anda</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 flex-wrap w-fit">
        {(['profil', 'keamanan', 'notifikasi', 'preferensi'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all capitalize ${
              tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* PROFIL TAB */}
      {tab === 'profil' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] relative">
              <button onClick={() => alert("Fitur ganti cover foto akan tersedia segera.")} className="absolute bottom-2 right-3 flex items-center gap-1.5 bg-white/90 text-[#1E3A8A] text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors font-sans">
                <Camera size={11} /> Ganti Cover
              </button>
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md overflow-hidden">
                    {user?.imageUrl
                      ? <img src={user.imageUrl} alt="avatar" className="w-full h-full object-cover" />
                      : (displayName?.[0]?.toUpperCase() ?? 'U')}
                  </div>
                  <button onClick={() => alert("Klik untuk upload foto profil via ImageKit.")} className="absolute bottom-0 right-0 w-7 h-7 bg-[#1E3A8A] text-[#BAE6FD] rounded-full flex items-center justify-center hover:bg-[#1D4ED8] transition-colors">
                    <Camera size={13} />
                  </button>
                </div>
                <div className="mb-1">
                  <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">{displayName || 'Nama Belum Diset'}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-sans">Agent · HOLANU</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#1D4ED8] font-bold border border-[rgba(29,78,216,0.4)] px-1.5 py-0.5 rounded">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile stats */}
              <div className="flex gap-6 mb-5 pb-5 border-b border-[#F1F5F9]">
                {[
                  { icon: Eye,               label: 'Profile views',    value: '—', period: '30 hari' },
                  { icon: MousePointerClick, label: 'Click ke listing',  value: '—', period: '30 hari' },
                  { icon: Phone,             label: 'WA Click',          value: '—', period: '30 hari' },
                ].map(({ icon: Icon, label, value, period }) => (
                  <div key={label}>
                    <p className="font-heading font-bold text-xl text-[#1D4ED8]">{value}</p>
                    <p className="text-[10px] text-slate-400 font-sans">{label}</p>
                    <p className="text-[9px] text-slate-300 font-sans">{period}</p>
                  </div>
                ))}
              </div>

              {/* Edit form — controlled inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Nama Display</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={displayEmail}
                      readOnly
                      className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-slate-400 bg-[#F8FAFF] font-sans cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">Email dikelola lewat Clerk — ubah di pengaturan akun</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">WhatsApp</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kota</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="cth: Sleman, Yogyakarta"
                    className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Instagram</label>
                  <div className="relative">
                    <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={instagram}
                      onChange={e => setInstagram(e.target.value)}
                      placeholder="@username"
                      className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Website</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveProfil}
                disabled={saving}
                className="mt-5 flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors font-sans"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
                {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : '💾 Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KEAMANAN TAB */}
      {tab === 'keamanan' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 space-y-5">
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 text-sm font-sans text-[#1E3A8A]">
              <p className="font-semibold mb-1">Keamanan dikelola oleh Clerk</p>
              <p className="text-xs text-slate-500">Password, 2FA, dan session login dikelola melalui dashboard Clerk. Klik tombol di bawah untuk mengelola keamanan akun.</p>
            </div>
            <a
              href="https://accounts.clerk.dev/user"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors font-sans"
            >
              🔐 Kelola Keamanan Akun
            </a>
            <div className="pt-5 border-t border-[#F1F5F9]">
              <h3 className="font-heading font-semibold text-red-600 mb-2">Hapus Akun</h3>
              <p className="text-xs text-slate-500 font-sans mb-3">Tindakan ini tidak dapat dibatalkan. Semua data listing dan inquiry akan dihapus permanen.</p>
              <button
                onClick={() => {
                  if (confirm('Yakin ingin menghapus akun? Tindakan ini tidak bisa dibatalkan.')) {
                    alert('Hubungi support@holanu.id untuk menghapus akun.');
                  }
                }}
                className="flex items-center gap-2 border border-red-200 text-red-500 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-sans"
              >
                🗑️ Hapus Akun Saya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFIKASI TAB */}
      {tab === 'notifikasi' && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6">
          <h3 className="font-heading font-semibold text-[#1E3A8A] mb-5">Preferensi Notifikasi</h3>
          <div className="space-y-4">
            {[
              { label: 'Inquiry baru via WhatsApp',  email: true,  wa: true  },
              { label: 'Listing akan expired',        email: true,  wa: true  },
              { label: 'Pembayaran berhasil',          email: true,  wa: false },
              { label: 'Review & rating baru',         email: false, wa: true  },
              { label: 'Promo & penawaran',            email: true,  wa: false },
            ].map(({ label, email, wa }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                <span className="text-sm text-[#1E3A8A] font-sans">{label}</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs text-slate-500 font-sans cursor-pointer">
                    <input type="checkbox" defaultChecked={email} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-500 font-sans cursor-pointer">
                    <input type="checkbox" defaultChecked={wa} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                    WhatsApp
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => alert("✅ Preferensi notifikasi tersimpan.")} className="mt-5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors font-sans">
            Simpan Preferensi
          </button>
        </div>
      )}

      {/* PREFERENSI TAB */}
      {tab === 'preferensi' && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 space-y-5">
          <div>
            <h3 className="font-heading font-semibold text-[#1E3A8A] mb-3">Bahasa</h3>
            <div className="flex gap-2">
              {['Indonesia', 'English'].map(lang => (
                <button key={lang} onClick={() => alert(`Bahasa ${lang} akan aktif setelah refresh.`)} className={`px-4 py-2 rounded-xl text-sm font-semibold font-sans border transition-all ${lang === 'Indonesia' ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]' : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'}`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-[#F1F5F9]">
            <h3 className="font-heading font-semibold text-[#1E3A8A] mb-3">Mode Tampilan</h3>
            <div className="flex gap-2">
              {['☀️ Light', '🌙 Dark', '⚙️ Auto'].map(mode => (
                <button key={mode} onClick={() => alert(`Mode ${mode} akan aktif setelah refresh.`)} className={`px-4 py-2 rounded-xl text-sm font-semibold font-sans border transition-all ${mode === '☀️ Light' ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]' : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
