'use client';

import { useState } from 'react';
import { Shield, Eye, AlertTriangle, Ban, Clock, Download, Lock, Plus, X } from 'lucide-react';

const auditLog = [
  { time: '17/03 09:32', admin: 'admin@holanu.id', action: 'BAN USER',       target: 'U-1027 Dian Pratiwi',     ip: '182.168.x.x' },
  { time: '17/03 09:15', admin: 'admin@holanu.id', action: 'APPROVE LISTING', target: 'HOL-1203',               ip: '182.168.x.x' },
  { time: '17/03 08:50', admin: 'admin@holanu.id', action: 'EDIT HARGA',      target: 'Paket Gold → Rp 399K',   ip: '182.168.x.x' },
  { time: '16/03 22:10', admin: 'mod@holanu.id',   action: 'REJECT LISTING',  target: 'HOL-1199 (spam content)',ip: '118.99.x.x'  },
  { time: '16/03 18:00', admin: 'admin@holanu.id', action: 'TIER UPGRADE',    target: 'U-1024 → Tier 2',        ip: '182.168.x.x' },
];

const INIT_FLAG_RULES = [
  { rule: 'Harga < Rp 10 juta (likely spam)',    on: true  },
  { rule: 'Foto < 2 buah',                       on: true  },
  { rule: 'Deskripsi < 50 karakter',             on: true  },
  { rule: 'Ada link eksternal di deskripsi',     on: true  },
  { rule: 'Nomor HP di judul listing',           on: false },
  { rule: 'Kata terlarang terdeteksi',           on: true  },
];

const INIT_SESSIONS = [
  { user: 'admin@holanu.id', device: 'Chrome · Desktop', location: 'Jakarta',    time: 'Sekarang',   current: true  },
  { user: 'mod@holanu.id',   device: 'Safari · iPhone',  location: 'Yogyakarta', time: '2 jam lalu', current: false },
];

const actionColors: Record<string, string> = {
  'BAN USER':        'bg-red-50     text-red-700   border-red-200',
  'APPROVE LISTING': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'REJECT LISTING':  'bg-orange-50  text-orange-700 border-orange-200',
  'EDIT HARGA':      'bg-blue-50    text-blue-700   border-blue-200',
  'TIER UPGRADE':    'bg-purple-50  text-purple-700 border-purple-200',
};
  'EDIT HARGA':     'bg-blue-50    text-blue-700   border-blue-200',
  'TIER UPGRADE':   'bg-purple-50  text-purple-700 border-purple-200',
};

export default function AdminKeamananPage() {
  const [flagRules, setFlagRules] = useState(INIT_FLAG_RULES);
  const [sessions,  setSessions]  = useState(INIT_SESSIONS);
  const [badWords,  setBadWords]  = useState(['judi', 'bokep', 'tipu', 'scam', 'penipuan']);
  const [newWord,   setNewWord]   = useState('');

  const toggleRule = (idx: number) =>
    setFlagRules(prev => prev.map((r, i) => i === idx ? { ...r, on: !r.on } : r));

  const revokeSession = (user: string) =>
    setSessions(prev => prev.filter(s => s.user !== user));

  const removeBadWord = (w: string) =>
    setBadWords(prev => prev.filter(x => x !== w));

  const addBadWord = () => {
    const w = newWord.trim().toLowerCase();
    if (w && !badWords.includes(w)) { setBadWords(prev => [...prev, w]); setNewWord(''); }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      <div>
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Keamanan & Moderasi</h1>
        <p className="text-sm text-slate-500 font-sans mt-0.5">Monitor akses, audit log, dan aturan moderasi konten</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">

        {/* Active sessions */}
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-2">
            <Lock size={15} className="text-[#1D4ED8]" />
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Sesi Aktif</h2>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {sessions.map(({ user, device, location, time, current }) => (
              <div key={user} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-[#1E3A8A] font-sans">{user}</p>
                    {current && (
                      <span className="text-[8px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">SESI INI</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">{device} · {location} · {time}</p>
                </div>
                {!current && (
                  <button
                    onClick={() => { if (confirm(`Revoke sesi ${user}?`)) revokeSession(user); }}
                    className="text-[10px] font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-sans"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[#F1F5F9]">
            <div>
              <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-1">Status 2FA Admin</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-sans">
                  <span className="text-slate-500">admin@holanu.id</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1"><Shield size={10} /> TOTP Aktif</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-sans">
                  <span className="text-slate-500">mod@holanu.id</span>
                  <span className="text-amber-600 font-bold flex items-center gap-1"><AlertTriangle size={10} /> Belum Setup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content moderation rules */}
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-2">
            <Ban size={15} className="text-[#1D4ED8]" />
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Auto-Flag Rules</h2>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {flagRules.map(({ rule, on }, idx) => (
              <div key={rule} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-[#1E3A8A] font-sans">{rule}</span>
                <button
                  onClick={() => toggleRule(idx)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${on ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-[#F1F5F9]">
            <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-2">Kata Terlarang</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {badWords.map(w => (
                <span key={w} className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {w}
                  <button onClick={() => removeBadWord(w)} className="opacity-60 hover:opacity-100">
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newWord}
                onChange={e => setNewWord(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addBadWord(); }}
                placeholder="Kata baru..."
                className="text-[11px] px-2.5 py-1.5 border border-[#BFDBFE] rounded-lg focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans w-32"
              />
              <button
                onClick={addBadWord}
                className="text-[10px] text-[#1D4ED8] font-bold font-sans border border-[rgba(29,78,216,0.3)] px-2.5 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors"
              >
                + Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-[#1D4ED8]" />
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Audit Log</h2>
            <span className="text-[10px] text-slate-400 font-sans">Retensi 90 hari</span>
          </div>
          <button onClick={() => { const csv = auditLog.map(l => `${l.time},${l.admin},${l.action},${l.target},${l.ip}`).join("\n"); const blob = new Blob(["Waktu,Admin,Aksi,Target,IP\n" + csv], {type:"text/csv"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="audit-log.csv"; a.click(); URL.revokeObjectURL(url); }} className="flex items-center gap-1.5 text-xs text-slate-500 border border-[#BFDBFE] px-3 py-1.5 rounded-lg hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors font-sans">
            <Download size={12} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EFF6FF]">
              <tr>
                {['Waktu', 'Admin', 'Aksi', 'Target', 'IP Address'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {auditLog.map((log, i) => (
                <tr key={i} className="hover:bg-[#F8FAFF] transition-colors">
                  <td className="px-4 py-3 text-[10px] text-slate-400 font-mono whitespace-nowrap">{log.time}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 font-sans">{log.admin}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${actionColors[log.action] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#1E3A8A] font-sans">{log.target}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
