
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_NEWS, CATEGORIES } from '../constants';
import NewsCard from '../components/NewsCard';
import { ChevronRight, Calendar, Youtube, PlayCircle, ExternalLink } from 'lucide-react';
import { translations } from '../translations';

interface HomeProps {
  language: 'bn' | 'en';
  onOpenPrayer?: () => void;
}

const Home: React.FC<HomeProps> = ({ language, onOpenPrayer }) => {
  const { id } = useParams<{ id?: string }>();
  const t = translations[language];

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

  return (
    <div className="container mx-auto px-4 py-6 transition-colors">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="lg:w-2/3">
          {filteredNews.length > 0 ? (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 transition-colors">
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
            <h2 className="text-2xl font-black flex items-center dark:text-white transition-colors">
              {pageTitle}
              <span className="ml-3 text-sm text-gray-400 dark:text-gray-500 font-normal hidden sm:flex items-center">
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
              <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-yellow-500 text-yellow-600 dark:text-yellow-500 px-6 py-2 rounded-full font-bold hover:bg-yellow-500 hover:text-white dark:hover:text-black transition shadow-sm">
                <span>{t.readMore}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="lg:w-1/3 space-y-8">
          <div className="bg-yellow-50 dark:bg-gray-800/50 rounded-lg p-6 text-center border border-yellow-200 dark:border-yellow-900/50 transition-colors">
            <img src="https://picsum.photos/seed/ad-side/300/250" alt="Sidebar Ad" className="mx-auto rounded shadow-sm opacity-90 dark:opacity-70" />
            <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
               {t.advertisement}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-bold mb-4 border-b-2 border-yellow-500 pb-1 dark:text-white">
               {t.popular}
            </h3>
            <div className="space-y-4">
              {MOCK_NEWS.slice(0, 5).map((news, idx) => (
                <Link to={`/news/${news.id}`} key={`popular-${news.id}`} className="flex space-x-3 items-start group cursor-pointer">
                  <span className="text-2xl font-black text-gray-200 dark:text-gray-700 group-hover:text-yellow-500 dark:group-hover:text-yellow-500 transition leading-none font-en">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <p className="text-sm font-bold leading-snug text-gray-800 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                    {news.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-black rounded-xl p-6 text-white text-center shadow-lg transform hover:scale-[1.02] transition">
             <div className="flex justify-center mb-3">
               <svg className="w-12 h-12 text-yellow-500 fill-current" viewBox="0 0 24 24">
                 <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
               </svg>
             </div>
             <h4 className="text-lg font-bold mb-1">
                {t.prayerSchedule}
             </h4>
             <p className="text-xs text-gray-400 mb-3">
                {language === 'bn' ? 'আপনার এলাকার সঠিক সময় জানতে' : 'To know the exact time of your area'}
             </p>
             <button 
               onClick={onOpenPrayer}
               className="bg-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-yellow-600 transition shadow-lg active:scale-90"
             >
                {t.prayerCTA}
             </button>
          </div>

          {/* YouTube Section */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4 border-b-2 border-red-600 pb-2">
              <div className="flex items-center space-x-2">
                <Youtube className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">
                   {t.youtube}
                </h3>
              </div>
              <a 
                href="https://www.youtube.com/@Channel24Ghontav" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-inner mb-4">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/hazRrHlHI8I?rel=0&modestbranding=1" 
                title="Featured Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="opacity-95 hover:opacity-100 transition-opacity"
              ></iframe>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 group cursor-pointer border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="relative shrink-0">
                  <img src="https://img.youtube.com/vi/hazRrHlHI8I/0.jpg" className="w-24 h-14 object-cover rounded shadow-sm" alt="Video thumbnail" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition">
                    <PlayCircle className="w-6 h-6 text-white/90" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight dark:text-gray-300 group-hover:text-red-600 transition line-clamp-2">
                    {language === 'bn' ? 'এক্সপ্রেস বাংলাদেশ: আমাদের বিশেষ ইউটিউব প্রতিবেদন' : 'Express Bangladesh: Our special YouTube report'}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Just now</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group cursor-pointer">
                <div className="relative shrink-0">
                  <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg" className="w-24 h-14 object-cover rounded shadow-sm" alt="Video thumbnail" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition">
                    <PlayCircle className="w-6 h-6 text-white/90" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight dark:text-gray-300 group-hover:text-red-600 transition line-clamp-2">
                    {language === 'bn' ? 'চ্যানেল ২৪: খবরের পিছনের সব খবর সরাসরি' : 'Channel 24: All news behind news live'}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">3 hours ago</span>
                </div>
              </div>
            </div>

            <a 
              href="https://www.youtube.com/@Channel24Ghontav" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition active:scale-95 text-sm shadow-lg shadow-red-600/20"
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
