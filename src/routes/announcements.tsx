import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CalendarDays, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, SectionTitle, EmptyState, routeHead } from '@/components/site';
import { announcements as initialAnnouncements, type Announcement } from '@/lib/site-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const Route = createFileRoute('/announcements')({
  head: () =>
    routeHead(
      'Announcements & Notices',
      'Official public notices, circulars, and announcements from Gram Panchayat Ovali, Bhiwandi, Thane.'
    ),
  component: Announcements,
});

const filters = ['All', 'General', 'Gram Sabha', 'Development', 'Public Notice'] as const;

function Announcements() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [expanded, setExpanded] = useState<string | number | null>(null);
  const [items, setItems] = useState<Announcement[]>(initialAnnouncements);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);

    supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('notice_date', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data) {
          const mapped: Announcement[] = data.map(d => ({
            id: d.id,
            date: d.notice_date,
            category: d.category,
            title: d.title_en,
            titleMarathi: d.title_mr,
            english: d.title_en,
            description: d.description_en,
            descriptionMarathi: d.description_mr,
            isPinned: d.is_pinned,
          }));
          setItems(mapped);
        }
      });
  }, []);

  const filteredItems = items.filter(n => filter === 'All' || n.category === filter);

  return (
    <>
      <PageHeader title="Announcements & Notices" marathi="सूचना व जाहिराती" breadcrumb="Announcements" />
      <div className="site-container py-14">
        <SectionTitle
          title="Latest Notices"
          marathi="ताज्या सूचना"
          intro="Important information and official announcements for residents of Ovali village."
        />

        <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label="Filter announcements">
          {filters.map(f => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => {
                setFilter(f);
                setExpanded(null);
              }}
            >
              {f}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading announcements...</div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map(n => (
              <article
                id={`notice-${n.id}`}
                key={n.id}
                className="scroll-mt-6 rounded-md border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex gap-4">
                  <span className="hidden size-11 shrink-0 place-items-center rounded bg-secondary text-primary sm:grid">
                    <Bell className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {n.date}
                      </span>
                      <span className="rounded bg-secondary px-2 py-1 font-semibold text-green">
                        {n.category}
                      </span>
                      {n.isPinned && (
                        <span className="rounded bg-primary/10 px-2 py-1 font-semibold text-primary">
                          Important / महत्त्वाचे
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{n.title}</h2>
                    {n.titleMarathi && (
                      <p className="mt-1 text-sm font-medium text-green">{n.titleMarathi}</p>
                    )}
                    <p className="mt-1 text-sm font-medium text-primary">{n.english}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{n.description}</p>
                    {n.descriptionMarathi && (
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{n.descriptionMarathi}</p>
                    )}

                    {expanded === n.id && (
                      <div className="mt-4 border-t border-border pt-4 text-sm leading-7 text-muted-foreground">
                        <p>For further details regarding this notice, please contact the Gram Panchayat Ovali office.</p>
                        <p>या सूचनेबाबत अधिक माहितीसाठी कृपया ग्रामपंचायत कार्यालयाशी संपर्क साधा.</p>
                      </div>
                    )}

                    <Button
                      variant="link"
                      className="mt-3 h-auto p-0 font-semibold"
                      onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                      aria-expanded={expanded === n.id}
                    >
                      {expanded === n.id ? 'Show Less' : 'Read More / अधिक वाचा'}{' '}
                      <ChevronDown
                        className={`size-4 transition-transform ${expanded === n.id ? 'rotate-180' : ''}`}
                      />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No announcements or public notices at this time"
            titleMr="या वेळी कोणत्याही सूचना किंवा जाहिराती उपलब्ध नाहीत"
            description="Official notices, meeting invitations, and administrative orders will be published here when issued."
            descriptionMr="माहिती लवकरच अद्ययावत केली जाईल. कृपया नंतर पुन्हा तपासा."
          />
        )}
      </div>
    </>
  );
}
