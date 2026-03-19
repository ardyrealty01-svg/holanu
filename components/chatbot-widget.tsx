'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Loader2 } from 'lucide-react';

type Message = { from: 'user' | 'bot'; text: string; time: string };

const QUICK = [
  'Cari rumah di Yogyakarta',
  'Cara simulasi KPR',
  'Apa bedanya SHM & HGB?',
  'Cara jual properti di HOLANU',
];

const now = () =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

export function ChatbotWidget() {
  const [open,      setOpen]      = useState(false);
  const [minimized, setMin]       = useState(false);
  const [messages,  setMessages]  = useState<Message[]>([
    {
      from: 'bot',
      text: 'Halo! 👋 Saya asisten properti HOLANU yang didukung AI. Mau tanya apa tentang properti hari ini?',
      time: now(),
    },
  ]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showBubble, setBubble]   = useState(true);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  // Keep conversation history for context
  const historyRef                = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    const t = setTimeout(() => setBubble(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    setInput('');

    const userMsg: Message = { from: 'user', text, time: now() };
    setMessages(m => [...m, userMsg]);
    historyRef.current = [...historyRef.current, { role: 'user', content: text }];
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: historyRef.current }),
      });

      const data = await res.json() as { reply?: string; error?: string };
      const reply = data.reply ?? data.error ?? 'Maaf, terjadi kesalahan. Coba lagi ya.';

      historyRef.current = [...historyRef.current, { role: 'assistant', content: reply }];
      // Jaga history max 10 pesan agar tidak terlalu panjang
      if (historyRef.current.length > 10) {
        historyRef.current = historyRef.current.slice(-10);
      }

      setMessages(m => [...m, { from: 'bot', text: reply, time: now() }]);
    } catch {
      setMessages(m => [
        ...m,
        { from: 'bot', text: 'Koneksi bermasalah. Silakan coba lagi.', time: now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Bubble hint */}
      {showBubble && !open && (
        <div
          className="fixed bottom-[88px] right-6 z-40 bg-white dark:bg-slate-800 shadow-lg rounded-2xl px-4 py-2.5 text-sm font-sans text-slate-700 dark:text-slate-200 border border-[#BFDBFE] cursor-pointer max-w-[220px]"
          onClick={() => { setOpen(true); setBubble(false); }}
        >
          💬 Ada yang bisa saya bantu?
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => { setOpen(o => !o); setBubble(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-lg flex items-center justify-center transition-all"
        aria-label="Buka chatbot"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[520px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#BFDBFE] overflow-hidden font-sans">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1D4ED8] text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🏠</div>
              <div>
                <p className="text-sm font-bold leading-tight">HOLANU AI</p>
                <p className="text-[11px] text-blue-200">Asisten properti · Didukung Llama 3</p>
              </div>
            </div>
            <button
              onClick={() => setMin(m => !m)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.from === 'user'
                          ? 'bg-[#1D4ED8] text-white rounded-br-sm'
                          : 'bg-[#F0F4FF] dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                      <p className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#F0F4FF] dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-[#1D4ED8]" />
                      <span className="text-xs text-slate-500">Sedang mengetik...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              {messages.length <= 1 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {QUICK.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={loading}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#EFF6FF] transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex items-center gap-2 px-3 py-3 border-t border-[#BFDBFE]">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={loading}
                  placeholder="Ketik pertanyaan..."
                  className="flex-1 text-sm px-3 py-2 rounded-xl border border-[#BFDBFE] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] placeholder-slate-300 font-sans disabled:opacity-60"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center transition-colors disabled:opacity-40"
                  aria-label="Kirim"
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
