
import React from 'react';
import { translations } from '../translations';
import { Link } from 'react-router-dom';

interface PrivacyProps {
  language: 'bn' | 'en';
}

const Privacy: React.FC<PrivacyProps> = ({ language }) => {
  const t = translations[language];
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <nav className="text-sm text-gray-500 mb-6 flex space-x-2">
        <Link to="/" className="hover:text-yellow-600">{t.home}</Link>
        <span>/</span>
        <span className="text-yellow-600 font-bold">{t.privacyPolicy}</span>
      </nav>
      <h1 className="text-4xl font-black mb-8 border-b-4 border-yellow-500 pb-2 inline-block">
        {t.privacyPolicy}
      </h1>
      <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-6">
        <p>
          {language === 'bn' 
            ? 'আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। এক্সপ্রেস বাংলাদেশ আপনার ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।' 
            : 'Your privacy is very important to us. Express Bangladesh is committed to ensuring the protection of your personal information.'}
        </p>
        <h2 className="text-2xl font-bold">{language === 'bn' ? 'তথ্য সংগ্রহ' : 'Information Collection'}</h2>
        <p>
          {language === 'bn' 
            ? 'আমরা সরাসরি কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না যতক্ষণ না আপনি আমাদের কোনো ফর্মের মাধ্যমে বার্তা পাঠান। আমরা শুধুমাত্র সাইটের কার্যকারিতা বৃদ্ধির জন্য কুকিজ ব্যবহার করি।' 
            : 'We do not directly collect any personal information unless you send us a message through one of our forms. We only use cookies to improve the site functionality.'}
        </p>
      </div>
    </div>
  );
};

export default Privacy;
