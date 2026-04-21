import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Product, Category, Banner, SiteSetting, ContactInfo } from '@/storage/database/shared/schema';

const client = getSupabaseClient();

// 产品 API
export async function getProducts(options?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = client.from('products').select('*').eq('is_active', true);
  
  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  
  if (options?.featured) {
    query = query.eq('is_featured', true);
  }
  
  query = query.order('sort_order', { ascending: true });
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    const start = options.offset;
    const end = start + (options.limit || 10) - 1;
    query = query.range(start, end);
  }
  
  const { data, error } = await query;
  if (error) throw new Error(`获取产品失败: ${error.message}`);
  return data as Product[];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await client
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw new Error(`获取产品详情失败: ${error.message}`);
  return data as (Product & { categories?: Category }) | null;
}

export async function getProductById(id: string) {
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`获取产品失败: ${error.message}`);
  return data as Product | null;
}

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await client
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw new Error(`创建产品失败: ${error.message}`);
  return data as Product;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { data, error } = await client
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`更新产品失败: ${error.message}`);
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await client.from('products').delete().eq('id', id);
  if (error) throw new Error(`删除产品失败: ${error.message}`);
}

// 分类 API
export async function getCategories(options?: { parentId?: string | null; active?: boolean }) {
  let query = client.from('categories').select('*');
  
  if (options?.parentId !== undefined) {
    if (options.parentId === null) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', options.parentId);
    }
  }
  
  if (options?.active !== undefined) {
    query = query.eq('is_active', options.active);
  }
  
  query = query.order('sort_order', { ascending: true });
  
  const { data, error } = await query;
  if (error) throw new Error(`获取分类失败: ${error.message}`);
  return data as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`获取分类失败: ${error.message}`);
  return data as Category | null;
}

export async function createCategory(category: Partial<Category>) {
  const { data, error } = await client
    .from('categories')
    .insert(category)
    .select()
    .single();
  if (error) throw new Error(`创建分类失败: ${error.message}`);
  return data as Category;
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const { data, error } = await client
    .from('categories')
    .update({ ...category, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`更新分类失败: ${error.message}`);
  return data as Category;
}

export async function deleteCategory(id: string) {
  const { error } = await client.from('categories').delete().eq('id', id);
  if (error) throw new Error(`删除分类失败: ${error.message}`);
}

// 轮播图 API
export async function getBanners(options?: { active?: boolean }) {
  let query = client.from('banners').select('*');
  
  if (options?.active !== undefined) {
    query = query.eq('is_active', options.active);
  }
  
  query = query.order('sort_order', { ascending: true });
  
  const { data, error } = await query;
  if (error) throw new Error(`获取轮播图失败: ${error.message}`);
  return data as Banner[];
}

export async function createBanner(banner: Partial<Banner>) {
  const { data, error } = await client
    .from('banners')
    .insert(banner)
    .select()
    .single();
  if (error) throw new Error(`创建轮播图失败: ${error.message}`);
  return data as Banner;
}

export async function updateBanner(id: string, banner: Partial<Banner>) {
  const { data, error } = await client
    .from('banners')
    .update({ ...banner, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`更新轮播图失败: ${error.message}`);
  return data as Banner;
}

export async function deleteBanner(id: string) {
  const { error } = await client.from('banners').delete().eq('id', id);
  if (error) throw new Error(`删除轮播图失败: ${error.message}`);
}

// 网站设置 API
export async function getSiteSetting(key: string) {
  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .maybeSingle();
  if (error) throw new Error(`获取网站设置失败: ${error.message}`);
  return data as SiteSetting | null;
}

export async function getAllSiteSettings() {
  const { data, error } = await client.from('site_settings').select('*');
  if (error) throw new Error(`获取网站设置失败: ${error.message}`);
  return data as SiteSetting[];
}

export async function upsertSiteSetting(setting: Partial<SiteSetting>) {
  const { data, error } = await client
    .from('site_settings')
    .upsert(setting, { onConflict: 'key' })
    .select()
    .single();
  if (error) throw new Error(`保存网站设置失败: ${error.message}`);
  return data as SiteSetting;
}

// 联系信息 API
export async function getContactInfo() {
  const { data, error } = await client.from('contact_info').select('*').limit(1).maybeSingle();
  if (error) throw new Error(`获取联系信息失败: ${error.message}`);
  return data as ContactInfo | null;
}

export async function saveContactInfo(info: Partial<ContactInfo>) {
  const existing = await getContactInfo();
  
  if (existing) {
    const { data, error } = await client
      .from('contact_info')
      .update({ ...info, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw new Error(`更新联系信息失败: ${error.message}`);
    return data as ContactInfo;
  } else {
    const { data, error } = await client
      .from('contact_info')
      .insert(info)
      .select()
      .single();
    if (error) throw new Error(`创建联系信息失败: ${error.message}`);
    return data as ContactInfo;
  }
}
