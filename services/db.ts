
import { NewsItem, SiteConfig } from '../types';

const DB_NAME = 'ExpressBangladeshDB_v2';
const DB_VERSION = 2; // Incremented version
const NEWS_STORE = 'news';
const CONFIG_STORE = 'config';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(NEWS_STORE)) {
        db.createObjectStore(NEWS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CONFIG_STORE)) {
        db.createObjectStore(CONFIG_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const saveNewsToDB = async (newsList: NewsItem[]): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NEWS_STORE, 'readwrite');
    const store = transaction.objectStore(NEWS_STORE);
    store.clear().onsuccess = () => {
      newsList.forEach(news => store.put(news));
    };
    transaction.oncomplete = () => {
      localStorage.setItem('express_db_initialized', 'true');
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getNewsFromDB = async (): Promise<NewsItem[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NEWS_STORE, 'readonly');
    const store = transaction.objectStore(NEWS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveConfigToDB = async (config: SiteConfig): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CONFIG_STORE, 'readwrite');
    const store = transaction.objectStore(CONFIG_STORE);
    store.put({ ...config, id: 'main_config' });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getConfigFromDB = async (): Promise<SiteConfig | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CONFIG_STORE, 'readonly');
    const store = transaction.objectStore(CONFIG_STORE);
    const request = store.get('main_config');
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};
