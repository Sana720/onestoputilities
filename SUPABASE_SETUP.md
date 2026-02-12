# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill in:
   - **Name**: `shreeg-investment-portal`
   - **Database Password**: (generate a strong password and save it)
   - **Region**: Choose closest to India (e.g., Singapore or Mumbai if available)
6. Click "Create new project"
7. Wait 2-3 minutes for project to be ready

## Step 2: Get API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this
   - **service_role** key - Copy this (click "Reveal" first)

## Step 3: Update Environment Variables

1. Open `.env.local` in your project
2. Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Step 4: Create Database Tables

1. In Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the entire content from `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Step 5: Verify Tables

1. Click on **Table Editor** in the left sidebar
2. You should see two tables:
   - `users`
   - `investments`
3. Click on each table to verify the columns are created

## Step 6: Create Admin User

1. In Supabase dashboard, click on **Authentication** in the left sidebar
2. Click on **Users** tab
3. Click **Add user** → **Create new user**
4. Fill in:
   - **Email**: `admin@shreeg.com`
   - **Password**: `admin123` (change this later!)
   - **Auto Confirm User**: ✅ Check this box
5. Click **Create user**
6. Copy the **User UID** (you'll need this)

## Step 7: Set Admin Role

1. Go back to **SQL Editor**
2. Run this query (replace `USER_UID_HERE` with the UID you copied):
   ```sql
   UPDATE users 
   SET role = 'admin', name = 'Admin User'
   WHERE id = 'USER_UID_HERE';
   ```
3. If the user doesn't exist in the users table yet, insert it:
   ```sql
   INSERT INTO users (id, email, role, name)
   VALUES ('USER_UID_HERE', 'admin@shreeg.com', 'admin', 'Admin User');
   ```

## Step 8: Restart Development Server

1. Stop the current dev server (Ctrl+C)
2. Run:
   ```bash
   npm run dev
   ```

## Step 9: Test the Application

1. Open http://localhost:3000
2. Click "Login"
3. Login with:
   - Email: `admin@shreeg.com`
   - Password: `admin123`
4. You should be redirected to the admin dashboard

## Troubleshooting

### "Invalid API key"
- Double-check you copied the correct keys from Supabase
- Make sure there are no extra spaces in `.env.local`
- Restart the dev server after updating `.env.local`

### "relation 'users' does not exist"
- Run the SQL schema again in SQL Editor
- Check if tables were created in Table Editor

### "User not found"
- Make sure you created the user in Authentication
- Run the UPDATE query to set the role to 'admin'

### Need Help?
Check the Supabase documentation: https://supabase.com/docs
