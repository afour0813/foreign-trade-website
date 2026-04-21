'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight, ArrowLeft, Share2 } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  summary: string | null;
  image_url: string | null;
  category: string;
  created_at: string;
}

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news?slug=${slug}`);
        const data = await res.json();
        setNews(data);

        if (data?.category) {
          const relatedRes = await fetch(`/api/news?category=${data.category}&limit=3`);
          const relatedData = await relatedRes.json();
          setRelatedNews(
            Array.isArray(relatedData)
              ? relatedData.filter((n: NewsItem) => n.id !== data.id).slice(0, 3)
              : []
          );
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">News Not Found</h2>
          <Link href="/news" className="text-orange-500 hover:underline">Back to News</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-orange-100 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/news" className="hover:text-white">News</Link>
            <ChevronRight className="w-4 h-4" />
            <span>{news.category === 'company' ? 'Company News' : 'Industry News'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{news.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-orange-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(news.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20">
              {news.category === 'company' ? 'Company' : 'Industry'}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm p-8">
              {news.image_url && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                  <Image src={news.image_url} alt={news.title} fill className="object-cover" />
                </div>
              )}
              <div className="prose max-w-none text-gray-700">
                {news.content ? (
                  news.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
                  ))
                ) : news.summary ? (
                  <p className="mb-4 leading-relaxed">{news.summary}</p>
                ) : (
                  <p className="text-gray-400">No content available.</p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                <Link
                  href="/news"
                  className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to News
                </Link>
                <button className="flex items-center gap-2 text-gray-400 hover:text-orange-500">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Related News</h3>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Contact Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions? Get in touch with our team.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Send Inquiry
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
