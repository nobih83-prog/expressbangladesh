
import React, { useMemo, useState } from 'react';
import { translations } from '../translations';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, Info, Bell } from 'lucide-react';
import { HOLIDAYS_EVENTS } from '../constants/holidays';

interface CalendarWidgetProps {
  language: 'bn' | 'en';
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ language }) => {
  const t = translations[language];
  const today = new Date();
  
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const formatDigits = (str: string) => {
    if (language === 'bn') {
      const bnDigits: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      return str.replace(/[0-9]/g, w => bnDigits[w]);
    }
    return str;
  };

  const years = useMemo(() => {
    const arr = [];
    for (let i = 1971; i <= 2030; i++) arr.push(i);
    return arr;
  }, []);

  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [viewMonth, viewYear]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  const isToday = (day: number | null) => {
    return day === today.getDate() && 
           viewMonth === today.getMonth() && 
           viewYear === today.getFullYear();
  };

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    return HOLIDAYS_EVENTS.filter(e => 
      e.day === day && 
      e.month === viewMonth && 
      (!e.year || e.year === viewYear)
    );
  };

  const currentDayEvents = useMemo(() => getEventsForDay(selectedDay), [selectedDay, viewMonth, viewYear]);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-5 border-b-2 border-red-600 pb-2">
        <h3 className="text-lg font-black dark:text-white flex items-center">
           <span className="w-1.5 h-5 bg-red-600 mr-2 rounded-full"></span>
           {t.calendar}
        </h3>
        <button 
          onClick={() => {
            setViewMonth(today.getMonth());
            setViewYear(today.getFullYear());
            setSelectedDay(today.getDate());
          }}
          className="text-gray-400 hover:text-red-600 transition-colors"
          title={language === 'bn' ? 'আজকের তারিখ' : 'Today'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-5 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-2xl">
        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition shadow-sm">
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="flex space-x-1">
          <select 
            value={viewMonth}
            onChange={(e) => setViewMonth(parseInt(e.target.value))}
            className="bg-transparent border-none text-[13px] font-bold dark:text-gray-200 outline-none cursor-pointer focus:ring-0"
          >
            {t.months.map((m, idx) => (
              <option key={idx} value={idx} className="dark:text-black">{m}</option>
            ))}
          </select>
          <select 
            value={viewYear}
            onChange={(e) => setViewYear(parseInt(e.target.value))}
            className="bg-transparent border-none text-[13px] font-bold dark:text-gray-200 outline-none cursor-pointer focus:ring-0"
          >
            {years.map(y => (
              <option key={y} value={y} className="dark:text-black">{formatDigits(y.toString())}</option>
            ))}
          </select>
        </div>

        <button onClick={handleNextMonth} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition shadow-sm">
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {t.weekdays.map((day, idx) => (
          <div key={idx} className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-2">
            {day}
          </div>
        ))}
        {calendarData.map((day, idx) => {
          const isCurrentToday = isToday(day);
          const isSelected = selectedDay === day;
          const events = getEventsForDay(day);
          const hasEvent = events.length > 0;
          const isHoliday = events.some(e => e.isHoliday);
          
          const eventTitles = events.map(e => language === 'bn' ? e.bn : e.en).join(', ');

          return (
            <div 
              key={idx} 
              onClick={() => day && setSelectedDay(day)}
              title={eventTitles}
              className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all relative group
                ${day === null ? '' : 'cursor-pointer'}
                ${isSelected 
                  ? 'bg-gray-900 text-white dark:bg-red-600 dark:text-white scale-105 z-10 shadow-md' 
                  : isCurrentToday 
                    ? 'text-red-600 dark:text-red-500 border border-red-500/30' 
                    : isHoliday
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                      : day !== null ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : ''
                }
              `}
            >
              {day ? formatDigits(day.toString()) : ''}
              {hasEvent && !isSelected && (
                <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isHoliday ? 'bg-red-600' : 'bg-blue-500'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Info */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {selectedDay ? `${formatDigits(selectedDay.toString())} ${t.months[viewMonth]}` : 'দিনের ইভেন্ট'}
          </span>
        </div>
        
        <div className="space-y-2">
          {selectedDay && currentDayEvents.length > 0 ? (
            currentDayEvents.map((event, idx) => (
              <div key={idx} className={`${event.isHoliday ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20'} p-2.5 rounded-xl border`}>
                <div className="flex items-start space-x-2">
                  <Bell className={`w-3.5 h-3.5 mt-0.5 ${event.isHoliday ? 'text-red-600' : 'text-blue-600'}`} />
                  <p className={`text-xs font-bold ${event.isHoliday ? 'text-red-800 dark:text-red-400' : 'text-blue-800 dark:text-blue-400'}`}>
                    {language === 'bn' ? event.bn : event.en}
                    {event.isHoliday && <span className="ml-2 text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded-full uppercase">{language === 'bn' ? 'ছুটি' : 'Holiday'}</span>}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-gray-400 italic py-1">
              {language === 'bn' ? 'এই দিনে কোনো সরকারি ছুটি বা ইভেন্ট নেই।' : 'No holidays or events on this day.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
