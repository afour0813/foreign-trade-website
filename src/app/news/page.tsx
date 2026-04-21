'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  image_url: string | null;
  category: string;
  created_at: string;
}

const categories = [
  { value: '', labelKey: 'news.all' },
  { value: 'company', labelKey: 'news.company' },
  { value: 'industry', labelKey: 'news.industry' },
];

export default function NewsPage() {
  const { t } = useI18n();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        const res = await fetch(`/api/news?${params.toString()}`);
        const data = await res.json();
        setNewsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-orange-100 mb-4">
            <Link href="/" className="hover:text-white">{t('nav.home')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span>{t('nav.news')}</span>
          </div>
          <h1 className="text-4xl font-bold">{t('news.title')}</h1>
          <p className="mt-2 text-orange-100">{t('news.subtitle')}</p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500 border border-gray-200'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-16 text-gray-400">{t('news.noNews')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {newsList.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
              >
                {item.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-500">
                      {item.category === 'company' ? 'Company' : 'Industry'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                  )}
                  <div className="mt-4 flex items-center text-orange-500 text-sm font-medium">
                    {t('news.readMore')} <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
