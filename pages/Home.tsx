
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_NEWS, CATEGORIES } from '../constants';
import NewsCard from '../components/NewsCard';
import CalendarWidget from '../components/CalendarWidget';
import { ChevronRight, Calendar, Youtube, PlayCircle, ExternalLink, Clock, ChevronLeft } from 'lucide-react';
import { translations } from '../translations';

interface HomeProps {
  language: 'bn' | 'en';
  onOpenPrayer?: () => void;
}

const Home: React.FC<HomeProps> = ({ language, onOpenPrayer }) => {
  const { id } = useParams<{ id?: string }>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = translations[language];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset visible count and slide when category changes
  useEffect(() => {
    setVisibleCount(5);
    setCurrentSlide(0);
  }, [id]);

  // Categories to show in Hero Slider as requested
  const heroCategories = [
    'সর্বশেষ', 'সারাদেশ', 'শিক্ষাঙ্গন', 'উচ্চশিক্ষা', 'শিক্ষা প্রশাসন', 'জাতীয়', 'রাজনীতি', 'খেলাধুলা', 'বিনোদন'
  ];

  // Pick one latest news for each requested category for the slider
  const sliderNews = useMemo(() => {
    const items = heroCategories.map(catName => {
      if (catName === 'সর্বশেষ') return MOCK_NEWS[0];
      return MOCK_NEWS.find(news => news.category === catName);
    }).filter(Boolean);
    // Remove duplicates if any
    return Array.from(new Set(items));
  }, []);

  // Auto-play for Hero Slider
  useEffect(() => {
    if (sliderNews.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderNews.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [sliderNews]);

  const currentCategory = useMemo(() => {
    if (!id || id === 'latest') return null;
    return CATEGORIES.find(cat => cat.id === id);
  }, [id]);

  const filteredNews = useMemo(() => {
    if (!id || id === 'latest') return MOCK_NEWS;
    return MOCK_NEWS.filter(news => news.category === currentCategory?.label);
  }, [id, currentCategory]);

  // Regular list excluding slider items if on Home
  const listNews = useMemo(() => {
    // If we're on a specific category page, just show that category's news
    if (id && id !== 'latest') {
      const remaining = filteredNews.length > 1 ? filteredNews.slice(1) : [];
      return remaining.slice(0, visibleCount);
    }
    // If on Home page, exclude the first featured item (which is in slider)
    const featured = filteredNews[0];
    const remaining = filteredNews.filter(n => n.id !== featured.id);
    return remaining.slice(0, visibleCount);
  }, [filteredNews, visibleCount, id]);

  const hasMore = useMemo(() => {
    const totalCount = id && id !== 'latest' ? filteredNews.length - 1 : filteredNews.length - 1;
    return visibleCount < totalCount;
  }, [filteredNews, visibleCount, id]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

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
          
          {/* Hero Slider Section */}
          {!id || id === 'latest' ? (
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-black h-[350px] sm:h-[450px] group">
              {sliderNews.map((news, index) => (
                <div 
                  key={`slide-${news?.id}`}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <Link to={`/news/${news?.id}`} className="block w-full h-full relative">
                    <img 
                      src={news?.imageUrl} 
                      alt={news?.title} 
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[10s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10">
                      <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 mb-4 w-max rounded-full uppercase tracking-widest shadow-lg">
                        {news?.category}
                      </span>
                      <h2 className="text-white text-2xl sm:text-4xl font-black leading-tight mb-4 line-clamp-2 drop-shadow-md">
                        {news?.title}
                      </h2>
                      <div className="flex items-center text-gray-300 text-xs sm:text-sm space-x-6">
                        <span className="flex items-center font-bold"><Clock className="w-4 h-4 mr-2 text-yellow-500" /> {news?.time}</span>
                        <span className="flex items-center font-bold"><Calendar className="w-4 h-4 mr-2 text-yellow-500" /> {news?.date}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Slider Controls */}
              {sliderNews.length > 1 && (
                <>
                  <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
                    {sliderNews.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 sm:w-8 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-yellow-500 w-6 sm:w-12' : 'bg-white/40 hover:bg-white/70'}`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentSlide(prev => (prev - 1 + sliderNews.length) % sliderNews.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setCurrentSlide(prev => (prev + 1) % sliderNews.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
              <NewsCard news={filteredNews[0] || MOCK_NEWS[0]} layout="hero" />
            </div>
          )}

          <div className="flex items-center justify-between mb-6 border-l-4 border-red-600 pl-4">
            <h2 className="text-xl sm:text-2xl font-black flex items-center dark:text-white transition-colors">
              {pageTitle}
              <span className="ml-4 text-[10px] sm:text-sm text-gray-400 dark:text-gray-500 font-bold hidden xs:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 mr-2 text-red-600"/> {language === 'bn' ? '০২ ফেব্রুয়ারি ২০২৫' : 'February 02, 2025'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {listNews.length > 0 ? (
              listNews.map((news, idx) => (
                <NewsCard key={`${news.id}-${idx}`} news={news} />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t.noNews}
                </p>
              </div>
            )}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={handleLoadMore}
                className="group flex items-center space-x-3 bg-white dark:bg-gray-800 border-2 border-yellow-500 text-yellow-600 dark:text-yellow-500 px-8 py-3 rounded-full font-black hover:bg-yellow-500 hover:text-white dark:hover:text-black transition-all shadow-lg active:scale-95"
              >
                <span>{t.readMore}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Area */}
        <div className="lg:w-1/3 space-y-8">
          
          {/* Prayer Schedule Card */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden border-t-4 border-yellow-500">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
             <div className="flex justify-center mb-4">
               <div className="relative">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-yellow-500/30">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)] border-2 border-black" />
                  </div>
               </div>
             </div>
             <h4 className="text-lg font-black mb-1 uppercase tracking-widest text-gray-300">
                {t.prayerSchedule}
             </h4>
             
             <div className="my-6 inline-block bg-white/5 px-8 py-4 rounded-3xl border border-white/10 backdrop-blur-xl shadow-inner">
                <span className="text-4xl font-black text-yellow-400 font-en tracking-tighter tabular-nums">
                  {liveTimeStr}
                </span>
             </div>

             <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-widest">
                {language === 'bn' ? 'সঠিক সময় জানতে ক্লিক করুন' : 'Click for exact timings'}
             </p>
             <button 
               onClick={onOpenPrayer}
               className="w-full bg-yellow-500 text-black px-6 py-4 rounded-2xl text-sm font-black hover:bg-yellow-600 transition shadow-xl active:scale-95 uppercase tracking-widest flex items-center justify-center space-x-2"
             >
                <span>{t.prayerCTA}</span>
                <ChevronRight className="w-4 h-4" />
             </button>
          </div>

          {/* Popular News Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-black mb-6 border-b-2 border-yellow-500 pb-2 dark:text-white flex items-center">
               <span className="w-2 h-6 bg-yellow-500 mr-3 rounded-full"></span>
               {t.popular}
            </h3>
            <div className="space-y-6">
              {MOCK_NEWS.slice(0, 5).map((news, idx) => (
                <Link to={`/news/${news.id}`} key={`popular-${news.id}`} className="flex space-x-4 items-start group cursor-pointer border-b border-gray-50 dark:border-gray-700/50 pb-4 last:border-0 last:pb-0">
                  <span className="text-3xl font-black text-gray-100 dark:text-gray-700 group-hover:text-yellow-500/30 transition leading-none font-en pt-1">
                    {formatDigits((idx + 1).toString())}
                  </span>
                  <p className="text-sm font-bold leading-relaxed text-gray-800 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors line-clamp-2">
                    {news.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Advertisement Placeholder */}
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-3xl p-4 text-center border border-gray-100 dark:border-gray-700">
            <div className="relative overflow-hidden rounded-2xl group">
              <img src="https://picsum.photos/seed/ad-side/300/250" alt="Sidebar Ad" className="mx-auto rounded-2xl shadow-sm opacity-90 group-hover:opacity-100 transition group-hover:scale-105 duration-700" />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em]">
               {t.advertisement}
            </p>
          </div>

          {/* Dynamic Calendar Widget (New Section below Ad) */}
          <CalendarWidget language={language} />

          {/* YouTube Live Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Youtube className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">
                   {t.youtube}
                </h3>
              </div>
              <a 
                href="https://www.youtube.com/@Channel24Ghontav" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition p-2 bg-gray-50 dark:bg-gray-700 rounded-full"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl mb-6 border border-gray-100 dark:border-gray-700 group">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/hazRrHlHI8I?rel=0&modestbranding=1" 
                title="Featured Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="opacity-90 group-hover:opacity-100 transition-opacity"
              ></iframe>
            </div>

            <a 
              href="https://www.youtube.com/@Channel24Ghontav" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-red-600/30"
            >
              <Youtube className="w-5 h-5" />
              <span>{language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Now'}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
