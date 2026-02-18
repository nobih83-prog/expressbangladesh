
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import NewsCard from '../components/NewsCard';
import CalendarWidget from '../components/CalendarWidget';
import { ChevronRight, Calendar, Youtube, Clock, ChevronLeft } from 'lucide-react';
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
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = translations[language];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sliderNews = useMemo(() => {
    if (!newsList.length) return [];
    const cats = ['সর্বশেষ', 'সারাদেশ', 'জাতীয়', 'রাজনীতি', 'খেলাধুলা', 'বিনোদন'];
    return cats.map(c => c === 'সর্বশেষ' ? newsList[0] : newsList.find(n => n.category === c)).filter(Boolean) as NewsItem[];
  }, [newsList]);

  useEffect(() => {
    if (sliderNews.length <= 1) return;
    const slideTimer = setInterval(() => setCurrentSlide(p => (p + 1) % sliderNews.length), 5000);
    return () => clearInterval(slideTimer);
  }, [sliderNews]);

  const filteredNews = useMemo(() => {
    if (!id || id === 'latest') return newsList;
    const cat = CATEGORIES.find(c => c.id === id);
    return newsList.filter(n => n.category === cat?.label);
  }, [id, newsList]);

  const listNews = useMemo(() => {
    if (id && id !== 'latest') return filteredNews.slice(0, visibleCount);
    return filteredNews.slice(1, visibleCount + 1);
  }, [filteredNews, visibleCount, id]);

  const liveTimeStr = useMemo(() => {
    const time = currentTime.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { hour12: true });
    return time;
  }, [currentTime, language]);

  // Section Rendering Map
  const sections: Record<string, React.ReactNode> = {
    hero: (!id || id === 'latest') && (
      <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl bg-black h-[350px] sm:h-[450px] group">
        {sliderNews.map((news, idx) => (
          <div key={news.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <Link to={`/news/${news.id}`} className="block w-full h-full relative">
              <img src={news.imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent p-6 sm:p-10 flex flex-col justify-end">
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 mb-4 w-max rounded-full">{news.category}</span>
                <h2 className="text-white text-2xl sm:text-4xl font-black mb-4 line-clamp-2">{news.title}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    ),
    latest: (
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black mb-6 border-l-4 border-red-600 pl-4 dark:text-white">
          {id ? CATEGORIES.find(c => c.id === id)?.label : 'সর্বশেষ খবর'}
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {listNews.map(news => <NewsCard key={news.id} news={news} />)}
        </div>
      </div>
    ),
    prayer: (
      <div className="bg-gray-900 rounded-3xl p-8 text-white text-center shadow-2xl border-t-4 border-red-600 mb-8">
         <h4 className="text-lg font-black mb-4 uppercase text-gray-400">{t.prayerSchedule}</h4>
         <div className="text-4xl font-black text-red-500 mb-6 font-en">{liveTimeStr}</div>
         <button onClick={onOpenPrayer} className="w-full bg-red-600 py-4 rounded-2xl font-black hover:bg-red-700 transition">জানতে ক্লিক করুন</button>
      </div>
    ),
    popular: (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-black mb-6 border-b-2 border-red-600 pb-2 dark:text-white">{t.popular}</h3>
        <div className="space-y-4">
          {newsList.slice(0, 5).map((news, idx) => (
            <Link to={`/news/${news.id}`} key={news.id} className="flex space-x-4 items-start group">
              <span className="text-2xl font-black text-gray-200 group-hover:text-red-600 transition">{idx + 1}</span>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-300 group-hover:text-red-600 transition line-clamp-2">{news.title}</p>
            </Link>
          ))}
        </div>
      </div>
    ),
    calendar: <div className="mb-8"><CalendarWidget language={language} /></div>,
    youtube: (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-black mb-4 dark:text-white">YOUTUBE LIVE</h3>
        <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/N2-jKzpxYfM" frameBorder="0" allowFullScreen></iframe>
        </div>
      </div>
    )
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {config.layout.filter(l => l === 'hero' || l === 'latest').map(l => sections[l])}
        </div>
        <div className="lg:w-1/3">
          {config.layout.filter(l => l !== 'hero' && l !== 'latest').map(l => sections[l])}
        </div>
      </div>
    </div>
  );
};

export default Home;
