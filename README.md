# BOHOBLOCKPRINTED E-Commerce Store

A full-featured clothing e-commerce platform built with Next.js, React, and MongoDB. Inspired by modern Indian fashion retailers like Snitch, Myntra, and Ajio.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Auth:** NextAuth.js (credentials provider)
- **State:** Zustand (cart & wishlist persistence)
- **Validation:** Zod

## Features

- Product catalog with categories, filters, and search
- Product detail pages with image gallery, size/color variants
- Shopping cart with persistent storage
- Guest and registered user checkout
- Coupon/discount code support
- User authentication (register/login)
- Order management
- Wishlist
- Responsive mobile-first design
- **Razorpay payment gateway** (UPI, cards, net banking)
- **Admin dashboard** (products, orders, offers, analytics)
- **Drag & drop image upload** (Cloudinary or local storage)
- **SMS notifications** on order confirm & ship

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bohoblockprinted.git
cd bohoblockprinted

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and secrets

# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Razorpay Setup (for online payments)

1. Create an account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Get your **Key ID** and **Key Secret** from Settings → API Keys
3. Add to `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_secret
   ```
4. Use test cards from [Razorpay docs](https://razorpay.com/docs/payments/payments/test-card-details/) in test mode

Without Razorpay keys, **Cash on Delivery** still works.

### Email Setup (order confirmations)

Add SMTP credentials to `.env.local`. Example with SendGrid:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=support@bohoblockprinted.com
```

Without SMTP, orders still work — emails are logged to the console in dev.

### Cloudinary Setup (admin image uploads)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Add to `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. In admin → Add Product, use **Upload Image** button

### Admin Panel

Login as admin → [http://localhost:3000/admin](http://localhost:3000/admin)

**Add Product** (`/admin/products/new`) — full form with:
- Drag & drop multiple images (upload directly, no URL needed)
- Product name, short & full description
- Selling price + MRP (shows live discount %)
- Size, color, stock variants
- Featured / active toggles

**Offers** (`/admin/coupons`) — create discount codes:
- Percentage or flat ₹ off
- Min order amount, usage limits, expiry date

**Orders** — Ship orders with auto tracking number + SMS to customer

**Dashboard** — Revenue chart (7 days), top sellers, quick actions

Images upload to **Cloudinary** if configured, otherwise saved locally to `/public/uploads/`.

### Language Toggle

Click **हिं / EN** in the header to switch between Hindi and English across the storefront.

### Demo Accounts

| Role     | Email                    | Password     |
|----------|--------------------------|--------------|
| Admin    | admin@bohoblockprinted.com | admin123     |
| Customer | customer@example.com     | customer123  |

### Demo Coupons

- `WELCOME10` — 10% off (min order ₹500)
- `FLAT200` — Flat ₹200 off (min order ₹1500)

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # REST API endpoints
│   ├── shop/             # Product listing page
│   ├── product/[slug]/   # Product detail page
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── account/          # User account
│   └── ...
├── components/           # React components
│   ├── layout/           # Header, Footer
│   ├── home/             # Homepage sections
│   ├── products/         # Product cards, filters
│   └── ui/               # Reusable UI primitives
├── models/               # Mongoose schemas
├── lib/                  # Utilities, DB connection, auth
├── store/                # Zustand stores
├── types/                # TypeScript types
└── scripts/              # Seed & utility scripts
```

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/products`             | List products (filters)  |
| GET    | `/api/products/[slug]`      | Get product details      |
| GET    | `/api/categories`           | List categories          |
| POST   | `/api/auth/register`        | Register new user        |
| POST   | `/api/orders`               | Create order             |
| GET    | `/api/orders`               | Get user orders          |
| POST   | `/api/coupons/validate`     | Validate coupon code     |
| POST   | `/api/payments/razorpay/create-order` | Create Razorpay order |
| POST   | `/api/payments/razorpay/verify`       | Verify payment          |
| GET    | `/api/admin/stats`          | Admin dashboard stats    |
| GET/POST | `/api/admin/products`     | Admin product list/create|
| GET/PUT/DELETE | `/api/admin/products/[id]` | Admin product CRUD |
| GET    | `/api/admin/orders`         | Admin order list         |
| GET/PATCH | `/api/admin/orders/[id]`  | Admin order detail/update|

## Roadmap

- [x] Razorpay payment gateway integration
- [x] Admin dashboard (product/order management)
- [x] Hindi/English i18n support
- [x] Email notifications (SMTP/SendGrid)
- [x] Product reviews (submit + admin moderation)
- [x] Cloudinary image uploads
- [x] SEO sitemap & robots.txt
- [x] Admin offers/coupons management
- [x] SMS notifications (MSG91/Twilio)
- [x] Shipping tracking & analytics dashboard
- [ ] Live Delhivery/Shiprocket API integration

## License

MIT
