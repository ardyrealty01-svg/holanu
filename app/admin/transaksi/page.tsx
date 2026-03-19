'use client';

import { useState } from 'react';
import { Download, RefreshCw, TrendingUp, DollarSign, AlertCircle, Check, X } from 'lucide-react';

const INIT_TRANSACTIONS = [
  { id: 'TRX-2892', user: 'Andi Wijaya',   product: 'Paket Gold — 1 bulan',   amount: 399000,  status: 'paid',    method: 'QRIS',         date: '17/03/25 09:15' },
  { id: 'TRX-2891', user: 'Budi Santoso',  product: 'Boost Listing 7 hari',   amount: 25000,   status: 'pending', method: 'BCA VA',        date: '17/03/25 08:55' },
  { id: 'TRX-2890', user: 'Citra Kusuma',  product: 'Paket Pro — 1 bulan',    amount: 149000,  status: 'paid',    method: 'GoPay',         date: '16/03/25 22:30' },
  { id: 'TRX-2889', user: 'Dian Pratiwi',  product: 'Paket Platinum Custom',  amount: 1500000, status: 'paid',    method: 'Transfer Bank', date: '16/03/25 18:00' },
  { id: 'TRX-2888', user: 'Eka Rahayu',    product: 'Paket Pro — 1 bulan',    amount: 149000,  status: 'failed',  method: 'OVO',           date: '16/03/25 14:22' },
  { id: 'TRX-2887', user: 'Fahmi Nugroho', product: 'Featured Homepage 3hr',  amount: 50000,   status: 'refund',  method: 'QRIS',          date: '15/03/25 11:10' },
];

const INIT_REFUNDS = [
  { id: 'REF-023', user: 'Fahmi Nugroho', product: 'Featured Homepage 3hr',  amount: 50000,  reason: 'Salah klik, tidak jadi',    time: '2 jam lalu',  eligible: true  },
  { id: 'REF-022', user: 'Gita Sari',     product: 'Paket Pro — 1 bulan',    amount: 149000, reason: 'Tidak sesuai ekspektasi',   time: '1 hari lalu', eligible: false },
];

