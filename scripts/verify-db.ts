import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  console.log('=== DATABASE VERIFICATION LOG ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('Connecting to PostgreSQL database: vela_keyboard on port 5433...');

  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' }
  });

  console.log(`\nQuery result: Found ${products.length} products in database.`);
  console.log('--------------------------------------------------');

  products.forEach((product) => {
    console.log(`ID: ${product.id}`);
    console.log(`Name: ${product.name}`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Category: ${product.category}`);
    console.log(`Price: Rp ${product.price.toLocaleString('id-ID')}`);
    console.log(`Stock: ${product.stock} units`);
    console.log(`Active: ${product.active}`);
    console.log(`Image: ${product.image}`);
    console.log(`Description: ${product.description}`);
    console.log('--------------------------------------------------');
  });

  const allAppendixProductsPresent = 
    products.length === 4 &&
    products.some(p => p.sku === 'VLA-K75') &&
    products.some(p => p.sku === 'VLA-K75-LP') &&
    products.some(p => p.sku === 'VLA-SW-T45') &&
    products.some(p => p.sku === 'VLA-K75-BB');

  if (allAppendixProductsPresent) {
    console.log('\nVERIFICATION SUCCESSFUL: All 4 Appendix products are successfully migrated and seeded in the database!');
  } else {
    console.error('\nVERIFICATION FAILED: Missing or incorrect seeded products in the database.');
    process.exit(1);
  }
}

verify()
  .catch((e) => {
    console.error('Verification failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
