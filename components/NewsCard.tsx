
import React from 'react';
import { Clock } from 'lucide-react';
import { NewsItem } from '../types';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  news: NewsItem;
  layout?: 'horizontal' | 'vertical' | 'hero';
}

const NewsCard: React.FC<NewsCardProps> = ({ news, layout = 'horizontal' }) => {
  if (layout === 'hero') {
    return (
      <Link to={`/news/${news.id}`} className="block relative h-[400px] overflow-hidden group">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 mb-2 w-max rounded">
            {news.category}
          </span>
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3">
            {news.title}
          </h2>
          <div className="flex items-center text-gray-300 text-sm space-x-4">
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {news.time}</span>
            <span>{news.date}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (layout === 'vertical') {
    return (
      <Link to={`/news/${news.id}`} className="block group">
        <div className="aspect-video overflow-hidden rounded-lg mb-3">
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
        <h3 className="text-lg font-bold leading-tight hover:text-yellow-600 dark:text-gray-100 dark:hover:text-yellow-500 transition">
          {news.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">{news.excerpt}</p>
        <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs mt-3 space-x-3">
          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {news.time}</span>
          <span>{news.date}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${news.id}`} className="flex space-x-4 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition group">
      <div className="w-1/3 md:w-40 h-24 flex-shrink-0 overflow-hidden rounded">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-base md:text-lg font-bold leading-snug group-hover:text-yellow-600 dark:text-gray-100 dark:group-hover:text-yellow-500 transition line-clamp-2">
          {news.title}
        </h3>
        <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs mt-3 space-x-3">
          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {news.time}</span>
          <span>{news.date}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
