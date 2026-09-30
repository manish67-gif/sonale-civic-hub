import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Building2,
  Bell,
  Images,
  Phone,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  MapPin,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle, AnnouncementCard, PrimaryLink, EmptyState, routeHead } from '@/components/site';
import { announcements as initialAnnouncements, portals, tagline, type Announcement } from '@/lib/site-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import office from '@/assets/panchayat-office.jpg';

export const Route = createFileRoute('/')({
  head: () =>
    routeHead(
      'ग्राम पंचायत ओवळी',
      'Official website of Gram Panchayat Ovali, Bhiwandi, Thane, Maharashtra – PIN 421302.'
    ),
  component: Home,
});

const quick = [
  {
    title: 'About Gram Panchayat',
    mr: 'आमच्याबद्दल',
    copy: 'Learn about our village, governance and census facts.',
    to: '/about',
    icon: Building2,
  },
  {
    title: 'Announcements',
    mr: 'सूचना',
    copy: 'Stay informed with the latest public notices and circulars.',
    to: '/announcements',
    icon: Bell,
  },
  {
    title: 'Photo Gallery',
    mr: 'फोटो गॅलरी',
    copy: 'Explore authentic photos of village life and development.',
    to: '/gallery',
    icon: Images,
  },
  {
    title: 'Documents',
    mr: 'कागदपत्रे',
    copy: 'Access public resolutions, citizen forms and records.',
    to: '/documents',
    icon: FileText,
  },
  {
    title: 'Contact Us',
    mr: 'संपर्क',
    copy: 'Reach out to the Gram Panchayat office directly.',
    to: '/contact',
    icon: Phone,
  },
  {
    title: 'Submit Feedback',
    mr: 'अभिप्राय',
    copy: 'Share suggestions, queries, or civic concerns.',
    to: '/feedback',
    icon: MessageSquare,
  },
] as const;

function Home() {
  const [items, setItems] = useState<Announcement[]>(initialAnnouncements);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('notice_date', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-primary text-primary-foreground sm:min-h-[470px]">
        <img
          src={office}
          width={1408}
          height={912}
          alt="Gram Panchayat Ovali local office"
          className="absolute inset-0 -z-20 size-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-footer/80" />
        <div className="site-container py-16">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 border-l-[3px] border-footer-accent pl-3 text-xs font-bold uppercase text-footer-accent">
              <Building2 className="size-4" /> Local Self-Government · Bhiwandi, Thane
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Gram Panchayat Ovali</h1>
            <p className="mt-3 text-2xl font-semibold text-primary-soft sm:text-3xl">ग्राम पंचायत ओवळी</p>
            <p className="mt-7 max-w-xl text-base leading-8 text-primary-foreground/90">{tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-card text-primary hover:bg-card/90">
                <Link to="/about">
                  About Gram Panchayat <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-card hover:text-primary"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="site-container py-14">
        <SectionTitle title="Quick Access" marathi="त्वरित दुवे" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map(q => (
            <Link
              key={q.to}
              to={q.to}
              className="group rounded-md border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="mb-5 grid size-11 place-items-center rounded bg-secondary text-green">
                <q.icon className="size-5" />
              </span>
              <h3 className="font-bold text-foreground group-hover:text-primary">{q.title}</h3>
              <p className="mt-1 text-xs font-medium text-green">{q.mr}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{q.copy}</p>
              <ArrowRight className="mt-5 size-4 text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="border-y border-border bg-card">
        <div className="site-container py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle title="Latest Announcements" marathi="सूचना व जाहिराती" />
            <Link
              to="/announcements"
              className="mb-7 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View All Announcements <ArrowRight className="size-4" />
            </Link>
          </div>
          {items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {items.slice(0, 3).map(item => (
                <AnnouncementCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No announcements published yet"
              titleMr="सध्या कोणतीही नवीन सूचना नाही"
              description="Official Gram Panchayat Ovali notices, public announcements, and gram sabha schedules will appear here."
              descriptionMr="ग्राम पंचायत ओवळीच्या अधिकृत सूचना आणि ग्रामसभा माहिती लवकरच अद्ययावत केली जाईल."
            />
          )}
        </div>
      </section>

      {/* About Ovali Teaser */}
      <section className="site-container grid items-center gap-10 py-16 md:grid-cols-2">
        <img
          src={office}
          loading="lazy"
          width={1408}
          height={912}
          alt="Gram Panchayat Ovali administrative office"
          className="aspect-[4/3] w-full rounded-md object-cover shadow-sm"
        />
        <div>
          <SectionTitle title="About Gram Panchayat Ovali" marathi="आमच्याबद्दल" />
          <p className="text-sm leading-8 text-muted-foreground">
            Gram Panchayat Ovali serves the village of Ovali in Bhiwandi Taluka, Thane District, Maharashtra. We work with
            citizens to strengthen public facilities, ensure transparent rural administration, and support sustainable
            community development.
          </p>
          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            पारदर्शक कारभार, नागरिकांचा सहभाग आणि सर्वांगीण विकास हे ग्राम पंचायत ओवळीच्या कारभाराचे प्रमुख उद्दिष्ट आहे.
          </p>
          <div className="mt-7">
            <PrimaryLink to="/about">Read More / अधिक माहिती</PrimaryLink>
          </div>
        </div>
      </section>

      {/* Government Portals */}
      <section className="border-y border-border bg-card">
        <div className="site-container py-14">
          <SectionTitle title="Government Portals" marathi="शासकीय संकेतस्थळे" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {portals.map(p => (
              <a
                href={p.url}
                key={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-24 items-center justify-between gap-3 rounded-md border border-border px-4 py-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span>{p.name}</span>
                <ExternalLink className="size-4 shrink-0 text-green" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen Call-to-action */}
      <section className="bg-secondary">
        <div className="site-container flex flex-col gap-5 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-green">
              <MapPin className="size-4" /> We are here to help
            </p>
            <h2 className="text-2xl font-bold text-primary">Have a question, suggestion or concern?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              प्रश्न, सूचना किंवा तक्रार असल्यास ग्रामपंचायतीशी संपर्क साधा.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PrimaryLink to="/contact">Contact Us / संपर्क</PrimaryLink>
            <PrimaryLink to="/feedback" outline>
              Submit Feedback / अभिप्राय
            </PrimaryLink>
          </div>
        </div>
      </section>
    </>
  );
}
