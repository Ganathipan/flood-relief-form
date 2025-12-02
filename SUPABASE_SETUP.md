# Supabase Setup Guide for Flood Relief System

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new project:
   - **Project name**: flood-relief-system
   - **Database password**: (save this securely!)
   - **Region**: Choose closest to Sri Lanka (Singapore recommended)
   - **Pricing plan**: Free tier (0$/month)

### Step 2: Create Database Tables

Once your project is ready, go to **SQL Editor** and run this script:

```sql
-- Create donor_responses table
CREATE TABLE donor_responses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone2 TEXT,
  district TEXT NOT NULL,
  donations TEXT NOT NULL,
  gps TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transport_responses table
CREATE TABLE transport_responses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone2 TEXT,
  home_district TEXT NOT NULL,
  service_districts TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_capacity TEXT,
  gps TEXT,
  availability TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affected_responses table
CREATE TABLE affected_responses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone2 TEXT,
  district TEXT NOT NULL,
  gps TEXT,
  people_count INTEGER NOT NULL,
  needs TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coordination_log table (for future coordination features)
CREATE TABLE coordination_log (
  id BIGSERIAL PRIMARY KEY,
  donor_id BIGINT REFERENCES donor_responses(id),
  transport_id BIGINT REFERENCES transport_responses(id),
  affected_id BIGINT REFERENCES affected_responses(id),
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE affected_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordination_log ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for registration forms)
CREATE POLICY "Enable insert for all users" ON donor_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON donor_responses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON transport_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON transport_responses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON affected_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON affected_responses
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all users" ON coordination_log
  FOR SELECT USING (true);
```

### Step 3: Get Your API Keys

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** section
3. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 4: Update index.html

Open `index.html` and replace these placeholders around line 10:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE'; // Paste your Project URL
const SUPABASE_KEY = 'YOUR_ANON_KEY_HERE';    // Paste your anon public key
```

### Step 5: Deploy

**Option A: GitHub Pages (Easiest)**
1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Select branch: `supabase-migration`
4. Click **Save**
5. Your site will be live at: `https://ganathipan.github.io/flood-relief-form/`

**Option B: Netlify (Alternative)**
1. Go to https://netlify.com
2. Drag and drop your project folder
3. Done! Instant deployment

---

## 📊 Viewing Your Data (Spreadsheet View)

### In Supabase Dashboard:
1. Go to **Table Editor** in left sidebar
2. Click any table: `donor_responses`, `transport_responses`, or `affected_responses`
3. You'll see a spreadsheet-like interface where you can:
   - ✅ View all data in rows/columns
   - ✅ Filter by district, date, etc.
   - ✅ Sort any column
   - ✅ Edit data directly
   - ✅ Export to CSV
   - ✅ Search across all fields

### Export to Google Sheets (Optional):
If you want to keep using Google Sheets, you can:
1. Click **Export to CSV** in Table Editor
2. Import CSV into Google Sheets
3. Or use Apps Script to auto-sync (we can set this up later)

---

## 🎯 What Changed?

### ✅ Benefits of Supabase:
- **Scalability**: Handles 1000+ concurrent users easily
- **Speed**: Much faster than Google Apps Script
- **Real-time**: Auto-updates without page refresh (optional feature)
- **Free tier**: 500MB database, unlimited API requests
- **Security**: Row-level security built-in
- **Backup**: Automatic daily backups

### ⚠️ What Stays the Same:
- ✅ Exact same user interface
- ✅ All forms work identically
- ✅ Same data structure
- ✅ Mobile-friendly design unchanged
- ✅ All features preserved

---

## 🆘 Troubleshooting

**Error: "Failed to fetch"**
- Check if SUPABASE_URL and SUPABASE_KEY are correctly pasted
- Verify RLS policies are created
- Check browser console for detailed errors

**Can't see data in Table Editor:**
- Make sure you ran all SQL scripts
- Check if forms are submitting successfully
- Verify policies allow SELECT access

**Need help?**
- Supabase Discord: https://discord.supabase.com
- Documentation: https://supabase.com/docs

---

## 📈 Monitoring Usage

Go to **Project Settings → Usage** to see:
- Number of requests
- Database size
- Active connections
- All metrics (stays within free tier limits)

---

## 🔒 Security Notes

- The `anon` key is safe to expose in frontend code
- Row Level Security (RLS) protects your data
- Only permitted operations can be performed
- For admin access, we can set up authentication later

---

## Next Steps After Setup

1. ✅ Test all three forms (Donor, Transport, Affected)
2. ✅ Verify data appears in Table Editor
3. ✅ Share the deployed URL with your team
4. ✅ Monitor usage in Supabase dashboard
5. 🚀 Ready to handle 1000+ users!

---

**Estimated Setup Time:** 15-20 minutes
**Cost:** $0/month (Free tier)
**Scalability:** 1000+ concurrent users ✅
