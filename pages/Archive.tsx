
import React, { useState, useMemo } from 'react';
import { Calendar, Search } from 'lucide-react';
import { NewsItem } from '../types';
import NewsCard from '../components/NewsCard';
import { translations } from '../translations';
import { Link } from 'react-router-dom';

interface ArchiveProps {
  language: 'bn' | 'en';
  newsList: NewsItem[];
}

const Archive: React.FC<ArchiveProps> = ({ language, newsList }) => {
  const [selectedDate, setSelectedDate] = useState('2025-02-06');
  const t = translations[language];

  // In a real app, this would filter by the selectedDate property
  const results = useMemo(() => newsList.slice(0, 6), [newsList]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6 flex space-x-2">
          <Link to="/" className="hover:text-red-600">{t.home}</Link>
          <span>/</span>
          <span className="text-red-600 font-bold">{t.archive}</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
          <div className="flex items-center space-x-2 mb-4">
             <Calendar className="w-5 h-5 text-red-600" />
             <h2 className="text-lg font-bold dark:text-white">{t.selectDate}</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none font-bold text-gray-700 dark:text-gray-200"
            />
            <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center space-x-2 shadow-lg active:scale-95">
              <Search className="w-5 h-5" />
              <span>{t.search}</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black mb-6 flex items-center space-x-3 dark:text-white">
             <span className="bg-red-50 dark:bg-red-900/20 p-2 rounded-xl text-red-600">
                <Calendar className="w-6 h-6" />
             </span>
             <span>{t.archive}: "{selectedDate}"</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map(news => (
              <NewsCard key={news.id} news={news} layout="vertical" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archive;
