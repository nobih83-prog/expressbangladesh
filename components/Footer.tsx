
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, MapPin, Phone, ChevronRight, Lock } from 'lucide-react';
import { translations } from '../translations';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface FooterProps {
  language: 'bn' | 'en';
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ language, config }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#0f1115] text-white pt-16 pb-8 border-t-8 border-red-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          <div className="space-y-6">
            <Link to="/">
              <div className="flex flex-col items-start">
                 <h1 className="text-2xl font-black uppercase tracking-tighter text-white font-en">
                    {config.siteTitle} <span className="text-red-600">{config.siteTitleRed}</span>
                 </h1>
                 <p className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase -mt-1">
                   {config.slogan}
                 </p>
              </div>
            </Link>
            <div>
              <h4 className="text-gray-500 text-xs mb-3 uppercase tracking-widest font-bold">{t.editor}:</h4>
              <p className="text-xl font-bold mb-2 text-white">{config.editorName}</p>
              <div className="flex items-start space-x-2 text-gray-400 text-sm mb-4">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-red-600" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="text-gray-300">{config.mobile}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-red-600 text-sm mb-6 uppercase tracking-widest font-black border-l-4 border-red-600 pl-3">সংবাদ বিভাগ</h4>
            <ul className="grid grid-cols-1 gap-y-3">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link to={cat.id === 'latest' ? '/' : `/category/${cat.id}`} className="text-gray-400 hover:text-white flex items-center text-sm font-bold">
                    <ChevronRight className="w-3 h-3 mr-2 text-red-600" />
                    {language === 'bn' ? cat.label : cat.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-red-600 text-sm mb-6 uppercase tracking-widest font-black border-l-4 border-red-600 pl-3">প্রয়োজনীয় লিঙ্ক</h4>
            <ul className="grid grid-cols-1 gap-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm font-bold flex items-center"><ChevronRight className="w-3 h-3 mr-2 text-red-600" /> {t.aboutUs}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm font-bold flex items-center"><ChevronRight className="w-3 h-3 mr-2 text-red-600" /> {t.contact}</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-red-500 text-xs font-black uppercase tracking-widest mt-2 flex items-center"><Lock className="w-3 h-3 mr-2" /> {t.adminPanel}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-red-600 text-sm mb-6 uppercase tracking-widest font-black border-l-4 border-red-600 pl-3">অনুসরণ করুন</h4>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-red-600 transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-red-600 transition"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="pt-8 text-center text-gray-500 text-sm">{t.copyright}</div>
      </div>
    </footer>
  );
};

export default Footer;
