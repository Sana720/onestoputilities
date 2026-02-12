# Supabase Migration - Quick Start Guide

## ✅ What's Been Done

All code has been migrated from MongoDB to Supabase:

- ✅ Removed MongoDB dependencies (mongoose, bcryptjs, jsonwebtoken)
- ✅ Installed Supabase client libraries
- ✅ Migrated all API routes to use Supabase
- ✅ Created PostgreSQL database schema
- ✅ Removed old MongoDB files (mongodb.ts, User.ts, Investment.ts, seed-admin.ts)
- ✅ Updated documentation

## 🚀 Your Next Steps (15 minutes)

### 1. Create Supabase Project (5 min)

1. Go to **https://supabase.com** and sign up/login
2. Click **"New Project"**
3. Fill in:
   - Name: `shreeg-investment-portal`
   - Database Password: (create a strong password and **save it**)
   - Region: **Singapore** (closest to India)
4. Click **"Create new project"**
5. Wait ~2 minutes for setup

### 2. Get Your API Keys (2 min)

1. In your Supabase dashboard, click **Settings** (gear icon) → **API**
2. Copy these three values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (click to copy)
   - **service_role** key (click "Reveal" then copy)

### 3. Update Environment Variables (1 min)

Open `.env.local` and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Database Tables (2 min)

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase-schema.sql` in your project
4. Copy **ALL** the SQL content
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see: ✅ "Success. No rows returned"

**Verify:** Click **Table Editor** → you should see `users` and `investments` tables

### 5. Create Admin User (3 min)

1. In Supabase dashboard, click **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - Email: `admin@shreeg.com`
   - Password: `admin123`
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create user"**
5. **Copy the User UID** (the long string like `a1b2c3d4-...`)

6. Go back to **SQL Editor** → **New query**
7. Run this (replace `USER_UID_HERE` with the UID you copied):

```sql
INSERT INTO users (id, email, role, name)
VALUES ('USER_UID_HERE', 'admin@shreeg.com', 'admin', 'Admin User');
```

### 6. Test the Application (2 min)

1. **Restart the dev server:**
   ```bash
   # Press Ctrl+C to stop current server
   npm run dev
   ```

2. Open **http://localhost:3000**
3. Click **"Login"**
4. Login with:
   - Email: `admin@shreeg.com`
   - Password: `admin123`
5. You should see the **Admin Dashboard**! 🎉

---

## 📋 Testing Checklist

Once logged in, test these features:

### Admin Dashboard
- [ ] View all investments table
- [ ] Search for investments
- [ ] Filter by status
- [ ] Update dividend rate
- [ ] Add a dividend
- [ ] Change investment status

### Client Application
- [ ] Go to homepage → Click "Apply Now"
- [ ] Fill out the 4-step form
- [ ] Submit application
- [ ] Note the temporary password
- [ ] Logout and login as the new client
- [ ] View client dashboard
- [ ] Verify investment details appear

---

## 🆘 Troubleshooting

### "Invalid API key" error
- Double-check you copied the keys correctly from Supabase
- Make sure there are no extra spaces in `.env.local`
- Restart the dev server after updating `.env.local`

### "relation 'users' does not exist"
- Go to Supabase → SQL Editor
- Run the schema SQL again
- Check Table Editor to verify tables exist

### "User not found" after login
- Make sure you created the user in Authentication
- Run the INSERT SQL query to add user to users table
- Verify the user ID matches between Auth and users table

### Still having issues?
Check the detailed guide: `SUPABASE_SETUP.md`

---

## 📁 Important Files

- **[SUPABASE_SETUP.md](file:///Users/ahmadsana/Documents/shreeg/investment-portal/SUPABASE_SETUP.md)** - Detailed setup guide
- **[supabase-schema.sql](file:///Users/ahmadsana/Documents/shreeg/investment-portal/supabase-schema.sql)** - Database schema to run
- **[.env.local](file:///Users/ahmadsana/Documents/shreeg/investment-portal/.env.local)** - Environment variables
- **[README.md](file:///Users/ahmadsana/Documents/shreeg/investment-portal/README.md)** - Full documentation

---

## 🎯 Summary

**Migration Status:** ✅ **COMPLETE**

All code has been successfully migrated to Supabase. The application is ready to run once you complete the 6 setup steps above (should take ~15 minutes total).

**Benefits:**
- ✅ No MongoDB installation needed
- ✅ Free tier perfect for your needs
- ✅ Built-in authentication
- ✅ Easy deployment to Vercel
- ✅ Automatic backups and scaling

Ready to get started? Follow the steps above! 🚀
