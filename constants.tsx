
import { Category, NewsItem } from './types';

export interface CategoryWithLang extends Category {
  labelEn: string;
}

export const CATEGORIES: CategoryWithLang[] = [
  { id: 'latest', label: 'সর্বশেষ', labelEn: 'Latest' },
  { id: 'districts', label: 'সারাদেশ', labelEn: 'Districts' },
  { id: 'education', label: 'শিক্ষাঙ্গন', labelEn: 'Education', subCategories: ['স্কুল', 'কলেজ', 'বিশ্ববিদ্যালয়', 'মাদ্রাসা'] },
  { id: 'higher-edu', label: 'উচ্চশিক্ষা', labelEn: 'Higher Edu', subCategories: ['বেসরকারি বিশ্ববিদ্যালয়', 'জাতীয় বিশ্ববিদ্যালয়', 'বিদেশে শিক্ষা'] },
  { id: 'admin', label: 'শিক্ষা প্রশাসন', labelEn: 'Admin' },
  { id: 'national', label: 'জাতীয়', labelEn: 'National' },
  { id: 'politics', label: 'রাজনীতি', labelEn: 'Politics' },
  { id: 'sports', label: 'খেলাধুলা', labelEn: 'Sports', subCategories: ['ক্রিকেট', 'ফুটবল'] },
  { id: 'entertainment', label: 'বিনোদন', labelEn: 'Entertainment' },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'জাতীয় বিশ্ববিদ্যালয়ের অধীনে স্নাতক প্রথম বর্ষের ভর্তি পরীক্ষা শুরু',
    excerpt: 'সারাদেশের সকল কেন্দ্রে একযোগে এই পরীক্ষা অনুষ্ঠিত হচ্ছে। পরীক্ষার্থীদের উপচে পড়া ভিড় লক্ষ্য করা গেছে।',
    category: 'উচ্চশিক্ষা',
    imageUrl: 'https://picsum.photos/seed/nu1/800/450',
    date: '০২ ফেব্রুয়ারি ২০২৫',
    time: '১০:৩০ AM',
    author: 'নিজস্ব প্রতিবেদক'
  },
  {
    id: '2',
    title: 'রেজাউলের কবর জিয়ারত, মেয়েকে কোলে নিয়ে অঝোরে কাঁদলেন জামায়াত আমির',
    excerpt: 'মরহুমের পরিবারের সাথে সাক্ষাৎ করতে গিয়ে তিনি আবেগপ্রবণ হয়ে পড়েন এবং দোয়া কামনা করেন।',
    category: 'রাজনীতি',
    imageUrl: 'https://picsum.photos/seed/politics1/800/450',
    date: '০১ ফেব্রুয়ারি ২০২৫',
    time: '০২:২৮ PM',
    author: 'স্টাফ রিপোর্টার'
  },
  {
    id: '3',
    title: 'এবার ফেসবুক পেজ হারানোর শঙ্কায় ১১ দলীয় জোটের আরেক শীর্ষ নেতা',
    excerpt: 'সামাজিক যোগাযোগ মাধ্যমে ক্রমবর্ধমান সাইবার হামলার শিকার হচ্ছেন রাজনৈতিক নেতারা।',
    category: 'জাতীয়',
    imageUrl: 'https://picsum.photos/seed/fb1/800/450',
    date: '০১ ফেব্রুয়ারি ২০২৫',
    time: '০২:২২ PM',
    author: 'নিজস্ব প্রতিবেদক'
  },
  {
    id: '4',
    title: 'তাপমাত্রা আবার কমার পূর্বাভাস, থাকবে কত দিন',
    excerpt: 'আবহাওয়া অধিদপ্তর জানিয়েছে মৃদু শৈত্যপ্রবাহ আসতে পারে দেশের উত্তরাঞ্চলে।',
    category: 'জাতীয়',
    imageUrl: 'https://picsum.photos/seed/weather1/800/450',
    date: '০১ ফেব্রুয়ারি ২০২৫',
    time: '০১:১৫ PM',
    author: 'আবহাওয়া ডেস্ক'
  },
  {
    id: '5',
    title: 'বইমেলায় দর্শনার্থীদের উপচে পড়া ভিড়, বিক্রি বেড়েছে কয়েক গুণ',
    excerpt: 'অমর একুশে বইমেলায় আজ ছুটির দিনে পাঠকদের সমাগম ছিল চোখে পড়ার মতো।',
    category: 'বিনোদন',
    imageUrl: 'https://picsum.photos/seed/bookfair/800/450',
    date: '০১ ফেব্রুয়ারি ২০২৫',
    time: '০৮:১০ PM',
    author: 'স্টাফ রিপোর্টার'
  }
];
