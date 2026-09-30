import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project.supabase.co') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase: SupabaseClient | null =
  isSupabaseConfigured && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

// Database Types
export interface AnnouncementRecord {
  id: string;
  title_en: string;
  title_mr: string;
  description_en: string;
  description_mr: string;
  category: 'General' | 'Gram Sabha' | 'Development' | 'Public Notice';
  notice_date: string;
  attachment_url?: string | null;
  is_pinned: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItemRecord {
  id: string;
  title_en: string;
  title_mr: string;
  description_en?: string | null;
  description_mr?: string | null;
  category: 'Village' | 'Panchayat' | 'Development' | 'Community';
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  title_en: string;
  title_mr: string;
  category: 'Gram Sabha' | 'Budget & Finance' | 'Citizen Services' | 'Forms' | 'Tenders' | 'Government Schemes';
  document_number?: string | null;
  issue_date: string;
  file_url: string;
  file_size_bytes?: number | null;
  file_extension: string;
  is_active: boolean;
  created_at: string;
}

export interface ContactSubmissionRecord {
  id: string;
  full_name: string;
  mobile: string;
  email?: string | null;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved' | 'archived';
  admin_notes?: string | null;
  created_at: string;
}

export interface FeedbackSubmissionRecord {
  id: string;
  full_name?: string | null;
  mobile?: string | null;
  email?: string | null;
  ward?: string | null;
  category: string;
  subject: string;
  message: string;
  rating?: number | null;
  is_anonymous: boolean;
  status: 'new' | 'reviewed' | 'action_taken' | 'archived';
  admin_notes?: string | null;
  created_at: string;
}

export interface PanchayatSettingsRecord {
  id: number;
  office_phone: string;
  office_email: string;
  office_address: string;
  office_hours_en: string;
  office_hours_mr: string;
  sarpanch_name_en: string;
  sarpanch_name_mr: string;
  deputy_sarpanch_name_en: string;
  deputy_sarpanch_name_mr: string;
  gram_sevak_name_en: string;
  gram_sevak_name_mr: string;
  updated_at: string;
}
