
export interface HolidayEvent {
  day: number;
  month: number; // 0-indexed
  year?: number; // optional if it's every year
  bn: string;
  en: string;
  isHoliday: boolean;
}

export const HOLIDAYS_EVENTS: HolidayEvent[] = [
  { day: 21, month: 1, bn: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস", en: "Shaheed Day & International Mother Language Day", isHoliday: true },
  { day: 17, month: 2, bn: "বঙ্গবন্ধু শেখ মুজিবুর রহমানের জন্মবার্ষিকী", en: "Birthday of Bangabandhu Sheikh Mujibur Rahman", isHoliday: true },
  { day: 26, month: 2, bn: "স্বাধীনতা ও জাতীয় দিবস", en: "Independence and National Day", isHoliday: true },
  { day: 14, month: 3, bn: "পহেলা বৈশাখ (বাংলা নববর্ষ)", en: "Pohela Boishakh (Bengali New Year)", isHoliday: true },
  { day: 1, month: 4, bn: "মে দিবস", en: "May Day", isHoliday: true },
  { day: 16, month: 11, bn: "বিজয় দিবস", en: "Victory Day", isHoliday: true },
  { day: 25, month: 11, bn: "বড়দিন", en: "Christmas Day", isHoliday: true },
  // 2025 Specific (Approximated religious dates)
  { day: 31, month: 2, year: 2025, bn: "ঈদুল ফিতর", en: "Eid-ul-Fitr", isHoliday: true },
  { day: 1, month: 3, year: 2025, bn: "ঈদুল ফিতর (২য় দিন)", en: "Eid-ul-Fitr (Day 2)", isHoliday: true },
  { day: 7, month: 5, year: 2025, bn: "ঈদুল আযহা", en: "Eid-ul-Adha", isHoliday: true },
  { day: 8, month: 5, year: 2025, bn: "ঈদুল আযহা (২য় দিন)", en: "Eid-ul-Adha (Day 2)", isHoliday: true },
  // Add more as needed...
];
