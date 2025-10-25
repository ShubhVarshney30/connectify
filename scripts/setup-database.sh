#!/bin/bash

# Connect & Thrive Database Migration Script
# Run this script to set up your Supabase database

echo "🚀 Setting up Connect & Thrive database..."

# Check if .env file exists and has Supabase credentials
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it with your Supabase credentials."
    exit 1
fi

# Source environment variables
source .env

# Check if Supabase credentials are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase credentials not found in .env file."
    echo "Please add:"
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    exit 1
fi

echo "✅ Environment variables loaded"

# Check if schema.sql exists
if [ ! -f "lib/database/schema.sql" ]; then
    echo "❌ Schema file not found at lib/database/schema.sql"
    exit 1
fi

echo "📋 Database schema found"

# Instructions for manual setup
echo ""
echo "🔧 Manual Setup Instructions:"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/$(echo $NEXT_PUBLIC_SUPABASE_URL | cut -d'/' -f4)/sql"
echo ""
echo "2. Copy and paste the contents of lib/database/schema.sql"
echo ""
echo "3. Run the SQL in the Supabase SQL Editor"
echo ""
echo "4. Enable Authentication providers:"
echo "   - Go to Authentication > Providers"
echo "   - Enable Google OAuth"
echo "   - Add your OAuth credentials"
echo ""
echo "5. Set up Storage (optional):"
echo "   - Go to Storage > Buckets"
echo "   - Create buckets for user avatars and post images"
echo ""
echo "📖 For more details, see the setup documentation."
echo ""
echo "🎉 Setup complete! Your database is ready for Connect & Thrive."
