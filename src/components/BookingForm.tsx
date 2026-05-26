'use client';

import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2, User, HelpCircle, MessageSquare } from 'lucide-react';

interface BookingFormProps {
  dateStr: string;
  timeStr: string;
  onBook: (name: string, reason: string, notes: string) => void;
}

export default function BookingForm({ dateStr, timeStr, onBook }: BookingFormProps) {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !reason) return;

    setIsSubmitting(true);
    // Simüle edilmiş kısa gecikme (animasyon hissi için)
    setTimeout(() => {
      onBook(name, reason, notes);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const formattedDate = new Date(dateStr).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isSuccess) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm text-center space-y-5 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Randevunuz Onaylandı!
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Randevu detayları başarıyla kaydedildi.
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 text-left border border-zinc-100 dark:border-zinc-900 space-y-2.5">
          <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
            <span className="text-zinc-400 dark:text-zinc-500">Tarih</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formattedDate}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
            <span className="text-zinc-400 dark:text-zinc-500">Saat</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{timeStr}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
            <span className="text-zinc-400 dark:text-zinc-500">Kişi</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{name}</span>
          </div>
          <div className="flex justify-between text-xs pb-1">
            <span className="text-zinc-400 dark:text-zinc-500">Konu</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">{reason}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setName('');
            setReason('');
            setNotes('');
            setIsSuccess(false);
          }}
          className="w-full py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-xl transition-all duration-200"
          type="button"
        >
          Yeni Randevu Al
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
        <CalendarCheck className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Randevu Formu
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formattedDate} saat {timeStr}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* İsim */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-zinc-400" />
            Adınız Soyadınız *
          </label>
          <input
            type="text"
            required
            placeholder="Örn: Ahmet Yılmaz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white"
          />
        </div>

        {/* Buluşma Nedeni */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
            Buluşma Nedeni / Konu *
          </label>
          <input
            type="text"
            required
            placeholder="Örn: Proje Detayları Görüşmesi"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white"
          />
        </div>

        {/* Notlar */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
            Varsa Ek Notlar
          </label>
          <textarea
            placeholder="İletmek istediğiniz ek bilgiler..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full py-2 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all resize-none dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 px-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-xl text-xs transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2 ${
            isSubmitting ? 'cursor-not-allowed opacity-75' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white dark:text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Onaylanıyor...</span>
            </>
          ) : (
            'Randevuyu Onayla'
          )}
        </button>
      </form>
    </div>
  );
}
