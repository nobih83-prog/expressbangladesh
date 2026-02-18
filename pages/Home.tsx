
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import NewsCard from '../components/NewsCard';
import CalendarWidget from '../components/CalendarWidget';
import { ChevronRight, Calendar, Youtube, Clock, Moon, Bell } from 'lucide-react';
import { translations } from '../translations';
import { NewsItem, SiteConfig } from '../types';

interface HomeProps {
  language: 'bn' | 'en';
  newsList: NewsItem[];
  onOpenPrayer?: () => void;
  config: SiteConfig;
}

const Home: React.FC<HomeProps> = ({ language, newsList, onOpenPrayer, config }) => {
  const { id } = useParams<{ id?: string }>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const t = translations[language];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredNews = useMemo(() => {
    if (!id || id === 'latest') return newsList;
    const category = CATEGORIES.find(c => c.id === id);
    return newsList.filter(n => n.category === category?.label);
  }, [id, newsList]);

  const heroNews = filteredNews[0];
  const sideNews = filteredNews.slice(1, 5);
  const remainingNews = filteredNews.slice(5);

  const formatDigits = (str: string) => {
    if (language === 'bn') {
      const bnDigits: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      return str.replace(/[0-9]/g, w => bnDigits[w]);
    }
    return str;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dynamic Sections Based on Config Layout */}
      <div className="space-y-12">
        {config.layout.map((sectionId) => {
          if (sectionId === 'hero' && heroNews && !id) {
            return (
              <section key="hero" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <NewsCard news={heroNews} layout="hero" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-4">
                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">{t.latestNews}</h3>
                    <Link to="/archive" className="text-red-600 text-xs font-bold flex items-center hover:underline">
                      {language === 'bn' ? 'সব খবর' : 'All News'} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {sideNews.map(news => (
                      <NewsCard key={news.id} news={news} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (sectionId === 'prayer') {
            return (
              <section key="prayer" className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black mb-1">{t.prayerSchedule}</h2>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{language === 'bn' ? 'ইসলামি ফাউন্ডেশন বাংলাদেশ' : 'Islamic Foundation BD'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={onOpenPrayer}
                      className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center space-x-2"
                    >
                      <Bell className="w-5 h-5" />
                      <span>{t.prayerCTA}</span>
                    </button>
                    <Link 
                      to="/roza"
                      className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-teal-700 transition-all shadow-xl active:scale-95 flex items-center space-x-2"
                    >
                      <Moon className="w-5 h-5" />
                      <span>{language === 'bn' ? 'রোজা ও ইফতারের সময়সূচী' : 'Roza Schedule'}</span>
                    </Link>
                  </div>
                </div>
              </section>
            );
          }

          if (sectionId === 'latest') {
            return (
              <section key="latest" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                    <h2 className="text-3xl font-black dark:text-white uppercase tracking-tight">
                      {id ? CATEGORIES.find(c => c.id === id)?.label : t.latestNews}
                    </h2>
                  </div>
                  
                  {filteredNews.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-20 rounded-[3rem] text-center border border-dashed border-gray-200 dark:border-gray-700">
                       <p className="text-gray-500 font-bold">{t.noNews}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(id ? filteredNews : remainingNews).map(news => (
                        <NewsCard key={news.id} news={news} layout="vertical" />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-8">
                  <CalendarWidget language={language} />
                  
                  <div className="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group cursor-pointer">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                    <h3 className="text-xl font-black mb-4 relative z-10">{language === 'bn' ? 'বিজ্ঞাপন' : 'ADVERTISEMENT'}</h3>
                    <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 italic text-sm opacity-60">
                      Place Your Ad Here
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-2 mb-6 border-b dark:border-gray-700 pb-3">
                      <Youtube className="w-5 h-5 text-red-600" />
                      <h3 className="font-black dark:text-white uppercase tracking-tighter">{t.videoGallery}</h3>
                    </div>
                    <div className="space-y-4">
                       {[1, 2].map(i => (
                         <div key={i} className="group cursor-pointer">
                           <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-2xl mb-2 relative overflow-hidden flex items-center justify-center">
                              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                <Youtube className="w-6 h-6" />
                              </div>
                           </div>
                           <p className="text-xs font-bold dark:text-gray-300 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">এক্সপ্রেস বাংলাদেশ ভিডিও সংবাদ: আজকের প্রধান খবরসমূহ</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Home;
