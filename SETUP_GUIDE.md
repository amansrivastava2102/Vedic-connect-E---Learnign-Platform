# VedicConnect Setup Guide

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `vedic-connect`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
6. Click "Create new project"
7. Wait for project to be created (2-3 minutes)

### 1.2 Get Your Supabase Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

### 1.3 Set Up Database Schema
1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy and paste the entire content from `database-schema.sql` file
4. Click "Run" to execute the schema
5. You should see success messages for all tables and policies

### 1.4 Create Storage Buckets
1. Go to Storage in Supabase dashboard
2. Create these buckets:
   - `documents` (for PDFs, docs, etc.)
   - `videos` (for lecture videos)
   - `thumbnails` (for course/lecture thumbnails)
   - `avatars` (for user profile pictures)

## Step 2: Environment Configuration

### 2.1 Create Environment File
1. In your project root, create a file called `.env.local`
2. Add the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace the values with your actual Supabase credentials from Step 1.2.

### 2.2 Restart Development Server
1. Stop the current dev server (Ctrl+C)
2. Run `npm run dev` again

## Step 3: Test the Setup

### 3.1 Test Authentication
1. Go to `http://localhost:3000/auth`
2. Try to register a new account
3. Check if user is created in Supabase Auth section

### 3.2 Test API Endpoints
1. Go to `http://localhost:3000/api/courses`
2. You should see an empty array `[]` (no courses yet)
3. This confirms the API is working

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file exists
   - Verify the variable names are correct
   - Restart the dev server

2. **"Table doesn't exist"**
   - Run the database schema again
   - Check if all tables were created in Supabase

3. **"Permission denied"**
   - Check Row Level Security policies
   - Verify user authentication 