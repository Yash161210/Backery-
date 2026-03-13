# Sweet Crumbs Bakery

Production-ready bakery website with **public storefront**, **shopping cart + orders**, **owner admin dashboard**, **gallery**, and an **AI cake recommendation** assistant.

## Tech stack
- **Frontend**: Next.js (App Router) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (owner-only admin)
- **Uploads**: Local image upload (served from `/uploads`)
- **AI**: Euri OpenAI-compatible `/chat/completions` (with safe fallback)

## Folder structure
```
sweet-crumbs-bakery/
  backend/
    src/
      middleware/
      models/
      routes/
      utils/
      seed.js
      server.js
    uploads/               # created automatically
    .env.example
    package.json
  frontend/
    src/
      app/
        admin/
        ai-recommendation/
        cart/
        contact/
        gallery/
        menu/
      components/
      contexts/
      lib/
      types.ts
    public/
    .env.example
    next.config.ts
    package.json
```

## Environment variables

### Backend (`sweet-crumbs-bakery/backend/.env`)
Create a file from `.env.example` and fill values:
- `MONGODB_URI`
- `JWT_SECRET`
- `OWNER_EMAIL` (default: `owner@sweetcrumbs.com`)
- `OWNER_PASSWORD` (**required**; used to create the owner user on first start)
- `CORS_ORIGIN` (e.g. `http://localhost:3000`)
- `EURI_API_KEY` (optional, enables AI provider; otherwise fallback recommender is used)

### Frontend (`sweet-crumbs-bakery/frontend/.env.local`)
Create from `.env.example`:
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

## Run locally

### 1) Start MongoDB
Use local MongoDB or MongoDB Atlas.

### 2) Backend
```bash
cd sweet-crumbs-bakery/backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
Backend runs on `http://localhost:4000`.

### 3) Frontend
```bash
cd sweet-crumbs-bakery/frontend
cp .env.example .env.local
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

## Backend API routes (summary)
- `GET  /health`
- **Auth**
  - `POST /api/auth/login`
  - `GET  /api/auth/me`
- **Products**
  - `GET  /api/products?featured=true&popular=true&active=false`
  - `GET  /api/products/:slug`
  - `POST /api/products` (owner)
  - `PUT  /api/products/:id` (owner)
  - `DELETE /api/products/:id` (owner)
  - `POST /api/products/:id/image` (owner, multipart `image`)
- **Orders**
  - `POST /api/orders` (public checkout)
  - `GET  /api/orders` (owner)
  - `PUT  /api/orders/:id/status` (owner)
- **Gallery**
  - `GET  /api/gallery`
  - `POST /api/gallery/upload` (owner, multipart `image`)
  - `DELETE /api/gallery/:id` (owner)
- **AI**
  - `POST /api/ai/recommend`
- **Contact**
  - `POST /api/contact`
  - `GET  /api/contact` (owner)

## Database schemas
- `User` (owner)
- `Product`
- `Order`
- `GalleryImage`
- `ContactMessage`

## Deploy

### Frontend (Vercel / Netlify)
- Build command: `npm run build`
- Output: Next.js default
- Env vars:
  - `NEXT_PUBLIC_API_BASE_URL` → your backend URL
  - `NEXT_PUBLIC_SITE_URL` → your site URL

### Backend
Deploy on Render / Railway / VPS.
- Set env vars from `backend/.env.example`
- Ensure MongoDB is reachable (Atlas recommended)
- Persist uploads:
  - For production, prefer **Cloudinary** or attach a persistent disk; local uploads on serverless platforms won’t persist.

