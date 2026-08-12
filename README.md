# Vela Keyboard Catalog

A premium, minimal, dark-themed product catalog application for **Vela** (a fictional custom mechanical keyboard brand). This project is built as a full-stack Next.js application using Next.js App Router, TypeScript, Prisma ORM, and PostgreSQL.

It follows clean layering patterns (**Route Handler &rarr; Controller &rarr; Service &rarr; Model**) with input validation, database seeding, API endpoints, and a frontend catalog UI inspired by high-end product presentations.

---

## 🚀 Key Features

### Backend (Product Service)
*   **Database Schema**: Designed with Prisma ORM containing fields for `name`, `sku`, `category`, `price`, `stock`, `active`, and `description`.
*   **Database Seeder**: Populates the PostgreSQL database with the official product models from the spec sheet.
*   **REST API (`GET /product-service/products`)**:
    *   Centralized request parameter validation via **Zod Schema Validation**.
    *   Case-insensitive **live search** (matches product `name` or `sku`).
    *   **Category filter** (Keyboards, Switches, Kits).
    *   Robust **pagination** (returns pagination metadata like current page, limit, total pages, and total records).

### Frontend (User Interface)
*   **Aesthetics**: Minimalist, pure-black theme (`#000000`) with subtle dividers (`#141414`) and gold accents (`#c5a880`) matching high-end design languages.
*   **Rhythmic Layout**: A seamless borderless 3-column grid that flows naturally on desktops and shifts dynamically on mobile viewports.
*   **Fluid Animations**:
    *   **Hero Sequence**: Fade-in and slide-up entrance animation for the hero header.
    *   **Staggered Card Entrance**: Grid items load with staggered delays for a premium and organic page load feel.
    *   **Focus Ambient Glow**: Ambient organic box-shadow glows on focused inputs (Search and Subscription box).
    *   **Buy Modal Transition**: Premium overlay blur overlay (`12px`) and scale-in modal window animations.
*   **State Management**: Real-time category switching, search querying, and pagination updates that seamlessly communicate with the internal API.
*   **Out-of-Stock Statuses**: Custom indicators for products with `stock = 0`, dynamically disabling active hover arrows and fading text colors.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router, React 19)
*   **Language**: TypeScript
*   **ORM**: Prisma v7 with `@prisma/adapter-pg`
*   **Database**: PostgreSQL (port 5433)
*   **Validation**: Zod
*   **Styling**: Vanilla CSS (Global Design System)

---

## 📦 Installation & Setup

### 1. Prerequisites
Ensure you have Node.js and a running PostgreSQL database. According to the database configuration:
*   **Connection URI**: `postgresql://postgres:postgres@localhost:5433/vela_keyboard`

### 2. Setup Environment Variables
Create a `.env` file in the root directory and add your connection string:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/vela_keyboard"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migrations & Seeding
Run the migrations to create the database schema and populate it with the initial product data:
```bash
# Run migrations
npx prisma migrate dev --name init

# Run seeder
npx prisma db seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Verification & QA Evidence

To satisfy the **Quality Pass** gates, verification scripts are included in the `scripts/` directory:

1.  **Database Verification**: Checks if all seed products exist in PostgreSQL.
    ```bash
    npx ts-node scripts/verify-db.ts
    ```
    *Log output saved to:* [docs/evidence/story-1-verification.txt](docs/evidence/story-1-verification.txt)

2.  **API Endpoint Verification**: Hits the API with various queries (search term, category filters, pagination limits) and logs JSON responses.
    ```bash
    npx ts-node scripts/verify-api.ts
    ```
    *Log output saved to:* [docs/evidence/story-2-verification.txt](docs/evidence/story-2-verification.txt)

---

## 📸 Screenshots (Evidence)

Below are the screenshots of the final catalog page demonstrating the visual identity, category filtering, and search functionality.

### 1. Full Catalog Page
*Default view showing the premium dark-minimal theme layout and staggered grid.*
![Full Catalog](docs/evidence/story-3-full-catalog.png)

### 2. Category Filter (Switches)
*Visual listing of products filtered by the "Switches" category tab.*
![Filtered Switches](docs/evidence/story-3-filtered-switches.png)

### 3. Search Functionality (Low-Profile)
*Live catalog search showing matching products for "Low-Profile" keyword.*
![Search Low-Profile](docs/evidence/story-3-search-low-profile.png)