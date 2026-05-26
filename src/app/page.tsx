'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  CalendarCheck, 
  Settings, 
  User, 
  Mail, 
  Moon, 
  Sun,
  ShieldAlert
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import BookingForm from '../components/BookingForm';
import AdminPanel from '../components/AdminPanel';
import { 
  WeeklyAvailability, 
  Appointment, 
  getAvailability, 
  getAppointments,
  addAppointment,
  defaultAvailability
} from '../utils/storage';

export default function Home() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Data State
  const [availability, setAvailability] = useState<WeeklyAvailability>(defaultAvailability);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Selection State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load initial data
  useEffect(() => {
    setAvailability(getAvailability());
    setAppointments(getAppointments());

    // Dark mode check
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  const handleBook = (name: string, reason: string, notes: string) => {
    if (!selectedDate || !selectedSlot) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    
    // Add to storage
    const newApp = addAppointment({
      date: dateStr,
      time: selectedSlot,
      name,
      reason,
      notes,
    });

    // Update state
    setAppointments([...appointments, newApp]);
    setSelectedSlot(null);
  };

  // Get booked slots for selected date
  const getBookedSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointments
      .filter((app) => app.date === dateStr)
      .map((app) => app.time);
  };

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const bookedSlots = getBookedSlotsForSelectedDate();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-zinc-50 flex flex-col">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-150 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black shadow-sm">
            <CalendarCheck className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-sm tracking-tight">BulutTakvim</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-200"
            title={isDarkMode ? 'Açık Mod' : 'Koyu Mod'}
            type="button"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Admin Switch */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
              isAdminMode
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-zinc-100 hover:bg-zinc-200/80 border-transparent text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
            type="button"
          >
            {isAdminMode ? (
              <>
                <User className="h-3.5 w-3.5" />
                <span>Müşteri Görünümü</span>
              </>
            ) : (
              <>
                <Settings className="h-3.5 w-3.5" />
                <span>Yönetici Paneli</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
        {isAdminMode ? (
          // YÖNETİCİ GÖRÜNÜMÜ
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-3 mb-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Yönetici Paneli</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Uygunluk saatlerinizi güncelleyin ve randevuları yönetin.
                </p>
              </div>
            </div>
            
            <AdminPanel
              availability={availability}
              appointments={appointments}
              onUpdateAvailability={(newAvail) => setAvailability(newAvail)}
              onUpdateAppointments={(newApps) => setAppointments(newApps)}
            />
          </div>
        ) : (
          // MÜŞTERİ / ARKADAŞ GÖRÜNÜMÜ
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Sol Sütun: Profil Bilgisi */}
            <div className="md:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6 md:sticky md:top-24">
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shadow-inner bg-zinc-50">
                  <Image
                    src="/profile.png"
                    alt="Semih Şener"
                    fill
                    sizes="(max-width: 112px) 100vw, 112px"
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Semih Şener
                  </h1>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Kişisel Randevu & Takvim
                  </p>
                </div>
                <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed max-w-sm md:max-w-none">
                  Merhaba! Benimle görüşmek, kahve içmek veya herhangi bir konuyu konuşmak için aşağıdaki takvim üzerinden uygun bir gün ve saat seçerek randevu oluşturabilirsiniz.
                </p>
              </div>

              {/* Sosyal Medya & İletişim */}
              <div className="flex items-center justify-center md:justify-start gap-3 border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800/60 rounded-xl hover:scale-105 transition-all text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800/60 rounded-xl hover:scale-105 transition-all text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <a
                  href="mailto:derin@example.com"
                  className="p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800/60 rounded-xl hover:scale-105 transition-all text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Sağ Sütun: Takvim & Randevu Akışı */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Takvim Bileşeni */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  1. Görüşme Tarihi Seçin
                </h3>
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  availability={availability}
                />
              </div>

              {/* Saat Slotları */}
              {selectedDate && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4 animate-in slide-in-from-bottom duration-350">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-850 pb-2">
                    2. Saat Dilimi Seçin
                  </h3>
                  <TimeSlots
                    selectedDateStr={selectedDateStr}
                    availability={availability}
                    bookedSlots={bookedSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={(slot) => setSelectedSlot(slot)}
                  />
                </div>
              )}

              {/* Randevu Formu */}
              {selectedDate && selectedSlot && (
                <div className="animate-in slide-in-from-bottom duration-350">
                  <BookingForm
                    dateStr={selectedDateStr}
                    timeStr={selectedSlot}
                    onBook={handleBook}
                  />
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-[10px] text-zinc-400 dark:text-zinc-600 border-t border-zinc-150 dark:border-zinc-900 mt-auto">
        <p>© 2026 BulutTakvim. Tüm hakları saklıdır. Proje yerel localStorage kullanmaktadır.</p>
      </footer>
    </div>
  );
}
