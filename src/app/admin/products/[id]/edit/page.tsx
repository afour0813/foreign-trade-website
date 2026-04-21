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
import { ArrowLeft, Save, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  price?: string;
  category_id?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  min_order?: string;
  material?: string;
  size?: string;
  color?: string;
  packaging?: string;
  moq?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    images: [],
    price: '',
    category_id: '',
    is_featured: false,
    is_active: true,
    sort_order: 0,
    min_order: '',
    material: '',
    size: '',
    color: '',
    packaging: '',
    moq: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/products?id=${id}`),
        fetch('/api/categories'),
      ]);

      const product = await productRes.json();
      const categoriesData = await categoriesRes.json();

      if (product.error) {
        setError(product.error);
        return;
      }

      setFormData(product);
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof Product, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const imagesArray = value.split('\n').map((url) => url.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, images: imagesArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save product');
        return;
      }

      router.push('/admin/products');
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save product');
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

  if (error && !formData.name) {
    return (
      <div className="space-y-6">
        <Link href="/admin/products">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-500">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id || ''}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="e.g., $5.00 / pair"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <Textarea
                id="images"
                name="images"
                value={(formData.images || []).join('\n')}
                onChange={handleImagesChange}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={4}
              />
              <p className="text-sm text-gray-500">
                Enter one image URL per line. The first image will be used as the main product image.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  name="material"
                  value={formData.material || ''}
                  onChange={handleChange}
                  placeholder="e.g., Cotton, Velvet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  name="size"
                  value={formData.size || ''}
                  onChange={handleChange}
                  placeholder="e.g., 5cm"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color || ''}
                  onChange={handleChange}
                  placeholder="e.g., Pink, Blue, Mixed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moq">MOQ (Minimum Order Quantity)</Label>
                <Input
                  id="moq"
                  name="moq"
                  value={formData.moq || ''}
                  onChange={handleChange}
                  placeholder="e.g., 50 pairs"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_order">Minimum Order</Label>
                <Input
                  id="min_order"
                  name="min_order"
                  value={formData.min_order || ''}
                  onChange={handleChange}
                  placeholder="e.g., 1 pair"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packaging">Packaging</Label>
                <Input
                  id="packaging"
                  name="packaging"
                  value={formData.packaging || ''}
                  onChange={handleChange}
                  placeholder="e.g., OPP bag"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="is_active" className="font-medium">Active</Label>
                  <p className="text-sm text-gray-500">Show this product on website</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active ?? true}
                  onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="is_featured" className="font-medium">Featured</Label>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured ?? false}
                  onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-pink-500 hover:bg-pink-600" disabled={saving}>
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
