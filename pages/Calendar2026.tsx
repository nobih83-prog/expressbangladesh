
import React from 'react';
import { translations } from '../translations';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <nav className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-yellow-600 transition-colors flex items-center">
           <ChevronLeft className="w-4 h-4 mr-1" />
           {t.home}
        </Link>
        <span>/</span>
        <span className="text-yellow-600 font-bold">{t.calendar2026}</span>
      </nav>

      <div className="flex items-center justify-center mb-12 space-x-4">
        <div className="bg-yellow-500 p-3 rounded-2xl shadow-lg">
          <CalendarIcon className="w-8 h-8 text-black" />
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
              <h3 className="text-xl font-black text-center mb-6 text-yellow-600 dark:text-yellow-500 border-b pb-3 border-gray-100 dark:border-gray-700">
                {monthName}
              </h3>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {t.weekdays.map((day, idx) => (
                  <div key={idx} className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                    {day}
                  </div>
                ))}
                
                {monthDays.map((day, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square flex items-center justify-center text-sm font-bold rounded-full transition-all
                      ${day === null ? '' : 'text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700'}
                    `}
                  >
                    {day ? formatDigits(day) : ''}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-gray-900 text-white rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <h2 className="text-2xl font-black mb-4">{language === 'bn' ? '২০২৬ সালের সরকারি ছুটির তালিকা দেখতে চান?' : 'Want to see 2026 public holidays?'}</h2>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          {language === 'bn' 
            ? 'সরকারি ক্যালেন্ডার অনুযায়ী গুরুত্বপূর্ণ দিবস এবং সরকারি ছুটির দিনগুলো নিয়মিত আপডেট করা হয়।' 
            : 'Important days and public holidays are updated regularly according to the official calendar.'}
        </p>
        <Link to="/" className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full font-black hover:bg-yellow-600 transition shadow-lg active:scale-95">
          {language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
};

export default Calendar2026;
