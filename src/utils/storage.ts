export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface WeeklyAvailability {
  workingDays: number[]; // 0 = Pazar, 1 = Pazartesi, ...
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  slotDuration: number; // Dakika cinsinden (örn: 30, 60)
}

const APPOINTMENTS_KEY = 'scheduling_app_appointments';
const AVAILABILITY_KEY = 'scheduling_app_availability';

export const defaultAvailability: WeeklyAvailability = {
  workingDays: [1, 2, 3, 4, 5], // Hafta içi (Pazartesi - Cuma)
  startTime: '09:00',
  endTime: '17:00',
  slotDuration: 60, // 60 dakika
};

export const getAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing appointments', e);
    return [];
  }
};

export const saveAppointments = (appointments: Appointment[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

export const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  saveAppointments(appointments);
  return newAppointment;
};

export const cancelAppointment = (id: string): Appointment[] => {
  const appointments = getAppointments();
  const filtered = appointments.filter(app => app.id !== id);
  saveAppointments(filtered);
  return filtered;
};

export const getAvailability = (): WeeklyAvailability => {
  if (typeof window === 'undefined') return defaultAvailability;
  const stored = localStorage.getItem(AVAILABILITY_KEY);
  if (!stored) return defaultAvailability;
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing availability', e);
    return defaultAvailability;
  }
};

export const saveAvailability = (availability: WeeklyAvailability) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(availability));
};

// Belirli bir gün için slotları üretir (Örn: "09:00", "10:00", vb.)
export const generateSlotsForDate = (dateStr: string, availability: WeeklyAvailability): string[] => {
  const slots: string[] = [];
  const [startHour, startMin] = availability.startTime.split(':').map(Number);
  const [endHour, endMin] = availability.endTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes + availability.slotDuration <= endMinutes) {
    const hh = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const mm = (currentMinutes % 60).toString().padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    currentMinutes += availability.slotDuration;
  }

  return slots;
};

// Belirli bir tarihin ve saatin geçmişte olup olmadığını denetler
export const isSlotInPast = (dateStr: string, timeStr: string): boolean => {
  const now = new Date();
  const slotDate = new Date(`${dateStr}T${timeStr}`);
  return slotDate.getTime() < now.getTime();
};
