import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = [
    {
      name: "Vela V1 75%",
      sku: "VLA-K75",
      category: "keyboard",
      price: 1850000,
      stock: 12,
      active: true,
      image: "/product-hero.png",
      description: "75% hot-swap keyboard, CNC aluminium case, volume knob."
    },
    {
      name: "Vela V1 Low-Profile",
      sku: "VLA-K75-LP",
      category: "keyboard",
      price: 1650000,
      stock: 8,
      active: true,
      image: "/product-top.png",
      description: "Low-profile variant for light typing, same 75% layout."
    },
    {
      name: "Vela Switch Tactile 45g (10 pcs)",
      sku: "VLA-SW-T45",
      category: "switch",
      price: 85000,
      stock: 120,
      active: true,
      image: "/product-detail.png",
      description: "45g tactile switches, factory lubed, 3-pin MX-style."
    },
    {
      name: "Vela V1 Barebones Kit",
      sku: "VLA-K75-BB",
      category: "kit",
      price: 1250000,
      stock: 6,
      active: true,
      image: "/product-exploded.png",
      description: "Case, plate, gasket, and hot-swap PCB — build with your choice of switches and keycaps."
    }
  ];

  console.log('Seeding database with default products...');

  for (const product of products) {
    const upserted = await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });
    console.log(`Upserted product: ${upserted.name} (${upserted.sku})`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
