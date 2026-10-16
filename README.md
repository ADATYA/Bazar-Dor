# 🛒 বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের দাম এক নজরে — a Bangla market-price tracker.

## Technologies
Next.js (App Router) · Tailwind CSS v4 + DaisyUI · BetterAuth · MongoDB · react-hot-toast

## Key features
1. Live price ticker (marquee) and Bangla date in the navbar
2. Top 6 risers / top 6 fallers + all products grid with ▲/▼ badges (Bengali digits)
3. Category pages with skeleton loading, empty/404 state and numeric price sorting
4. BetterAuth: email/password + Google + GitHub, toast messages, protected product/profile routes
5. Profile page with update-name feature, fully responsive, custom 404

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

## Fixing "error on sign in / sign out"
1. `BETTER_AUTH_SECRET` and `MONGODB_URI` must be set (also in Vercel > Settings > Environment Variables).
2. `BETTER_AUTH_URL` must equal your real site URL (http://localhost:3000 locally, your https Vercel URL when deployed).
3. In MongoDB Atlas > Network Access allow `0.0.0.0/0`, otherwise Vercel cannot connect.
4. Google/GitHub callback URL: `<your-url>/api/auth/callback/google` and `/github`.
5. Redeploy after changing environment variables.
