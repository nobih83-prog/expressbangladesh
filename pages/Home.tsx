
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_NEWS, CATEGORIES } from '../constants';
import NewsCard from '../components/NewsCard';
import { ChevronRight, Calendar, Youtube, PlayCircle, ExternalLink, Clock } from 'lucide-react';
import { translations } from '../translations';

interface HomeProps {
  language: 'bn' | 'en';
  onOpenPrayer?: () => void;
}

const Home: React.FC<HomeProps> = ({ language, onOpenPrayer }) => {
  const { id } = useParams<{ id?: string }>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const t = translations[language];

  // Update clock every second for the live time feature
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCategory = useMemo(() => {
    if (!id || id === 'latest') return null;
    return CATEGORIES.find(cat => cat.id === id);
  }, [id]);

  const filteredNews = useMemo(() => {
    if (!id || id === 'latest') return MOCK_NEWS;
    return MOCK_NEWS.filter(news => news.category === currentCategory?.label);
  }, [id, currentCategory]);

  const featured = filteredNews[0] || MOCK_NEWS[0];
  const listNews = filteredNews.length > 1 ? filteredNews.slice(1) : filteredNews;

  const pageTitle = currentCategory 
    ? (language === 'bn' ? currentCategory.label : currentCategory.labelEn)
    : (language === 'bn' ? 'সর্বশেষ খবর' : 'Latest News');

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

  return (
    <div className="container mx-auto px-4 py-6 transition-colors">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="lg:w-2/3">
          {filteredNews.length > 0 ? (
            <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 transition-colors">
              <NewsCard news={featured} layout="hero" />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl text-center shadow-sm mb-8 border border-gray-100 dark:border-gray-700 transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {t.noNews}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 border-l-4 border-red-600 pl-3">
            <h2 className="text-xl sm:text-2xl font-black flex items-center dark:text-white transition-colors">
              {pageTitle}
              <span className="ml-3 text-[10px] sm:text-sm text-gray-400 dark:text-gray-500 font-normal hidden xs:flex items-center">
                <Calendar className="w-4 h-4 mr-1"/> {language === 'bn' ? '০২ ফেব্রুয়ারি ২০২৫' : 'February 02, 2025'}
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {listNews.length > 0 ? (
              listNews.map((news, idx) => (
                <NewsCard key={`${news.id}-${idx}`} news={news} />
              ))
            ) : (
              !currentCategory && MOCK_NEWS.map(news => (
                <NewsCard key={`fallback-${news.id}`} news={news} />
              ))
            )}
          </div>

          {filteredNews.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-yellow-500 text-yellow-600 dark:text-yellow-500 px-6 py-2.5 rounded-full font-bold hover:bg-yellow-500 hover:text-white dark:hover:text-black transition shadow-sm active:scale-95">
                <span>{t.readMore}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Area */}
        <div className="lg:w-1/3 space-y-8">
          
          {/* Prayer Schedule Card with Live Clock */}
          <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 text-white text-center shadow-xl transform hover:scale-[1.01] transition-all border-t-4 border-yellow-500">
             <div className="flex justify-center mb-3">
               <div className="relative">
                  <Clock className="w-12 h-12 text-yellow-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  </div>
               </div>
             </div>
             <h4 className="text-lg font-black mb-1 uppercase tracking-tight">
                {t.prayerSchedule}
             </h4>
             
             {/* Dynamic Live Time Display */}
             <div className="my-4 inline-block bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
                <span className="text-3xl font-black text-yellow-400 font-en tracking-tighter tabular-nums">
                  {liveTimeStr}
                </span>
             </div>

             <p className="text-xs text-gray-400 mb-4 font-medium">
                {language === 'bn' ? 'আপনার এলাকার সঠিক সময় জানতে ক্লিক করুন' : 'Click to know exact time of your area'}
             </p>
             <button 
               onClick={onOpenPrayer}
               className="w-full bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-black hover:bg-yellow-600 transition shadow-lg active:scale-95 uppercase tracking-widest"
             >
                {t.prayerCTA}
             </button>
          </div>

          {/* Popular News Section */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-black mb-5 border-b-2 border-yellow-500 pb-1 dark:text-white flex items-center">
               <span className="w-2 h-6 bg-yellow-500 mr-2 rounded-full"></span>
               {t.popular}
            </h3>
            <div className="space-y-5">
              {MOCK_NEWS.slice(0, 5).map((news, idx) => (
                <Link to={`/news/${news.id}`} key={`popular-${news.id}`} className="flex space-x-3 items-start group cursor-pointer">
                  <span className="text-2xl font-black text-gray-200 dark:text-gray-700 group-hover:text-yellow-500 transition leading-none font-en pt-1">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-bold leading-snug text-gray-800 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors line-clamp-2">
                    {news.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Advertisement Placeholder */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700 transition-colors">
            <img src="https://picsum.photos/seed/ad-side/300/250" alt="Sidebar Ad" className="mx-auto rounded-xl shadow-sm opacity-90 hover:opacity-100 transition" />
            <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.2em]">
               {t.advertisement}
            </p>
          </div>

          {/* YouTube Live Section */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4 border-b-2 border-red-600 pb-2">
              <div className="flex items-center space-x-2">
                <Youtube className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-black dark:text-white uppercase tracking-tighter">
                   {t.youtube}
                </h3>
              </div>
              <a 
                href="https://www.youtube.com/@Channel24Ghontav" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition p-1"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner mb-4 border border-gray-200 dark:border-gray-700">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/hazRrHlHI8I?rel=0&modestbranding=1" 
                title="Featured Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="opacity-95 hover:opacity-100 transition-opacity"
              ></iframe>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 group cursor-pointer border-b border-gray-50 dark:border-gray-700 pb-3">
                <div className="relative shrink-0">
                  <img src="https://img.youtube.com/vi/hazRrHlHI8I/0.jpg" className="w-20 sm:w-24 h-12 sm:h-14 object-cover rounded-lg shadow-sm" alt="Video thumbnail" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition rounded-lg">
                    <PlayCircle className="w-6 h-6 text-white/90" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight dark:text-gray-300 group-hover:text-red-600 transition line-clamp-2">
                    {language === 'bn' ? 'এক্সপ্রেস বাংলাদেশ: আমাদের বিশেষ ইউটিউব প্রতিবেদন' : 'Express Bangladesh: Our special YouTube report'}
                  </p>
                  <span className="text-[9px] text-gray-400 mt-1 block font-bold uppercase tracking-widest">Live</span>
                </div>
              </div>
            </div>

            <a 
              href="https://www.youtube.com/@Channel24Ghontav" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center space-x-2 bg-red-600 text-white py-3.5 rounded-xl font-black hover:bg-red-700 transition active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-red-600/20"
            >
              <Youtube className="w-4 h-4" />
              <span>{language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Now'}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
