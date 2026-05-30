import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.contactInquiry.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.operatingHours.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.siteSettings.deleteMany();

  // Seed Services (7 items)
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Jahit Kebaya Custom',
        slug: 'jahit-kebaya-custom',
        order: 1,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Jahit Gamis Custom',
        slug: 'jahit-gamis-custom',
        order: 2,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Jahit Seragam Komunitas',
        slug: 'jahit-seragam-komunitas',
        order: 3,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Jahit Tunik',
        slug: 'jahit-tunik',
        order: 4,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Jahit Seragam Sekolah',
        slug: 'jahit-seragam-sekolah',
        order: 5,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Jahit Seragam Kerja',
        slug: 'jahit-seragam-kerja',
        order: 6,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Jasa Layanan Makloon',
        slug: 'jasa-layanan-makloon',
        order: 7,
      },
    }),
  ]);

  console.log(`✅ Created ${services.length} services`);

  // Seed Products (4 sample items)
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'Gamis Cokelat',
        description: 'Gamis muslimah dengan kualitas jahitan premium',
        imageUrl: '/images/tunik-1.svg',
        category: 'Gamis',
        order: 1,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Tunik Hitam',
        description: 'Tunik elegan dengan desain modern',
        imageUrl: '/images/tunik-2.svg',
        category: 'Tunik',
        order: 2,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Kain Batik Premium',
        description: 'Kain batik asli dari Kebumen',
        imageUrl: '/images/tunik-3.svg',
        category: 'Kain',
        order: 3,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Gamis Krem',
        description: 'Gamis nyaman untuk keseharian',
        imageUrl: '/images/oneset.svg',
        category: 'Gamis',
        order: 4,
        isFeatured: true,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Seed Testimonials (3 samples)
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        customerName: 'Siti Nur Azizah',
        customerInitial: 'SNA',
        rating: 5,
        message:
          'Layanan jahit Muzayyan sangat memuaskan! Gamis saya selesai tepat waktu dengan kualitas jahitan yang rapi. Saya akan merekomendasikan ke teman-teman saya.',
        isApproved: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        customerName: 'Dewi Fatimah',
        customerInitial: 'DF',
        rating: 5,
        message:
          'Kualitas hasil jahitan Muzayyan sangat bagus dan harganya terjangkau. Pelayanannya juga ramah dan profesional.',
        isApproved: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        customerName: 'Nia Winarsih',
        customerInitial: 'NW',
        rating: 5,
        message:
          'Sudah berulang kali menggunakan jasa Muzayyan dan selalu puas. Jahitan rapi, desain sesuai keinginan, dan pengiriman tepat waktu.',
        isApproved: true,
      },
    }),
  ]);

  console.log(`✅ Created ${testimonials.length} testimonials`);

  // Seed Operating Hours (7 days)
  const days = [
    { day: 'monday', dayLabel: 'Senin', order: 1 },
    { day: 'tuesday', dayLabel: 'Selasa', order: 2 },
    { day: 'wednesday', dayLabel: 'Rabu', order: 3 },
    { day: 'thursday', dayLabel: 'Kamis', order: 4 },
    { day: 'friday', dayLabel: 'Jum\'at', order: 5 },
    { day: 'saturday', dayLabel: 'Sabtu', order: 6 },
    { day: 'sunday', dayLabel: 'Minggu', isClosed: true, order: 7 },
  ];

  await Promise.all(
    days.map((d) =>
      prisma.operatingHours.create({
        data: {
          day: d.day,
          dayLabel: d.dayLabel,
          openTime: d.isClosed ? null : '07:30',
          closeTime: d.isClosed ? null : '16:30',
          isClosed: d.isClosed || false,
          order: d.order,
        },
      })
    )
  );

  console.log(`✅ Created operating hours for all days`);

  // Seed SiteSettings
  await prisma.siteSettings.create({
    data: {
      whatsappNumber: '6287889252965', // Update this
      defaultWhatsappMessage: 'Halo Muzayyan, saya ingin bertanya tentang layanan Anda',
      address: 'Jl Ahmad Yani No 83 Kebumen, Jawa Tengah',
      postalCode: '54311',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8568656468707!2d109.63652!3d-7.70819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5f5f5f5f5f5f%3A0x5f5f5f5f5f5f5f5f!2sJl.%20Ahmad%20Yani%20No.83%2C%20Kebumen%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1234567890',
      tiktokUsername: 'ruang_jahit_muzzayan',
      instagramUsername: 'ruangjahitmuzzayan',
      facebookUsername: 'Muzayyan Id',
    },
  });

  console.log(`✅ Created site settings`);

  // Seed Admin user
  const hashedPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@123456', 10);
  const admin = await prisma.admin.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@muzayyan.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'superadmin',
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
