# AnnaHairBows - Children's Hair Accessories B2B Website

A professional B2B e-commerce website for children's hair accessories manufacturer, featuring a public-facing showcase website with multi-language support (English/Korean) and a Chinese admin management system.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (via Supabase)
- **Package Manager**: pnpm

## Features

### Public Website
- Homepage with banner carousel, categories, and featured products
- Product listing with category filtering and search
- Product detail pages with full specifications
- About Us page
- Contact Us page with inquiry form
- News & Updates section
- Download center for catalogs and documents
- Multi-language support (English / Korean) with top-right language switcher
- Responsive design (mobile + desktop)

### Admin Panel (Chinese)
- Authentication system (login / register)
- Dashboard with statistics overview
- Product management (CRUD)
- Category management (CRUD)
- Banner management (CRUD)
- News management (CRUD)
- Download management (CRUD)
- Inquiry management (read status, status updates, email reply)
- Site settings (contact info, about us content, SEO)

## Prerequisites

- Node.js 20+ (recommended: 24)
- pnpm 9+
- Supabase account (for PostgreSQL database)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/afour0813/foreign-trade-website.git
cd foreign-trade-website
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Supabase Database (required)
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key
COZE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server port (default: 5000)
DEPLOY_RUN_PORT=5000

# Project domain (optional, for absolute URL generation)
COZE_PROJECT_DOMAIN_DEFAULT=https://yourdomain.com
```

### 4. Start development server

```bash
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000) to view the website.

### 5. Build for production

```bash
pnpm build
```

### 6. Start production server

```bash
pnpm start
```

## Project Structure

```
src/
├── app/                              # Next.js App Router pages
│   ├── page.tsx                      # Homepage
│   ├── layout.tsx                    # Root layout
│   ├── products/                     # Products pages
│   │   ├── page.tsx                  # Products listing
│   │   └── [slug]/page.tsx          # Product detail
│   ├── about/page.tsx               # About Us page
│   ├── contact/page.tsx             # Contact Us page
│   ├── news/                        # News pages
│   │   ├── page.tsx                 # News listing
│   │   └── [slug]/page.tsx         # News detail
│   ├── downloads/page.tsx           # Download center
│   ├── admin/                       # Admin panel (Chinese)
│   │   ├── (auth)/                  # Auth pages (login/register)
│   │   └── (dashboard)/            # Dashboard pages
│   └── api/                         # API routes
│       ├── home/route.ts            # Homepage data
│       ├── products/route.ts        # Products API
│       ├── categories/route.ts      # Categories API
│       ├── site/route.ts            # Site info API
│       ├── news/route.ts            # News API
│       ├── downloads/route.ts       # Downloads API
│       ├── inquiries/route.ts       # Inquiry submission API
│       └── admin/                   # Admin APIs (auth required)
├── components/                       # React components
│   ├── ui/                          # shadcn/ui components
│   ├── Header.tsx                   # Site header (with language switcher)
│   ├── Footer.tsx                   # Site footer
│   ├── BannerCarousel.tsx           # Homepage banner
│   ├── ProductCard.tsx              # Product card
│   ├── CategoryCard.tsx             # Category card
│   └── admin/                       # Admin components
├── lib/                             # Utilities
│   ├── db.ts                        # Database operations
│   ├── admin-auth.ts                # Admin authentication
│   ├── i18n/                        # Internationalization
│   │   ├── config.ts               # Locale config (en, ko)
│   │   ├── translations.ts         # EN/KO translation dictionaries
│   │   └── context.tsx             # I18nProvider + useI18n hook
│   └── utils.ts                    # Utility functions
├── storage/database/                # Database configuration
│   ├── shared/schema.ts            # Database schema
│   └── supabase-client.ts          # Supabase client
└── server.ts                        # Custom server entry
```

## API Endpoints

### Public APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/home` | Homepage data (banners, categories, featured products) |
| GET | `/api/products` | List products (supports `category`, `slug` filters) |
| GET | `/api/categories` | List categories |
| GET | `/api/site` | Site info and contact details |
| GET | `/api/news` | List news articles |
| GET | `/api/downloads` | List downloadable files |
| POST | `/api/inquiries` | Submit an inquiry |

### Admin APIs (Authentication required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth` | Login |
| DELETE | `/api/admin/auth` | Logout |
| GET | `/api/admin/auth` | Check authentication |
| POST | `/api/admin/register` | Register admin user |
| GET/POST | `/api/admin/products` | Product CRUD |
| PUT/DELETE | `/api/admin/products` | Product update/delete |
| GET/POST | `/api/admin/categories` | Category CRUD |
| PUT/DELETE | `/api/admin/categories` | Category update/delete |
| GET/POST | `/api/admin/banners` | Banner CRUD |
| PUT/DELETE | `/api/admin/banners` | Banner update/delete |
| GET/POST | `/api/admin/news` | News CRUD |
| PUT/DELETE | `/api/admin/news` | News update/delete |
| GET/POST | `/api/admin/downloads` | Download CRUD |
| PUT/DELETE | `/api/admin/downloads` | Download update/delete |
| GET/POST | `/api/admin/inquiries` | Inquiry management |
| PUT | `/api/admin/inquiries` | Update inquiry status |
| GET/POST | `/api/admin/settings` | Site settings |

## Database Schema

### Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `admin_users` | Admin accounts | id, username, password, email, is_active |
| `categories` | Product categories | id, name, slug, image_url, sort_order, is_active |
| `products` | Products | id, name, slug, price, category_id, images, is_featured, is_active |
| `banners` | Homepage banners | id, title, image_url, link_url, sort_order, is_active |
| `news` | News articles | id, title, slug, content, category, is_active |
| `downloads` | Downloadable files | id, title, file_url, file_size, download_count, is_active |
| `inquiries` | Customer inquiries | id, name, email, phone, message, status, is_read |
| `site_settings` | Key-value settings | id, key, value, description |
| `contact_info` | Company contact info | id, address, phone, email, whatsapp, wechat, skype |

## Deployment

### PM2 (Recommended for VPS)

```bash
# Install PM2
npm install -g pm2

# Build
pnpm build

# Start with PM2
pm2 start pnpm --name "annahairbows" -- start

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Docker

```bash
# Build image
docker build -t annahairbows .

# Run container
docker run -d \
  --name annahairbows \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  annahairbows
```

### Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/ssl/yourdomain.crt;
    ssl_certificate_key /etc/ssl/yourdomain.key;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## License

Private - All rights reserved.
