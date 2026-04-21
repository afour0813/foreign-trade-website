'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Pencil, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Banner {
  id: string;
  title?: string;
  image_url: string;
  link_url?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', image_url: '', link_url: '', description: '', sort_order: 0, is_active: true,
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (Array.isArray(data)) { setBanners(data); }
    } catch (error) {
      console.error('获取横幅失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '', image_url: banner.image_url, link_url: banner.link_url || '',
        description: banner.description || '', sort_order: banner.sort_order, is_active: banner.is_active,
      });
    } else {
      setEditingBanner(null);
      setFormData({ title: '', image_url: '', link_url: '', description: '', sort_order: 0, is_active: true });
    }
    setError('');
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingBanner?.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '保存横幅失败'); return; }
      setDialogOpen(false);
      fetchBanners();
    } catch (err) {
      console.error('保存失败:', err);
      setError('保存横幅失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此横幅吗？')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      if (res.ok) { setBanners(banners.filter((b) => b.id !== id)); }
      else { const data = await res.json(); alert(data.error || '删除横幅失败'); }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除横幅失败');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, is_active: !banner.is_active }),
      });
      if (res.ok) { setBanners(banners.map((b) => b.id === banner.id ? { ...b, is_active: !b.is_active } : b)); }
    } catch (error) { console.error('切换状态失败:', error); }
  };

  if (loading) {
    return (<div className="space-y-6"><Skeleton className="h-8 w-32" /><Skeleton className="h-96" /></div>);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">横幅管理</h1>
          <p className="text-gray-500">管理首页横幅（共 {banners.length} 个）</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />添加横幅
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">图片</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>链接</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-20">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      暂无横幅，点击「添加横幅」创建。
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        {banner.image_url ? (
                          <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-100">
                            <Image src={banner.image_url} alt={banner.title || '横幅'} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-24 h-16 rounded bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{banner.title || '-'}</TableCell>
                      <TableCell className="text-gray-500 truncate max-w-xs">{banner.link_url || '-'}</TableCell>
                      <TableCell>{banner.sort_order}</TableCell>
                      <TableCell>
                        <Badge variant={banner.is_active ? 'default' : 'secondary'} className={banner.is_active ? 'bg-green-500' : ''} onClick={() => toggleActive(banner)} style={{ cursor: 'pointer' }}>
                          {banner.is_active ? '启用' : '禁用'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(banner)}><Pencil className="w-4 h-4 mr-2" />编辑</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(banner.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />删除</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBanner ? '编辑横幅' : '添加横幅'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}
            <div className="space-y-2">
              <Label htmlFor="image_url">图片地址 *</Label>
              <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/banner.jpg" required />
              <p className="text-sm text-gray-500">建议尺寸：1920x600 像素</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="横幅标题" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_url">链接地址</Label>
              <Input id="link_url" name="link_url" value={formData.link_url} onChange={handleChange} placeholder="https://example.com/page" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} placeholder="横幅描述（选填）" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">排序</Label>
                <Input id="sort_order" name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">启用</Label>
                  <p className="text-sm text-gray-500">在首页显示</p>
                </div>
                <input type="checkbox" checked={formData.is_active} onChange={(e) => handleSwitchChange(e.target.checked)} className="w-5 h-5" />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={saving}>
                {saving ? '保存中...' : (<><Save className="w-4 h-4 mr-2" />保存横幅</>)}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
