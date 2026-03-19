'use client';

import { useState } from 'react';
import {
  Plus, FileText, Send, CheckCircle2, Clock,
  Eye, Download, X, ChevronRight,
} from 'lucide-react';

type DocStatus = 'draft' | 'sent' | 'viewed' | 'signed_client' | 'signed_agent' | 'done';

const TEMPLATES = [
  { id: 'spa',      icon: '📄', name: 'Perjanjian Jual Beli (SPA)',    badge: '⭐ Populer' },
  { id: 'sewa',     icon: '📄', name: 'Perjanjian Sewa Menyewa',        badge: ''           },
  { id: 'mou',      icon: '📄', name: 'MoU Kerjasama Properti',         badge: ''           },
  { id: 'kerjasama',icon: '📄', name: 'Kerjasama Agen & Pemilik',       badge: ''           },
  { id: 'custom',   icon: '✨', name: 'Custom — Buat dari Nol',         badge: ''           },
];

const ACTIVE_DOCS = [
  {
    id: 'DOC-001', title: 'SPA — Rumah Condongcatur',
    client: 'Ahmad Fajar', phone: '0812-3456-7890',
    status: 'signed_client' as DocStatus, created: '15 Mar 2025',
  },
  {
    id: 'DOC-002', title: 'Perjanjian Sewa — Kost Putri UGM',
    client: 'Siti Rahayu', phone: '0813-9876-5432',
    status: 'sent' as DocStatus, created: '16 Mar 2025',
  },
  {
    id: 'DOC-003', title: 'MoU Kerjasama — Villa Pakem',
    client: 'Budi Santoso', phone: '0878-1234-5678',
    status: 'draft' as DocStatus, created: '17 Mar 2025',
  },
];

const PIPELINE: { key: DocStatus; label: string }[] = [
  { key: 'draft',        label: 'Draft'          },
  { key: 'sent',         label: 'Terkirim'       },
  { key: 'viewed',       label: 'Dibuka Client'  },
  { key: 'signed_client',label: 'TTD Client'     },
  { key: 'signed_agent', label: 'TTD Agen'       },
  { key: 'done',         label: 'Selesai'        },
];

const statusColor: Record<DocStatus, string> = {
  draft:         'bg-gray-100   text-gray-500',
  sent:          'bg-blue-50    text-blue-700',
  viewed:        'bg-amber-50   text-amber-700',
  signed_client: 'bg-purple-50  text-purple-700',
  signed_agent:  'bg-orange-50  text-orange-700',
  done:          'bg-emerald-50 text-emerald-700',
};

