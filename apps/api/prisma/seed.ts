/// <reference types="node" />

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import * as dotenv from 'dotenv';
import { join } from 'path';

import { PrismaClient, UserRole } from '../generated/prisma';

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// Storage helper class for seed script
class StorageHelper {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;
  private endpoint: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME!;
    this.publicUrl = process.env.R2_PUBLIC_URL!;
    this.endpoint = process.env.R2_ENDPOINT!;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    contentType: string = 'image/jpeg',
    prefix: string = 'products'
  ): Promise<string> {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.\./g, '_')
      .substring(0, 255);

    const key = `${prefix}/${timestamp}-${randomSuffix}-${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    // Return public URL
    return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
  }
}

async function checkIfSeeded(): Promise<boolean> {
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@wds.org' },
  });
  return !!adminUser;
}

async function createAdminUser() {
  const hashedPassword = await argon2.hash('admin123@');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wds.org' },
    update: {},
    create: {
      email: 'admin@wds.org',
      password: hashedPassword,
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);
  return admin;
}

// List of curated shoe image URLs from Unsplash
const SHOE_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2hvZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1682125177822-63c27a3830ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hvZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2hvZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1561909848-977d0617f275?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1570464197285-9949814674a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1521774971864-62e842046145?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1537636568536-a2e00b44cb85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHNob2V8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1636718282214-0b4162a154f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHNob2V8ZW58MHx8MHx8fDA%3D',
];

async function generateProductImage(
  storage: StorageHelper,
  imageUrl: string
): Promise<string> {
  // Fetch shoe image from provided URL
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // Verify it's actually an image
      if (contentType.startsWith('image/')) {
        const url = await storage.uploadBuffer(
          buffer,
          `shoe-${faker.string.uuid()}.${contentType.split('/')[1] || 'jpg'}`,
          contentType,
          'products'
        );
        return url;
      }
    }
  } catch (_error) {
    // Fall through to SVG placeholder
  }

  // Fallback: create a shoe-themed SVG placeholder
  console.warn('Using SVG placeholder for shoe image');
  const colors = [
    ['#1a1a1a', '#000000'],
    ['#2c2c2c', '#1a1a1a'],
    ['#3d3d3d', '#2c2c2c'],
    ['#4a4a4a', '#3d3d3d'],
    ['#5c5c5c', '#4a4a4a'],
  ];
  const [color1, color2] = faker.helpers.arrayElement(colors);
  const shoeEmojis = ['👟', '👠', '🥾', '👢', '🩴'];
  const shoeEmoji = faker.helpers.arrayElement(shoeEmojis);

  const svg = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="url(#grad)"/>
    <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="120" text-anchor="middle" dominant-baseline="middle">${shoeEmoji}</text>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">Shoe Product</text>
    <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="24" fill="#cccccc" text-anchor="middle" dominant-baseline="middle">Premium Quality</text>
  </svg>`;
  const placeholderBuffer = Buffer.from(svg);
  return await storage.uploadBuffer(
    placeholderBuffer,
    `shoe-placeholder-${faker.string.uuid()}.svg`,
    'image/svg+xml',
    'products'
  );
}

async function createProducts(storage: StorageHelper) {
  const sizes = ['S', 'M', 'L', 'XL'];
  const count = SHOE_IMAGE_URLS.length;
  let createdCount = 0;

  console.log(
    `\n📦 Creating ${count} products (based on ${count} shoe images)...`
  );

  // Shuffle the image URLs to randomize which product gets which image
  const shuffledImageUrls = faker.helpers.shuffle([...SHOE_IMAGE_URLS]);

  for (let i = 0; i < count; i++) {
    const productName = faker.commerce.productName();
    const slug = faker.helpers.slugify(productName).toLowerCase();
    const priceCurrent = parseFloat(
      faker.commerce.price({ min: 100000, max: 5000000 })
    );
    const hasDiscount = faker.datatype.boolean({ probability: 0.3 });
    const priceOriginal = hasDiscount
      ? parseFloat(
          faker.commerce.price({ min: priceCurrent, max: priceCurrent * 1.5 })
        )
      : null;
    const priceDiscount = priceOriginal ? priceOriginal - priceCurrent : null;

    // Generate product image using the corresponding URL
    console.log(`  [${i + 1}/${count}] Creating product: ${productName}...`);
    const imageUrl = await generateProductImage(storage, shuffledImageUrls[i]);

    // Combine description with image URL
    const baseDescription = faker.commerce.productDescription();
    const description = `${baseDescription}\n\n[IMAGE_URL:${imageUrl}]`;

    const product = await prisma.product.create({
      data: {
        slug: `${slug}-${faker.string.alphanumeric(8)}`,
        name: productName,
        description,
        priceCurrent,
        priceOriginal,
        priceDiscount,
        badge: faker.datatype.boolean({ probability: 0.2 })
          ? faker.helpers.arrayElement([
              'Limited Edition',
              'Official Merch',
              'New Arrival',
              'Best Seller',
            ])
          : null,
        ratingValue: parseFloat(
          faker.number.float({ min: 0, max: 5, fractionDigits: 2 }).toFixed(2)
        ),
        ratingCount: faker.number.int({ min: 0, max: 1000 }),
        isPublished: faker.datatype.boolean({ probability: 0.9 }),
        sizeStocks: {
          create: sizes.map((size) => ({
            size,
            stock: faker.number.int({ min: 0, max: 100 }),
          })),
        },
      },
    });

    createdCount++;
    console.log(`  ✅ Created: ${product.name} (Image: ${imageUrl})`);
  }

  console.log(`\n✅ Created ${createdCount} products`);
}

async function main() {
  console.log('🌱 Starting seed...\n');

  // Check if already seeded
  const isSeeded = await checkIfSeeded();
  if (isSeeded) {
    console.log('⚠️  Database already seeded. Skipping...');
    console.log('   To re-seed, delete the admin user first.');
    return;
  }

  // Initialize storage helper
  const storage = new StorageHelper();
  console.log('✅ Storage helper initialized\n');

  // Create admin user
  await createAdminUser();

  // Create products (number of products = number of shoe images)
  await createProducts(storage);

  console.log(
    `\n🎉 Seed completed successfully! Created ${SHOE_IMAGE_URLS.length} products.`
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
