# Advice for Life - GitHub + Vercel Deployment Guide

## ✅ Pre-Deployment Audit Complete

### Website Features (All Working):
- ✅ Contact/Message Feature
- ✅ 7 Photo Galleries (QR Code Ready)
  - California (8 photos)
  - Club Rohm (17 photos)
  - Dogs (14 photos)
  - Early Life (5 photos)
  - Memorial (13 photos)
  - Pittsburgh (9 photos)
  - Texas (17 photos)
- ✅ Checkout & Stripe Integration
- ✅ Product Tiers (PDF, Audiobook, Paperback, Hardback, Bundle)
- ✅ Success Page & Download System
- ✅ Prisma Database (PostgreSQL)
- ✅ Google Analytics (configured)

---

## 🚀 Quick Deploy to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Advice for Life website"

# Create GitHub repository at: https://github.com/new
# Name it: advice-for-life-website

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/advice-for-life-website.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `nextjs_space`
   - **Build Command:** `yarn build`
   - **Output Directory:** `.next`
   - **Install Command:** `yarn install`

5. Add Environment Variables (see `.env.template` below)

6. Click "Deploy"

---

## 🔐 Environment Variables

Create these in Vercel Dashboard under Settings → Environment Variables:

### Required Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Lulu (Print on Demand)
LULU_API_KEY=your-lulu-api-key
LULU_PAPERBACK_POD_PACKAGE_ID=0600X0900BWSTDPB060UW444MXX
LULU_POD_PACKAGE_ID=0600X0900BWPRELW060UW444MFB

# ActiveCampaign
ACTIVECAMPAIGN_API_KEY=your-api-key
ACTIVECAMPAIGN_API_URL=https://your-account.api-us1.com

# Google Analytics (Optional but recommended)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# File URLs (Use your Vercel deployment URL)
COVER_PDF_URL=https://your-domain.vercel.app/advice-for-life-cover.pdf
INTERIOR_PDF_URL=https://your-domain.vercel.app/advice-for-life-interior.pdf
```

---

## 📦 Database Setup

### Option 1: Use Existing PostgreSQL (Recommended)
Your current `DATABASE_URL` from `.env` will work.

### Option 2: Vercel Postgres (Alternative)
1. In Vercel Dashboard → Storage → Create Database → Postgres
2. Copy connection string to `DATABASE_URL`

### Run Prisma Migrations:

```bash
# Generate Prisma Client
yarn prisma generate

# Run migrations
yarn prisma migrate deploy

# (Optional) Seed admin user
yarn prisma db seed
```

---

## 🔄 Stripe Webhook Setup

After deployment, configure Stripe webhook:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## 📊 Google Analytics Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create property for your domain
3. Get Measurement ID (starts with `G-`)
4. Add to Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at your Vercel URL
- [ ] Test contact form (check database for submission)
- [ ] Test all 7 photo galleries
- [ ] Test checkout flow (use Stripe test mode first)
- [ ] Verify downloads work (PDF, audiobook)
- [ ] Check Google Analytics tracking
- [ ] Test Stripe webhook (make test purchase)
- [ ] Verify email subscriptions work

---

## 🐛 Troubleshooting

### Build Fails
- Check `yarn build` locally first
- Verify all environment variables are set
- Check Vercel build logs

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check PostgreSQL allows external connections
- Run `yarn prisma generate` before deployment

### Stripe Webhook Failing
- Verify webhook URL matches deployment
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`

### Downloads Not Working
- Verify PDF/MP3 files exist in `public/` folder
- Check file paths in API routes

---

## 📞 Support

- Stripe Issues: Check [Stripe Docs](https://stripe.com/docs)
- Vercel Issues: Check [Vercel Docs](https://vercel.com/docs)
- Prisma Issues: Check [Prisma Docs](https://www.prisma.io/docs)

---

**Deployment Package Created By:** DeepAgent
**Date:** December 28, 2025
**Website:** Advice for Life by Brandon Rohm
