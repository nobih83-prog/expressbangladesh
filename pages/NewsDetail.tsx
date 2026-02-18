import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsItem } from '../types';
import { Clock, User, Share2, Facebook, Twitter, MessageCircle, Sparkles, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

interface NewsDetailProps {
  language: 'bn' | 'en';
  newsList: NewsItem[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ language, newsList }) => {
  const { id } = useParams<{ id: string }>();
  const news = newsList.find(n => n.id === id);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (!news) return;
    
    // Clear summary when news changes
    setSummary(null);
    
    const fetchSummary = async () => {
      setLoadingSummary(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Summary this news in ${language === 'bn' ? 'Bengali' : 'English'}: ${news.excerpt + " " + news.title}`,
          config: {
            systemInstruction: `You are a professional journalist. Provide a concise summary in ${language === 'bn' ? 'Bengali' : 'English'}. Maximum 3-4 sentences.`
          }
        });
        setSummary(response.text || "No summary available.");
      } catch (error) {
        console.error("Gemini Error:", error);
        setSummary(null);
      }
      setLoadingSummary(false);
    };
    fetchSummary();
  }, [id, news, language]);

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold dark:text-white">সংবাদটি পাওয়া যায়নি</h2>
        <Link to="/" className="text-red-600 mt-4 inline-block font-bold">হোমে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-red-600 transition-colors">{t.home}</Link>
          <span className="text-gray-300">/</span>
          <Link to={`/category/${news.category}`} className="text-red-600 font-bold hover:underline">{news.category}</Link>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-8 text-gray-900 dark:text-white">
          {news.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-100 dark:border-gray-800 py-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-200">{news.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-red-600" />
              <span>{t.published}: {news.date} | {news.time}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button className="p-2.5 bg-[#1877F2] text-white rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95"><Facebook className="w-5 h-5"/></button>
             <button className="p-2.5 bg-[#1DA1F2] text-white rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95"><Twitter className="w-5 h-5"/></button>
             <button className="p-2.5 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95"><MessageCircle className="w-5 h-5"/></button>
             <button className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-md active:scale-95"><Share2 className="w-5 h-5"/></button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative rounded-[2rem] overflow-hidden mb-12 shadow-2xl border border-gray-100 dark:border-gray-800">
           <img src={news.imageUrl} alt={news.title} className="w-full h-auto object-cover min-h-[300px]" />
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
              <p className="text-white/80 text-xs font-bold italic">চিত্র: {news.title}</p>
           </div>
        </div>

        {/* AI Summary Section */}
        {(loadingSummary || summary) && (
          <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-900 border-l-4 border-red-600 p-8 mb-12 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex items-center space-x-2 mb-4 text-red-600 font-black uppercase tracking-widest text-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{t.summary}</span>
            </div>
            {loadingSummary ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-red-100 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-red-100 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-red-100 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            ) : (
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-bold italic text-lg">
                {summary}
              </p>
            )}
          </div>
        )}

        {/* Main News Content */}
        <div className="max-w-none text-gray-800 dark:text-gray-300 leading-relaxed space-y-8">
          <div 
            className="rich-content font-bn"
            dangerouslySetInnerHTML={{ __html: news.content || `<p>${news.excerpt}</p>` }} 
          />
        </div>

        {/* Additional Gallery */}
        {news.additionalImages && news.additionalImages.length > 0 && (
          <div className="mt-16 pt-12 border-t dark:border-gray-800">
            <h3 className="text-2xl font-black mb-10 flex items-center dark:text-white uppercase tracking-tight">
              <ImageIcon className="w-7 h-7 mr-4 text-red-600" />
              {language === 'bn' ? 'সংবাদের আরও ছবি' : 'More Images'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {news.additionalImages.map((img, idx) => (
                 <div key={idx} className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 group">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover aspect-video transition-transform duration-700 group-hover:scale-110" />
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Related News Section */}
        <div className="mt-20 border-t-2 border-gray-100 dark:border-gray-800 pt-12">
           <h3 className="text-2xl font-black mb-10 flex items-center dark:text-white uppercase">
             <span className="w-3 h-10 bg-red-600 mr-4 rounded-full"></span>
             {t.relatedNews}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {newsList
               .filter(n => n.id !== news.id && n.category === news.category)
               .slice(0, 4)
               .map(n => (
               <Link to={`/news/${n.id}`} key={`related-${n.id}`} className="flex space-x-5 group bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-md">
                    <img src={n.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={n.title} />
                 </div>
                 <div className="flex flex-col justify-center">
                    <h4 className="font-black text-lg leading-tight group-hover:text-red-600 transition-colors dark:text-gray-200 line-clamp-3">{n.title}</h4>
                    <div className="flex items-center text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
                       <Clock className="w-3 h-3 mr-1 text-red-600" />
                       {n.date}
                    </div>
                 </div>
               </Link>
             ))}
           </div>
        </div>

        {/* Back Button */}
        <div className="mt-16 text-center">
           <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-gray-900 dark:bg-white dark:text-black text-white px-8 py-4 rounded-2xl font-black hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-xl active:scale-95"
           >
              <ChevronLeft className="w-5 h-5" />
              <span>{language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Back to Home'}</span>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;