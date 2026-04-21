'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

interface DownloadItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  file_url: string | null;
  file_size: string | null;
  category: string;
  is_active: boolean;
  download_count: number;
  sort_order: number;
  created_at: string;
}

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', description: '', file_url: '', file_size: '', category: 'help', sort_order: 0, is_active: true,
  });

  const fetchDownloads = async () => {
    try {
      const res = await fetch('/api/admin/downloads', { credentials: 'include' });
      const data = await res.json();
      setDownloads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('获取下载列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDownloads(); }, []);

  const openNewDialog = () => {
    setEditingItem(null);
    setForm({ title: '', slug: '', description: '', file_url: '', file_size: '', category: 'help', sort_order: 0, is_active: true });
    setDialogOpen(true);
  };

  const openEditDialog = (item: DownloadItem) => {
    setEditingItem(item);
    setForm({
      title: item.title, slug: item.slug, description: item.description || '',
      file_url: item.file_url || '', file_size: item.file_size || '',
      category: item.category, sort_order: item.sort_order || 0, is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { id: editingItem.id, ...form } : { ...form, slug: form.slug || generateSlug(form.title) };
      const res = await fetch('/api/admin/downloads', {
        method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
      });
      if (res.ok) { setDialogOpen(false); fetchDownloads(); }
      else { const data = await res.json(); alert(data.error || '保存失败'); }
    } catch (error) {
      console.error('保存下载项失败:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此下载项吗？')) return;
    try {
      await fetch(`/api/admin/downloads?id=${id}`, { method: 'DELETE', credentials: 'include' });
      fetchDownloads();
    } catch (error) {
      console.error('删除下载项失败:', error);
    }
  };

  const filtered = downloads.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Download className="w-6 h-6 text-orange-500" /> 下载管理
        </h1>
        <Button onClick={openNewDialog} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" /> 添加下载
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索下载项..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">暂无下载项。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">文件大小</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">下载次数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-500">
                        {item.category === 'help' ? '帮助文档' : '文件下载'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.file_size || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.download_count}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.is_active ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                        {item.is_active ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑下载项' : '添加下载项'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
              <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: p.slug || generateSlug(e.target.value) }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL别名</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500">
                  <option value="help">帮助文档</option>
                  <option value="download">文件下载</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文件大小</label>
                <input type="text" value={form.file_size} onChange={(e) => setForm((p) => ({ ...p, file_size: e.target.value }))} placeholder="例如：2.5 MB" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文件地址</label>
              <input type="text" value={form.file_url} onChange={(e) => setForm((p) => ({ ...p, file_url: e.target.value }))} placeholder="/files/catalog.pdf" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 text-orange-500 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">启用</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">排序：</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="w-20 px-3 py-1 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                {editingItem ? '保存修改' : '创建'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
