'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactInfo {
  id?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  wechat?: string;
  skype?: string;
  working_hours?: string;
}

interface Settings {
  about_us?: string;
  [key: string]: string | undefined;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setContactInfo(data.contactInfo || {});
      setSettings(data.settings || {});
    } catch (err) {
      console.error('获取设置失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo, settings }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '保存设置失败'); return; }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('保存失败:', err);
      setError('保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (<div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div>);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">站点设置</h1>
        <p className="text-gray-500">管理网站信息</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-700 border-green-200">
            <AlertDescription className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              设置保存成功！
            </AlertDescription>
          </Alert>
        )}

        {/* 联系信息 */}
        <Card>
          <CardHeader>
            <CardTitle>联系信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" name="email" type="email" value={contactInfo.email || ''} onChange={handleContactChange} placeholder="contact@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">电话</Label>
                <Input id="phone" name="phone" value={contactInfo.phone || ''} onChange={handleContactChange} placeholder="+86 123 4567 8900" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" value={contactInfo.whatsapp || ''} onChange={handleContactChange} placeholder="+86 123 4567 8900" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wechat">微信</Label>
                <Input id="wechat" name="wechat" value={contactInfo.wechat || ''} onChange={handleContactChange} placeholder="微信号" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skype">Skype</Label>
                <Input id="skype" name="skype" value={contactInfo.skype || ''} onChange={handleContactChange} placeholder="live:username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="working_hours">工作时间</Label>
                <Input id="working_hours" name="working_hours" value={contactInfo.working_hours || ''} onChange={handleContactChange} placeholder="周一至周五: 9:00 - 18:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">地址</Label>
              <Textarea id="address" name="address" value={contactInfo.address || ''} onChange={handleContactChange} rows={2} placeholder="公司详细地址" />
            </div>
          </CardContent>
        </Card>

        {/* 关于我们 */}
        <Card>
          <CardHeader>
            <CardTitle>关于我们</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about_us">公司简介</Label>
              <Textarea
                id="about_us" name="about_us"
                value={settings.about_us || ''}
                onChange={(e) => handleSettingChange('about_us', e.target.value)}
                rows={10}
                placeholder={'输入公司简介，将显示在「关于我们」页面...'}
              />
              <p className="text-sm text-gray-500">
                此文本将显示在「关于我们」页面，支持多段落。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 其他设置 */}
        <Card>
          <CardHeader>
            <CardTitle>其他设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">网站标题（SEO）</Label>
              <Input
                id="meta_title"
                value={settings.meta_title || ''}
                onChange={(e) => handleSettingChange('meta_title', e.target.value)}
                placeholder="搜索引擎显示的网站标题"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">网站描述（SEO）</Label>
              <Textarea
                id="meta_description"
                value={settings.meta_description || ''}
                onChange={(e) => handleSettingChange('meta_description', e.target.value)}
                rows={3}
                placeholder="搜索引擎显示的网站描述"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={saving}>
            {saving ? '保存中...' : (<><Save className="w-4 h-4 mr-2" />保存设置</>)}
          </Button>
        </div>
      </form>
    </div>
  );
}
