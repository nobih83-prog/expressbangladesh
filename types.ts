
export interface NewsAttachment {
  name: string;
  url: string; // Base64 or Blob URL
  type: 'pdf' | 'word' | 'other';
  size?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  imageUrl: string;
  additionalImages?: string[];
  attachments?: NewsAttachment[];
  date: string;
  time: string;
  author: string;
}

export interface Category {
  id: string;
  label: string;
  subCategories?: string[];
}

export interface SiteConfig {
  siteTitle: string;
  siteTitleRed: string;
  slogan: string;
  editorName: string;
  address: string;
  mobile: string;
  logoUrl?: string;
  layout: string[]; // Order of sections: ['hero', 'latest', 'prayer', 'popular', 'calendar', 'youtube']
}

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark'
}
