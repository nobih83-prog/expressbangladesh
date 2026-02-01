
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { translations } from '../translations';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';

interface FooterProps {
  language: 'bn' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#0f1115] text-white pt-16 pb-8 border-t-8 border-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          
          {/* Column 1: Editor & About */}
          <div className="space-y-6">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-black uppercase tracking-tight text-white font-en">
                Express <span className="text-yellow-500">Bangladesh</span>
              </h1>
            </Link>
            <div>
              <h4 className="text-gray-500 text-xs mb-3 uppercase tracking-widest font-bold">{t.editor}:</h4>
              <p className="text-xl font-bold mb-2 text-white">{t.editorName}</p>
              <div className="flex items-start space-x-2 text-gray-400 text-sm leading-relaxed mb-4">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-yellow-500" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-300">{t.mobile}</span>
              </div>
            </div>
          </div>

          {/* Column 2: News Categories */}
          <div>
            <h4 className="text-yellow-500 text-sm mb-6 uppercase tracking-widest font-black border-l-4 border-yellow-500 pl-3">
              {language === 'bn' ? 'সংবাদ বিভাগ' : 'Categories'}
            </h4>
            <ul className="grid grid-cols-1 gap-y-3">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link 
                    to={cat.id === 'latest' ? '/' : `/category/${cat.id}`} 
                    className="text-gray-400 hover:text-white flex items-center group transition-all text-sm font-bold"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {language === 'bn' ? cat.label : cat.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-yellow-500 text-sm mb-6 uppercase tracking-widest font-black border-l-4 border-yellow-500 pl-3">
              {language === 'bn' ? 'প্রয়োজনীয় লিঙ্ক' : 'Useful Links'}
            </h4>
            <ul className="grid grid-cols-1 gap-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white flex items-center group transition-all text-sm font-bold">
                  <ChevronRight className="w-3 h-3 mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white flex items-center group transition-all text-sm font-bold">
                  <ChevronRight className="w-3 h-3 mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link to="/archive" className="text-gray-400 hover:text-white flex items-center group transition-all text-sm font-bold">
                  <ChevronRight className="w-3 h-3 mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.archive}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white flex items-center group transition-all text-sm font-bold">
                  <ChevronRight className="w-3 h-3 mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white flex items-center group transition-all text-sm font-bold">
                  <ChevronRight className="w-3 h-3 mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Use'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h4 className="text-yellow-500 text-sm mb-6 uppercase tracking-widest font-black border-l-4 border-yellow-500 pl-3">
              {t.followUs}
            </h4>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-blue-600 transition-all hover:-translate-y-1"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-sky-500 transition-all hover:-translate-y-1"><Twitter className="w-5 h-5" /></a>
              <a href="https://www.youtube.com/@Channel24Ghontav" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-xl hover:bg-red-600 transition-all hover:-translate-y-1"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-pink-600 transition-all hover:-translate-y-1"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-blue-700 transition-all hover:-translate-y-1"><Linkedin className="w-5 h-5" /></a>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
              <p className="text-xs text-gray-400 mb-3">{language === 'bn' ? 'সব খবরের আপডেট ইমেইলে পেতে সাবস্ক্রাইব করুন' : 'Subscribe for daily news updates'}</p>
              <div className="flex">
                <input type="email" placeholder="Email" className="bg-gray-900 border-none text-xs rounded-l-lg px-3 py-2 w-full outline-none focus:ring-1 focus:ring-yellow-500" />
                <button className="bg-yellow-500 text-black px-4 py-2 rounded-r-lg text-xs font-bold hover:bg-yellow-600 transition">Go</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
            {t.copyright}
          </p>
          <div className="flex items-center space-x-6 text-xs text-gray-500 uppercase tracking-widest font-bold">
            <Link to="/about" className="hover:text-yellow-500 transition">{t.aboutUs}</Link>
            <Link to="/contact" className="hover:text-yellow-500 transition">{t.contact}</Link>
            <Link to="/privacy" className="hover:text-yellow-500 transition">{t.privacyPolicy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
