# Implementation Plan - Vela Keyboard Catalog

Rencana kerja untuk membangun bagian katalog dari website **Vela** menggunakan **Next.js** (App Router), **Prisma ORM**, dan **PostgreSQL** (port 5433).

---

## User Review Required

> [!IMPORTANT]
> **Struktur Berlapis (Layering Pattern):**  
> Sesuai spesifikasi, kita akan memisahkan kode menjadi layer-layer terpisah:
> - **Route Handler**: Menangani routing HTTP (`app/product-service/products/route.ts`).
> - **Controller**: Menangani request/response HTTP, validasi parameter menggunakan Zod (`controllers/productController.ts`).
> - **Service**: Menangani logika query database dan filter pencarian (`services/productService.ts`).
> - **Model**: Didefinisikan oleh Prisma Client (`prisma/schema.prisma`).
>
> Validasi input parameter hanya akan diletakkan di controller/service layer, tidak tersebar di view.

> [!IMPORTANT]
> **Desain Dark Premium & Minimalis:**  
> Desain halaman utama katalog (`app/page.tsx`) akan dirancang menggunakan CSS Modules (Vanilla CSS) agar sesuai dengan estetika visual gelap, minimalis, dan premium dari [design-page.png](file:///Users/OUT2305/Repo/vela-keyboard-catalog/docs/vela-assets/design-page.png). Kami akan memindahkan file gambar produk resmi ke folder `public/` agar dapat diakses oleh Next.js.

> [!IMPORTANT]
> **Penerapan Pagination Opsional:**  
> Meskipun data benih (seed data) bawaan hanya berisi 4 produk, dari sudut pandang kualitas rekayasa perangkat lunak (*production-grade quality*), API katalog produk idealnya mendukung pembatasan data. Oleh karena itu, kami merancang endpoint API untuk menerima parameter opsional `page` (default: 1) dan `limit` (default: 10). Jika tidak dikirimkan, API akan mengembalikan seluruh produk di dalam objek `"content"`, menjaga kompatibilitas penuh dengan spesifikasi yang diminta.

---

## Database Connection Settings

Sesuai informasi kredensial yang Anda berikan, konfigurasi database adalah sebagai berikut:
- **Port:** 5433
- **Username:** postgres
- **Password:** postgres
- **Database Name:** vela_keyboard
- **Connection String (`.env`):** `postgresql://postgres:postgres@localhost:5433/vela_keyboard`

---

## HTML Mockup Review

> [!TIP]
> **Mockup Desain untuk Direview:**  
> Sebelum mengimplementasikan kode di Next.js, saya telah membuat file mockup HTML interaktif dengan Vanilla CSS dan JS di **[catalog-mockup.html](file:///Users/OUT2305/Repo/vela-keyboard-catalog/docs/catalog-mockup.html)**. Anda dapat langsung membuka file tersebut dengan browser untuk melihat tampilan desain, navigasi, layout produk, dan fungsionalitas pencarian/filternya.

---

## Design System (Extracted from design-page.png)

Berdasarkan analisis visual dari berkas desain resmi [design-page.png](file:///Users/OUT2305/Repo/vela-keyboard-catalog/docs/vela-assets/design-page.png), berikut adalah *Design System* terperinci yang kita ekstrak dan terapkan:

### 1. Warna (Color Palette)
- **Background Utama (Background):** `#000000` (Pure Black). Menghindari abu-abu solid agar memberikan kedalaman dan fokus maksimal pada foto produk.
- **Background Kartu & Section (Surface):** `#000000` (Seamless / Transparan). Produk melayang bebas langsung di atas latar belakang hitam tanpa adanya kotak/card penampung yang membatasi gambar.
- **Text Primer (White):** `#ffffff` (Putih bersih).
- **Text Sekunder/Muted (Silver-Gray):** `#86868b` (Warm silver-gray khas Apple).
- **Warna Aksen/Bronze Gold (Gold Detail):** `#c5a880` (Bronze Gold) / `#a98d6c`. Digunakan untuk detail kecil penunjuk nomor indeks kolom (misal: "01", "02"), kategori produk, serta *call-to-action* sekunder (seperti teks tautan "learn more").
- **Borders & Dividers (Border):** `#141414` (Garis tipis berwarna abu-abu sangat gelap dan redup).
- **Interactive States:** Hover link menjadi putih solid `#ffffff`. Hover tombol buy solid putih menjadi opacity 95%. Hover kartu melayang menaikkan skala gambar produk secara halus (`scale(1.03)`) dan menggeser ikon panah (`→`) di teks "learn more".

### 2. Tipografi (Typography)
- **Font-Family:** System Font Stack (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif`). Ini memastikan rendering font di macOS menggunakan **SF Pro Display** yang asli, bersih, geometris, dan sangat tajam, sama persis seperti berkas desain.
- **Heading (Hero/Header):**
  - Ukuran: Sangat Besar (64px).
  - Ketebalan: `400` (Regular) / `300` (Light).
  - Letter Spacing: `-0.035em` (sangat rapat) untuk nuansa mewah.
  - Line Height: `1.1` (sangat padat).
  - Case: Menggunakan huruf kecil secara sengaja pada sub-heading (*"Precision / you can feel."* di mana baris kedua *"you can feel."* semuanya menggunakan huruf kecil).
- **Sub-headings & Card Titles:**
  - Ukuran: Medium (20px).
  - Ketebalan: `400` (Regular) / `500` (Medium).
  - Letter Spacing: `-0.02em`.
- **Body & Muted Text:**
  - Ukuran: Kecil (13px - 13.5px).
  - Ketebalan: `300` (Light) atau `400` (Regular).
  - Line Height: `1.6` (ruang spasi tinggi untuk kenyamanan baca).

### 3. Layout & Layout Rhythm (Nav & Spacing)
- **Top Navigation (Navbar):**
  - Ikon logo "V" geometris asimetris (slanted left leg lebih lebar) di samping tulisan "Vela".
  - **Penempatan Menu:** Seluruh tautan navigasi (`Design`, `Feel`, `Sound`, `Specs`) diletakkan di **sebelah kanan**, berdekatan dengan tombol **"Buy"** (tidak di tengah). Bagian tengah dibiarkan kosong untuk menonjolkan visual minimalis.
- **Grid Tanpa Card Box (Borderless Columns):**
  - Grid diatur menjadi 3 kolom. Setiap kolom tidak menggunakan box kartu melainkan dipisahkan secara langsung menggunakan pembatas vertikal tipis (`border-right: 1px solid #141414`) antar kolomnya (kecuali kolom terakhir pada baris).
  - Spacing atas-bawah menggunakan padding tinggi (`100px`) untuk membiarkan elemen visual "bernapas".
- **Section Langganan (Make the desk quieter):**
  - Ditempatkan di bawah grid produk dan di atas footer, dipisahkan dengan garis horizontal.
  - Sisi kiri: Judul "Make the desk quieter." (40px, regular) dengan subtext kecil.
  - Sisi kanan: Input field "Enter your email" di dalam kontainer berdesain pill hitam dengan border abu-abu gelap, yang memuat tombol solid putih "Notify me" di sebelah kanan.

---

## Project Structure

Rancangan struktur folder setelah proyek selesai diinisialisasi dan diimplementasikan:

```text
vela-keyboard-catalog/
├── app/
│   ├── page.tsx                             # Frontend view: Halaman katalog interaktif
│   ├── globals.css                          # Custom Vanilla CSS untuk tema premium
│   ├── layout.tsx                           # Global layout
│   └── product-service/
│       └── products/
│           └── route.ts                     # API Route: GET /product-service/products
├── controllers/
│   └── productController.ts                 # Controller: Validasi request & response handler
├── services/
│   └── productService.ts                     # Service: Logika bisnis dan query DB
├── prisma/
│   ├── schema.prisma                        # Schema database Prisma
│   └── seed.ts                              # Script seeder data
├── public/                                  # Folder asset gambar produk Next.js
│   ├── product-hero.png
│   ├── product-top.png
│   ├── product-detail.png
│   └── product-exploded.png
├── docs/                                    # Dokumentasi & aset asli
│   ├── vela-assets/                         # File gambar desain & render asli
│   ├── catalog-mockup.html                  # Mockup desain HTML untuk review awal
│   └── IMPLEMENTATION-PLAN.md               # File rencana kerja ini
├── .env                                     # Konfigurasi environment (DATABASE_URL)
├── package.json
└── tsconfig.json
```

---

## Proposed Changes

### Phase 1: User Story 1 - Product Table & Seeder [BE]

#### [NEW] [next-app](file:///Users/OUT2305/Repo/vela-keyboard-catalog/)
Inisialisasi aplikasi Next.js baru di root directory `./` menggunakan perintah non-interaktif:
```bash
npx -y create-next-app@latest ./ --ts --no-tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

#### [NEW] [prisma-setup](file:///Users/OUT2305/Repo/vela-keyboard-catalog/prisma/schema.prisma)
Inisialisasi Prisma ORM dengan PostgreSQL provider:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-name"
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  sku         String   @unique
  category    String
  price       Int
  stock       Int
  active      Boolean  @default(true)
  image       String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### [NEW] [prisma-seed](file:///Users/OUT2305/Repo/vela-keyboard-catalog/prisma/seed.ts)
Script seeder untuk mengisi 4 data produk dari lampiran tugas ke database PostgreSQL:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

### Phase 2: User Story 2 - API GET All Product [BE]

#### [NEW] [productController.ts](file:///Users/OUT2305/Repo/vela-keyboard-catalog/controllers/productController.ts)
Controller yang bertugas mengambil request, memvalidasi parameter query (`search`, `category`) dengan `zod`, memanggil service layer, dan mengembalikan response JSON standar.

#### [NEW] [productService.ts](file:///Users/OUT2305/Repo/vela-keyboard-catalog/services/productService.ts)
Service yang berinteraksi dengan database melalui Prisma untuk memfilter produk:
- Jika `search` ada: filter berdasarkan `name` atau `sku` (case-insensitive).
- Jika `category` ada: filter berdasarkan `category`.
- Hanya mengembalikan produk yang `active: true`.

#### [NEW] [route.ts](file:///Users/OUT2305/Repo/vela-keyboard-catalog/app/product-service/products/route.ts)
Next.js API route handler untuk `GET /product-service/products` yang memanggil `ProductController.getAllProducts`.

### Phase 3: User Story 3 - Catalog Page [FE]

#### [NEW] [page.tsx](file:///Users/OUT2305/Repo/vela-keyboard-catalog/app/page.tsx)
Halaman katalog produk utama. Komponen ini akan memanggil API local dan mengimplementasikan UI sesuai layout navigasi, header hero, kontrol filter kategori, dan pencarian produk secara interaktif.

#### [MODIFY] [globals.css](file:///Users/OUT2305/Repo/vela-keyboard-catalog/app/globals.css)
Modifikasi gaya global untuk menerapkan tema gelap (*dark mode*), font sans-serif modern (misal Outfit/Inter), layout responsif, spasi yang presisi, efek glassmorphism, dan transisi hover yang halus sesuai referensi desain.

#### [NEW] [Aset Gambar](file:///Users/OUT2305/Repo/vela-keyboard-catalog/public/)
Menyalin file gambar produk resmi ke folder `public/`:
- `product-hero.png`
- `product-top.png`
- `product-detail.png`
- `product-exploded.png`

---

## Verification Plan & Quality Pass Evidence

Untuk memenuhi kriteria **Quality Pass** yang mewajibkan bukti nyata (*evidence*) untuk setiap User Story, kita menerapkan strategi pengujian otomatis untuk menghasilkan berkas bukti di dalam folder `docs/evidence/`:

### 1. Bukti User Story 1 (Product Table & Seeder)
- **Uji Otomatis:** Kita akan membuat script verifikasi database `scripts/verify-db.ts` yang melakukan query langsung via Prisma ke PostgreSQL untuk memastikan 4 produk telah berhasil di-seed.
- **Output Bukti:** Hasil verifikasi teks akan disimpan secara otomatis ke file: `docs/evidence/story-1-verification.txt`.
- **Perintah Verifikasi:** `npx ts-node scripts/verify-db.ts`

### 2. Bukti User Story 2 (API GET All Product)
- **Uji Otomatis:** Kita akan membuat script pengujian API `scripts/verify-api.ts` yang menembak endpoint lokal `GET /product-service/products` dengan berbagai filter dan mencatat output respons.
- **Output Bukti:** JSON response payload asli dan status HTTP akan direkam langsung ke file: `docs/evidence/story-2-verification.txt`.
- **Perintah Verifikasi:** `npx ts-node scripts/verify-api.ts`

### 3. Bukti User Story 3 (Catalog Page)
- **Uji Otomatis (UI Screenshot):** Kita akan menggunakan otomatisasi browser untuk menavigasi `http://localhost:3000` di lingkungan lokal, mensimulasikan input pencarian serta klik tombol filter, dan menyimpan cuplikan layar (*screenshot*) aslinya.
- **Output Bukti:** File gambar screenshot akan disimpan ke:
  - `docs/evidence/story-3-full-catalog.png` (Tampilan awal semua produk)
  - `docs/evidence/story-3-filtered-switches.png` (Tampilan setelah filter "switches" diaktifkan)
  - `docs/evidence/story-3-search-low-profile.png` (Tampilan setelah pencarian kata kunci "Low-Profile")
- Screenshot ini akan ditautkan di berkas walkthrough proyek sebagai bukti visual pembanding terhadap `design-page.png`.
