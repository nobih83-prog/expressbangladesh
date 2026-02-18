import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Bell, Search, X, ChevronRight, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DISTRICTS } from '../constants/districts';
import { translations } from '../translations';

interface RozaProps {
  language: 'bn' | 'en';
}

const Roza: React.FC<RozaProps> = ({ language }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState('dhaka');
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Persistent Fasting Tracker
  const [fastedDays, setFastedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('fasted_days_2026');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fasted_days_2026', JSON.stringify(fastedDays));
  }, [fastedDays]);

  const t = translations[language];

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
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${newMod}`;
  };

  // Full 30 Days Ramadan 2026 Schedule (Base: Dhaka)
  const scheduleData = useMemo(() => {
    const baseData = [
      { id: 1, islamicDate: '১ রমজান', day: 'বৃহস্পতিবার, ১৯ ফেব্রুয়ারি', sehri: '০৫:১২ AM', iftar: '০৫:৫৮ PM' },
      { id: 2, islamicDate: '২ রমজান', day: 'শুক্রবার, ২০ ফেব্রুয়ারি', sehri: '০৫:১১ AM', iftar: '০৫:৫৮ PM' },
      { id: 3, islamicDate: '৩ রমজান', day: 'শনিবার, ২১ ফেব্রুয়ারি', sehri: '০৫:১১ AM', iftar: '০৫:৫৯ PM' },
      { id: 4, islamicDate: '৪ রমজান', day: 'রবিবার, ২২ ফেব্রুয়ারি', sehri: '০৫:১০ AM', iftar: '০৫:৫৯ PM' },
      { id: 5, islamicDate: '৫ রমজান', day: 'সোমবার, ২৩ ফেব্রুয়ারি', sehri: '০৫:০৯ AM', iftar: '০৬:০০ PM' },
      { id: 6, islamicDate: '৬ রমজান', day: 'মঙ্গলবার, ২৪ ফেব্রুয়ারি', sehri: '০৫:০৮ AM', iftar: '০৬:০০ PM' },
      { id: 7, islamicDate: '৭ রমজান', day: 'বুধবার, ২৫ ফেব্রুয়ারি', sehri: '০৫:০৭ AM', iftar: '০৬:০১ PM' },
      { id: 8, islamicDate: '৮ রমজান', day: 'বৃহস্পতিবার, ২৬ ফেব্রুয়ারি', sehri: '০৫:০৬ AM', iftar: '০৬:০১ PM' },
      { id: 9, islamicDate: '৯ রমজান', day: 'শুক্রবার, ২৭ ফেব্রুয়ারি', sehri: '০৫:০৫ AM', iftar: '০৬:০২ PM' },
      { id: 10, islamicDate: '১০ রমজান', day: 'শনিবার, ২৮ ফেব্রুয়ারি', sehri: '০৫:০৪ AM', iftar: '০৬:০২ PM' },
      { id: 11, islamicDate: '১১ রমজান', day: 'রবিবার, ০১ মার্চ', sehri: '০৫:০৩ AM', iftar: '০৬:০৩ PM' },
      { id: 12, islamicDate: '১২ রমজান', day: 'সোমবার, ০২ মার্চ', sehri: '০৫:০২ AM', iftar: '০৬:০৩ PM' },
      { id: 13, islamicDate: '১৩ রমজান', day: 'মঙ্গলবার, ০৩ মার্চ', sehri: '০৫:০১ AM', iftar: '০৬:০৩ PM' },
      { id: 14, islamicDate: '১৪ রমজান', day: 'বুধবার, ০৪ মার্চ', sehri: '০৫:০০ AM', iftar: '০৬:০৪ PM' },
      { id: 15, islamicDate: '১৫ রমজান', day: 'বৃহস্পতিবার, ০৫ মার্চ', sehri: '০৪:৫৯ AM', iftar: '০৬:০৪ PM' },
      { id: 16, islamicDate: '১৬ রমজান', day: 'শুক্রবার, ০৬ মার্চ', sehri: '০৪:৫৮ AM', iftar: '০৬:০৫ PM' },
      { id: 17, islamicDate: '১৭ রমজান', day: 'শনিবার, ০৭ মার্চ', sehri: '০৪:৫৭ AM', iftar: '০৬:০৫ PM' },
      { id: 18, islamicDate: '১৮ রমজান', day: 'রবিবার, ০৮ মার্চ', sehri: '০৪:৫৬ AM', iftar: '০৬:০৫ PM' },
      { id: 19, islamicDate: '১৯ রমজান', day: 'সোমবার, ০৯ মার্চ', sehri: '০৪:৫৫ AM', iftar: '০৬:০৬ PM' },
      { id: 20, islamicDate: '২০ রমজান', day: 'মঙ্গলবার, ১০ মার্চ', sehri: '০৪:৫৪ AM', iftar: '০৬:০৬ PM' },
      { id: 21, islamicDate: '২১ রমজান', day: 'বুধবার, ১১ মার্চ', sehri: '০৪:৫৩ AM', iftar: '০৬:০৭ PM' },
      { id: 22, islamicDate: '২২ রমজান', day: 'বৃহস্পতিবার, ১২ মার্চ', sehri: '০৪:৫২ AM', iftar: '০৬:০৭ PM' },
      { id: 23, islamicDate: '২৩ রমজান', day: 'শুক্রবার, ১৩ মার্চ', sehri: '০৪:৫১ AM', iftar: '০৬:০৭ PM' },
      { id: 24, islamicDate: '২৪ রমজান', day: 'শনিবার, ১৪ মার্চ', sehri: '০৪:৫০ AM', iftar: '০৬:০৮ PM' },
      { id: 25, islamicDate: '২৫ রমজান', day: 'রবিবার, ১৫ মার্চ', sehri: '০৪:৪৮ AM', iftar: '০৬:০৮ PM' },
      { id: 26, islamicDate: '২৬ রমজান', day: 'সোমবার, ১৬ মার্চ', sehri: '০৪:৪৭ AM', iftar: '০৬:০৮ PM' },
      { id: 27, islamicDate: '২৭ রমজান', day: 'মঙ্গলবার, ১৭ মার্চ', sehri: '০৪:৪৬ AM', iftar: '০৬:০৯ PM' },
      { id: 28, islamicDate: '২৮ রমজান', day: 'বুধবার, ১৮ মার্চ', sehri: '০৪:৪৫ AM', iftar: '০৬:০৯ PM' },
      { id: 29, islamicDate: '২৯ রমজান', day: 'বৃহস্পতিবার, ১৯ মার্চ', sehri: '০৪:৪৪ AM', iftar: '০৬:১০ PM' },
      { id: 30, islamicDate: '৩০ রমজান', day: 'শুক্রবার, ২০ মার্চ', sehri: '০৪:৪৩ AM', iftar: '০৬:১০ PM' },
    ];
    return baseData;
  }, []);

  const toggleFasting = (dayId: number) => {
    setFastedDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  const progress = (fastedDays.length / 30) * 100;

  const filteredDistricts = useMemo(() => 
    DISTRICTS.filter(d => 
      d.bn.includes(searchQuery) || 
      d.en.toLowerCase().includes(searchQuery.toLowerCase())
    ), 
    [searchQuery]
  );

  // Today is defined as Feb 19, 2026 for the sake of this mock app logic
  const isTodayRamadan = (id: number) => id === 1;

  return (
    <div className="bg-[#f8f9fa] dark:bg-gray-950 min-h-screen">
      {/* Header Bar */}
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-[110] border-b dark:border-gray-800 px-4 py-4 flex items-center">
        <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition mr-4">
          <ChevronLeft className="w-6 h-6 dark:text-white" />
        </Link>
        <h1 className="text-xl font-black dark:text-white">{language === 'bn' ? 'রোজা ও ইফতারের সময়সূচী' : 'Roza & Iftar Schedule'}</h1>
      </div>

      <div className="container mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* District Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsDistrictModalOpen(true)} 
            className="w-full flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:border-teal-500 transition-all group"
          >
            <div className="flex flex-col items-start">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.district}</span>
               <span className="font-bold dark:text-gray-200">{selectedDistrict.en} ({selectedDistrict.bn})</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
          </button>
        </div>

        {/* Main Hero Card (Teal) */}
        <div className="bg-[#4D807E] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-6 right-8 opacity-40">
             <div className="flex space-x-2 items-start">
               <div className="space-y-4">
                  <div className="w-0.5 h-16 bg-white/30 mx-auto" />
                  <Moon className="w-8 h-8 fill-white" />
               </div>
               <div className="space-y-2">
                  <div className="w-0.5 h-10 bg-white/30 mx-auto" />
                  <div className="w-4 h-4 rounded-full border border-white/40" />
               </div>
             </div>
          </div>

          <div className="space-y-1 mb-8">
            <p className="text-xs font-medium opacity-90">{formatDigits('বৃহস্পতিবার, ১৯ ফেব্রুয়ারি ২০২৬ • ৬ ফাল্গুন, ১৪৩২')}</p>
            <h2 className="text-2xl font-black text-yellow-400 leading-tight">{formatDigits('১ রমজান, ১৪৪৭ হিজরী')}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between group">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1 text-[10px] opacity-70 mb-1">
                  <Sun className="w-3 h-3" />
                  <span>সেহরীর শেষ সময়</span>
                </div>
                <div className="text-lg font-black">{formatDigits(addMinutes('05:12 AM', selectedDistrict.offset))}</div>
              </div>
              <Bell className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between group">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1 text-[10px] opacity-70 mb-1">
                  <Moon className="w-3 h-3" />
                  <span>ইফতারের সময়</span>
                </div>
                <div className="text-lg font-black">{formatDigits(addMinutes('05:58 PM', selectedDistrict.offset))}</div>
              </div>
              <Bell className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">আজ রোজা আছেন?</span>
              <button 
                onClick={() => toggleFasting(1)}
                className={`w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center transition-all ${fastedDays.includes(1) ? 'bg-white' : 'hover:bg-white/10'}`}
              >
                {fastedDays.includes(1) && <CheckCircle2 className="w-6 h-6 text-[#4D807E]" />}
              </button>
            </div>
            <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${progress}%` }} />
               <div className="absolute right-0 -top-6 text-[10px] font-black opacity-90 uppercase tracking-tighter">
                 {formatDigits(fastedDays.length.toString())} / {formatDigits('৩০')}
               </div>
            </div>
            <div className="flex items-center justify-between opacity-80">
               <span className="text-[10px] font-black uppercase tracking-widest">রোজা ট্র্যাকিং সচল</span>
               <div className="flex items-center space-x-1">
                  <span className="text-[10px] font-bold">{Math.round(progress)}% সম্পন্ন</span>
               </div>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="space-y-4 pb-12">
          <div className="flex items-center justify-between border-l-4 border-[#4D807E] pl-3">
             <h3 className="text-2xl font-black dark:text-white">রমজান ক্যালেন্ডার ২০২৬</h3>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ইসলামি ফাউন্ডেশন</span>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b dark:border-gray-800">
                  <th className="p-6">রমজান ও তারিখ</th>
                  <th className="p-6 text-right">সেহরি</th>
                  <th className="p-6 text-right">ইফতার</th>
                  <th className="p-6 text-center">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {scheduleData.map((item) => (
                  <tr key={item.id} className={`${isTodayRamadan(item.id) ? 'bg-teal-50/40 dark:bg-teal-900/10' : ''} group`}>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-sm dark:text-gray-100">{formatDigits(item.islamicDate)}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{formatDigits(item.day)}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right font-bold text-sm dark:text-gray-300">
                       {formatDigits(addMinutes(item.sehri, selectedDistrict.offset))}
                    </td>
                    <td className="p-6 text-right font-bold text-sm dark:text-gray-300">
                       {formatDigits(addMinutes(item.iftar, selectedDistrict.offset))}
                    </td>
                    <td className="p-6 text-center">
                       <button 
                        onClick={() => toggleFasting(item.id)}
                        className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center ${
                          fastedDays.includes(item.id) 
                            ? 'bg-teal-500 border-teal-500 text-white' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-teal-500'
                        }`}
                       >
                         {fastedDays.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* District Modal */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDistrictModalOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-black dark:text-white">জেলা ভিত্তিক সময় পরিবর্তন</h3>
              <button onClick={() => setIsDistrictModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="আপনার জেলা খুঁজুন..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-teal-500 outline-none transition dark:text-white font-bold"
                />
              </div>

              <div className="max-h-[50vh] overflow-y-auto no-scrollbar space-y-1">
                {filteredDistricts.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => {
                      setSelectedDistrictId(d.id);
                      setIsDistrictModalOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left p-4 rounded-xl transition flex items-center justify-between ${
                      selectedDistrictId === d.id 
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex flex-col">
                       <span className="font-bold">{d.en} ({d.bn})</span>
                       <span className="text-[10px] opacity-60">ঢাকার সাথে ব্যবধান: {formatDigits(d.offset.toString())} মিনিট</span>
                    </div>
                    {selectedDistrictId === d.id && <CheckCircle2 className="w-5 h-5 text-teal-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roza;