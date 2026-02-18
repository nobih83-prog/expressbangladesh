
import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { translations } from '../translations';

interface LoginProps {
  language: 'bn' | 'en';
  onLogin: (status: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ language, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock credentials
    if (username === 'admin' && password === 'admin123') {
      onLogin(true);
    } else {
      setError(language === 'bn' ? 'ইউজারনেম বা পাসওয়ার্ড ভুল!' : 'Invalid username or password!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black dark:text-white uppercase font-en">Express <span className="text-red-600">Bangladesh</span></h1>
          <p className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest">{language === 'bn' ? 'অ্যাডমিন প্যানেল লোগিন' : 'Admin Panel Login'}</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center space-x-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 p-3 rounded-xl text-sm font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              {language === 'bn' ? 'ইউজারনেম' : 'Username'}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-red-600 outline-none transition dark:text-white"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-red-600 outline-none transition dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <LogIn className="w-5 h-5" />
            <span>{language === 'bn' ? 'প্রবেশ করুন' : 'Login'}</span>
          </button>
        </form>
        
        <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
           {language === 'bn' ? 'সুরক্ষিত ড্যাশবোর্ড' : 'Secured Dashboard Access'}
        </p>
      </div>
    </div>
  );
};

export default Login;
