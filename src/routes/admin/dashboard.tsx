import { useState, useEffect, type FormEvent } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Building2,
  Bell,
  Images,
  FileText,
  Mail,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Star,
  Pin,
  RefreshCw,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routeHead } from '@/components/site';
import {
  supabase,
  isSupabaseConfigured,
  type AnnouncementRecord,
  type GalleryItemRecord,
  type DocumentRecord,
  type ContactSubmissionRecord,
  type FeedbackSubmissionRecord,
  type PanchayatSettingsRecord,
} from '@/lib/supabase';
import { useAdminAuth } from '@/lib/auth-context';
import { contact, TO_BE_UPDATED_EN, TO_BE_UPDATED_MR } from '@/lib/site-data';

export const Route = createFileRoute('/admin/dashboard')({
  head: () =>
    routeHead(
      'Admin Dashboard',
      'Administrative control panel for Gram Panchayat Ovali portal management.'
    ),
  component: AdminDashboard,
});

type Tab =
  | 'overview'
  | 'panchayat'
  | 'announcements'
  | 'gallery'
  | 'documents'
  | 'contacts'
  | 'feedback';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Data states
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [gallery, setGallery] = useState<GalleryItemRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [contacts, setContacts] = useState<ContactSubmissionRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackSubmissionRecord[]>([]);
  const [settings, setSettings] = useState<PanchayatSettingsRecord>({
    id: 1,
    office_phone: contact.phone,
    office_email: contact.email,
    office_address: contact.address,
    office_hours_en: contact.hours,
    office_hours_mr: contact.hoursMarathi,
    sarpanch_name_en: contact.sarpanch,
    sarpanch_name_mr: contact.sarpanchMarathi,
    deputy_sarpanch_name_en: contact.deputySarpanch,
    deputy_sarpanch_name_mr: contact.deputySarpanchMarathi,
    gram_sevak_name_en: contact.gramSevak,
    gram_sevak_name_mr: contact.gramSevakMarathi,
    updated_at: new Date().toISOString(),
  });

  const [loadingData, setLoadingData] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Authentication guard
  useEffect(() => {
    if (!isLoading && !user && isSupabaseConfigured) {
      navigate({ to: '/admin/login' });
    }
  }, [user, isLoading, navigate]);

  const loadAllData = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoadingData(true);

    try {
      const [aRes, gRes, dRes, cRes, fRes, sRes] = await Promise.all([
        supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('feedback_submissions')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('panchayat_settings')
          .select('*')
          .eq('id', 1)
          .single(),
      ]);

      if (aRes.data) setAnnouncements(aRes.data);
      if (gRes.data) setGallery(gRes.data);
      if (dRes.data) setDocuments(dRes.data);
      if (cRes.data) setContacts(cRes.data);
      if (fRes.data) setFeedback(fRes.data);
      if (sRes.data) setSettings(sRes.data);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/admin/login' });
  };

  const showNotification = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold text-muted-foreground">
          Loading admin session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40 pb-16">
      {/* Admin Top Navigation */}
      <div className="border-b border-border bg-card">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded bg-primary text-primary-foreground font-bold">
              GP
            </span>

            <div>
              <h1 className="text-lg font-bold text-foreground">
                Gram Panchayat Ovali
              </h1>
              <p className="text-xs text-muted-foreground">
                प्रशासकीय नियंत्रण कक्ष · Admin Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="mr-1.5 size-4" />
                View Public Site
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-1.5 size-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Supabase Status Alert if not configured */}
      {!isSupabaseConfigured && (
        <div className="site-container mt-4">
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
            <AlertTriangle className="size-5 shrink-0 text-amber-600" />

            <div>
              <strong className="font-bold">
                Supabase Backend Offline (Demo Preview Mode):
              </strong>

              <p className="mt-1 leading-5">
                VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not yet
                configured in your .env file. The admin screens below are
                fully functional in preview mode. Set up Supabase to persist
                changes live to PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      )}

      {noticeMessage && (
        <div className="site-container mt-4">
          <div className="flex items-center gap-2 rounded-md border border-green/30 bg-secondary p-3 text-xs font-semibold text-primary">
            <CheckCircle2 className="size-4 text-green" />
            {noticeMessage}
          </div>
        </div>
      )}

      <div className="site-container mt-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Sidebar Tabs */}
          <nav className="space-y-1 rounded-md border border-border bg-card p-3 shadow-sm h-fit">
            {[
              {
                id: 'overview',
                label: 'Dashboard Overview',
                mr: 'नियंत्रण कक्ष',
                icon: LayoutDashboard,
              },
              {
                id: 'panchayat',
                label: 'Panchayat Information',
                mr: 'पंचायत माहिती',
                icon: Building2,
              },
              {
                id: 'announcements',
                label: 'Announcements CRUD',
                mr: 'सूचना व्यवस्थापन',
                icon: Bell,
                count: announcements.length,
              },
              {
                id: 'gallery',
                label: 'Gallery Management',
                mr: 'फोटो गॅलरी',
                icon: Images,
                count: gallery.length,
              },
              {
                id: 'documents',
                label: 'Documents Management',
                mr: 'कागदपत्रे',
                icon: FileText,
                count: documents.length,
              },
              {
                id: 'contacts',
                label: 'Contact Submissions',
                mr: 'संपर्क संदेश',
                icon: Mail,
                count: contacts.length,
              },
              {
                id: 'feedback',
                label: 'Feedback Submissions',
                mr: 'अभिप्राय',
                icon: MessageSquare,
                count: feedback.length,
              },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-xs font-semibold transition-colors ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="size-4 shrink-0" />

                  <div>
                    <span>{tab.label}</span>
                    <span className="block text-[10px] font-normal opacity-80">
                      {tab.mr}
                    </span>
                  </div>
                </div>

                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${activeTab === tab.id
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-secondary text-muted-foreground'
                      }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Main Tab Content */}
          <main className="rounded-md border border-border bg-card p-6 shadow-sm min-h-[500px]">
            {activeTab === 'overview' && (
              <OverviewTab
                announcementsCount={announcements.length}
                galleryCount={gallery.length}
                documentsCount={documents.length}
                contactsCount={contacts.length}
                feedbackCount={feedback.length}
                onSelectTab={setActiveTab}
                onRefresh={loadAllData}
                loading={loadingData}
              />
            )}

            {activeTab === 'panchayat' && (
              <PanchayatSettingsTab
                settings={settings}
                setSettings={setSettings}
                showNotice={showNotification}
              />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsTab
                items={announcements}
                setItems={setAnnouncements}
                showNotice={showNotification}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab
                items={gallery}
                setItems={setGallery}
                showNotice={showNotification}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                items={documents}
                setItems={setDocuments}
                showNotice={showNotification}
              />
            )}

            {activeTab === 'contacts' && (
              <ContactsTab
                items={contacts}
                setItems={setContacts}
                showNotice={showNotification}
              />
            )}

            {activeTab === 'feedback' && (
              <FeedbackTab
                items={feedback}
                setItems={setFeedback}
                showNotice={showNotification}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 1. Dashboard Overview Tab
// ---------------------------------------------------------------------
function OverviewTab({
  announcementsCount,
  galleryCount,
  documentsCount,
  contactsCount,
  feedbackCount,
  onSelectTab,
  onRefresh,
  loading,
}: {
  announcementsCount: number;
  galleryCount: number;
  documentsCount: number;
  contactsCount: number;
  feedbackCount: number;
  onSelectTab: (tab: Tab) => void;
  onRefresh: () => void;
  loading: boolean;
}) {
  const cards = [
    {
      title: 'Active Announcements',
      mr: 'सक्रिय सूचना',
      count: announcementsCount,
      tab: 'announcements' as Tab,
      icon: Bell,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Gallery Photos',
      mr: 'फोटो गॅलरी',
      count: galleryCount,
      tab: 'gallery' as Tab,
      icon: Images,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Official Documents',
      mr: 'कागदपत्रे',
      count: documentsCount,
      tab: 'documents' as Tab,
      icon: FileText,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Contact Submissions',
      mr: 'संपर्क संदेश',
      count: contactsCount,
      tab: 'contacts' as Tab,
      icon: Mail,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Feedback Submissions',
      mr: 'नागरिक अभिप्राय',
      count: feedbackCount,
      tab: 'feedback' as Tab,
      icon: MessageSquare,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Dashboard Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Gram Panchayat Ovali · Quick portal statistics and operations
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-1.5 size-3.5 ${loading ? 'animate-spin' : ''
              }`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <div
            key={c.title}
            onClick={() => onSelectTab(c.tab)}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {c.title}
              </p>

              <p className="text-2xl font-bold text-foreground mt-1">
                {c.count}
              </p>

              <p className="text-[11px] text-green mt-0.5">{c.mr}</p>
            </div>

            <div
              className={`grid size-12 place-items-center rounded-lg ${c.color}`}
            >
              <c.icon className="size-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-5">
        <h3 className="text-sm font-bold text-foreground">
          Official Guidelines & Rules
        </h3>

        <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground list-disc list-inside">
          <li>
            Do not invent official names or phone numbers. If unavailable, use
            &quot;To be updated&quot;.
          </li>
          <li>
            All official demographic statistics must explicitly cite
            &quot;Census 2011&quot;.
          </li>
          <li>
            Uploaded circulars and Gram Sabha resolutions must be genuine and
            verified before publishing.
          </li>
          <li>
            Contact inquiries and public feedback should be reviewed regularly
            by Panchayat officials.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Panchayat Settings Tab
// ---------------------------------------------------------------------
function PanchayatSettingsTab({
  settings,
  setSettings,
  showNotice,
}: {
  settings: PanchayatSettingsRecord;
  setSettings: (s: PanchayatSettingsRecord) => void;
  showNotice: (msg: string) => void;
}) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('panchayat_settings')
        .upsert({
          ...form,
          id: 1,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        showNotice(`Error saving: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setSettings(form);
    setSaving(false);
    showNotice('Panchayat official information updated successfully.');
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">
          Panchayat Information
        </h2>

        <p className="text-xs text-muted-foreground">
          Update official office contact details, working hours, and
          representative names.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="form-label">Office Phone Number</label>

          <input
            className="form-control"
            value={form.office_phone}
            onChange={e =>
              setForm({
                ...form,
                office_phone: e.target.value,
              })
            }
            placeholder={TO_BE_UPDATED_EN}
          />
        </div>

        <div>
          <label className="form-label">Official Email</label>

          <input
            className="form-control"
            type="email"
            value={form.office_email}
            onChange={e =>
              setForm({
                ...form,
                office_email: e.target.value,
              })
            }
            placeholder={TO_BE_UPDATED_EN}
          />
        </div>
      </div>

      <div>
        <label className="form-label">Office Address</label>

        <input
          className="form-control"
          value={form.office_address}
          onChange={e =>
            setForm({
              ...form,
              office_address: e.target.value,
            })
          }
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="form-label">Office Hours (English)</label>

          <input
            className="form-control"
            value={form.office_hours_en}
            onChange={e =>
              setForm({
                ...form,
                office_hours_en: e.target.value,
              })
            }
            placeholder={TO_BE_UPDATED_EN}
          />
        </div>

        <div>
          <label className="form-label">
            कार्यालयीन वेळ (मराठी)
          </label>

          <input
            className="form-control"
            value={form.office_hours_mr}
            onChange={e =>
              setForm({
                ...form,
                office_hours_mr: e.target.value,
              })
            }
            placeholder={TO_BE_UPDATED_MR}
          />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Official Representatives (पदाधिकारी)
        </h3>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                Sarpanch Name (English)
              </label>

              <input
                className="form-control"
                value={form.sarpanch_name_en}
                onChange={e =>
                  setForm({
                    ...form,
                    sarpanch_name_en: e.target.value,
                  })
                }
                placeholder={TO_BE_UPDATED_EN}
              />
            </div>

            <div>
              <label className="form-label">
                सरपंच नाव (मराठी)
              </label>

              <input
                className="form-control"
                value={form.sarpanch_name_mr}
                onChange={e =>
                  setForm({
                    ...form,
                    sarpanch_name_mr: e.target.value,
                  })
                }
                placeholder={TO_BE_UPDATED_MR}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                Deputy Sarpanch (English)
              </label>

              <input
                className="form-control"
                value={form.deputy_sarpanch_name_en}
                onChange={e =>
                  setForm({
                    ...form,
                    deputy_sarpanch_name_en: e.target.value,
                  })
                }
                placeholder={TO_BE_UPDATED_EN}
              />
            </div>

            <div>
              <label className="form-label">
                उपसरपंच नाव (मराठी)
              </label>

              <input
                className="form-control"
                value={form.deputy_sarpanch_name_mr}
                onChange={e =>
                  setForm({
                    ...form,
                    deputy_sarpanch_name_mr: e.target.value,
                  })
                }
                placeholder={TO_BE_UPDATED_MR}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                Gram Sevak (English)
              </label>

              <input
                className="form-control"
                value={form.gram_sevak_name_en}
                onChange={e =>
                  setForm({
                    ...form,
                    gram_sevak_name_en: e.target.value,
                  })
                }
                placeholder={TO_BE_UPDATED_EN}
              />
            </div>

            <div>
              <label className="form-label">
                ग्रामसेवक नाव (मराठी)
              </label>

              <input
                className="form-control"
                value={form.gram_sevak_name_mr}
                onChange={e =>
                  setForm({
                    ...form,
                    gram_sevak_name_mr: e.target.value,
                  })
                }
                placeholder={TO_BE_UPDATED_MR}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Panchayat Information'}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------
// 3. Announcements CRUD Tab
// ---------------------------------------------------------------------
function AnnouncementsTab({
  items,
  setItems,
  showNotice,
}: {
  items: AnnouncementRecord[];
  setItems: (i: AnnouncementRecord[]) => void;
  showNotice: (msg: string) => void;
}) {
  const [editing, setEditing] =
    useState<Partial<AnnouncementRecord> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startCreate = () => {
    setEditing({
      title_en: '',
      title_mr: '',
      description_en: '',
      description_mr: '',
      category: 'General',
      notice_date:
        new Date().toISOString().split('T')[0] ?? '',
      is_pinned: false,
      is_active: true,
    });

    setIsNew(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!editing?.title_en || !editing?.title_mr) {
      alert('Please provide both English and Marathi titles.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      if (isNew) {
        const { data, error } = await supabase
          .from('announcements')
          .insert([editing])
          .select()
          .single();

        if (error) {
          showNotice(
            `Error creating announcement: ${error.message}`
          );
          return;
        }

        if (data) {
          setItems([data, ...items]);
        }
      } else {
        const { data, error } = await supabase
          .from('announcements')
          .update(editing)
          .eq('id', editing.id)
          .select()
          .single();

        if (error) {
          showNotice(
            `Error updating announcement: ${error.message}`
          );
          return;
        }

        if (data) {
          setItems(
            items.map(a =>
              a.id === data.id ? data : a
            )
          );
        }
      }
    } else {
      // Local demo mode
      if (isNew) {
        const newRecord: AnnouncementRecord = {
          ...editing,
          id: `demo-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as AnnouncementRecord;

        setItems([newRecord, ...items]);
      } else {
        setItems(
          items.map(a =>
            a.id === editing.id
              ? ({
                ...a,
                ...editing,
              } as AnnouncementRecord)
              : a
          )
        );
      }
    }

    setEditing(null);
    showNotice(
      isNew
        ? 'Announcement published.'
        : 'Announcement updated.'
    );
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this announcement?'
      )
    ) {
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        showNotice(`Delete error: ${error.message}`);
        return;
      }
    }

    setItems(items.filter(a => a.id !== id));
    showNotice('Announcement deleted.');
  };

  const toggleActive = async (
    item: AnnouncementRecord
  ) => {
    const updated = !item.is_active;

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('announcements')
        .update({
          is_active: updated,
        })
        .eq('id', item.id);
    }

    setItems(
      items.map(a =>
        a.id === item.id
          ? {
            ...a,
            is_active: updated,
          }
          : a
      )
    );

    showNotice(
      `Announcement ${updated ? 'published' : 'unpublished'
      }.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Announcements & Notices CRUD
          </h2>

          <p className="text-xs text-muted-foreground">
            Publish and manage public Gram Panchayat notices
          </p>
        </div>

        <Button onClick={startCreate} size="sm">
          <Plus className="mr-1.5 size-4" />
          New Announcement
        </Button>
      </div>

      {editing ? (
        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-md border border-border p-5 bg-card"
        >
          <h3 className="text-base font-bold text-foreground">
            {isNew
              ? 'Create New Announcement / नवीन सूचना'
              : 'Edit Announcement / सूचना संपादन'}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                English Title *
              </label>

              <input
                required
                className="form-control"
                value={editing.title_en || ''}
                onChange={e =>
                  setEditing({
                    ...editing,
                    title_en: e.target.value,
                  })
                }
                placeholder="e.g. Gram Sabha Meeting Notice"
              />
            </div>

            <div>
              <label className="form-label">
                मराठी शीर्षक *
              </label>

              <input
                required
                className="form-control"
                value={editing.title_mr || ''}
                onChange={e =>
                  setEditing({
                    ...editing,
                    title_mr: e.target.value,
                  })
                }
                placeholder="उदा. ग्रामसभा बैठक सूचना"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                Category
              </label>

              <select
                className="form-control"
                value={editing.category || 'General'}
                onChange={e =>
                  setEditing({
                    ...editing,
                    category:
                      e.target.value as AnnouncementRecord['category'],
                  })
                }
              >
                <option value="General">General</option>
                <option value="Gram Sabha">
                  Gram Sabha
                </option>
                <option value="Development">
                  Development
                </option>
                <option value="Public Notice">
                  Public Notice
                </option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Date (दिनांक)
              </label>

              <input
                type="date"
                className="form-control"
                value={editing.notice_date || ''}
                onChange={e =>
                  setEditing({
                    ...editing,
                    notice_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              English Description *
            </label>

            <textarea
              required
              rows={3}
              className="form-control"
              value={editing.description_en || ''}
              onChange={e =>
                setEditing({
                  ...editing,
                  description_en: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="form-label">
              मराठी तपशील (Description) *
            </label>

            <textarea
              required
              rows={3}
              className="form-control"
              value={editing.description_mr || ''}
              onChange={e =>
                setEditing({
                  ...editing,
                  description_mr: e.target.value,
                })
              }
            />
          </div>

          <div className="flex flex-wrap gap-5 text-sm pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.is_pinned || false}
                onChange={e =>
                  setEditing({
                    ...editing,
                    is_pinned: e.target.checked,
                  })
                }
                className="size-4"
              />

              Pin to top / मुख्यस्थानी ठेवा
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.is_active ?? true}
                onChange={e =>
                  setEditing({
                    ...editing,
                    is_active: e.target.checked,
                  })
                }
                className="size-4"
              />

              Active / प्रकाशित करा
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save Announcement
            </Button>
          </div>
        </form>
      ) : items.length > 0 ? (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-md border border-border p-4 bg-card hover:bg-secondary/20"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.notice_date}</span>

                  <span className="rounded bg-secondary px-2 py-0.5 font-medium text-green">
                    {item.category}
                  </span>

                  {item.is_pinned && (
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <Pin className="size-3" />
                      Pinned
                    </span>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.is_active
                      ? 'bg-green/10 text-green'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {item.is_active
                      ? 'Published'
                      : 'Draft / Unpublished'}
                  </span>
                </div>

                <h4 className="mt-1 font-bold text-foreground text-sm">
                  {item.title_en}
                </h4>

                <p className="text-xs text-green">
                  {item.title_mr}
                </p>

                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {item.description_en}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(item)}
                  className="text-xs"
                >
                  {item.is_active
                    ? 'Unpublish'
                    : 'Publish'}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditing(item);
                    setIsNew(false);
                  }}
                >
                  <Edit2 className="size-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No announcements created yet. Click &quot;New
          Announcement&quot; above to create one.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// 4. Gallery Management Tab
// ---------------------------------------------------------------------
function GalleryTab({
  items,
  setItems,
  showNotice,
}: {
  items: GalleryItemRecord[];
  setItems: (i: GalleryItemRecord[]) => void;
  showNotice: (msg: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [category, setCategory] =
    useState<
      'Village' | 'Panchayat' | 'Development' | 'Community'
    >('Village');

  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUploadAndSave = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!titleEn || !titleMr) {
      alert('Please provide titles.');
      return;
    }

    let finalUrl = imageUrl;

    if (
      file &&
      isSupabaseConfigured &&
      supabase
    ) {
      setUploading(true);

      const filename = `gallery-${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        ''
      )}`;

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage
        .from('gallery')
        .upload(filename, file);

      if (uploadError) {
        showNotice(
          `Upload error: ${uploadError.message}`
        );
        setUploading(false);
        return;
      }

      const { data: urlData } =
        supabase.storage
          .from('gallery')
          .getPublicUrl(uploadData.path);

      finalUrl = urlData.publicUrl;
      setUploading(false);
    }

    if (!finalUrl) {
      alert(
        'Please upload an image file or provide an image URL.'
      );
      return;
    }

    const newRecord: Partial<GalleryItemRecord> = {
      title_en: titleEn,
      title_mr: titleMr,
      category,
      image_url: finalUrl,
      display_order: items.length + 1,
      is_active: true,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } =
        await supabase
          .from('gallery_items')
          .insert([newRecord])
          .select()
          .single();

      if (error) {
        showNotice(
          `Error saving photo: ${error.message}`
        );
        return;
      }

      if (data) {
        setItems([data, ...items]);
      }
    } else {
      setItems([
        {
          ...newRecord,
          id: `demo-g-${Date.now()}`,
          created_at: new Date().toISOString(),
        } as GalleryItemRecord,
        ...items,
      ]);
    }

    setIsAdding(false);
    setTitleEn('');
    setTitleMr('');
    setImageUrl('');
    setFile(null);

    showNotice(
      'Gallery photo added successfully.'
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return;

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);
    }

    setItems(
      items.filter(g => g.id !== id)
    );

    showNotice('Photo deleted.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Gallery Management
          </h2>

          <p className="text-xs text-muted-foreground">
            Upload and manage authentic Ovali village photographs
          </p>
        </div>

        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
        >
          <Upload className="mr-1.5 size-4" />
          Add Photo
        </Button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleUploadAndSave}
          className="space-y-4 rounded-md border border-border p-5 bg-card"
        >
          <h3 className="text-base font-bold text-foreground">
            Add New Photograph / छायाचित्र जोडा
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                English Title *
              </label>

              <input
                required
                className="form-control"
                value={titleEn}
                onChange={e =>
                  setTitleEn(e.target.value)
                }
                placeholder="e.g. Village Water Conservation"
              />
            </div>

            <div>
              <label className="form-label">
                मराठी शीर्षक *
              </label>

              <input
                required
                className="form-control"
                value={titleMr}
                onChange={e =>
                  setTitleMr(e.target.value)
                }
                placeholder="उदा. गाव पाणी पुरवठा प्रकल्प"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                Category
              </label>

              <select
                className="form-control"
                value={category}
                onChange={e =>
                  setCategory(
                    e.target.value as any
                  )
                }
              >
                <option value="Village">
                  Village (गाव)
                </option>

                <option value="Panchayat">
                  Panchayat (ग्रामपंचायत)
                </option>

                <option value="Development">
                  Development (विकास)
                </option>

                <option value="Community">
                  Community (सामुदायिक)
                </option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Upload Image File (Supabase Storage)
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="form-control text-xs"
                onChange={e =>
                  setFile(
                    e.target.files?.[0] ||
                    null
                  )
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Or External Image URL
            </label>

            <input
              type="url"
              className="form-control"
              value={imageUrl}
              onChange={e =>
                setImageUrl(e.target.value)
              }
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setIsAdding(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? 'Uploading…'
                : 'Save Photo'}
            </Button>
          </div>
        </form>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map(item => (
            <div
              key={item.id}
              className="relative group rounded-md border border-border overflow-hidden bg-card shadow-sm"
            >
              <img
                src={item.image_url}
                alt={item.title_en}
                className="aspect-[4/3] w-full object-cover"
              />

              <div className="p-3">
                <span className="text-[10px] font-bold text-green">
                  {item.category}
                </span>

                <h4 className="font-bold text-foreground text-xs truncate">
                  {item.title_en}
                </h4>

                <p className="text-[11px] text-muted-foreground truncate">
                  {item.title_mr}
                </p>
              </div>

              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 size-7 opacity-80 group-hover:opacity-100"
                onClick={() =>
                  handleDelete(item.id)
                }
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No gallery images uploaded yet. Click
          &quot;Add Photo&quot; to upload images into
          Supabase Storage.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// 5. Documents Management Tab
// ---------------------------------------------------------------------
function DocumentsTab({
  items,
  setItems,
  showNotice,
}: {
  items: DocumentRecord[];
  setItems: (i: DocumentRecord[]) => void;
  showNotice: (msg: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [category, setCategory] =
    useState<DocumentRecord['category']>(
      'Gram Sabha'
    );
  const [docNumber, setDocNumber] =
    useState('');

  const [issueDate, setIssueDate] =
    useState<string>(
      () =>
        new Date().toISOString().split('T')[0] ??
        ''
    );

  const [fileUrl, setFileUrl] =
    useState('');

  const [file, setFile] =
    useState<File | null>(null);

  const handleUploadAndSave = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!titleEn || !titleMr) {
      alert('Please provide titles.');
      return;
    }

    let finalUrl = fileUrl;
    let fileSize: number | undefined;

    if (
      file &&
      isSupabaseConfigured &&
      supabase
    ) {
      setUploading(true);

      const filename = `doc-${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        ''
      )}`;

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage
        .from('documents')
        .upload(filename, file);

      if (uploadError) {
        showNotice(
          `Upload error: ${uploadError.message}`
        );

        setUploading(false);
        return;
      }

      const { data: urlData } =
        supabase.storage
          .from('documents')
          .getPublicUrl(uploadData.path);

      finalUrl = urlData.publicUrl;
      fileSize = file.size;

      setUploading(false);
    }

    if (!finalUrl) {
      alert(
        'Please upload a PDF file or provide a document URL.'
      );
      return;
    }

    const newRecord: Partial<DocumentRecord> = {
      title_en: titleEn,
      title_mr: titleMr,
      category,
      document_number:
        docNumber || null,
      issue_date: issueDate,
      file_url: finalUrl,
      file_size_bytes:
        fileSize || null,
      file_extension: 'pdf',
      is_active: true,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } =
        await supabase
          .from('documents')
          .insert([newRecord])
          .select()
          .single();

      if (error) {
        showNotice(
          `Error saving document: ${error.message}`
        );
        return;
      }

      if (data) {
        setItems([data, ...items]);
      }
    } else {
      setItems([
        {
          ...newRecord,
          id: `demo-doc-${Date.now()}`,
          created_at:
            new Date().toISOString(),
        } as DocumentRecord,
        ...items,
      ]);
    }

    setIsAdding(false);
    setTitleEn('');
    setTitleMr('');
    setDocNumber('');
    setFileUrl('');
    setFile(null);

    showNotice(
      'Document uploaded and published.'
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?'))
      return;

    if (
      isSupabaseConfigured &&
      supabase
    ) {
      await supabase
        .from('documents')
        .delete()
        .eq('id', id);
    }

    setItems(
      items.filter(d => d.id !== id)
    );

    showNotice('Document deleted.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Documents Management
          </h2>

          <p className="text-xs text-muted-foreground">
            Upload Gram Sabha resolutions, citizen forms,
            and tender notices
          </p>
        </div>

        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
        >
          <Upload className="mr-1.5 size-4" />
          Upload PDF Document
        </Button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleUploadAndSave}
          className="space-y-4 rounded-md border border-border p-5 bg-card"
        >
          <h3 className="text-base font-bold text-foreground">
            Upload Document / कागदपत्र जोडा
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                English Title *
              </label>

              <input
                required
                className="form-control"
                value={titleEn}
                onChange={e =>
                  setTitleEn(e.target.value)
                }
                placeholder="e.g. Gram Sabha Resolution No. 04"
              />
            </div>

            <div>
              <label className="form-label">
                मराठी शीर्षक *
              </label>

              <input
                required
                className="form-control"
                value={titleMr}
                onChange={e =>
                  setTitleMr(e.target.value)
                }
                placeholder="उदा. ग्रामसभा ठराव क्र. ०४"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label">
                Category
              </label>

              <select
                className="form-control"
                value={category}
                onChange={e =>
                  setCategory(
                    e.target.value as any
                  )
                }
              >
                <option value="Gram Sabha">
                  Gram Sabha
                </option>

                <option value="Budget & Finance">
                  Budget & Finance
                </option>

                <option value="Citizen Services">
                  Citizen Services
                </option>

                <option value="Forms">
                  Forms
                </option>

                <option value="Tenders">
                  Tenders
                </option>

                <option value="Government Schemes">
                  Government Schemes
                </option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Document Number (Optional)
              </label>

              <input
                className="form-control"
                value={docNumber}
                onChange={e =>
                  setDocNumber(e.target.value)
                }
                placeholder="e.g. GPO/2026/04"
              />
            </div>

            <div>
              <label className="form-label">
                Issue Date
              </label>

              <input
                type="date"
                className="form-control"
                value={issueDate}
                onChange={e =>
                  setIssueDate(e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">
                PDF File (Supabase Storage)
              </label>

              <input
                type="file"
                accept="application/pdf"
                className="form-control text-xs"
                onChange={e =>
                  setFile(
                    e.target.files?.[0] ||
                    null
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                Or External Document URL
              </label>

              <input
                type="url"
                className="form-control"
                value={fileUrl}
                onChange={e =>
                  setFileUrl(e.target.value)
                }
                placeholder="https://example.com/resolution.pdf"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setIsAdding(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? 'Uploading PDF…'
                : 'Save Document'}
            </Button>
          </div>
        </form>
      )}

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-md border border-border p-4 bg-card"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-secondary px-2 py-0.5 font-semibold text-green">
                    {item.category}
                  </span>

                  <span>
                    {item.issue_date}
                  </span>

                  {item.document_number && (
                    <span className="font-mono">
                      ({item.document_number})
                    </span>
                  )}
                </div>

                <h4 className="mt-1 font-bold text-foreground text-sm">
                  {item.title_en}
                </h4>

                <p className="text-xs text-green">
                  {item.title_mr}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                >
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-1.5 size-3.5" />
                    View / Download
                  </a>
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No official documents uploaded yet. Click
          &quot;Upload PDF Document&quot; above to add
          documents.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// 6. Contact Inquiries Tab
// ---------------------------------------------------------------------
function ContactsTab({
  items,
  setItems,
  showNotice,
}: {
  items: ContactSubmissionRecord[];
  setItems: (
    c: ContactSubmissionRecord[]
  ) => void;
  showNotice: (msg: string) => void;
}) {
  const updateStatus = async (
    id: string,
    status: ContactSubmissionRecord['status']
  ) => {
    if (
      isSupabaseConfigured &&
      supabase
    ) {
      const { error } =
        await supabase
          .from('contact_submissions')
          .update({ status })
          .eq('id', id);

      if (error) {
        showNotice(
          `Error updating inquiry: ${error.message}`
        );
        return;
      }
    }

    setItems(
      items.map(c =>
        c.id === id
          ? {
            ...c,
            status,
          }
          : c
      )
    );

    showNotice(
      `Inquiry status updated to ${status}.`
    );
  };

  // NEW: Delete Contact Inquiry
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this contact inquiry?'
      )
    ) {
      return;
    }

    if (
      isSupabaseConfigured &&
      supabase
    ) {
      const { error } =
        await supabase
          .from('contact_submissions')
          .delete()
          .eq('id', id);

      if (error) {
        showNotice(
          `Delete error: ${error.message}`
        );
        return;
      }
    }

    setItems(
      items.filter(c => c.id !== id)
    );

    showNotice(
      'Contact inquiry deleted successfully.'
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">
          Contact Inquiries Inbox
        </h2>

        <p className="text-xs text-muted-foreground">
          Citizen messages and service inquiries received
          through the contact form
        </p>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(inq => (
            <div
              key={inq.id}
              className="rounded-md border border-border p-4 bg-card shadow-sm space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <strong className="text-foreground text-sm">
                    {inq.full_name}
                  </strong>

                  <span className="text-muted-foreground">
                    · Tel: {inq.mobile}
                  </span>

                  {inq.email && (
                    <span className="text-muted-foreground">
                      · {inq.email}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {new Date(
                      inq.created_at
                    ).toLocaleDateString()}
                  </span>

                  <select
                    className="rounded border border-border bg-card px-2 py-1 text-xs font-semibold"
                    value={inq.status}
                    onChange={e =>
                      updateStatus(
                        inq.id,
                        e.target.value as any
                      )
                    }
                  >
                    <option value="new">
                      New (नवीन)
                    </option>

                    <option value="reviewed">
                      Reviewed (तपासले)
                    </option>

                    <option value="resolved">
                      Resolved (निवारण झाले)
                    </option>

                    <option value="archived">
                      Archived
                    </option>
                  </select>

                  {/* NEW: Delete button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      handleDelete(inq.id)
                    }
                    title="Delete inquiry"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <p className="text-xs font-semibold text-primary">
                Subject: {inq.subject}
              </p>

              <p className="text-xs text-muted-foreground leading-5 bg-secondary/40 p-3 rounded">
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No contact inquiries submitted yet.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// 7. Feedback Submissions Tab
// ---------------------------------------------------------------------
function FeedbackTab({
  items,
  setItems,
  showNotice,
}: {
  items: FeedbackSubmissionRecord[];
  setItems: (
    f: FeedbackSubmissionRecord[]
  ) => void;
  showNotice: (msg: string) => void;
}) {
  // NEW: Delete Feedback Submission
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this feedback submission?'
      )
    ) {
      return;
    }

    if (
      isSupabaseConfigured &&
      supabase
    ) {
      const { error } =
        await supabase
          .from('feedback_submissions')
          .delete()
          .eq('id', id);

      if (error) {
        showNotice(
          `Delete error: ${error.message}`
        );
        return;
      }
    }

    setItems(
      items.filter(f => f.id !== id)
    );

    showNotice(
      'Feedback submission deleted successfully.'
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">
          Feedback & Grievances
        </h2>

        <p className="text-xs text-muted-foreground">
          Citizen suggestions, service ratings, and community
          issues
        </p>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(fb => (
            <div
              key={fb.id}
              className="rounded-md border border-border p-4 bg-card shadow-sm space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-secondary px-2.5 py-0.5 font-bold text-green">
                    {fb.category}
                  </span>

                  {fb.is_anonymous ? (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-primary font-semibold">
                      Anonymous (निनावी)
                    </span>
                  ) : (
                    <strong className="text-foreground">
                      {fb.full_name} ({fb.mobile})
                    </strong>
                  )}

                  {fb.ward && (
                    <span className="text-muted-foreground">
                      · Ward: {fb.ward}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {fb.rating && (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                      <Star className="size-3.5 fill-current" />
                      {fb.rating}/5
                    </span>
                  )}

                  <span className="text-muted-foreground">
                    {new Date(
                      fb.created_at
                    ).toLocaleDateString()}
                  </span>

                  {/* NEW: Delete button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      handleDelete(fb.id)
                    }
                    title="Delete feedback"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-foreground">
                {fb.subject}
              </h4>

              <p className="text-xs text-muted-foreground leading-5 bg-secondary/40 p-3 rounded">
                {fb.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No feedback submitted yet.
        </div>
      )}
    </div>
  );
}