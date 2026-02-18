
import React, { useState } from 'react';
import { Search, Calendar, Moon, Sun, Menu, ChevronRight, Globe } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { SiteConfig } from '../types';

interface HeaderProps {
  onMenuToggle: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'bn' | 'en';
  onLanguageToggle: () => void;
  config: SiteConfig;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isDarkMode, toggleDarkMode, language, onLanguageToggle, config }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <div className="flex flex-col items-start">
             <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase font-en transition-colors leading-none">
               {config.siteTitle} <span className="text-red-600">{config.siteTitleRed}</span>
             </h1>
             <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.3em] uppercase mt-1">
               {config.slogan}
             </p>
          </div>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-4 text-gray-600 dark:text-gray-300">
          <Link to="/calendar-2026" className={`p-2 hidden xs:block ${isActive('/calendar-2026') ? 'text-red-600' : 'hover:text-red-600 transition-colors'}`}>
            <Calendar className="w-5 h-5" />
          </Link>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:text-red-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-yellow-400">
            {isDarkMode ? <Sun className="w-5 h-5 fill-current" /> : <Moon className="w-5 h-5 fill-current" />}
          </button>

          <button onClick={onMenuToggle} className="p-2 md:hidden hover:text-red-600 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="border-t border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar bg-white dark:bg-gray-900">
        <div className="container mx-auto flex items-center justify-between px-3 sm:px-4">
          <ul className="flex items-center space-x-4 sm:space-x-6 py-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const path = cat.id === 'latest' ? '/' : `/category/${cat.id}`;
              return (
                <li key={cat.id}>
                  <Link 
                    to={path}
                    className={`text-[13px] sm:text-base font-bold whitespace-nowrap pb-1 border-b-2 transition-all ${isActive(path) ? 'border-red-600 text-red-600' : 'border-transparent hover:border-red-600 text-gray-700 dark:text-gray-300'}`}
                  >
                    {language === 'bn' ? cat.label : cat.labelEn}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden md:flex items-center space-x-4 ml-4 py-2">
            <button onClick={onLanguageToggle} className={`flex items-center space-x-1 border rounded-lg px-3 py-1.5 text-sm font-bold transition ${language === 'en' ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800'}`}>
              <Globe className="w-4 h-4" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3 sm:p-4 shadow-2xl">
          <div className="container mx-auto flex items-center">
            <input type="text" placeholder="Search..." className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-l-xl px-4 py-3 outline-none" autoFocus />
            <button className="bg-red-600 text-white px-5 sm:px-6 py-3 rounded-r-xl"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
