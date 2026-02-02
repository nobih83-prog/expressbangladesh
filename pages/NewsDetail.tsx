
// Fixed: Added React import to resolve the 'Cannot find namespace React' error when using React.FC
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_NEWS } from '../constants';
import { NewsItem } from '../types';
import { Clock, User, Share2, Facebook, Twitter, MessageCircle, Sparkles } from 'lucide-react';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

interface NewsDetailProps {
  language: 'bn' | 'en';
}

const NewsDetail: React.FC<NewsDetailProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const news = MOCK_NEWS.find(n => n.id === id) || MOCK_NEWS[0];
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      // Fixed: Initialize GoogleGenAI with named parameter apiKey from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Summary this news in ${language === 'bn' ? 'Bengali' : 'English'}: ${news.excerpt + " " + news.title}`,
          config: {
            systemInstruction: `You are a professional journalist. Provide a concise summary in ${language === 'bn' ? 'Bengali' : 'English'}.`
          }
        });
        // Fixed: Use .text property directly (not as a method) as per @google/genai guidelines
        setSummary(response.text || "No summary available.");
      } catch (error) {
        console.error("Gemini Error:", error);
        setSummary("Summary failed to load.");
      }
      setLoadingSummary(false);
    };
    fetchSummary();
  }, [news, language]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-yellow-600">{t.home}</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${news.category}`} className="hover:text-yellow-600">{news.category}</Link>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-gray-900 dark:text-white">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-gray-100 dark:border-gray-800 py-4 mb-8">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1 text-yellow-500" />
              <span className="font-bold">{language === 'bn' ? news.author : 'Staff Correspondent'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-yellow-500" />
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
           <img src={news.imageUrl} alt={news.title} className="w-full h-auto" />
        </div>

        {/* AI Summary Box */}
        <div className="bg-yellow-50 dark:bg-gray-800 border-l-4 border-yellow-500 p-6 mb-8 rounded-r-xl shadow-sm">
          <div className="flex items-center space-x-2 mb-3 text-yellow-700 dark:text-yellow-500 font-bold">
            <Sparkles className="w-5 h-5" />
            <span>{t.summary}</span>
          </div>
          {loadingSummary ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-yellow-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-yellow-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
              {summary}
            </p>
          )}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
          {news.content ? (
            <div className="whitespace-pre-line">
              {news.content}
            </div>
          ) : (
            <>
              <p>{news.excerpt}</p>
              <p>
                {language === 'bn' 
                  ? 'ঢাকা সংবাদদাতা: দেশের বর্তমান প্রেক্ষাপটে এই বিষয়টি অত্যন্ত গুরুত্ববহ। সংশ্লিষ্ট মহল থেকে জানানো হয়েছে যে, পরিস্থিতির ওপর নিবিড় পর্যবেক্ষণ রাখা হচ্ছে।'
                  : 'Dhaka Correspondent: In the current context of the country, this issue is very significant. Relevant authorities have informed that the situation is being closely monitored.'}
              </p>
            </>
          )}
        </div>

        <div className="mt-16 border-t dark:border-gray-800 pt-8">
           <h3 className="text-2xl font-bold mb-8 flex items-center dark:text-white">
             <span className="w-2 h-8 bg-yellow-500 mr-3 rounded-full"></span>
             {t.relatedNews}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {MOCK_NEWS.filter(n => n.id !== news.id).slice(0, 2).map(n => (
               <Link to={`/news/${n.id}`} key={`related-${n.id}`} className="flex space-x-4 group">
                 <img src={n.imageUrl} className="w-24 h-24 object-cover rounded-lg flex-shrink-0 group-hover:opacity-80 transition shadow-sm" alt={n.title} />
                 <h4 className="font-bold leading-tight group-hover:text-yellow-600 transition dark:text-gray-300">{n.title}</h4>
               </Link>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
