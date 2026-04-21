import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 管理员用户表
export const adminUsers = pgTable(
  "admin_users",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    username: varchar("username", { length: 50 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    email: varchar("email", { length: 100 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("admin_users_username_idx").on(table.username),
  ]
);

// 产品分类表
export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    imageUrl: varchar("image_url", { length: 500 }),
    parentId: varchar("parent_id", { length: 36 }).references(() => categories.id, { onDelete: "set null" }),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("categories_slug_idx").on(table.slug),
    index("categories_parent_id_idx").on(table.parentId),
    index("categories_sort_order_idx").on(table.sortOrder),
  ]
);

// 产品表
export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    description: text("description"),
    price: varchar("price", { length: 50 }),
    categoryId: varchar("category_id", { length: 36 }).references(() => categories.id, { onDelete: "set null" }),
    images: jsonb("images").$type<string[]>(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    minOrder: varchar("min_order", { length: 50 }),
    material: varchar("material", { length: 200 }),
    size: varchar("size", { length: 100 }),
    color: varchar("color", { length: 200 }),
    packaging: varchar("packaging", { length: 200 }),
    moq: varchar("moq", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("products_slug_idx").on(table.slug),
    index("products_category_id_idx").on(table.categoryId),
    index("products_is_featured_idx").on(table.isFeatured),
    index("products_sort_order_idx").on(table.sortOrder),
    index("products_is_active_idx").on(table.isActive),
  ]
);

// 轮播图/横幅表
export const banners = pgTable(
  "banners",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 200 }),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    linkUrl: varchar("link_url", { length: 500 }),
    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("banners_sort_order_idx").on(table.sortOrder),
    index("banners_is_active_idx").on(table.isActive),
  ]
);

// 网站设置表
export const siteSettings = pgTable(
  "site_settings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value"),
    description: varchar("description", { length: 200 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("site_settings_key_idx").on(table.key),
  ]
);

// 联系信息表
export const contactInfo = pgTable(
  "contact_info",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    address: text("address"),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 100 }),
    whatsapp: varchar("whatsapp", { length: 50 }),
    wechat: varchar("wechat", { length: 50 }),
    skype: varchar("skype", { length: 50 }),
    workingHours: varchar("working_hours", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  }
);

// Zod Schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({ 
  username: true, 
  password: true,
  email: true 
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  parentId: true,
  sortOrder: true,
  isActive: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  categoryId: true,
  images: true,
  isFeatured: true,
  isActive: true,
  sortOrder: true,
  minOrder: true,
  material: true,
  size: true,
  color: true,
  packaging: true,
  moq: true,
});

export const insertBannerSchema = createInsertSchema(banners).pick({
  title: true,
  imageUrl: true,
  linkUrl: true,
  description: true,
  sortOrder: true,
  isActive: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type ContactInfo = typeof contactInfo.$inferSelect;
