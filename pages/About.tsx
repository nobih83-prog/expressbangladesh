
import React from 'react';
import { translations } from '../translations';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface AboutProps {
  language: 'bn' | 'en';
  config: SiteConfig;
}

// About component now accepts config for dynamic address and branding
const About: React.FC<AboutProps> = ({ language, config }) => {
  const t = translations[language];
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <nav className="text-sm text-gray-500 mb-6 flex space-x-2">
        <Link to="/" className="hover:text-yellow-600">{t.home}</Link>
        <span>/</span>
        <span className="text-yellow-600 font-bold">{t.aboutUs}</span>
      </nav>
      <h1 className="text-4xl font-black mb-8 border-b-4 border-yellow-500 pb-2 inline-block">
        {t.aboutUs}
      </h1>
      <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-6">
        <p>
          {language === 'bn' 
            ? `${config.siteTitle} ${config.siteTitleRed} একটি আধুনিক ও গতিশীল অনলাইন নিউজ পোর্টাল। আমরা বস্তুনিষ্ঠ সংবাদ এবং সত্যের সন্ধানে অবিচল। আমাদের লক্ষ্য হলো পাঠকদের কাছে সঠিক সময়ে সঠিক তথ্য পৌঁছে দেওয়া।` 
            : `${config.siteTitle} ${config.siteTitleRed} is a modern and dynamic online news portal. We are committed to objective journalism and finding the truth. Our goal is to deliver accurate information to readers at the right time.`}
        </p>
        <p>
          {language === 'bn' 
            ? `${config.address} থেকে আমাদের প্রধান কার্যক্রম পরিচালিত হয়। শিক্ষা, রাজনীতি, জাতীয় ও আন্তর্জাতিক সব খবরের বিশ্বস্ত ঠিকানা ${config.siteTitle} ${config.siteTitleRed}।` 
            : `Our main operations are conducted from ${config.address}. ${config.siteTitle} ${config.siteTitleRed} is the trusted address for Education, Politics, National, and International news.`}
        </p>
      </div>
    </div>
  );
};

export default About;
