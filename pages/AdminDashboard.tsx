import React, { useState, useRef, useEffect } from 'react';
import { NewsItem, SiteConfig, NewsAttachment } from '../types';
import { CATEGORIES } from '../constants';
import { 
  Plus, Edit, Trash2, LogOut, Save, X, Image as ImageIcon, 
  Upload, Layers, Bold, Italic, Heading2, Heading3, List, 
  Eye, Code, RotateCcw, Table as TableIcon, Layout, Settings, 
  ArrowUp, ArrowDown, Type, Globe, MapPin, Phone, ImagePlus,
  Underline, ListOrdered, Link as LinkIcon, FileText, Download, FilePlus, RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  language: 'bn' | 'en';
  newsList: NewsItem[];
  onUpdateNews: (updated: NewsItem[]) => void;
  onLogout: () => void;
  config: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  language, newsList, onUpdateNews, onLogout, config, onUpdateConfig 
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'site'>('news');
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);
  const [tempConfig, setTempConfig] = useState<SiteConfig>(config);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync temp config
  useEffect(() => {
    setTempConfig(config);
  }, [config, activeTab]);

  // Layout Management
  const moveLayout = (idx: number, direction: 'up' | 'down') => {
    const newLayout = [...tempConfig.layout];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newLayout.length) return;
    [newLayout[idx], newLayout[targetIdx]] = [newLayout[targetIdx], newLayout[idx]];
    setTempConfig({ ...tempConfig, layout: newLayout });
  };

  // Editor Commands
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (contentRef.current) contentRef.current.focus();
  };

  const insertTable = () => {
    const rows = prompt(language === 'bn' ? "কয়টি সারি (Rows)?" : "Number of rows?", "3");
    const cols = prompt(language === 'bn' ? "কয়টি কলাম (Columns)?" : "Number of columns?", "2");
    
    if (rows && cols) {
      let tableHtml = '<table class="w-full border-collapse border border-gray-300 my-6"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHtml += '<td class="border border-gray-300 p-3">Cell Content</td>';
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table><p><br></p>';
      execCommand('insertHTML', tableHtml);
    }
  };

  const insertImageAtCursor = (imgUrl: string) => {
    const imgHtml = `<div class="my-8 text-center"><img src="${imgUrl}" class="w-full rounded-2xl shadow-xl mx-auto" alt="Embedded News Image"/><p class="text-xs text-gray-500 mt-2 font-bold italic">${language === 'bn' ? 'ছবির ক্যাপশন লিখুন...' : 'Write image caption...'}</p></div><p><br></p>`;
    execCommand('insertHTML', imgHtml);
  };

  const insertFileAtCursor = (file: NewsAttachment) => {
    const fileHtml = `
      <div contenteditable="false" class="my-6">
        <a href="${file.url}" download="${file.name}" class="file-download-block" title="Download ${file.name}">
          <div class="file-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M9 18h6"/><path d="M9 12h1"/></svg>
          </div>
          <div class="file-info">
            <span class="file-name">${file.name}</span>
            <span class="file-meta">${file.type.toUpperCase()} • ${file.size || 'FILE'} • DOWNLOAD NOW</span>
          </div>
          <div class="ml-2 text-red-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </div>
        </a>
      </div>
      <p><br></p>
    `;
    execCommand('insertHTML', fileHtml);
  };

  const startEditNews = (item: NewsItem) => {
    setEditingItem({ 
      ...item, 
      additionalImages: item.additionalImages || [],
      attachments: item.attachments || []
    });
    setIsEditingNews(true);
    setIsPreviewMode(false);
  };

  const startCreateNews = () => {
    setEditingItem({
      id: Date.now().toString(),
      title: '',
      content: '<p>এখানে বিস্তারিত সংবাদ লিখুন...</p>',
      excerpt: '',
      category: CATEGORIES[0].label,
      imageUrl: '',
      additionalImages: [],
      attachments: [],
      author: language === 'bn' ? 'স্টাফ রিপোর্টার' : 'Staff Reporter',
      date: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: new Date().toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    });
    setIsEditingNews(true);
    setIsPreviewMode(false);
  };

  const handleSaveNews = () => {
    const el = contentRef.current;
    const finalContent = el ? el.innerHTML : (editingItem?.content || '');
    
    if (!editingItem?.title) {
        alert(language === 'bn' ? 'অনুগ্রহ করে একটি শিরোনাম দিন' : 'Please provide a title');
        return;
    }

    if (!editingItem?.imageUrl) {
        alert(language === 'bn' ? 'অনুগ্রহ করে একটি মূল ছবি (Featured Image) যোগ করুন' : 'Please add a Featured Image');
        return;
    }

    const finalItem = { 
      ...editingItem, 
      content: finalContent,
      excerpt: el ? el.innerText.substring(0, 150) + '...' : ''
    } as NewsItem;

    if (newsList.find(n => n.id === finalItem.id)) {
      onUpdateNews(newsList.map(n => n.id === finalItem.id ? finalItem : n));
    } else {
      onUpdateNews([finalItem, ...newsList]);
    }
    setIsEditingNews(false);
    setEditingItem(null);
  };

  // Fixed handleFileUpload to resolve type errors for unknown File/Blob properties
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'gallery' | 'docs') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (target === 'main') {
      const reader = new FileReader();
      reader.onload = () => setEditingItem(prev => ({ ...prev!, imageUrl: reader.result as string }));
      // Use as File to treat as Blob for readAsDataURL
      reader.readAsDataURL(files[0] as File);
    } else if (target === 'gallery') {
      // Cast Array.from result to File[] to ensure properties are accessible
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => setEditingItem(prev => ({ 
          ...prev!, 
          additionalImages: [...(prev!.additionalImages || []), reader.result as string] 
        }));
        reader.readAsDataURL(file);
      });
    } else if (target === 'docs') {
      // Cast Array.from result to File[] to ensure properties are accessible
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const type: 'pdf' | 'word' | 'other' = file.type.includes('pdf') ? 'pdf' : (file.type.includes('word') || file.type.includes('officedocument') ? 'word' : 'other');
          const size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
          const newDoc: NewsAttachment = {
            name: file.name,
            url: reader.result as string,
            type,
            size
          };
          setEditingItem(prev => ({
            ...prev!,
            attachments: [...(prev!.attachments || []), newDoc]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = ''; 
  };

  const handlePublishConfig = () => {
    onUpdateConfig(tempConfig);
    alert(language === 'bn' ? 'কনফিগারেশন সফলভাবে আপডেট হয়েছে!' : 'Configuration updated successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Express <span className="text-red-600">Admin</span></h1>
          <div className="flex mt-3 space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-max">
            <button 
              onClick={() => setActiveTab('news')}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'news' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              News Manager
            </button>
            <button 
              onClick={() => setActiveTab('site')}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'site' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Site Design
            </button>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-red-600 hover:text-white transition font-black active:scale-95">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {activeTab === 'news' ? (
        isEditingNews ? (
          <div className="animate-in slide-in-from-bottom duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between mb-8 items-center border-b dark:border-gray-700 pb-6">
                <div>
                  <h2 className="text-2xl font-black dark:text-white">{editingItem?.title ? 'সংবাদ সম্পাদনা' : 'নতুন সংবাদ তৈরি'}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Full News Management Active</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`p-3 rounded-xl transition ${isPreviewMode ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
                    title="Toggle Preview"
                  >
                    {isPreviewMode ? <Code className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button onClick={() => { setIsEditingNews(false); setEditingItem(null); }} className="p-3 text-gray-400 hover:text-red-600 transition"><X className="w-6 h-6"/></button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">News Title</label>
                    <input 
                      type="text" 
                      value={editingItem?.title}
                      onChange={e => setEditingItem({...editingItem!, title: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl px-5 py-4 text-2xl font-black outline-none border-none dark:text-white focus:ring-2 focus:ring-red-600 transition"
                      placeholder="শিরোনাম এখানে লিখুন..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">News Body (Rich HTML Support)</label>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-1 items-center sticky top-0 z-10">
                        <button onClick={() => execCommand('bold')} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition" title="Bold"><Bold className="w-4 h-4"/></button>
                        <button onClick={() => execCommand('italic')} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition" title="Italic"><Italic className="w-4 h-4"/></button>
                        <button onClick={() => execCommand('underline')} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition" title="Underline"><Underline className="w-4 h-4"/></button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                        <button onClick={() => execCommand('formatBlock', 'h2')} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition font-black" title="Heading 2">H2</button>
                        <button onClick={() => execCommand('formatBlock', 'h3')} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition font-black" title="Heading 3">H3</button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                        <button onClick={() => execCommand('insertUnorderedList')} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition" title="Bullet List"><List className="w-4 h-4"/></button>
                        <button onClick={insertTable} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition" title="Insert Table"><TableIcon className="w-4 h-4"/></button>
                        <button onClick={() => {
                          const url = prompt("Enter Link URL", "https://");
                          if(url) execCommand('createLink', url);
                        }} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition" title="Insert Link"><LinkIcon className="w-4 h-4"/></button>
                        <div className="ml-auto">
                           <button onClick={() => execCommand('undo')} className="p-2.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg dark:text-gray-200 transition" title="Undo"><RotateCcw className="w-4 h-4"/></button>
                        </div>
                      </div>

                      <div 
                        ref={contentRef}
                        contentEditable={!isPreviewMode}
                        dangerouslySetInnerHTML={{ __html: editingItem?.content || '<p><br/></p>' }}
                        className={`min-h-[500px] p-8 sm:p-12 outline-none dark:text-gray-100 rich-content transition-all ${isPreviewMode ? 'bg-gray-50 dark:bg-gray-800/20' : 'bg-white dark:bg-gray-900 focus:shadow-inner'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="space-y-3">
                    <button onClick={handleSaveNews} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-600/20 hover:bg-red-700 transition flex items-center justify-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>সংরক্ষণ করুন</span>
                    </button>
                    <button onClick={() => { setIsEditingNews(false); setEditingItem(null); }} className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 py-4 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-gray-700 transition">বাতিল</button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Featured Image</label>
                      <button onClick={() => mainFileInputRef.current?.click()} className="text-red-600 p-1 hover:bg-red-50 rounded-lg transition" title="Replace Principal Image"><RefreshCw className="w-4 h-4"/></button>
                    </div>
                    <div 
                      onClick={() => mainFileInputRef.current?.click()}
                      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-red-600 transition-all bg-white dark:bg-gray-800 shadow-sm"
                    >
                      {editingItem?.imageUrl ? (
                        <img src={editingItem.imageUrl} className="w-full h-full object-cover hover:opacity-80 transition" alt="Principal" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="text-[10px] font-bold">CLICK TO ADD PRINCIPAL PHOTO</span>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={mainFileInputRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'main')} />
                    <p className="text-[9px] text-gray-400 mt-2 italic text-center uppercase tracking-tight">ছবিটি পরিবর্তন করতে ক্লিক করুন</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Library (PDF/Word)</label>
                       <button onClick={() => docFileInputRef.current?.click()} className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 shadow-md transition"><FilePlus className="w-4 h-4" /></button>
                    </div>
                    <input type="file" ref={docFileInputRef} className="hidden" accept=".pdf,.doc,.docx" multiple onChange={e => handleFileUpload(e, 'docs')} />
                    
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 no-scrollbar">
                      {(editingItem?.attachments || []).map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-red-600 transition shadow-sm">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <FileText className={`w-4 h-4 shrink-0 ${doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'}`} />
                            <p className="text-[10px] font-bold dark:text-white line-clamp-1">{doc.name}</p>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => insertFileAtCursor(doc)} className="p-1 text-red-600 hover:bg-red-50 rounded-lg" title="Embed Download Link"><Download className="w-4 h-4" /></button>
                            <button 
                              onClick={() => setEditingItem(prev => ({ 
                                ...prev!, 
                                attachments: prev!.attachments?.filter((_, i) => i !== idx) 
                              }))}
                              className="p-1 text-gray-400 hover:text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image Gallery</label>
                       <button onClick={() => galleryFileInputRef.current?.click()} className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 shadow-md transition"><Plus className="w-4 h-4" /></button>
                    </div>
                    <input type="file" ref={galleryFileInputRef} className="hidden" multiple accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} />
                    
                    <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto no-scrollbar">
                      {(editingItem?.additionalImages || []).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border dark:border-gray-700">
                           <img src={img} className="w-full h-full object-cover" alt="" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center space-y-1">
                              <button onClick={() => insertImageAtCursor(img)} className="bg-white text-black p-1.5 rounded-lg hover:bg-red-600 hover:text-white transition shadow-lg"><ImagePlus className="w-4 h-4" /></button>
                              <button onClick={() => setEditingItem(prev => ({ ...prev!, additionalImages: prev!.additionalImages?.filter((_, i) => i !== idx) }))} className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Category</label>
                    <select 
                      value={editingItem?.category}
                      onChange={e => setEditingItem({...editingItem!, category: e.target.value})}
                      className="w-full bg-white dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold dark:text-white outline-none focus:ring-2 focus:ring-red-600 transition"
                    >
                      {CATEGORIES.map(cat => <option key={cat.id} value={cat.label}>{cat.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-500">
             <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-b dark:border-gray-700">
                <h3 className="font-black dark:text-white text-lg">সংবাদ তালিকা ({newsList.length})</h3>
                <button onClick={startCreateNews} className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-black flex items-center space-x-2 hover:bg-green-700 transition shadow-lg shadow-green-600/20 active:scale-95">
                  <Plus className="w-5 h-5" /> 
                  <span>সংবাদ যোগ করুন</span>
                </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b dark:border-gray-700">
                      <th className="p-6 text-left">Article</th>
                      <th className="p-6 text-left">Category</th>
                      <th className="p-6 text-left">Author</th>
                      <th className="p-6 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                   {newsList.map(n => (
                     <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                       <td className="p-6">
                          <div className="flex items-center space-x-4">
                            <img src={n.imageUrl} className="w-16 h-10 object-cover rounded-lg shadow-sm bg-gray-100" alt="" />
                            <p className="font-bold dark:text-white line-clamp-1 max-w-xs">{n.title}</p>
                          </div>
                       </td>
                       <td className="p-6">
                          <span className="text-[10px] uppercase font-black text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">{n.category}</span>
                       </td>
                       <td className="p-6">
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{n.author}</p>
                       </td>
                       <td className="p-6 text-right space-x-1">
                          <button onClick={() => startEditNews(n)} className="p-2.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition"><Edit className="w-5 h-5"/></button>
                          <button onClick={() => { if(confirm('Are you sure you want to delete this news?')) onUpdateNews(newsList.filter(news => news.id !== n.id)) }} className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-blue-900/20 rounded-xl transition"><Trash2 className="w-5 h-5"/></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-right duration-500">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-black mb-6 flex items-center dark:text-white border-b dark:border-gray-700 pb-4"><Settings className="w-5 h-5 mr-3 text-red-600" /> Header & Branding</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Title Part 1</label>
                    <input value={tempConfig.siteTitle} onChange={e => setTempConfig({...tempConfig, siteTitle: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl outline-none border-none dark:text-white focus:ring-2 focus:ring-red-600 transition" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Title Part 2 (Red)</label>
                    <input value={tempConfig.siteTitleRed} onChange={e => setTempConfig({...tempConfig, siteTitleRed: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl outline-none border-none dark:text-white focus:ring-2 focus:ring-red-600 transition" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Slogan</label>
                  <input value={tempConfig.slogan} onChange={e => setTempConfig({...tempConfig, slogan: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl outline-none border-none dark:text-white focus:ring-2 focus:ring-red-600 transition" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-black mb-6 flex items-center dark:text-white border-b dark:border-gray-700 pb-4"><Globe className="w-5 h-5 mr-3 text-red-600" /> Footer Details</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Editor Name</label>
                  <input value={tempConfig.editorName} onChange={e => setTempConfig({...tempConfig, editorName: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl outline-none border-none dark:text-white focus:ring-2 focus:ring-red-600 transition" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Address</label>
                  <input value={tempConfig.address} onChange={e => setTempConfig({...tempConfig, address: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl outline-none border-none dark:text-white focus:ring-2 focus:ring-red-600 transition" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mobile</label>
                  <input value={tempConfig.mobile} onChange={e => setTempConfig({...tempConfig, mobile: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl outline-none border-none dark:text-white focus:ring-2 focus:ring-red-600 transition" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                 <h3 className="text-lg font-black flex items-center dark:text-white"><Layout className="w-5 h-5 mr-3 text-red-600" /> Homepage Layout</h3>
                 <span className="text-[9px] font-black uppercase bg-red-600 text-white px-2.5 py-1 rounded-lg">Position Manager</span>
              </div>
              <div className="space-y-3">
                {tempConfig.layout.map((item, idx) => (
                  <div key={item} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-red-600 transition">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm font-black text-xs text-red-600">{idx + 1}</div>
                      <span className="font-bold dark:text-white uppercase text-xs tracking-widest">{item}</span>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => moveLayout(idx, 'up')} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:bg-red-600 hover:text-white transition"><ArrowUp className="w-4 h-4"/></button>
                      <button onClick={() => moveLayout(idx, 'down')} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:bg-red-600 hover:text-white transition"><ArrowDown className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t dark:border-gray-700">
                 <button onClick={handlePublishConfig} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-red-600/20 hover:bg-red-700 transition flex items-center justify-center space-x-2 active:scale-[0.98]">
                   <Save className="w-5 h-5" />
                   <span>PUBLISH CHANGES</span>
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;