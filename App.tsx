
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// Component to handle scroll restoration on route change
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bn' ? 'en' : 'bn');
  };

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
        />
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          language={language}
        />
        
        <main className="flex-grow transition-colors duration-500">
          <Routes>
            <Route path="/" element={<Home language={language} onOpenPrayer={() => setIsPrayerModalOpen(true)} />} />
            <Route path="/archive" element={<Archive language={language} />} />
            <Route path="/about" element={<About language={language} />} />
            <Route path="/contact" element={<Contact language={language} />} />
            <Route path="/privacy" element={<Privacy language={language} />} />
            <Route path="/terms" element={<Terms language={language} />} />
            <Route path="/calendar-2026" element={<Calendar2026 language={language} />} />
            <Route path="/news/:id" element={<NewsDetail language={language} />} />
            <Route path="/category/:id" element={<Home language={language} onOpenPrayer={() => setIsPrayerModalOpen(true)} />} />
            <Route path="*" element={<Home language={language} onOpenPrayer={() => setIsPrayerModalOpen(true)} />} />
          </Routes>
        </main>

        <Footer language={language} />

        <PrayerModal 
          isOpen={isPrayerModalOpen} 
          onClose={() => setIsPrayerModalOpen(false)} 
          language={language} 
        />

        <div className="md:hidden fixed bottom-4 right-4 z-40">
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="bg-yellow-500 text-white p-4 rounded-full shadow-2xl hover:bg-yellow-600 transition transform active:scale-95"
           >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
           </button>
        </div>
      </div>
    </Router>
  );
};

export default App;
