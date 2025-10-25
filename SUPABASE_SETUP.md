# Connect & Thrive - Supabase Setup Guide

## 🚀 Quick Start

### 1. Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose your organization and plan
   - Enter project name: `connect-thrive`
   - Set database password (save this securely)
   - Wait for project to be created (~2-3 minutes)

2. **Configure Authentication**
   - Go to **Authentication > Providers**
   - Enable **Google** provider
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-domain.com/auth/callback`
     - `http://localhost:3000/auth/callback` (for development)
   - Copy Client ID and Client Secret to Supabase

3. **Run Database Schema**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy and paste the contents of `lib/database/schema.sql`
   - Run the SQL script

### 2. Environment Variables

Update your `.env` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Connection (for migrations)
DATABASE_URL="postgresql://postgres.your-project:password@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.your-project:password@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

### 3. Database Schema Overview

The schema includes:

- **profiles**: User profiles with verification levels and points
- **posts**: Community posts with categories and engagement metrics
- **comments**: Nested comments with likes and replies
- **likes**: Like system for posts and comments
- **reports**: Content moderation system
- **badges**: Achievement system for users
- **user_badges**: User progress towards badges

### 4. Authentication Flow

1. **OAuth Setup**: Users sign in with Google OAuth
2. **Profile Creation**: Automatic profile creation on first login
3. **Session Management**: Persistent sessions with auto-refresh
4. **Protected Routes**: Middleware ensures authentication for protected pages

### 5. Key Features Implemented

✅ **Authentication System**
- Google OAuth integration
- Session management
- Automatic profile creation
- Protected routes middleware

✅ **User Profile Management**
- Editable profiles with bio, location, website
- Points and verification levels
- Badge system for achievements

✅ **Community Features**
- Post creation and management
- Comment system with threading
- Like system for engagement
- Content moderation tools

✅ **Database Services**
- Type-safe database operations
- Profile, post, and comment management
- Badge and achievement tracking

### 6. Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run database setup script
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

### 7. Project Structure

```
├── app/
│   ├── auth/           # Authentication pages
│   ├── profile/        # User profile management
│   ├── community/      # Community feed
│   └── layout.tsx      # Root layout with auth provider
├── contexts/
│   └── auth-context.tsx # Authentication state management
├── hooks/
│   └── use-auth.ts     # Authentication hooks
├── lib/
│   ├── supabase.ts     # Supabase client configuration
│   └── database/
│       ├── schema.sql  # Database schema
│       └── services.ts # Database operations
├── types/
│   └── database.ts     # TypeScript type definitions
└── middleware.ts       # Protected routes middleware
```

### 8. Next Steps

1. **Storage Setup** (Optional)
   - Create storage buckets for user avatars and post images
   - Configure RLS policies for storage access

2. **Real-time Features**
   - Enable real-time subscriptions for live updates
   - Add real-time notifications

3. **Advanced Features**
   - Implement search functionality
   - Add location-based features
   - Create admin dashboard

4. **Performance Optimization**
   - Add database indexes for common queries
   - Implement caching strategies
   - Optimize image loading

### 9. Troubleshooting

**Authentication Issues:**
- Check OAuth redirect URLs in Google Console
- Verify Supabase auth settings
- Check browser console for errors

**Database Issues:**
- Verify RLS policies are correctly set
- Check that schema.sql was run completely
- Ensure environment variables are correct

**TypeScript Errors:**
- Run `npm run build` to check for type issues
- Ensure all imports are correct
- Check that database types match schema

### 10. Support

For issues or questions:
- Check Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the code comments in this project
- Check the browser console for detailed error messages

---

🎉 **Congratulations!** Your Connect & Thrive platform is now ready with a fully functional authentication and database system powered by Supabase!
