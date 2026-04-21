'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Layers, Image, Newspaper, Download, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Stats {
  products: number;
  categories: number;
  banners: number;
  news: number;
  downloads: number;
  inquiries: number;
  unreadInquiries: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    products: 0, categories: 0, banners: 0, news: 0, downloads: 0, inquiries: 0, unreadInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, categories, homeData, newsData, downloadsData, inquiriesData] = await Promise.all([
        fetch('/api/products?limit=1000').then((res) => res.json()),
        fetch('/api/categories').then((res) => res.json()),
        fetch('/api/home').then((res) => res.json()),
        fetch('/api/admin/news', { credentials: 'include' }).then((res) => res.json()).catch(() => []),
        fetch('/api/admin/downloads', { credentials: 'include' }).then((res) => res.json()).catch(() => []),
        fetch('/api/admin/inquiries', { credentials: 'include' }).then((res) => res.json()).catch(() => []),
      ]);

      const inquiriesArr = Array.isArray(inquiriesData) ? inquiriesData : [];

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        banners: Array.isArray(homeData?.banners) ? homeData.banners.length : 0,
        news: Array.isArray(newsData) ? newsData.length : 0,
        downloads: Array.isArray(downloadsData) ? downloadsData.length : 0,
        inquiries: inquiriesArr.length,
        unreadInquiries: inquiriesArr.filter((i: { is_read?: boolean }) => !i.is_read).length,
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: '产品', value: stats.products, icon: Package, href: '/admin/products', color: 'bg-orange-500' },
    { title: '分类', value: stats.categories, icon: Layers, href: '/admin/categories', color: 'bg-blue-500' },
    { title: '横幅', value: stats.banners, icon: Image, href: '/admin/banners', color: 'bg-green-500' },
    { title: '新闻', value: stats.news, icon: Newspaper, href: '/admin/news', color: 'bg-purple-500' },
    { title: '下载', value: stats.downloads, icon: Download, href: '/admin/downloads', color: 'bg-teal-500' },
    {
      title: '询盘',
      value: stats.inquiries,
      icon: MessageSquare,
      href: '/admin/inquiries',
      color: 'bg-red-500',
      badge: stats.unreadInquiries > 0 ? `${stats.unreadInquiries} 条未读` : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">控制台</h1>
        <p className="text-gray-500">欢迎进入管理后台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-500 text-sm">{stat.title}</p>
                        {stat.badge && (
                          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            {stat.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        {loading ? '-' : stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-orange-500">
                    <span>管理{stat.title}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
