import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Product, Category, Banner, SiteSetting, ContactInfo, News, Download, Inquiry } from '@/storage/database/shared/schema';

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

// 新闻 API
export async function getNews(options?: { category?: string; limit?: number; offset?: number; activeOnly?: boolean }) {
  let query = client.from('news').select('*');

  if (options?.activeOnly !== false) {
    query = query.eq('is_active', true);
  }

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    const start = options.offset;
    const end = start + (options.limit || 10) - 1;
    query = query.range(start, end);
  }

  const { data, error } = await query;
  if (error) throw new Error(`获取新闻失败: ${error.message}`);
  return data as News[];
}

export async function getNewsBySlug(slug: string) {
  const { data, error } = await client
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw new Error(`获取新闻详情失败: ${error.message}`);
  return data as News | null;
}

export async function getNewsById(id: string) {
  const { data, error } = await client
    .from('news')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`获取新闻失败: ${error.message}`);
  return data as News | null;
}

export async function createNews(item: Partial<News>) {
  const { data, error } = await client
    .from('news')
    .insert(item)
    .select()
    .single();
  if (error) throw new Error(`创建新闻失败: ${error.message}`);
  return data as News;
}

export async function updateNews(id: string, item: Partial<News>) {
  const { data, error } = await client
    .from('news')
    .update({ ...item, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`更新新闻失败: ${error.message}`);
  return data as News;
}

export async function deleteNews(id: string) {
  const { error } = await client.from('news').delete().eq('id', id);
  if (error) throw new Error(`删除新闻失败: ${error.message}`);
}

// 下载 API
export async function getDownloads(options?: { category?: string; active?: boolean }) {
  let query = client.from('downloads').select('*');

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.active !== undefined) {
    query = query.eq('is_active', options.active);
  }

  query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(`获取下载列表失败: ${error.message}`);
  return data as Download[];
}

export async function getDownloadBySlug(slug: string) {
  const { data, error } = await client
    .from('downloads')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw new Error(`获取下载详情失败: ${error.message}`);
  return data as Download | null;
}

export async function createDownload(item: Partial<Download>) {
  const { data, error } = await client
    .from('downloads')
    .insert(item)
    .select()
    .single();
  if (error) throw new Error(`创建下载资源失败: ${error.message}`);
  return data as Download;
}

export async function updateDownload(id: string, item: Partial<Download>) {
  const { data, error } = await client
    .from('downloads')
    .update({ ...item, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`更新下载资源失败: ${error.message}`);
  return data as Download;
}

export async function deleteDownload(id: string) {
  const { error } = await client.from('downloads').delete().eq('id', id);
  if (error) throw new Error(`删除下载资源失败: ${error.message}`);
}

export async function incrementDownloadCount(id: string) {
  const { error } = await client.rpc('increment_download_count', { row_id: id });
  // Fallback if RPC not available
  if (error) {
    const item = await client.from('downloads').select('download_count').eq('id', id).single();
    if (item.data) {
      await client.from('downloads')
        .update({ download_count: (item.data.download_count || 0) + 1 })
        .eq('id', id);
    }
  }
}

// 询盘 API
export async function getInquiries(options?: { status?: string; isRead?: boolean }) {
  let query = client.from('inquiries').select('*');

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.isRead !== undefined) {
    query = query.eq('is_read', options.isRead);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(`获取询盘失败: ${error.message}`);
  return data as Inquiry[];
}

export async function getInquiryById(id: string) {
  const { data, error } = await client
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`获取询盘失败: ${error.message}`);
  return data as Inquiry | null;
}

export async function createInquiry(inquiry: Partial<Inquiry>) {
  const { data, error } = await client
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single();
  if (error) throw new Error(`创建询盘失败: ${error.message}`);
  return data as Inquiry;
}

export async function updateInquiry(id: string, inquiry: Partial<Inquiry>) {
  const { data, error } = await client
    .from('inquiries')
    .update({ ...inquiry, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`更新询盘失败: ${error.message}`);
  return data as Inquiry;
}

export async function deleteInquiry(id: string) {
  const { error } = await client.from('inquiries').delete().eq('id', id);
  if (error) throw new Error(`删除询盘失败: ${error.message}`);
}