export default function FormSubmissionPage() {
  const [tab, setTab]           = useState<'template' | 'aktif' | 'selesai'>('template');
  const [showEditor, setEditor] = useState(false);
  const [selectedTpl, setTpl]   = useState('');

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Form & Kontrak</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            Buat perjanjian informal dengan materai tempel & tanda tangan digital
          </p>
        </div>
        <button
          onClick={() => { setEditor(true); setTpl(''); }}
          className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors font-sans"
        >
          <Plus size={15} /> Buat Kontrak Baru
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <span className="text-base flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-700 font-sans leading-relaxed">
          Dokumen ini menggunakan <strong>materai tempel</strong> (gambar) dan <strong>tanda tangan gambar</strong>.
          Cocok untuk MoU, perjanjian informal, dan kerjasama. Untuk AJB resmi tetap memerlukan PPAT/Notaris.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {(['template', 'aktif', 'selesai'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all capitalize ${
              tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'
            }`}
          >
            {t === 'template' ? 'Pilih Template' : t === 'aktif' ? `Aktif (${ACTIVE_DOCS.filter(d => d.status !== 'done').length})` : 'Selesai'}
          </button>
        ))}
      </div>

      {/* TEMPLATE TAB */}
      {tab === 'template' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => { setTpl(tpl.id); setEditor(true); }}
              className="bg-white rounded-xl border border-[#BFDBFE] p-5 text-left hover:border-[#1D4ED8] hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{tpl.icon}</span>
                {tpl.badge && (
                  <span className="text-[9px] font-bold bg-[#DBEAFE] text-[#1D4ED8] px-2 py-0.5 rounded-full">
                    {tpl.badge}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#1E3A8A] font-heading leading-snug mb-3">{tpl.name}</p>
              <div className="flex items-center text-[10px] text-[#1D4ED8] font-semibold font-sans group-hover:gap-2 transition-all">
                Gunakan Template <ChevronRight size={12} className="ml-1" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ACTIVE DOCS TAB */}
      {tab === 'aktif' && (
        <div className="space-y-3">
          {ACTIVE_DOCS.filter(d => d.status !== 'done').map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
              {/* Pipeline progress */}
              <div className="flex items-center gap-1 mb-4 overflow-x-auto">
                {PIPELINE.map(({ key, label }, i) => {
                  const currentIdx = PIPELINE.findIndex(p => p.key === doc.status);
                  const thisIdx    = i;
                  const done       = thisIdx < currentIdx;
                  const active     = thisIdx === currentIdx;
                  return (
                    <div key={key} className="flex items-center flex-shrink-0">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold transition-all ${
                        active ? 'bg-[#1E3A8A] text-[#BAE6FD]' :
                        done   ? 'bg-[#1D4ED8] text-white' :
                        'bg-[#F1F5F9] text-slate-400'
                      }`}>
                        {done && <CheckCircle2 size={9} />}
                        {label}
                      </div>
                      {i < PIPELINE.length - 1 && (
                        <div className={`w-4 h-0.5 mx-0.5 ${done ? 'bg-[#1D4ED8]' : 'bg-[#BFDBFE]'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className="text-[#1D4ED8]" />
                    <span className="text-sm font-bold text-[#1E3A8A] font-heading">{doc.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-sans">
                    <span>Client: <strong className="text-[#1E3A8A]">{doc.client}</strong></span>
                    <span>{doc.phone}</span>
                    <span className="flex items-center gap-1"><Clock size={9} /> {doc.created}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${statusColor[doc.status]}`}>
                    {PIPELINE.find(p => p.key === doc.status)?.label}
                  </span>
                  <button
                    onClick={() => window.open(`/property/${doc.id}`, '_blank')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                    title="Preview dokumen"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const content = `Dokumen: ${doc.title}\nClient: ${doc.client ?? ''}\nStatus: ${doc.status}\nDibuat: ${doc.created}`;
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url  = URL.createObjectURL(blob);
                      const a    = document.createElement('a');
                      a.href     = url; a.download = `${doc.title.replace(/\s+/g,'-')}.txt`; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                    title="Download dokumen"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Action buttons based on status */}
              <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex gap-2">
                {doc.status === 'draft' && (
                  <button
                    onClick={() => alert(`📧 Dokumen "${doc.title}" dikirim ke client via WhatsApp/Email.`)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-[#1D4ED8] text-white px-4 py-2 rounded-xl hover:bg-[#1E40AF] transition-colors font-sans"
                  >
                    <Send size={12} /> Kirim ke Client
                  </button>
                )}
                {doc.status === 'signed_client' && (
                  <button
                    onClick={() => alert(`✍️ Tanda tangan digital akan diproses. Dokumen akan disimpan sebagai fully_signed.`)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-[#1E3A8A] text-[#BAE6FD] px-4 py-2 rounded-xl hover:bg-[#1E3A8A] transition-colors font-sans"
                  >
                    ✍️ Tanda Tangan Saya
                  </button>
                )}
                {doc.status !== 'draft' && (
                  <a
                    href={`https://wa.me/62${doc.phone.replace(/\D/g,'').slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold bg-[#25D366] text-white px-4 py-2 rounded-xl hover:bg-[#1DB954] transition-colors font-sans"
                  >
                    💬 Chat Client
                  </a>
                )}
              </div>
            </div>
          ))}
          {ACTIVE_DOCS.filter(d => d.status !== 'done').length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-[#BFDBFE]">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-[#1E3A8A]">Belum ada kontrak aktif</p>
            </div>
          )}
        </div>
      )}

      {/* SELESAI TAB */}
      {tab === 'selesai' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Dokumen Selesai</h2>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {[
              { id: 'DOC-098', title: 'SPA — Ruko Mlati 3 Lantai',       client: 'Eko Prasetyo',  date: '15 Jan 2025' },
              { id: 'DOC-072', title: 'Sewa — Kost Putri Sebelumnya',     client: 'Farida Hanum',  date: '02 Des 2024' },
              { id: 'DOC-055', title: 'MoU Kerjasama Developer Sleman',   client: 'PT Griya Maju', date: '20 Nov 2024' },
            ].map(doc => (
              <div key={doc.id} className="flex items-center justify-between px-5 py-4 hover:bg-[#F8FAFF]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#1E3A8A] font-heading">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Client: {doc.client} · {doc.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const content = `Dokumen: ${doc.title}\nClient: ${doc.client}\nTanggal: ${doc.date}\nStatus: Selesai & Ditandatangani`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url  = URL.createObjectURL(blob);
                    const a    = document.createElement('a');
                    a.href = url; a.download = `${doc.title.replace(/\s+/g,'-')}.txt`; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-[#1D4ED8] transition-colors font-sans"
                >
                  <Download size={12} /> PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDITOR MODAL */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#BFDBFE]">
              <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">
                {selectedTpl ? TEMPLATES.find(t => t.id === selectedTpl)?.name : 'Buat Kontrak Baru'}
              </h2>
              <button onClick={() => setEditor(false)} className="p-2 rounded-lg text-slate-400 hover:bg-[#EFF6FF] transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Template selector */}
              {!selectedTpl && (
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Pilih Template</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTpl(t.id)}
                        className="text-left px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-xs font-semibold text-slate-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-all font-sans"
                      >
                        {t.icon} {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Client info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Nama Client *</label>
                  <input type="text" placeholder="Ahmad Fajar" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">WhatsApp Client *</label>
                  <input type="text" placeholder="0812-3456-7890" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                </div>
              </div>

              {/* Signature area preview */}
              <div className="border border-[#BFDBFE] rounded-xl p-4 bg-[#F8FAFF]">
                <p className="text-xs font-semibold text-[#1E3A8A] mb-3 font-sans">Preview Area Tanda Tangan</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Pihak Pertama (Agen)', 'Pihak Kedua (Client)'].map((label, i) => (
                    <div key={label} className="text-center">
                      <p className="text-[10px] text-slate-500 font-sans mb-2">{label}</p>
                      <div className="relative h-20 border-2 border-dashed border-[#BFDBFE] rounded-xl bg-white flex items-center justify-center overflow-hidden">
                        {/* Materai tempel placeholder (hanya untuk pihak pertama) */}
                        {i === 0 && (
                          <div className="absolute bottom-1 left-1 w-10 h-10 rounded-full bg-[#1E40AF] flex items-center justify-center opacity-80">
                            <span className="text-[7px] text-[#1D4ED8] font-bold text-center leading-tight">MATERAI<br/>TEMPEL</span>
                          </div>
                        )}
                        <p className="text-[9px] text-slate-300 font-sans">Gambar tanda tangan</p>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 font-sans">Tanda tangan menimpa materai</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { alert('Draft tersimpan.'); setEditor(false); }}
                  className="flex-1 border border-[#BFDBFE] text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-[#EFF6FF] transition-colors font-sans"
                >
                  Simpan Draft
                </button>
                <button
                  onClick={() => { alert('📧 Dokumen dikirim ke client via WhatsApp/Email.'); setEditor(false); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold py-2.5 rounded-xl transition-colors font-sans"
                >
                  <Send size={14} /> Kirim ke Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
