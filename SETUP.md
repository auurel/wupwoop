# 🚀 SETUP GUIDE - Muzayyan Website

## Tahapan Setup

### 1️⃣ Prerequisites Check
- ✅ Node.js 18+ installed
- ✅ PostgreSQL 12+ (lokal atau cloud: Neon, Supabase, Vercel Postgres)
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

### 2️⃣ Environment Setup

#### Generate NextAuth Secret
```bash
# Buka terminal dan jalankan:
openssl rand -hex 32
# Copy hasilnya untuk NEXTAUTH_SECRET
```

#### Database Setup (Pilih Salah Satu)

**Option A: PostgreSQL Lokal (Windows)**
```bash
# Installer: https://www.postgresql.org/download/windows/
# Default port: 5432
# Username: postgres
# Password: (set saat install)

# Connection string:
postgresql://postgres:password@localhost:5432/muzayyan
```

**Option B: Neon Cloud (Recommended)**
1. Buka https://neon.tech (free tier tersedia)
2. Create project "muzayyan"
3. Copy connection string
4. Format: `postgresql://user:password@host.neon.tech:5432/muzayyan?sslmode=require`

**Option C: Supabase**
1. Buka https://supabase.com
2. Create project
3. Copy PostgreSQL connection string
4. Format: `postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres`

### 3️⃣ Project Setup

```bash
# Terminal di folder d:\Tugas Semester 6\Capstone\web

# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local dengan:
# - DATABASE_URL (lihat tahap 2)
# - NEXTAUTH_SECRET (dari openssl rand -hex 32)
# - SEED_ADMIN_EMAIL & PASSWORD

# 4. Setup database
npm run db:push

# 5. Seed initial data
npm run db:seed

# 6. Start development server
npm run dev
```

### 4️⃣ Test Website

**Frontend:**
- http://localhost:3000 (public website)

**Admin:**
- http://localhost:3000/admin/login
- Email: `admin@muzayyan.com`
- Password: `Admin@123456` (default dari .env.local)

### 5️⃣ Customize

Edit file `.env.local`:
```env
# Update nomor WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="628xxxxxxxxx"

# Update admin credentials
SEED_ADMIN_EMAIL="email-anda@domain.com"
SEED_ADMIN_PASSWORD="password-kuat-anda"
```

Jalankan ulang seed untuk update data:
```bash
npm run db:seed
```

---

## 📱 Structure Overview

### Public Pages ✨
- `/` - Landing page dengan semua section
- `/api/services` - Fetch services
- `/api/products` - Fetch products
- `/api/testimonials` - Fetch testimoni
- `/api/settings` - Fetch settings site

### Admin Pages 🔐
- `/admin/login` - Login page
- `/admin` - Dashboard (protected)
- `/admin/products` - Kelola produk (protected)
- `/admin/services` - Kelola layanan (protected)
- `/admin/testimonials` - Moderate testimoni (protected)
- `/admin/hours` - Edit jam operasional (protected)
- `/admin/settings` - Site settings (protected)
- `/admin/inquiries` - Lihat inquiries (protected)

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solusi:**
- Pastikan PostgreSQL running
- Cek DATABASE_URL di .env.local
- Test connection: `psql [DATABASE_URL]`

### Port 3000 Sudah Digunakan
```bash
npm run dev -- -p 3001
```

### Clear Cache & Rebuild
```bash
rm -rf .next
npm run build
```

### Reset Database
```bash
# Drop table dan recreate
npm run db:push -- --force-reset

# Re-seed data
npm run db:seed
```

### Token Invalid
```bash
# Clear localStorage di browser console
localStorage.clear()

# Logout dari admin sidebar
# Login ulang dengan kredensial yang benar
```

---

## 📚 Useful Commands

```bash
# Development
npm run dev                      # Start dev server

# Database
npm run db:push                  # Sync schema ke database
npm run db:migrate               # Create migration
npm run db:seed                  # Seed initial data
npm run db:studio                # Open Prisma Studio (GUI)

# Build & Production
npm run build                    # Build untuk production
npm start                        # Run production server
npm run lint                     # Check linting errors
```

---

## 🔐 Security Checklist

Sebelum production:

- [ ] Change `NEXTAUTH_SECRET` ke random string yang aman
- [ ] Update `SEED_ADMIN_PASSWORD` ke password yang kuat
- [ ] Set `NEXTAUTH_URL` ke domain production
- [ ] Enable HTTPS pada hosting
- [ ] Setup rate limiting untuk login
- [ ] Enable CORS dengan whitelist domain
- [ ] Regular backup database
- [ ] Monitor logs untuk suspicious activity

---

## 📝 Common Customizations

### Ubah WhatsApp Number
File: `.env.local`
```env
NEXT_PUBLIC_WHATSAPP_NUMBER="628123456789"
```

### Ubah Jam Operasional
Admin Panel → Pengaturan → Jam Operasional
(Fitur lengkap akan ditambahkan di phase 2)

### Ubah Social Media
Admin Panel → Pengaturan → Social Links
(Fitur lengkap akan ditambahkan di phase 2)

### Upload Produk
Admin Panel → Produk → Tambah Produk
(Sementara perlu URL gambar, akan ditambahkan Cloudinary integration)

---

## 🎨 Design Customization

Warna utama ada di:
- `tailwind.config.js` (color palette)
- `app/globals.css` (CSS variables)

Untuk change warna primary orange `#F5A623`:
1. Edit `tailwind.config.js` - colors section
2. Update `.env` color references
3. Rebuild: `npm run build`

---

## 📞 Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com
- Neon Database: https://neon.tech/docs

---

## ⏭️ Next Phase

Setelah setup berhasil, lanjut ke:
1. Complete remaining admin CRUD pages
2. Add image upload dengan Cloudinary
3. Setup SEO & deployment
4. Testing & optimization

Dokumentasi lengkap ada di `README.md`

---

**Happy coding! 🚀**
