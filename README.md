# Trackr 📊

A simple, clean MERN app to track **job applications** and **personal expenses** in one place. Built to deploy in minutes.

- **Frontend:** React + Vite → Vercel
- **Backend:** Node + Express → Render
- **Database:** MongoDB → MongoDB Atlas

## Features

**Jobs**
- Add / edit / delete applications (company, role, link, salary, notes)
- Status pipeline: Wishlist → Applied → Interview → Offer → Rejected
- Filter by status, see counts per stage

**Expenses**
- Add / edit / delete expenses (title, amount, category, date)
- Filter by category and month
- Monthly total + per-category breakdown

**Dashboard**
- At-a-glance: active applications, this month's spend, recent activity

## Project Structure
```
trackr/
├── server/     # Express API
└── client/     # React (Vite) app
```

## Local Development

### 1. Backend
```bash
cd server
cp .env.example .env       # fill in MONGO_URI
npm install
npm run dev                # http://localhost:5000
```

### 2. Frontend
```bash
cd client
cp .env.example .env       # set VITE_API_URL=http://localhost:5000
npm install
npm run dev                # http://localhost:5173
```

## Deployment

### Database — MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Add a database user + allow network access (`0.0.0.0/0` to keep it simple).
3. Copy the connection string → this is your `MONGO_URI`.

### Backend — Render
1. New → Web Service → connect repo, **root directory `server`**.
2. Build: `npm install` · Start: `npm start`
3. Env vars: `MONGO_URI`, `CLIENT_URL` (your Vercel URL).
4. Deploy → copy the service URL.

### Frontend — Vercel
1. New Project → import repo, **root directory `client`**.
2. Framework preset: **Vite**.
3. Env var: `VITE_API_URL` = your Render backend URL.
4. Deploy.

Done. 🚀
