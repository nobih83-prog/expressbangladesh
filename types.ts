
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  imageUrl: string;
  date: string;
  time: string;
  author: string;
}

export interface Category {
  id: string;
  label: string;
  subCategories?: string[];
}

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark'
}
