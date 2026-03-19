'use client';

import { useState } from 'react';
import { Send, Bell, Mail, MessageSquare, Monitor, Users, Clock, CheckCircle2, Plus } from 'lucide-react';

const templates = [
  { name: 'Welcome New Agent',            sent: 289,  last: '1 hari lalu' },
  { name: 'Promo Upgrade Paket',          sent: 1247, last: '3 hari lalu' },
  { name: 'Listing Akan Expired',         sent: 'auto',last: 'Otomatis'  },
  { name: 'Verifikasi KTP Reminder',      sent: 'auto',last: 'Otomatis'  },
  { name: 'Invoice Pembayaran',           sent: 'auto',last: 'Otomatis'  },
];

const automations = [
  { label: 'Listing expired H-7, H-3, H-1',        on: true,  type: 'Email + WA' },
  { label: 'User baru daftar → Welcome email',       on: true,  type: 'Email'      },
  { label: 'Tier 2 belum lengkap 7 hari',           on: true,  type: 'Email'      },
  { label: 'Transaksi berhasil → Invoice',           on: true,  type: 'Email'      },
  { label: 'Inquiry tidak direspon 24 jam',          on: false, type: 'WA'         },
  { label: 'User tidak login 30 hari → Win-back',   on: false, type: 'Email'      },
  { label: 'Property request cocok listing baru',   on: false, type: 'Push'       },
];

export default function AdminBroadcastPage() {
  const [channel, setChannel] = useState<'email' | 'push' | 'wa' | 'inapp'>('email');
  const [target, setTarget]   = useState('all');
  const [tab, setTab]         = useState<'compose' | 'template' | 'automation'>('compose');

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      <div>
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Notifikasi & Broadcast</h1>
        <p className="text-sm text-slate-500 font-sans mt-0.5">Kirim pesan ke pengguna melalui berbagai saluran</p>
      </div>

      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {(['compose', 'template', 'automation'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all capitalize ${tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'}`}
          >
            {t === 'compose' ? 'Buat Broadcast' : t === 'template' ? 'Template' : 'Otomatis'}
          </button>
        ))}
      </div>

      {tab === 'compose' && (
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Compose form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-6 space-y-4">

            {/* Channel selector */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Saluran Pengiriman</label>
              <div className="flex gap-2">
                {([
                  { key: 'email', icon: Mail,         label: 'Email'   },
                  { key: 'push',  icon: Bell,         label: 'Push'    },
                  { key: 'wa',    icon: MessageSquare,label: 'WA'      },
                  { key: 'inapp', icon: Monitor,      label: 'In-App'  },
                ] as const).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setChannel(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-sans border transition-all ${
                      channel === key ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]' : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'
                    }`}
                  >
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject (email only) */}
            {channel === 'email' && (
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Subject Email *</label>
                <input type="text" placeholder="Contoh: Promo spesial untuk Anda hari ini!" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
              </div>
            )}

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Isi Pesan *</label>
              <textarea
                rows={6}
                placeholder="Tulis pesan di sini... Gunakan {{nama}} untuk personalisasi."
                className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans resize-none placeholder-slate-300"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                Variabel: {'{{nama}}'}, {'{{email}}'}, {'{{kode_listing}}'}, {'{{paket}}'} 
              </p>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Waktu Pengiriman</label>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-600 font-sans cursor-pointer">
                  <input type="radio" name="schedule" defaultChecked className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                  Kirim Sekarang
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 font-sans cursor-pointer">
                  <input type="radio" name="schedule" className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                  Jadwalkan:
                  <input type="datetime-local" className="px-2 py-1 border border-[#BFDBFE] rounded-lg text-xs focus:outline-none focus:border-[#1D4ED8] bg-[#F8FAFF]" />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => alert('✅ Test broadcast terkirim ke email admin.')}
                className="flex items-center gap-2 bg-slate-100 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-colors font-sans"
              >
                <Mail size={14} /> Kirim Test ke Saya
              </button>
              <button
                onClick={() => {
                  if (confirm('Kirim broadcast ke semua penerima yang dipilih?')) {
                    alert('✅ Broadcast dijadwalkan. Akan terkirim dalam beberapa menit.');
                  }
                }}
                className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors font-sans"
              >
                <Send size={14} /> Kirim Broadcast
              </button>
            </div>
          </div>

          {/* Target panel */}
          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={15} className="text-[#1D4ED8]" />
              <h3 className="font-heading font-semibold text-[#1E3A8A]">Target Penerima</h3>
            </div>
            <div className="space-y-2">
              {[
                { val: 'all',      label: 'Semua User',           count: '1.247' },
                { val: 'agent',    label: 'Agent saja',           count: '289'   },
                { val: 'buyer',    label: 'Buyer saja',           count: '958'   },
                { val: 'tier1',    label: 'Tier 1 (belum KTP)',   count: '445'   },
                { val: 'inactive', label: 'Tidak aktif 30+ hari', count: '167'   },
                { val: 'premium',  label: 'User Premium',         count: '89'    },
              ].map(({ val, label, count }) => (
                <label key={val} className="flex items-center justify-between cursor-pointer py-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="target"
                      value={val}
                      checked={target === val}
                      onChange={() => setTarget(val)}
                      className="w-3.5 h-3.5 accent-[#1D4ED8]"
                    />
                    <span className="text-xs text-[#1E3A8A] font-sans">{label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1D4ED8]">{count}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
              <p className="text-[10px] text-slate-400 font-sans mb-1">Estimasi reach:</p>
              <p className="text-lg font-bold text-[#1E3A8A] font-heading">
                {target === 'all' ? '1.247' : target === 'agent' ? '289' : target === 'buyer' ? '958' : target === 'tier1' ? '445' : target === 'inactive' ? '167' : '89'}
                <span className="text-xs text-slate-400 font-sans font-normal ml-1">pengguna</span>
              </p>
              <p className="text-[10px] text-slate-400 font-sans">Est. open rate: ~34%</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'template' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Library Template</h2>
            <button onClick={() => alert("Buat template broadcast baru dari tab Compose, lalu simpan sebagai template.")} className="flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans">
              <Plus size={12} /> Template Baru
            </button>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {templates.map(({ name, sent, last }) => (
              <div key={name} className="flex items-center justify-between px-5 py-4 hover:bg-[#F8FAFF] transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#1E3A8A] font-heading">{name}</p>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                    Terkirim: <strong>{sent}</strong> kali · Terakhir: {last}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] text-[#1D4ED8] border border-[rgba(29,78,216,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans font-bold">
                    Gunakan
                  </button>
                  <button className="text-[10px] text-slate-400 border border-[#BFDBFE] px-3 py-1.5 rounded-lg hover:border-[#1D4ED8] transition-colors font-sans">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'automation' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Trigger-based Automation</h2>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Pesan yang dikirim otomatis berdasarkan kejadian tertentu</p>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {automations.map(({ label, on, type }) => (
              <div key={label} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${on ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm text-[#1E3A8A] font-sans">{label}</p>
                    <p className="text-[10px] text-slate-400 font-sans">{type}</p>
                  </div>
                </div>
                <button className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${on ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
            <div className="px-5 py-3">
              <button onClick={() => alert("Fitur tambah automation baru akan tersedia di versi berikutnya.")} className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8] font-sans">
                <Plus size={12} /> Tambah Automation Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
