# Muzayyan - Website

Website full-stack untuk Muzayyan, bisnis jasa jahit custom dan penjualan produk ready-to-wear yang berdiri sejak 1 Maret 2017 di Kebumen, Jawa Tengah.

### Prerequisites
- Node.js 18+ -> npm/yarn
- PostgreSQL 12+
- Git

### Installation

1. **Clone dan setup project**
```bash
cd d:/Tugas\ Semester\ 6/Capstone/web
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi Anda:
```env
# Database (contoh Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/muzayyan"

# NextAuth
NEXTAUTH_SECRET="generate-dengan-openssl-rand-hex-32"
NEXTAUTH_URL="http://localhost:3000"

# Admin seed
SEED_ADMIN_EMAIL="admin@muzayyan.com"
SEED_ADMIN_PASSWORD="Admin@123456"

# Cloudinary (opsional untuk image upload)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="628xxxxxxxxx"
```

3. **Setup Database**
```bash
# Push schema ke database
npm run db:push

# Seed initial data
npm run db:seed
```

4. **Run development server**
```bash
npm run dev
```

## Struktur Project

```
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Landing page
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── login/page.tsx        # Admin login
│   │   ├── page.tsx              # Dashboard
│   │   ├── products/             # Manage produk
│   │   ├── services/             # Manage layanan
│   │   ├── testimonials/         # Moderate testimoni
│   │   ├── hours/                # Edit jam operasional
│   │   ├── settings/             # Site settings
│   │   ├── inquiries/            # View contact inquiries
│   │   └── layout.tsx
│   ├── api/
│   │   ├── services/
│   │   ├── products/
│   │   ├── testimonials/
│   │   ├── operating-hours/
│   │   ├── settings/
│   │   ├── contact/
│   │   └── admin/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── sections/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProductsSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── Footer.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       └── ...
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Utility functions
│   ├── auth.ts                   # Auth helpers
│   └── cloudinary.ts             # Cloudinary config (opsional)
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Initial data seed
├── public/
│   ├── pattern-damask.svg        # SVG patterns
│   └── wavy-divider.svg
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── package.json
└── README.md
```

## Design System

### Colors
- **Primary Orange:** `#F5A623` (headings, buttons)
- **Orange Dark:** `#E89010` (hover state)
- **Orange Light:** `#FFB84D` (gradients)
- **Cream Light:** `#FFF8E7` (background utama)
- **Cream:** `#FDEBC4` (cards)
- **Peach:** `#FFE5B4` (buttons secondary)
- **Text Dark:** `#3D2817` (headings)
- **Text Body:** `#4A3520` (paragraf)

### Typography
- **Headings:** Playfair Display (serif, italic)
- **Body:** Poppins (sans-serif, 400-700 weight)

### Spacing & Sizing
- Container max-width: 1280px
- Section padding: 80px (desktop), 48px (mobile)
- Border radius: 16-24px (cards), 9999px (buttons)

## Authentication

Admin panel menggunakan JWT token yang disimpan di localStorage. Token dikirim di header `Authorization: Bearer <token>`.

```typescript
// Client-side
const token = localStorage.getItem('adminToken');
fetch('/api/admin/products', {
  headers: { Authorization: `Bearer ${token}` }
});

// Server-side
const token = request.headers.get('authorization')?.replace('Bearer ', '');
verify(token, process.env.NEXTAUTH_SECRET);
```

## Image Management

### Cloudinary Setup (Optional)

1. Daftar di [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret ke .env.local
3. Implementasi upload di admin panel akan otomatis terintegrasi

### Environment Variables di Production
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate dengan: `openssl rand -hex 32`
- `NEXTAUTH_URL` - Domain production (contoh: https://muzayyan.com)
- `CLOUDINARY_*` - Jika menggunakan Cloudinary
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - Nomor WhatsApp bisnis

## 📋 Checklist Implementasi

- [x] Setup Next.js project + dependencies
- [x] Database schema (Prisma)
- [x] Public landing page sections
- [x] Public API endpoints
- [x] Admin login page
- [x] Admin dashboard + sidebar
- [ ] Admin CRUD pages (Products, Services, Testimonials, Hours, Settings, Inquiries)
- [ ] Image upload dengan Cloudinary
- [ ] Drag-to-reorder functionality
- [ ] Moderation untuk testimoni
- [ ] SEO optimization (meta tags, sitemap, schema)
- [ ] Testing (unit, integration)
- [ ] Performance optimization (ISR, image optimization)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Documentation completion

## Troubleshooting

### Database Connection Error
```bash
# Test connection
npm run db:push

# Atau gunakan Prisma Studio
npm run db:studio
```

### Port 3000 sudah digunakan
```bash
npm run dev -- -p 3001
```

### Clear cache & rebuild
```bash
rm -rf .next
npm run build
```
