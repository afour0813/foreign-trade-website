# Sunny Hair Bows - Project Documentation

## Project Overview

A B2B e-commerce website for children's hair accessories manufacturer, featuring a public-facing website and an admin management system.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── products/                 # Products pages
│   │   ├── page.tsx              # Products listing
│   │   └── [slug]/page.tsx       # Product detail
│   ├── about/page.tsx            # About Us page
│   ├── contact/page.tsx          # Contact Us page
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx             # Dashboard
│   │   ├── login/page.tsx       # Admin login
│   │   ├── register/page.tsx    # Admin registration
│   │   ├── products/             # Product management
│   │   ├── categories/          # Category management
│   │   ├── banners/              # Banner management
│   │   └── settings/             # Site settings
│   └── api/                      # API routes
│       ├── home/route.ts         # Homepage data
│       ├── products/route.ts     # Products API
│       ├── categories/route.ts   # Categories API
│       ├── site/route.ts         # Site info API
│       └── admin/                # Admin APIs
│           ├── auth/route.ts     # Authentication
│           ├── register/route.ts # User registration
│           ├── products/route.ts # Product CRUD
│           ├── categories/route.ts # Category CRUD
│           ├── banners/route.ts  # Banner CRUD
│           └── settings/route.ts # Settings API
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── Header.tsx                # Site header
│   ├── Footer.tsx                # Site footer
│   ├── BannerCarousel.tsx        # Homepage banner
│   ├── ProductCard.tsx           # Product card
│   ├── CategoryCard.tsx          # Category card
│   └── admin/                    # Admin components
│       └── AdminLayout.tsx       # Admin layout
├── lib/                          # Utilities
│   └── db.ts                     # Database operations
└── storage/database/             # Database configuration
    ├── shared/schema.ts          # Database schema
    └── supabase-client.ts        # Supabase client
```

## Database Schema

### Tables

- **admin_users**: Admin user accounts
  - id, username, password, email, is_active, created_at, updated_at

- **categories**: Product categories
  - id, name, slug, description, image_url, parent_id, sort_order, is_active, created_at, updated_at

- **products**: Products
  - id, name, slug, description, price, category_id, images (JSON), is_featured, is_active, sort_order, min_order, material, size, color, packaging, moq, created_at, updated_at

- **banners**: Homepage banners
  - id, title, image_url, link_url, description, sort_order, is_active, created_at, updated_at

- **site_settings**: Key-value site settings
  - id, key, value, description, created_at, updated_at

- **contact_info**: Company contact information
  - id, address, phone, email, whatsapp, wechat, skype, working_hours, created_at, updated_at

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Environment Variables

The project uses Supabase for database, which is configured automatically by the Coze platform.

## Key Features

### Public Website
- Homepage with banner carousel, categories, and featured products
- Product listing with category filtering and search
- Product detail pages with full specifications
- About Us page
- Contact Us page with inquiry form

### Admin Panel
- Authentication system (login/register)
- Dashboard with statistics
- Product management (CRUD)
- Category management (CRUD)
- Banner management (CRUD)
- Site settings management (contact info, about us content)

## API Endpoints

### Public APIs
- `GET /api/home` - Homepage data (banners, categories, featured products)
- `GET /api/products` - List products (supports category and slug filters)
- `GET /api/categories` - List categories
- `GET /api/site` - Site info and contact details

### Admin APIs
- `POST /api/admin/auth` - Login
- `DELETE /api/admin/auth` - Logout
- `GET /api/admin/auth` - Check authentication
- `POST /api/admin/register` - Register admin user
- `GET/POST/PUT/DELETE /api/admin/products` - Product CRUD
- `GET/POST/PUT/DELETE /api/admin/categories` - Category CRUD
- `GET/POST/PUT/DELETE /api/admin/banners` - Banner CRUD
- `GET/POST /api/admin/settings` - Site settings
