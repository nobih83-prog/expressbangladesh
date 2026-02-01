
import React, { useState, useMemo } from 'react';
import { X, MapPin, Clock, Search } from 'lucide-react';
import { translations } from '../translations';
import { DISTRICTS, District } from '../constants/districts';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

const PrayerModal: React.FC<PrayerModalProps> = ({ isOpen, onClose, language }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState('dhaka');
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isOpen) return null;

  const t = translations[language];

  const selectedDistrict = useMemo(() => 
    DISTRICTS.find(d => d.id === selectedDistrictId) || DISTRICTS[0],
    [selectedDistrictId]
  );

  const filteredDistricts = useMemo(() => {
    if (!searchTerm) return DISTRICTS;
    return DISTRICTS.filter(d => 
      d.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.bn.includes(searchTerm)
    );
  }, [searchTerm]);

  // Helper function to add minutes to a base time string "HH:MM AM/PM"
  const addMinutes = (timeStr: string, minutes: number) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, mins] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(mins + minutes);

    let h = date.getHours();
    const m = date.getMinutes();
    const newModifier = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    
    const formattedH = h.toString().padStart(2, '0');
    const formattedM = m.toString().padStart(2, '0');

    // Convert digits if language is Bengali
    const result = `${formattedH}:${formattedM} ${newModifier}`;
    if (language === 'bn') {
      const bnDigits: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      return result.replace(/[0-9]/g, w => bnDigits[w]);
    }
    return result;
  };

  const schedule = [
    { name: t.fajr, time: addMinutes('05:15 AM', selectedDistrict.offset) },
    { name: t.sunrise, time: addMinutes('06:38 AM', selectedDistrict.offset) },
    { name: t.dhuhr, time: addMinutes('12:15 PM', selectedDistrict.offset) },
    { name: t.asr, time: addMinutes('04:05 PM', selectedDistrict.offset) },
    { name: t.maghrib, time: addMinutes('05:50 PM', selectedDistrict.offset) },
    { name: t.isha, time: addMinutes('07:10 PM', selectedDistrict.offset) },
    { name: t.sehri, time: addMinutes('05:10 AM', selectedDistrict.offset), highlight: true },
    { name: t.iftar, time: addMinutes('05:52 PM', selectedDistrict.offset), highlight: true },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-gray-800 to-black p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2 text-yellow-500 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">{t.todaySchedule}</span>
          </div>
          <h2 className="text-2xl font-black mb-1">{t.prayerSchedule}</h2>
          
          <div className="mt-4 relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
             </div>
             <select 
               value={selectedDistrictId}
               onChange={(e) => setSelectedDistrictId(e.target.value)}
               className="w-full bg-white/10 border border-white/20 text-white rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-500 transition appearance-none"
             >
               {DISTRICTS.map(d => (
                 <option key={d.id} value={d.id} className="text-black">
                   {language === 'bn' ? d.bn : d.en}
                 </option>
               ))}
             </select>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {schedule.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  item.highlight 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}
              >
                <span className={`font-bold ${item.highlight ? 'text-yellow-700 dark:text-yellow-500' : 'text-gray-700 dark:text-gray-300'}`}>
                  {item.name}
                </span>
                <span className={`text-lg font-black ${item.highlight ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-6 bg-yellow-500 text-black font-black py-4 rounded-2xl hover:bg-yellow-600 transition shadow-lg active:scale-95"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrayerModal;
