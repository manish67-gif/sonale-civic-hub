-- =====================================================================
-- GRAM PANCHAYAT OVALI (ग्राम पंचायत ओवळी)
-- Supabase Database Schema, Row Level Security (RLS) & Storage
-- Location: Ovali, Bhiwandi Taluka, Thane District, Maharashtra – 421302
-- =====================================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. App Roles & Admin Profiles
-- ---------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT 'Gram Panchayat Admin',
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- 2. Announcements & Notices (सूचना व जाहिराती)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_mr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_mr TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('General', 'Gram Sabha', 'Development', 'Public Notice')),
  notice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  attachment_url TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 3. Photo Gallery (फोटो गॅलरी)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_mr TEXT NOT NULL,
  description_en TEXT,
  description_mr TEXT,
  category TEXT NOT NULL CHECK (category IN ('Village', 'Panchayat', 'Development', 'Community')),
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 4. Official Documents & Circulars (कागदपत्रे व शासन निर्णय)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_mr TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Gram Sabha', 'Budget & Finance', 'Citizen Services', 'Forms', 'Tenders', 'Government Schemes')),
  document_number TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_extension TEXT NOT NULL DEFAULT 'pdf',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 5. Contact Inquiries (संपर्क संदेश)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 6. Feedback Submissions (नागरिक अभिप्राय)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  mobile TEXT,
  email TEXT,
  ward TEXT,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'action_taken', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 7. Panchayat Office Settings (पंचायत माहिती)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.panchayat_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  office_phone TEXT NOT NULL DEFAULT 'To be updated',
  office_email TEXT NOT NULL DEFAULT 'To be updated',
  office_address TEXT NOT NULL DEFAULT 'Ovali, Bhiwandi, Thane, Maharashtra – 421302',
  office_hours_en TEXT NOT NULL DEFAULT 'To be updated',
  office_hours_mr TEXT NOT NULL DEFAULT 'माहिती लवकरच अद्ययावत केली जाईल',
  sarpanch_name_en TEXT NOT NULL DEFAULT 'To be updated',
  sarpanch_name_mr TEXT NOT NULL DEFAULT 'माहिती लवकरच अद्ययावत केली जाईल',
  deputy_sarpanch_name_en TEXT NOT NULL DEFAULT 'To be updated',
  deputy_sarpanch_name_mr TEXT NOT NULL DEFAULT 'माहिती लवकरच अद्ययावत केली जाईल',
  gram_sevak_name_en TEXT NOT NULL DEFAULT 'To be updated',
  gram_sevak_name_mr TEXT NOT NULL DEFAULT 'माहिती लवकरच अद्ययावत केली जाईल',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.panchayat_settings ENABLE ROW LEVEL SECURITY;

-- Seed default panchayat settings if empty
INSERT INTO public.panchayat_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Announcements RLS
DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;
CREATE POLICY "Public can view active announcements"
  ON public.announcements FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Gallery Items RLS
DROP POLICY IF EXISTS "Public can view active gallery items" ON public.gallery_items;
CREATE POLICY "Public can view active gallery items"
  ON public.gallery_items FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins can manage gallery items"
  ON public.gallery_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Documents RLS
DROP POLICY IF EXISTS "Public can view active documents" ON public.documents;
CREATE POLICY "Public can view active documents"
  ON public.documents FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage documents" ON public.documents;
CREATE POLICY "Admins can manage documents"
  ON public.documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Panchayat Settings RLS
DROP POLICY IF EXISTS "Public can view panchayat settings" ON public.panchayat_settings;
CREATE POLICY "Public can view panchayat settings"
  ON public.panchayat_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update panchayat settings" ON public.panchayat_settings;
CREATE POLICY "Admins can update panchayat settings"
  ON public.panchayat_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact Submissions RLS
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view and manage contact submissions"
  ON public.contact_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Feedback Submissions RLS
DROP POLICY IF EXISTS "Anyone can submit feedback form" ON public.feedback_submissions;
CREATE POLICY "Anyone can submit feedback form"
  ON public.feedback_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage feedback submissions" ON public.feedback_submissions;
CREATE POLICY "Admins can view and manage feedback submissions"
  ON public.feedback_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin Profiles RLS
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view admin profiles"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admin_profiles;
CREATE POLICY "Admins can update their own profile"
  ON public.admin_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Trigger to create admin_profile on first authenticated user
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Gram Panchayat Admin'),
    'admin'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- =====================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- =====================================================================
-- Creates 'gallery' and 'documents' public buckets in storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('gallery', 'gallery', true, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', true, 15728640, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Public read
DROP POLICY IF EXISTS "Public can read gallery bucket" ON storage.objects;
CREATE POLICY "Public can read gallery bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Public can read documents bucket" ON storage.objects;
CREATE POLICY "Public can read documents bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

-- Storage RLS: Authenticated Admin uploads & deletes
DROP POLICY IF EXISTS "Admins can upload to gallery bucket" ON storage.objects;
CREATE POLICY "Admins can upload to gallery bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can update gallery bucket" ON storage.objects;
CREATE POLICY "Admins can update gallery bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can delete from gallery bucket" ON storage.objects;
CREATE POLICY "Admins can delete from gallery bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can upload to documents bucket" ON storage.objects;
CREATE POLICY "Admins can upload to documents bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Admins can update documents bucket" ON storage.objects;
CREATE POLICY "Admins can update documents bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Admins can delete from documents bucket" ON storage.objects;
CREATE POLICY "Admins can delete from documents bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');
