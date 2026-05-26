'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  CalendarDays, 
  Clock, 
  Trash2, 
  Save, 
  CalendarRange, 
  Info,
  ChevronDown
} from 'lucide-react';
import { 
  WeeklyAvailability, 
  Appointment, 
  saveAvailability, 
  cancelAppointment 
} from '../utils/storage';

interface AdminPanelProps {
  availability: WeeklyAvailability;
  appointments: Appointment[];
  onUpdateAvailability: (newAvail: WeeklyAvailability) => void;
  onUpdateAppointments: (newApps: Appointment[]) => void;
}

export default function AdminPanel({
  availability,
  appointments,
  onUpdateAvailability,
  onUpdateAppointments,
}: AdminPanelProps) {
  // Form State
  const [workingDays, setWorkingDays] = useState<number[]>(availability.workingDays);
  const [startTime, setStartTime] = useState(availability.startTime);
  const [endTime, setEndTime] = useState(availability.endTime);
  const [slotDuration, setSlotDuration] = useState(availability.slotDuration);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const daysOfWeek = [
    { label: 'Paz', value: 0 },
    { label: 'Pzt', value: 1 },
    { label: 'Sal', value: 2 },
    { label: 'Çar', value: 3 },
    { label: 'Per', value: 4 },
    { label: 'Cum', value: 5 },
    { label: 'Cmt', value: 6 },
  ];

  const durationOptions = [15, 30, 45, 60, 90, 120];

  const toggleDay = (dayValue: number) => {
    if (workingDays.includes(dayValue)) {
      setWorkingDays(workingDays.filter((d) => d !== dayValue));
    } else {
      setWorkingDays([...workingDays, dayValue].sort());
    }
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WeeklyAvailability = {
      workingDays,
      startTime,
      endTime,
      slotDuration,
    };
    saveAvailability(updated);
    onUpdateAvailability(updated);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCancelApp = (id: string) => {
    if (confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) {
      const updated = cancelAppointment(id);
      onUpdateAppointments(updated);
    }
  };

  // Randevuları tarihe ve saate göre sırala (Gelecek randevular en üstte olacak şekilde)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
    const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
    return dateTimeA - dateTimeB;
  });

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'long' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
      
      {/* Sol Panel: Ayarlar */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-5">
            <Settings className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Haftalık Uygunluk Ayarları
            </h2>
          </div>

          <form onSubmit={handleSaveAvailability} className="space-y-5">
            {/* Günler */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                Çalışma Günleri
              </label>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((day) => {
                  const isActive = workingDays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`h-9 w-9 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-sm'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-750'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saatler */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  Başlangıç Saati
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  Bitiş Saati
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white"
                />
              </div>
            </div>

            {/* Slot Süresi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <CalendarRange className="h-3.5 w-3.5 text-zinc-400" />
                Randevu Slot Süresi
              </label>
              <div className="relative">
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full py-2.5 pl-3 pr-10 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all appearance-none dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white"
                >
                  {durationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} Dakika
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Kaydet Butonu */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-xl text-xs transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Ayarları Kaydet</span>
            </button>

            {saveSuccess && (
              <div className="text-xs text-center font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
                Ayarlar başarıyla kaydedildi ve uygulandı!
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Sağ Panel: Gelen Randevular */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Gelen Randevular
              </h2>
            </div>
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {appointments.length} Toplam
            </span>
          </div>

          {sortedAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="h-12 w-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                <Info className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Henüz Randevu Yok
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                  Müşterileriniz randevu aldığında burada listelenecektir.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {sortedAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-xl space-y-3 relative group transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        {getDayName(app.date)}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-100 mt-0.5">
                        {formatDate(app.date)}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black dark:bg-white px-3 py-1 rounded-lg text-white dark:text-black font-mono text-xs font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>{app.time}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-900 text-xs">
                    <div>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                        Adı Soyadı
                      </p>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        {app.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                        Görüşme Konusu
                      </p>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        {app.reason}
                      </p>
                    </div>
                  </div>

                  {app.notes && (
                    <div className="bg-white dark:bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400">
                      <p className="font-bold text-[9px] uppercase tracking-wide text-zinc-400 mb-0.5">
                        Notlar
                      </p>
                      <p className="italic leading-relaxed">{app.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCancelApp(app.id)}
                      className="py-1.5 px-3 border border-red-200/50 hover:bg-red-50 text-red-600 dark:border-red-950/40 dark:hover:bg-red-950/20 dark:text-red-400 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-all duration-200"
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Randevuyu İptal Et</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
