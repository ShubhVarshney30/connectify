-- Connect & Thrive Community Platform Database Schema
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/your-project/sql
-- This script handles existing tables gracefully

-- Enable Row Level Security (RLS) and necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in reverse dependency order (if they exist)
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;

-- Drop existing functions (if they exist)
DROP FUNCTION IF EXISTS public.update_post_likes_count();
DROP FUNCTION IF EXISTS public.update_post_comments_count();
DROP FUNCTION IF EXISTS public.update_comment_likes_count();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    phone TEXT,
    date_of_birth DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_level TEXT DEFAULT 'basic', -- basic, verified, premium
    points INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]'::jsonb, -- Array of badge objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Posts table
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general', -- help, tip, resource, event, etc.
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    location TEXT,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active', -- active, resolved, archived, flagged
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT posts_title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
    CONSTRAINT posts_content_length CHECK (char_length(content) >= 10 AND char_length(content) <= 10000)
);

-- Comments table
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For nested comments
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT comments_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- Likes table (for posts and comments)
CREATE TABLE public.likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT likes_target_check CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id)
);

-- Reports/Flags table
CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CONSTRAINT reports_target_check CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- User badges/achievements
CREATE TABLE public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT DEFAULT 'general', -- community, volunteering, safety, etc.
    rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
    points_required INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User badge progress
CREATE TABLE public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    progress INTEGER DEFAULT 0,
    earned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(user_id, badge_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON public.posts(likes_count DESC);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_comment_id ON public.likes(comment_id);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- RLS Policies for posts
DROP POLICY IF EXISTS "Anyone can view active posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

CREATE POLICY "Anyone can view active posts" ON public.posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for comments
DROP POLICY IF EXISTS "Anyone can view comments on active posts" ON public.comments;
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

CREATE POLICY "Anyone can view comments on active posts" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts
            WHERE posts.id = comments.post_id
            AND posts.status = 'active'
        )
    );

CREATE POLICY "Users can create comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
    FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for likes
DROP POLICY IF EXISTS "Users can view likes" ON public.likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.likes;

CREATE POLICY "Users can view likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON public.likes
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reports
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;

CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = reporter_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS handle_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS handle_comments_updated_at ON public.comments;

CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update like counts
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts
        SET likes_count = likes_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts
        SET likes_count = likes_count - 1
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for post likes count
DROP TRIGGER IF EXISTS update_post_likes_count_trigger ON public.likes;
CREATE TRIGGER update_post_likes_count_trigger
    AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW
    WHEN (NEW.post_id IS NOT NULL OR OLD.post_id IS NOT NULL)
    EXECUTE FUNCTION public.update_post_likes_count();

-- Function to update comment counts
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts
        SET comments_count = comments_count - 1
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for post comments count
DROP TRIGGER IF EXISTS update_post_comments_count_trigger ON public.comments;
CREATE TRIGGER update_post_comments_count_trigger
    AFTER INSERT OR DELETE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_post_comments_count();

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.comments
        SET likes_count = likes_count + 1
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.comments
        SET likes_count = likes_count - 1
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for comment likes count
DROP TRIGGER IF EXISTS update_comment_likes_count_trigger ON public.likes;
CREATE TRIGGER update_comment_likes_count_trigger
    AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW
    WHEN (NEW.comment_id IS NOT NULL OR OLD.comment_id IS NOT NULL)
    EXECUTE FUNCTION public.update_comment_likes_count();
