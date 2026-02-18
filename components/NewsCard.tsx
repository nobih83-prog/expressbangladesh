
import React, { useState, useEffect } from 'react';
import { Clock, Layers, ImageIcon } from 'lucide-react';
import { NewsItem } from '../types';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  news: NewsItem;
  layout?: 'horizontal' | 'vertical' | 'hero';
}

const NewsCard: React.FC<NewsCardProps> = ({ news, layout = 'horizontal' }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = [news.imageUrl, ...(news.additionalImages || [])].filter(Boolean);
  const hasMultiple = images.length > 1;

  // Auto-slide effect for cards with multiple images
  useEffect(() => {
    if (!hasMultiple) return;
    
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3500); // Slightly slower for better readability

    return () => clearInterval(timer);
  }, [hasMultiple, images.length]);

  const ImageDisplay = () => (
    <div className="relative w-full h-full overflow-hidden group bg-gray-200 dark:bg-gray-800">
      {images.map((img, idx) => (
        <img 
          key={idx}
          src={img} 
          alt={`${news.title} - ${idx}`} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
            idx === currentIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-110 translate-x-4'
          }`}
        />
      ))}
      
      {/* Overlay indicator for multiple images */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[9px] px-2 py-1 rounded-lg flex items-center space-x-1 backdrop-blur-md z-20 shadow-lg font-black uppercase">
          <ImageIcon className="w-3 h-3" />
          <span>{currentIdx + 1}/{images.length}</span>
        </div>
      )}

      {/* Slide dots - More prominent */}
      {hasMultiple && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 z-20">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                i === currentIdx ? 'w-5 bg-red-600' : 'w-1.5 bg-white/60 hover:bg-white'
              }`} 
            />
          ))}
        </div>
      )}
    </div>
  );

  if (layout === 'hero') {
    return (
      <Link to={`/news/${news.id}`} className="block relative h-[350px] sm:h-[450px] overflow-hidden group rounded-3xl shadow-2xl">
        <ImageDisplay />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-8 z-10">
          <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-4 py-1.5 mb-3 w-max rounded-full uppercase tracking-widest shadow-xl">
            {news.category}
          </span>
          <h2 className="text-white text-2xl md:text-4xl font-black leading-tight mb-4 line-clamp-2 group-hover:text-red-100 transition-colors drop-shadow-lg">
            {news.title}
          </h2>
          <div className="flex items-center text-gray-300 text-xs sm:text-sm space-x-5 font-bold">
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-red-500" /> {news.time}</span>
            <span className="tracking-wider">{news.date}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (layout === 'vertical') {
    return (
      <Link to={`/news/${news.id}`} className="block group">
        <div className="aspect-video overflow-hidden rounded-3xl mb-5 shadow-lg border border-gray-100 dark:border-gray-800 relative hover:shadow-2xl transition-shadow">
          <ImageDisplay />
        </div>
        <h3 className="text-lg sm:text-xl font-black leading-tight hover:text-red-600 dark:text-gray-100 dark:hover:text-red-500 transition-colors line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-2 leading-relaxed font-medium">{news.excerpt}</p>
        <div className="flex items-center text-gray-400 dark:text-gray-500 text-[11px] mt-4 space-x-4 font-black uppercase tracking-widest">
          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-red-600" /> {news.time}</span>
          <span>{news.date}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${news.id}`} className="flex space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl hover:shadow-2xl transition-all group active:scale-[0.98] border-b-4 border-b-transparent hover:border-b-red-600">
      <div className="w-[120px] sm:w-52 h-[90px] sm:h-32 flex-shrink-0 overflow-hidden rounded-2xl relative shadow-md">
        <ImageDisplay />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[15px] sm:text-xl font-black leading-tight group-hover:text-red-600 dark:text-gray-100 dark:group-hover:text-red-500 transition-colors line-clamp-2">
          {news.title}
        </h3>
        <div className="flex items-center text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs mt-3 space-x-4 font-black uppercase tracking-widest">
          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-red-600" /> {news.time}</span>
          <span className="hidden xs:inline">{news.date}</span>
          {hasMultiple && (
            <span className="text-red-600 ml-auto flex items-center bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
               <Layers className="w-3 h-3 mr-1" /> {images.length}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
