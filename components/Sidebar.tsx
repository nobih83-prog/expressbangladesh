
import React from 'react';
import { X, ChevronRight, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, language }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-[300px] md:w-[400px] bg-white dark:bg-gray-900 z-[101] transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-800 bg-yellow-50 dark:bg-gray-800 transition-colors">
          <h2 className="text-xl font-bold dark:text-white">{language === 'bn' ? 'মেনু' : 'Menu'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-yellow-200 dark:hover:bg-gray-700 rounded-full transition text-gray-600 dark:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 pb-20">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-6">
              <Link 
                to={cat.id === 'latest' ? '/' : `/category/${cat.id}`} 
                onClick={onClose}
                className="block text-lg font-bold border-b-2 border-yellow-500 pb-1 mb-3 hover:text-yellow-600 dark:text-gray-100 transition-colors"
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
                        className="text-gray-700 dark:text-gray-400 hover:text-yellow-500 flex items-center justify-between group transition-colors"
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
            <p className="text-center font-bold mb-4 dark:text-gray-300">{language === 'bn' ? 'অনুসরণ করুন' : 'Follow Us'}</p>
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
