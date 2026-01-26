# Massage Republic Clone - Next.js + Tailwind (Starter)

This is a starter fullstack project scaffold built to match the visual/layout and requirements you described.

**What is included**
- Next.js (Pages router, JavaScript)
- Tailwind CSS styling (preconfigured)
- Pages: Home, Sign In, Register, Profile, Admin Login, Admin Dashboard
- Components: Header, Footer, Hero, SearchBar, ListingCard
- Basic API routes for auth (register/login) and listings with MongoDB
- MongoDB helper (use your MONGODB_URI)
- Example `.env.local` pre-filled (update if needed)

**Important**
- This is a *starter* fullstack project. It includes working API routes and a basic auth flow (email/password with bcrypt + JWT cookie).
- You should review and secure it before a production deployment.
- Designed to be Vercel-ready.

**How to run locally**
1. Extract the zip.
2. `cd massage-republic-clone`
3. Install deps: `npm install`
4. Create `.env.local` (example provided). Make sure `MONGODB_URI` is set.
5. Run: `npm run dev`
6. Open http://localhost:3000

**Admin credentials pre-filled in .env.local**
- Email: wk9523675@gmail.com
- Password: Wasim786@123#

**Files**
- `pages/` contains pages and API routes.
- `components/` contains reusable UI components.
- `lib/mongodb.js` mongo helper.

If you want, I can now:
- Add more admin features (theme color editor, uploads).
- Harden auth sessions and CSRF protection.
- Replace JWT cookie with next-auth (if you'd like).

