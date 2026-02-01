
import React, { useState } from 'react';
import { Search, Calendar, Moon, Sun, Menu, ChevronRight, Globe } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'bn' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isDarkMode, toggleDarkMode, language, onLanguageToggle }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="hidden md:block bg-[#E8F0FE] dark:bg-gray-800 py-2 text-center overflow-hidden border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-4">
           <img 
            src="https://picsum.photos/seed/ad/800/90" 
            alt="Advertisement" 
            className="h-16 w-full object-cover rounded shadow-sm opacity-90 dark:opacity-75"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
             <div className="absolute -top-3 -left-2 rotate-12">
               <svg className="w-8 h-8 text-yellow-500 fill-current" viewBox="0 0 24 24">
                 <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
               </svg>
             </div>
             <div className="flex flex-col items-center">
               <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase font-en transition-colors">
                 Express <span className="text-yellow-500">Bangladesh</span>
               </h1>
               <p className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-widest mt-[-4px] uppercase transition-colors">
                 {language === 'bn' ? 'সত্যের পথে অবিচল' : 'Committed to Truth'}
               </p>
             </div>
          </div>
        </Link>

        <div className="flex items-center space-x-3 md:space-x-6 text-gray-600 dark:text-gray-300">
          <Link to="/archive" title={language === 'bn' ? "আর্কাইভ" : "Archive"} className={isActive('/archive') ? 'text-yellow-500' : 'hover:text-yellow-500 transition-colors'}>
            <Calendar className="w-5 h-5 cursor-pointer" />
          </Link>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} title={language === 'bn' ? "খুঁজুন" : "Search"} className="hover:text-yellow-500 transition-colors focus:outline-none">
            <Search className="w-5 h-5 cursor-pointer" />
          </button>
          
          {/* Dark Mode Toggle Button */}
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-yellow-400 transition-all duration-300 hover:scale-110 active:scale-90"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5 fill-current" /> : <Moon className="w-5 h-5 fill-current" />}
          </button>

          <button onClick={onMenuToggle} className="md:hidden hover:text-yellow-500 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="border-t border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar bg-white dark:bg-gray-900 transition-colors">
        <div className="container mx-auto flex items-center justify-between px-4">
          <ul className="flex items-center space-x-6 py-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const path = cat.id === 'latest' ? '/' : `/category/${cat.id}`;
              const active = isActive(path);
              return (
                <li key={cat.id} className="relative group">
                  <Link 
                    to={path}
                    className={`text-sm md:text-base font-bold whitespace-nowrap pb-1 border-b-2 transition-all duration-200 ${active ? 'border-red-600 text-red-600' : 'border-transparent hover:border-yellow-500 text-gray-700 dark:text-gray-300'}`}
                  >
                    {language === 'bn' ? cat.label : cat.labelEn}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden md:flex items-center space-x-4 ml-4 py-2">
            <button 
              onClick={onLanguageToggle}
              className={`flex items-center space-x-1 border rounded px-3 py-1 text-sm font-bold transition shadow-sm ${language === 'en' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
            <button onClick={onMenuToggle} className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">
               <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 animate-in slide-in-from-top duration-300 shadow-2xl">
          <div className="container mx-auto flex items-center">
            <input 
              type="text" 
              placeholder={language === 'bn' ? "খুঁজুন..." : "Search news..."} 
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-l-md px-4 py-3 outline-none focus:ring-1 focus:ring-yellow-500 border-none transition-all"
              autoFocus
            />
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-r-md hover:bg-yellow-600 transition">
               <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
