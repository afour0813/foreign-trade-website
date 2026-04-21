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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setContactInfo(data.contactInfo || {});
      setSettings(data.settings || {});
    } catch (err) {
      console.error('Failed to fetch settings:', err);
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
        body: JSON.stringify({
          contactInfo,
          settings,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save settings');
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
        <p className="text-gray-500">Manage website information</p>
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
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={contactInfo.email || ''}
                  onChange={handleContactChange}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={contactInfo.phone || ''}
                  onChange={handleContactChange}
                  placeholder="+86 123 4567 8900"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={contactInfo.whatsapp || ''}
                  onChange={handleContactChange}
                  placeholder="+86 123 4567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wechat">WeChat</Label>
                <Input
                  id="wechat"
                  name="wechat"
                  value={contactInfo.wechat || ''}
                  onChange={handleContactChange}
                  placeholder="wechat_id"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skype">Skype</Label>
                <Input
                  id="skype"
                  name="skype"
                  value={contactInfo.skype || ''}
                  onChange={handleContactChange}
                  placeholder="live:username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="working_hours">Working Hours</Label>
                <Input
                  id="working_hours"
                  name="working_hours"
                  value={contactInfo.working_hours || ''}
                  onChange={handleContactChange}
                  placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={contactInfo.address || ''}
                onChange={handleContactChange}
                rows={2}
                placeholder="Full address"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Us */}
        <Card>
          <CardHeader>
            <CardTitle>About Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about_us">Company Introduction</Label>
              <Textarea
                id="about_us"
                name="about_us"
                value={settings.about_us || ''}
                onChange={(e) => handleSettingChange('about_us', e.target.value)}
                rows={10}
                placeholder="Enter company introduction text that will be displayed on the About Us page..."
              />
              <p className="text-sm text-gray-500">
                This text will be displayed on the About Us page. You can use multiple paragraphs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title (SEO)</Label>
              <Input
                id="meta_title"
                value={settings.meta_title || ''}
                onChange={(e) => handleSettingChange('meta_title', e.target.value)}
                placeholder="Site title for search engines"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description (SEO)</Label>
              <Textarea
                id="meta_description"
                value={settings.meta_description || ''}
                onChange={(e) => handleSettingChange('meta_description', e.target.value)}
                rows={3}
                placeholder="Site description for search engines"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={saving}>
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
