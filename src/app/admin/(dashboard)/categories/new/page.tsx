'use client';

import { useState } from 'react';
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

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true,
  });

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '创建分类失败'); return; }
      router.push('/admin/categories');
    } catch (err) {
      console.error('保存失败:', err);
      setError('创建分类失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">添加分类</h1>
          <p className="text-gray-500">创建一个新的产品分类</p>
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
                <Input id="name" name="name" value={formData.name} onChange={handleNameChange} placeholder="请输入分类名称" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL别名 *</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="category-slug" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">图片地址</Label>
              <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">分类描述</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="请输入分类描述" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">排序</Label>
                <Input id="sort_order" name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">启用</Label>
                  <p className="text-sm text-gray-500">在网站上显示此分类</p>
                </div>
                <Switch checked={formData.is_active} onCheckedChange={handleSwitchChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/categories"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={saving}>
            {saving ? '创建中...' : (<><Save className="w-4 h-4 mr-2" />创建分类</>)}
          </Button>
        </div>
      </form>
    </div>
  );
}
