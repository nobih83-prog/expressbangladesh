
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsItem } from '../types';
import { Clock, User, Share2, Facebook, Twitter, MessageCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

interface NewsDetailProps {
  language: 'bn' | 'en';
  newsList: NewsItem[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ language, newsList }) => {
  const { id } = useParams<{ id: string }>();
  const news = newsList.find(n => n.id === id) || newsList[0];
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (!news) return;
    const fetchSummary = async () => {
      setLoadingSummary(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Summary this news in ${language === 'bn' ? 'Bengali' : 'English'}: ${news.excerpt + " " + news.title}`,
          config: {
            systemInstruction: `You are a professional journalist. Provide a concise summary in ${language === 'bn' ? 'Bengali' : 'English'}.`
          }
        });
        setSummary(response.text || "No summary available.");
      } catch (error) {
        console.error("Gemini Error:", error);
        setSummary("Summary failed to load.");
      }
      setLoadingSummary(false);
    };
    fetchSummary();
  }, [news, language]);

  if (!news) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
          <Link to="/" className="hover:text-red-600">{t.home}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-red-600 font-bold">{news.category}</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-gray-900 dark:text-white">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-gray-100 dark:border-gray-800 py-4 mb-8">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1 text-red-600" />
              <span className="font-bold">{news.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-red-600" />
              <span>{t.published}: {news.date} | {news.time}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"><Facebook className="w-4 h-4"/></button>
             <button className="p-2 bg-sky-400 text-white rounded-full hover:bg-sky-500 transition"><Twitter className="w-4 h-4"/></button>
             <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"><MessageCircle className="w-4 h-4"/></button>
             <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition"><Share2 className="w-4 h-4"/></button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden mb-8 shadow-xl border border-gray-100 dark:border-gray-800">
           <img src={news.imageUrl} alt={news.title} className="w-full h-auto object-cover" />
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-600 p-6 mb-8 rounded-r-2xl shadow-sm">
          <div className="flex items-center space-x-2 mb-3 text-red-600 font-black uppercase tracking-widest text-xs">
            <Sparkles className="w-4 h-4" />
            <span>{t.summary}</span>
          </div>
          {loadingSummary ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-red-100 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-red-100 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-bold italic">
              {summary}
            </p>
          )}
        </div>

        {/* Updated Content Rendering to support Rich HTML */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
          <div 
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: news.content || news.excerpt }} 
          />
        </div>

        {/* Existing Gallery Section stays as fallback or supplementary */}
        {news.additionalImages && news.additionalImages.length > 0 && (
          <div className="mt-12 pt-12 border-t dark:border-gray-800">
            <h3 className="text-xl font-black mb-8 flex items-center dark:text-white uppercase tracking-tight">
              <ImageIcon className="w-6 h-6 mr-3 text-red-600" />
              {language === 'bn' ? 'সংবাদের আরও কিছু ছবি' : 'More images of the news'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {news.additionalImages.map((img, idx) => (
                 <div key={idx} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 group">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 </div>
               ))}
            </div>
          </div>
        )}

        <div className="mt-16 border-t dark:border-gray-800 pt-8">
           <h3 className="text-2xl font-black mb-8 flex items-center dark:text-white uppercase">
             <span className="w-2 h-8 bg-red-600 mr-4 rounded-full"></span>
             {t.relatedNews}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {newsList.filter(n => n.id !== news.id).slice(0, 2).map(n => (
               <Link to={`/news/${n.id}`} key={`related-${n.id}`} className="flex space-x-4 group bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
                 <img src={n.imageUrl} className="w-24 h-24 object-cover rounded-xl flex-shrink-0 group-hover:opacity-80 transition shadow-sm" alt={n.title} />
                 <h4 className="font-bold leading-tight group-hover:text-red-600 transition dark:text-gray-200 line-clamp-3">{n.title}</h4>
               </Link>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
