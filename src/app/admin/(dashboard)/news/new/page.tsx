'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewNewsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', summary: '', content: '', category: 'company', sort_order: 0, is_active: true,
  });

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, slug: form.slug || generateSlug(form.title) }),
      });
      if (res.ok) { router.push('/admin/news'); }
      else { const data = await res.json(); alert(data.error || '创建新闻失败'); }
    } catch (error) {
      console.error('创建新闻失败:', error);
      alert('创建新闻失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/news"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <h1 className="text-2xl font-bold text-gray-800">添加新闻</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
            <input type="text" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value, slug: prev.slug || generateSlug(e.target.value) }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL别名</label>
            <input type="text" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500">
              <option value="company">公司新闻</option>
              <option value="industry">行业新闻</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 text-orange-500 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">发布</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={10} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/news"><Button type="button" variant="outline">取消</Button></Link>
          <Button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600">
            <Save className="w-4 h-4 mr-2" /> {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </div>
  );
}
