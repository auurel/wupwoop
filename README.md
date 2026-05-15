# Muzayyan - Website Interaktif Jasa Jahit & Penjualan Produk

Website full-stack untuk Muzayyan, bisnis jasa jahit custom dan penjualan produk ready-to-wear yang berdiri sejak 1 Maret 2017 di Kebumen, Jawa Tengah.

## 🎯 Fitur Utama

### Frontend Public
- ✨ Landing page responsif dengan design elegan sesuai mockup
- 🎨 Color scheme orange-cream dengan typography serif yang elegan
- 📱 Mobile-first responsive design
- 🔄 Smooth scroll navigation
- ✅ Animasi scroll yang subtle (Framer Motion)
- 📸 Product gallery dengan lightbox modal
- 💬 WhatsApp integration untuk setiap layanan
- ⭐ Section testimoni dengan form submit
- 🗺️ Google Maps embed untuk lokasi

### Admin Panel
- 🔐 Authentication dengan JWT
- 📊 Dashboard dengan statistik real-time
- ✏️ CRUD untuk:
  - Produk (upload gambar ke Cloudinary)
  - Layanan/Jasa
  - Testimoni (moderation)
  - Jam Operasional
  - Site Settings
  - Contact Inquiries
- 🖼️ Drag-to-reorder untuk produk dan layanan
- 🔒 Protected routes dengan token verification

### Backend API
- RESTful API dengan Next.js 14 App Router
- PostgreSQL + Prisma ORM
- Server-side validation dengan Zod
- CORS-enabled endpoints
- Error handling terpusat

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ dengan npm/yarn
- PostgreSQL 12+ (atau cloud: Neon, Supabase, Vercel Postgres)
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

Buka http://localhost:3000 di browser Anda.

**Login Admin:**
- Email: `admin@muzayyan.com`
- Password: `Admin@123456` (sesuaikan di .env.local)

## 📁 Struktur Project

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

## 🎨 Design System

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

## 📡 API Documentation

### Public Endpoints

#### GET `/api/services`
Fetch semua layanan aktif
```json
[
  {
    "id": "cuid",
    "name": "Jahit Kebaya Custom",
    "slug": "jahit-kebaya-custom",
    "order": 1
  }
]
```

#### GET `/api/products`
Fetch produk (dengan pagination)
```json
{
  "data": [...],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

#### GET `/api/testimonials`
Fetch testimoni yang approved

#### POST `/api/testimonials`
Submit testimoni baru (pending approval)
```json
{
  "customerName": "Siti Nur Azizah",
  "rating": 5,
  "message": "..."
}
```

#### GET `/api/operating-hours`
Fetch jam operasional

#### GET `/api/settings`
Fetch site settings (WhatsApp, sosial media, alamat, dll)

#### POST `/api/contact`
Submit contact inquiry

### Admin Endpoints (Protected)

#### POST `/api/admin/login`
```json
{
  "email": "admin@muzayyan.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "jwt-token",
  "admin": {
    "id": "...",
    "email": "...",
    "name": "...",
    "role": "admin"
  }
}
```

#### GET `/api/admin/stats`
Fetch dashboard statistics (requires Bearer token)

#### CRUD Products, Services, Testimonials, dll
Contoh:
- `POST /api/admin/products` (create)
- `PUT /api/admin/products/:id` (update)
- `DELETE /api/admin/products/:id` (delete)
- `PATCH /api/admin/products/reorder` (reorder)

## 🔐 Authentication

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

## 📸 Image Management

### Cloudinary Setup (Optional)

1. Daftar di [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret ke .env.local
3. Implementasi upload di admin panel akan otomatis terintegrasi

Atau gunakan:
- **Vercel Blob Storage** untuk simplicity
- **AWS S3** untuk scale
- **Local filesystem** untuk development (tidak recommended production)

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard
```

### Deploy Manual

1. **Build aplikasi**
   ```bash
   npm run build
   ```

2. **Generate migration database**
   ```bash
   npm run db:migrate
   ```

3. **Run production server**
   ```bash
   npm start
   ```

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

## 🐛 Troubleshooting

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

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)

## 📞 Support

Untuk pertanyaan atau issue, silahkan buat GitHub issue atau hubungi tim development.

## 📄 License

© 2024 Muzayyan - Jasa Jahit & Penjualan Produk Ready-to-Wear. All rights reserved.

---

**Happy coding! 🚀**
