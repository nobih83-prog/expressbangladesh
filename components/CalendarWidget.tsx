
import React, { useMemo, useState } from 'react';
import { translations } from '../translations';
import { ChevronLeft, ChevronRight, Bell, Calendar as CalendarIcon, Info } from 'lucide-react';
import { HOLIDAYS_EVENTS, HolidayEvent } from '../constants/holidays';

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
    for (let i = 1920; i <= 2050; i++) arr.push(i);
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-xl font-black mb-6 border-b-2 border-yellow-500 pb-2 dark:text-white flex items-center">
         <span className="w-2 h-6 bg-yellow-500 mr-3 rounded-full"></span>
         {t.calendar}
      </h3>
      
      {/* Selectors */}
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-2">
            <select 
              value={viewMonth}
              onChange={(e) => {
                setViewMonth(parseInt(e.target.value));
                setSelectedDay(null);
              }}
              className="bg-gray-50 dark:bg-gray-700 dark:text-white border-none text-sm font-bold rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-yellow-500"
            >
              {t.months.map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>

            <select 
              value={viewYear}
              onChange={(e) => {
                setViewYear(parseInt(e.target.value));
                setSelectedDay(null);
              }}
              className="bg-gray-50 dark:bg-gray-700 dark:text-white border-none text-sm font-bold rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-yellow-500"
            >
              {years.map(y => (
                <option key={y} value={y}>{formatDigits(y.toString())}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {t.weekdays.map((day, idx) => (
          <div key={idx} className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            {day}
          </div>
        ))}
        {calendarData.map((day, idx) => {
          const events = getEventsForDay(day);
          const hasEvent = events.length > 0;
          const isSelected = selectedDay === day;

          return (
            <div 
              key={idx} 
              onClick={() => day && setSelectedDay(day)}
              className={`relative aspect-square flex flex-col items-center justify-center text-sm font-bold rounded-xl transition-all
                ${day === null ? '' : 'cursor-pointer'}
                ${isSelected 
                  ? 'bg-black text-white dark:bg-yellow-500 dark:text-black shadow-lg scale-110 z-10' 
                  : isToday(day) 
                    ? 'bg-yellow-500 text-black shadow-md' 
                    : day !== null ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : ''
                }
              `}
            >
              {day ? formatDigits(day.toString()) : ''}
              {hasEvent && !isSelected && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Selected Day Events Info */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
          <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {selectedDay ? `${formatDigits(selectedDay.toString())} ${t.months[viewMonth]}, ${t.eventsForDay}` : t.eventsForDay}
          </h4>
        </div>
        
        <div className="space-y-3">
          {selectedDay && currentDayEvents.length > 0 ? (
            currentDayEvents.map((event, idx) => (
              <div key={idx} className="bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-900/20 flex items-start space-x-3">
                <Bell className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-700 dark:text-red-400 leading-tight">
                    {language === 'bn' ? event.bn : event.en}
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 dark:text-red-600">
                    {event.isHoliday ? t.holiday : t.event}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic py-2">
              {t.noEvents}
            </p>
          )}
        </div>

        <button 
          onClick={() => {
            setViewMonth(today.getMonth());
            setViewYear(today.getFullYear());
            setSelectedDay(today.getDate());
          }}
          className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-500 hover:underline flex items-center justify-center space-x-1"
        >
          <CalendarIcon className="w-3 h-3" />
          <span>{language === 'bn' ? 'আজকের তারিখে ফিরে যান' : 'Back to Today'}</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;
