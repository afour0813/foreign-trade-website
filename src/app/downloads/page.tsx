'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, FileText, ChevronRight } from 'lucide-react';

interface DownloadItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  file_url: string | null;
  file_size: string | null;
  category: string;
  download_count: number;
  created_at: string;
}

const categories = [
  { value: '', label: 'All' },
  { value: 'help', label: 'Help Documents' },
  { value: 'download', label: 'Downloads' },
];

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        const res = await fetch(`/api/downloads?${params.toString()}`);
        const data = await res.json();
        setDownloads(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch downloads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, [activeCategory]);

  const handleDownload = async (item: DownloadItem) => {
    if (item.file_url) {
      try {
        await fetch('/api/admin/downloads', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, action: 'increment' }),
        });
      } catch {
        // ignore
      }
      window.open(item.file_url, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-orange-100 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Download</span>
          </div>
          <h1 className="text-4xl font-bold">Download Center</h1>
          <p className="mt-2 text-orange-100">Product catalogs, help documents and resources</p>
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
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : downloads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No downloads available yet.</div>
        ) : (
          <div className="space-y-4 pb-16">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between gap-4 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {item.file_size && <span>{item.file_size}</span>}
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {item.download_count} downloads
                      </span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(item)}
                  disabled={!item.file_url}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors flex-shrink-0 ${
                    item.file_url
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