const statusBadge: Record<string, string> = {
  paid:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50   text-amber-700   border border-amber-200',
  failed:  'bg-red-50     text-red-700     border border-red-200',
  refund:  'bg-blue-50    text-blue-700    border border-blue-200',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const FILTERS = ['Semua', 'Paid', 'Pending', 'Failed', 'Refund'];

export default function AdminTransaksiPage() {
  const [filter,       setFilter]       = useState('Semua');
  const [transactions, setTransactions] = useState(INIT_TRANSACTIONS);
  const [refunds,      setRefunds]      = useState(INIT_REFUNDS);
  const [selectedTx,   setSelectedTx]  = useState<typeof INIT_TRANSACTIONS[0] | null>(null);

  const filtered = transactions.filter(tx =>
    filter === 'Semua' || tx.status === filter.toLowerCase()
  );

  const handleExportCSV = () => {
    const headers = 'ID,User,Produk,Jumlah,Metode,Status,Tanggal';
    const rows = transactions.map(tx =>
      `${tx.id},"${tx.user}","${tx.product}",${tx.amount},${tx.method},${tx.status},${tx.date}`
    );
    const csv  = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `holanu-transaksi-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApproveRefund = (refundId: string) => {
    if (!confirm('Setujui refund ini? Dana akan dikembalikan ke user.')) return;
    setRefunds(prev => prev.filter(r => r.id !== refundId));
    alert(`✅ Refund ${refundId} disetujui. Dana akan dikembalikan dalam 1-3 hari kerja.`);
  };

  const handleRejectRefund = (refundId: string) => {
    if (!confirm('Tolak permintaan refund ini?')) return;
    setRefunds(prev => prev.filter(r => r.id !== refundId));
    alert(`Refund ${refundId} ditolak.`);
  };

  const totalRevenue   = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0);
  const totalPending   = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const totalRefund    = transactions.filter(t => t.status === 'refund').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Transaksi & Keuangan</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">Revenue real-time dari semua sumber</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 border border-[#BFDBFE] bg-white text-sm text-slate-600 px-4 py-2 rounded-xl font-sans hover:border-[#1D4ED8] transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), icon: DollarSign,  color: 'text-emerald-600' },
          { label: 'Pending',       value: fmt(totalPending), icon: RefreshCw,   color: 'text-amber-600' },
          { label: 'Total Refund',  value: fmt(totalRefund),  icon: AlertCircle, color: 'text-blue-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#BFDBFE] p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon size={14} className={color} />
              <span className="text-[11px] text-slate-500 font-sans">{label}</span>
            </div>
            <p className="font-heading font-bold text-lg text-[#1E3A8A]">{value}</p>
          </div>
        ))}
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-heading font-semibold text-[#1E3A8A]">Riwayat Transaksi</h2>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border font-sans transition-all ${
                  filter === f
                    ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
                    : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EFF6FF]">
              <tr>
                {['ID Transaksi', 'User', 'Produk', 'Jumlah', 'Metode', 'Status', 'Tanggal', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-[#F8FAFF] transition-colors">
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{tx.id}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#1E3A8A] font-heading">{tx.user}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 font-sans">{tx.product}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#1D4ED8]">{fmt(tx.amount)}</td>
                  <td className="px-4 py-3 text-[10px] text-slate-500 font-sans">{tx.method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded capitalize ${statusBadge[tx.status]}`}>{tx.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-400 font-sans">{tx.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="text-[10px] text-[#1D4ED8] hover:underline font-sans"
                      >
                        Detail
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        onClick={() => {
                          const rows = [
                            `Invoice HOLANU`,
                            `ID: ${tx.id}`,
                            `User: ${tx.user}`,
                            `Produk: ${tx.product}`,
                            `Jumlah: ${fmt(tx.amount)}`,
                            `Metode: ${tx.method}`,
                            `Status: ${tx.status}`,
                            `Tanggal: ${tx.date}`,
                          ].join('\n');
                          const blob = new Blob([rows], { type: 'text/plain' });
                          const url  = URL.createObjectURL(blob);
                          const a    = document.createElement('a');
                          a.href     = url;
                          a.download = `invoice-${tx.id}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="text-[10px] text-slate-400 hover:underline font-sans"
                      >
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund queue */}
      {refunds.length > 0 && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Antrian Refund ({refunds.length})</h2>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {refunds.map(ref => (
              <div key={ref.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-slate-400">{ref.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${ref.eligible ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {ref.eligible ? 'Eligible' : 'Non-eligible'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1E3A8A] font-heading">{ref.user}</p>
                  <p className="text-[11px] text-slate-500 font-sans">{ref.product} · {fmt(ref.amount)} · {ref.time}</p>
                  <p className="text-[10px] text-slate-400 font-sans italic">"{ref.reason}"</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApproveRefund(ref.id)}
                    className="flex items-center gap-1.5 text-[10px] font-bold bg-[#1D4ED8] text-white px-3 py-1.5 rounded-lg hover:bg-[#1E40AF] transition-colors font-sans"
                  >
                    <Check size={11} /> Setujui
                  </button>
                  <button
                    onClick={() => handleRejectRefund(ref.id)}
                    className="flex items-center gap-1.5 text-[10px] font-bold border border-[#BFDBFE] text-slate-500 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors font-sans"
                  >
                    <X size={11} /> Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedTx(null)}>
          <div className="bg-white rounded-2xl border border-[#BFDBFE] p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-[#1E3A8A]">Detail Transaksi</h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-2 text-sm font-sans">
              {[
                ['ID', selectedTx.id],
                ['User', selectedTx.user],
                ['Produk', selectedTx.product],
                ['Jumlah', fmt(selectedTx.amount)],
                ['Metode', selectedTx.method],
                ['Status', selectedTx.status],
                ['Tanggal', selectedTx.date],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-[#F8FAFC] last:border-0">
                  <span className="text-slate-400">{k}</span>
                  <span className="font-semibold text-[#1E3A8A] text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
