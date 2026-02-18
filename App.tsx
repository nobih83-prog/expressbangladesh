
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Archive from './pages/Archive';
import NewsDetail from './pages/NewsDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Calendar2026 from './pages/Calendar2026';
import PrayerModal from './components/PrayerModal';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { MOCK_NEWS } from './constants';
import { NewsItem, SiteConfig } from './types';
import { getNewsFromDB, saveNewsToDB, getConfigFromDB, saveConfigToDB } from './services/db';

const DEFAULT_CONFIG: SiteConfig = {
  siteTitle: 'Express',
  siteTitleRed: 'Bangladesh',
  slogan: 'সত্যের পথে অবিচল',
  editorName: 'নবী হোসেন গাজী',
  address: 'ইসিবি, ঢাকা সেনানিবাস, ঢাকা-১২১৩',
  mobile: '০১৭১৮৯৫২৮৫২',
  layout: ['hero', 'latest', 'prayer', 'popular', 'calendar', 'youtube']
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppData = async () => {
      const authStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(authStatus);

      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }

      try {
        // Load Config
        const storedConfig = await getConfigFromDB();
        if (storedConfig) setSiteConfig(storedConfig);

        // Load News
        const storedNews = await getNewsFromDB();
        const hasInitialized = localStorage.getItem('express_db_initialized') === 'true';
        
        if (hasInitialized) {
          setNewsData(storedNews || []);
        } else if (storedNews && storedNews.length > 0) {
          setNewsData(storedNews);
          localStorage.setItem('express_db_initialized', 'true');
        } else {
          setNewsData(MOCK_NEWS);
          await saveNewsToDB(MOCK_NEWS);
        }
      } catch (err) {
        console.error("DB Load Error:", err);
        setNewsData(MOCK_NEWS);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return nextMode;
    });
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'bn' ? 'en' : 'bn');

  const updateNews = async (updatedList: NewsItem[]) => {
    setNewsData(updatedList);
    await saveNewsToDB(updatedList);
  };

  const updateConfig = async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    await saveConfigToDB(newConfig);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className={`flex flex-col min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-gray-900' : 'bg-[#F8F9FA]'} ${language === 'en' ? 'font-en' : 'font-bn'}`}>
        <Header 
          onMenuToggle={() => setIsSidebarOpen(true)} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
          onLanguageToggle={toggleLanguage}
          config={siteConfig}
        />
        
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} language={language} config={siteConfig} />
        
        <main className="flex-grow transition-colors duration-500">
          <Routes>
            <Route path="/" element={<Home language={language} newsList={newsData} onOpenPrayer={() => setIsPrayerModalOpen(true)} config={siteConfig} />} />
            <Route path="/archive" element={<Archive language={language} newsList={newsData} />} />
            <Route path="/about" element={<About language={language} config={siteConfig} />} />
            <Route path="/contact" element={<Contact language={language} config={siteConfig} />} />
            <Route path="/privacy" element={<Privacy language={language} />} />
            <Route path="/terms" element={<Terms language={language} />} />
            <Route path="/calendar-2026" element={<Calendar2026 language={language} />} />
            <Route path="/news/:id" element={<NewsDetail language={language} newsList={newsData} />} />
            <Route path="/category/:id" element={<Home language={language} newsList={newsData} onOpenPrayer={() => setIsPrayerModalOpen(true)} config={siteConfig} />} />
            
            <Route path="/login" element={!isAuthenticated ? <Login language={language} onLogin={(s) => { setIsAuthenticated(s); localStorage.setItem('isLoggedIn', s.toString()); }} /> : <Navigate to="/admin" />} />
            <Route path="/admin" element={isAuthenticated ? <AdminDashboard language={language} newsList={newsData} onUpdateNews={updateNews} onLogout={() => { setIsAuthenticated(false); localStorage.removeItem('isLoggedIn'); }} config={siteConfig} onUpdateConfig={updateConfig} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Home language={language} newsList={newsData} onOpenPrayer={() => setIsPrayerModalOpen(true)} config={siteConfig} />} />
          </Routes>
        </main>

        <Footer language={language} config={siteConfig} />
        <PrayerModal isOpen={isPrayerModalOpen} onClose={() => setIsPrayerModalOpen(false)} language={language} />
      </div>
    </Router>
  );
};

export default App;
