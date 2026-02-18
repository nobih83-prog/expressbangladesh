
import React from 'react';
import { X, ChevronRight, Facebook, Instagram, Twitter, Youtube, Linkedin, Calendar as CalendarIcon } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { translations } from '../translations';
import { SiteConfig } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
  config: SiteConfig;
}

// Sidebar component now accepts config for dynamic site title and slogan
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, language, config }) => {
  const t = translations[language];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-[300px] md:w-[400px] bg-white dark:bg-gray-900 z-[101] transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-8 flex flex-col items-start border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800 transition-colors relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-red-200 dark:hover:bg-gray-700 rounded-full transition text-gray-600 dark:text-gray-300">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-start mt-4">
             {/* Use dynamic branding from config */}
             <h2 className="text-2xl font-black dark:text-white uppercase font-en">{config.siteTitle} <span className="text-red-600">{config.siteTitleRed}</span></h2>
             <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
               {config.slogan}
             </p>
          </div>
        </div>

        <div className="p-4 pb-20">
          <div className="mb-8">
            <Link 
              to="/calendar-2026" 
              onClick={onClose}
              className="flex items-center space-x-3 p-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition shadow-lg"
            >
              <CalendarIcon className="w-6 h-6" />
              <span>{t.calendar2026}</span>
            </Link>
          </div>

          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-6">
              <Link 
                to={cat.id === 'latest' ? '/' : `/category/${cat.id}`} 
                onClick={onClose}
                className="block text-lg font-bold border-b-2 border-red-600 pb-1 mb-3 hover:text-red-700 dark:text-gray-100 transition-colors"
              >
                {language === 'bn' ? cat.label : cat.labelEn}
              </Link>
              {cat.subCategories && (
                <ul className="space-y-3 pl-2">
                  {cat.subCategories.map((sub, idx) => (
                    <li key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-2">
                      <Link 
                        to={`/category/${cat.id}`} 
                        onClick={onClose}
                        className="text-gray-700 dark:text-gray-400 hover:text-red-600 flex items-center justify-between group transition-colors"
                      >
                        <span>{sub}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-8 border-t dark:border-gray-800 pt-6">
            <p className="text-center font-bold mb-4 dark:text-gray-300">{t.followUs}</p>
            <div className="flex justify-center space-x-4">
              <Facebook className="w-5 h-5 text-blue-600 cursor-pointer hover:scale-110 transition" />
              <Instagram className="w-5 h-5 text-pink-600 cursor-pointer hover:scale-110 transition" />
              <Twitter className="w-5 h-5 text-sky-400 cursor-pointer hover:scale-110 transition" />
              <Youtube className="w-5 h-5 text-red-600 cursor-pointer hover:scale-110 transition" />
              <Linkedin className="w-5 h-5 text-blue-700 cursor-pointer hover:scale-110 transition" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
