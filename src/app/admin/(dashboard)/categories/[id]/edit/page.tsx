'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true,
  });

  useEffect(() => { fetchCategory(); }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`);
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setFormData(data);
    } catch (err) {
      console.error('获取分类失败:', err);
      setError('获取分类信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '保存分类失败'); return; }
      router.push('/admin/categories');
    } catch (err) {
      console.error('保存失败:', err);
      setError('保存分类失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (<div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div>);
  }

  if (error && !formData.name) {
    return (
      <div className="space-y-6">
        <Link href="/admin/categories"><Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-2" />返回分类列表</Button></Link>
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">编辑分类</h1>
          <p className="text-gray-500">修改分类信息</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

        <Card>
          <CardHeader><CardTitle>分类信息</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">分类名称 *</Label>
                <Input id="name" name="name" value={formData.name || ''} onChange={handleNameChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL别名 *</Label>
                <Input id="slug" name="slug" value={formData.slug || ''} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">图片地址</Label>
              <Input id="image_url" name="image_url" value={formData.image_url || ''} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">分类描述</Label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} placeholder="请输入分类描述" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">排序</Label>
                <Input id="sort_order" name="sort_order" type="number" value={formData.sort_order || 0} onChange={handleChange} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">启用</Label>
                  <p className="text-sm text-gray-500">在网站上显示此分类</p>
                </div>
                <Switch checked={formData.is_active || false} onCheckedChange={handleSwitchChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/categories"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={saving}>
            {saving ? '保存中...' : (<><Save className="w-4 h-4 mr-2" />保存修改</>)}
          </Button>
        </div>
      </form>
    </div>
  );
}
