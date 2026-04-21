'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Layers, Image, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  products: number;
  categories: number;
  banners: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, banners: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, categories, banners] = await Promise.all([
        fetch('/api/products?limit=1000').then((res) => res.json()),
        fetch('/api/categories').then((res) => res.json()),
        fetch('/api/home').then((res) => res.json()),
      ]);

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        banners: Array.isArray(banners.banners) ? banners.banners.length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
      color: 'bg-pink-500',
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: Layers,
      href: '/admin/categories',
      color: 'bg-blue-500',
    },
    {
      title: 'Banners',
      value: stats.banners,
      icon: Image,
      href: '/admin/banners',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        {loading ? '-' : stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-pink-500">
                    <span>Manage {stat.title.toLowerCase()}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Package className="w-5 h-5 text-pink-500" />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Layers className="w-5 h-5 text-blue-500" />
              <span>Add New Category</span>
            </Link>
            <Link
              href="/admin/banners/new"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Image className="w-5 h-5 text-green-500" />
              <span>Add New Banner</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Users className="w-5 h-5 text-purple-500" />
              <span>Site Settings</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Website Status</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Products</span>
                <span className="font-medium">{stats.products}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Categories</span>
                <span className="font-medium">{stats.categories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Banners</span>
                <span className="font-medium">{stats.banners}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link
                href="/"
                target="_blank"
                className="text-pink-500 hover:underline text-sm"
              >
                View Website
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
