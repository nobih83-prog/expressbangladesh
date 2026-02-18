
import React from 'react';
import { translations } from '../translations';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, Bell } from 'lucide-react';
import { HOLIDAYS_EVENTS } from '../constants/holidays';

interface Calendar2026Props {
  language: 'bn' | 'en';
}

const Calendar2026: React.FC<Calendar2026Props> = ({ language }) => {
  const t = translations[language];
  const year = 2026;

  const formatDigits = (num: number) => {
    const str = num.toString();
    if (language === 'bn') {
      const bnDigits: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      return str.replace(/[0-9]/g, w => bnDigits[w]);
    }
    return str;
  };

  const getMonthData = (month: number) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getHolidayForDate = (day: number | null, month: number) => {
    if (!day) return null;
    return HOLIDAYS_EVENTS.find(h => 
      h.day === day && 
      h.month === month && 
      (!h.year || h.year === year)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <nav className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-red-600 transition-colors flex items-center">
           <ChevronLeft className="w-4 h-4 mr-1" />
           {t.home}
        </Link>
        <span>/</span>
        <span className="text-red-600 font-bold">{t.calendar2026}</span>
      </nav>

      <div className="flex items-center justify-center mb-12 space-x-4">
        <div className="bg-red-600 p-3 rounded-2xl shadow-lg">
          <CalendarIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
          {t.calendar2026}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {t.months.map((monthName, monthIdx) => {
          const monthDays = getMonthData(monthIdx);
          return (
            <div key={monthIdx} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-black text-center mb-6 text-red-600 dark:text-red-500 border-b pb-3 border-gray-100 dark:border-gray-700">
                {monthName}
              </h3>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {t.weekdays.map((day, idx) => (
                  <div key={idx} className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                    {day}
                  </div>
                ))}
                
                {monthDays.map((day, idx) => {
                  const holiday = getHolidayForDate(day, monthIdx);
                  const isHoliday = holiday?.isHoliday;

                  return (
                    <div 
                      key={idx} 
                      title={holiday ? (language === 'bn' ? holiday.bn : holiday.en) : undefined}
                      className={`aspect-square flex items-center justify-center text-sm font-bold rounded-full transition-all relative group
                        ${day === null ? '' : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 cursor-default'}
                        ${isHoliday ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm' : ''}
                      `}
                    >
                      {day ? formatDigits(day) : ''}
                      {holiday && (
                        <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${isHoliday ? 'bg-red-600' : 'bg-blue-500'} scale-0 group-hover:scale-100 transition-transform`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-gray-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-black mb-4 flex items-center space-x-3">
              <Bell className="w-8 h-8 text-red-600" />
              <span>{language === 'bn' ? '২০২৬ সালের সরকারি ছুটির তালিকা' : '2026 Public Holidays List'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {HOLIDAYS_EVENTS.map((h, i) => (
                <div key={i} className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                    {formatDigits(h.day)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-300">{language === 'bn' ? h.bn : h.en}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">{formatDigits(h.day)} {t.months[h.month]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="shrink-0">
             <Link to="/" className="inline-block bg-red-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-red-700 transition shadow-xl active:scale-95">
              {language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar2026;
