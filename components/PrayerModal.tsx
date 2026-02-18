import React, { useState, useMemo, useEffect } from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import { translations } from '../translations';
import { DISTRICTS } from '../constants/districts';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

const PrayerModal: React.FC<PrayerModalProps> = ({ isOpen, onClose, language }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState('dhaka');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const t = translations[language];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedDistrict = useMemo(() => 
    DISTRICTS.find(d => d.id === selectedDistrictId) || DISTRICTS[0],
    [selectedDistrictId]
  );

  const formatDigits = (str: string) => {
    if (language === 'bn') {
      const bnDigits: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      return str.replace(/[0-9]/g, w => bnDigits[w]);
    }
    return str;
  };

  const liveTimeStr = useMemo(() => {
    let h = currentTime.getHours();
    const m = currentTime.getMinutes();
    const s = currentTime.getSeconds();
    const modifier = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${modifier}`;
    return formatDigits(time);
  }, [currentTime, language]);

  const addMinutes = (timeStr: string, minutes: number) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, mins] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const date = new Date();
    date.setHours(hours, mins + minutes);
    let h = date.getHours();
    const m = date.getMinutes();
    const newMod = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return formatDigits(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${newMod}`);
  };

  // Correct IFB Times for Feb 2025 (Base: Dhaka)
  const schedule = useMemo(() => [
    { name: t.sehri, time: addMinutes('05:17 AM', selectedDistrict.offset), highlight: true },
    { name: t.fajr, time: addMinutes('05:23 AM', selectedDistrict.offset) },
    { name: t.sunrise, time: addMinutes('06:35 AM', selectedDistrict.offset) },
    { name: t.dhuhr, time: addMinutes('12:15 PM', selectedDistrict.offset) },
    { name: t.asr, time: addMinutes('04:19 PM', selectedDistrict.offset) },
    { name: t.maghrib, time: addMinutes('05:51 PM', selectedDistrict.offset) },
    { name: t.iftar, time: addMinutes('05:51 PM', selectedDistrict.offset), highlight: true },
    { name: t.isha, time: addMinutes('07:08 PM', selectedDistrict.offset) },
  ], [t, selectedDistrict, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-gray-800">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X className="w-5 h-5" /></button>
          <div className="flex items-center space-x-2 text-red-500 mb-2">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.todaySchedule}</span>
          </div>
          <h2 className="text-3xl font-black mb-1">{t.prayerSchedule}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{language === 'bn' ? 'ইসলামি ফাউন্ডেশন বাংলাদেশ অনুযায়ী' : 'According to Islamic Foundation BD'}</p>
          <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-5 border border-white/10 flex items-center justify-between shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{language === 'bn' ? 'সময় এখন' : 'Current Time'}</span>
              <div className="text-3xl font-black text-red-500 font-en tabular-nums drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">{liveTimeStr}</div>
            </div>
            <div className="h-10 w-px bg-white/10 mx-4" />
            <div className="flex-1 min-w-0">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{t.district}</span>
               <div className="relative">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 text-red-600" />
                  <select value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} className="w-full bg-transparent border-none text-white font-black text-sm pl-5 pr-4 outline-none cursor-pointer">
                    {DISTRICTS.map(d => <option key={d.id} value={d.id} className="text-black">{language === 'bn' ? d.bn : d.en}</option>)}
                  </select>
               </div>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3 bg-gray-50 dark:bg-gray-900/50 max-h-[60vh] overflow-y-auto no-scrollbar">
          {schedule.map((item, idx) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border ${item.highlight ? 'bg-white dark:bg-gray-800 border-red-200' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800'}`}>
              <span className={`font-bold ${item.highlight ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{item.name}</span>
              <span className={`text-lg font-black ${item.highlight ? 'text-red-600' : 'dark:text-white'}`}>{item.time}</span>
            </div>
          ))}
          <button onClick={onClose} className="w-full mt-4 bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95">{t.close}</button>
        </div>
      </div>
    </div>
  );
};

export default PrayerModal;