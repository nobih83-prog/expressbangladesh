
import React from 'react';
import { translations } from '../translations';
import { Link } from 'react-router-dom';

interface TermsProps {
  language: 'bn' | 'en';
}

const Terms: React.FC<TermsProps> = ({ language }) => {
  const t = translations[language];
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <nav className="text-sm text-gray-500 mb-6 flex space-x-2">
        <Link to="/" className="hover:text-yellow-600">{t.home}</Link>
        <span>/</span>
        <span className="text-yellow-600 font-bold">{language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Use'}</span>
      </nav>
      <h1 className="text-4xl font-black mb-8 border-b-4 border-yellow-500 pb-2 inline-block">
        {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Use'}
      </h1>
      <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-6">
        <p>
          {language === 'bn' 
            ? 'এক্সপ্রেস বাংলাদেশ ওয়েবসাইটটি ব্যবহারের ক্ষেত্রে আপনাকে নিম্নোক্ত শর্তাবলী মেনে চলতে হবে।' 
            : 'In using the Express Bangladesh website, you must comply with the following terms and conditions.'}
        </p>
        <h2 className="text-2xl font-bold">{language === 'bn' ? 'কন্টেন্ট কপিরাইট' : 'Content Copyright'}</h2>
        <p>
          {language === 'bn' 
            ? 'এই সাইটের সকল সংবাদ, ছবি এবং ভিডিও এক্সপ্রেস বাংলাদেশের সম্পত্তি। অনুমতি ব্যতীত কোনো কন্টেন্ট কপি করা বা অন্য কোথাও প্রকাশ করা দণ্ডনীয় অপরাধ।' 
            : 'All news, photos, and videos on this site are the property of Express Bangladesh. Copying or publishing any content elsewhere without permission is a punishable offense.'}
        </p>
      </div>
    </div>
  );
};

export default Terms;
