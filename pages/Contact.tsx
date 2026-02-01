
import React from 'react';
import { translations } from '../translations';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContactProps {
  language: 'bn' | 'en';
}

const Contact: React.FC<ContactProps> = ({ language }) => {
  const t = translations[language];
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[60vh]">
       <nav className="text-sm text-gray-500 mb-6 flex space-x-2">
        <Link to="/" className="hover:text-yellow-600">{t.home}</Link>
        <span>/</span>
        <span className="text-yellow-600 font-bold">{t.contact}</span>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-black mb-8 border-b-4 border-yellow-500 pb-2 inline-block">
            {t.contact}
          </h1>
          <div className="space-y-8 mt-4">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">{t.address}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-xl text-green-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">{language === 'bn' ? 'ফোন ও মোবাইল' : 'Phone & Mobile'}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t.mobile}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">{language === 'bn' ? 'ইমেইল' : 'Email'}</h3>
                <p className="text-gray-600 dark:text-gray-400">info@expressbangla.com</p>
                <p className="text-gray-600 dark:text-gray-400">news@expressbangla.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">{language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send us a Message'}</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">{language === 'bn' ? 'আপনার নাম' : 'Your Name'}</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-yellow-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">{language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-yellow-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">{language === 'bn' ? 'বার্তালিখুন' : 'Your Message'}</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-yellow-500 transition"></textarea>
            </div>
            <button className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-yellow-600 transition shadow-lg active:scale-95">
              <Send className="w-5 h-5" />
              <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
