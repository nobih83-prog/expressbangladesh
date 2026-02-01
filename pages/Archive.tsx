
import React, { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { MOCK_NEWS } from '../constants';
import NewsCard from '../components/NewsCard';
import { translations } from '../translations';
import { Link } from 'react-router-dom';

interface ArchiveProps {
  language: 'bn' | 'en';
}

const Archive: React.FC<ArchiveProps> = ({ language }) => {
  const [selectedDate, setSelectedDate] = useState('2025-02-01');
  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6 flex space-x-2">
          <Link to="/" className="hover:text-yellow-600">{t.home}</Link>
          <span>/</span>
          <span className="text-yellow-600 font-bold">{t.archive}</span>
        </nav>

        {/* Filter Box */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100 mb-10">
          <div className="flex items-center space-x-2 mb-4">
             <Calendar className="w-5 h-5 text-yellow-500" />
             <h2 className="text-lg font-bold">{t.selectDate}</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-gray-700"
            />
            <button className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 transition flex items-center justify-center space-x-2">
              <Search className="w-5 h-5" />
              <span>{t.search}</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
             <span className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </span>
             <span>{t.archive}: "{selectedDate}"</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_NEWS.map(news => (
              <NewsCard key={news.id} news={news} layout="vertical" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archive;
