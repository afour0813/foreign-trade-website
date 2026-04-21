'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
    title: '',
    image_url: '',
    link_url: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBanners(data);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        description: banner.description || '',
        sort_order: banner.sort_order,
        is_active: banner.is_active,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        image_url: '',
        link_url: '',
        description: '',
        sort_order: 0,
        is_active: true,
      });
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
      const url = editingBanner 
        ? '/api/admin/banners' 
        : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingBanner?.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save banner');
        return;
      }

      setDialogOpen(false);
      fetchBanners();
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(banners.filter((b) => b.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete banner');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: banner.id,
          is_active: !banner.is_active,
        }),
      });
      
      if (res.ok) {
        setBanners(
          banners.map((b) =>
            b.id === banner.id ? { ...b, is_active: !b.is_active } : b
          )
        );
      }
    } catch (error) {
      console.error('Toggle active failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
          <p className="text-gray-500">Manage homepage banners ({banners.length})</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Banners Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No banners found. Click &quot;Add Banner&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        {banner.image_url ? (
                          <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={banner.image_url}
                              alt={banner.title || 'Banner'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-16 rounded bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{banner.title || '-'}</TableCell>
                      <TableCell className="text-gray-500 truncate max-w-xs">
                        {banner.link_url || '-'}
                      </TableCell>
                      <TableCell>{banner.sort_order}</TableCell>
                      <TableCell>
                        <Badge
                          variant={banner.is_active ? 'default' : 'secondary'}
                          className={banner.is_active ? 'bg-green-500' : ''}
                          onClick={() => toggleActive(banner)}
                          style={{ cursor: 'pointer' }}
                        >
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(banner)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(banner.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                required
              />
              <p className="text-sm text-gray-500">
                Recommended size: 1920x600 pixels
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Banner title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_url">Link URL</Label>
              <Input
                id="link_url"
                name="link_url"
                value={formData.link_url}
                onChange={handleChange}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Optional description"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Active</Label>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleSwitchChange(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600" disabled={saving}>
                {saving ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Banner
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
