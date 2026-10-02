import { useEffect, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  Building2,
  Phone,
  Mail,
  LockKeyhole,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  CalendarDays,
  Bell,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  announcements,
  contact,
  navItems,
  portals,
  tagline,
  type Announcement,
  TO_BE_UPDATED_EN,
} from '@/lib/site-data';
import {
  isSupabaseConfigured,
  supabase,
  type PanchayatSettingsRecord,
} from '@/lib/supabase';

function usePanchayatSettings() {
  const [settings, setSettings] =
    useState<PanchayatSettingsRecord | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let cancelled = false;

    const loadSettings = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('panchayat_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!cancelled && !error && data) {
        setSettings(data);
      }
    };

    // Initial load
    loadSettings();

    // Refresh Header/Footer after admin updates Panchayat Information
    const handleSettingsUpdated = () => {
      loadSettings();
    };

    window.addEventListener(
      'panchayat-settings-updated',
      handleSettingsUpdated
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        'panchayat-settings-updated',
        handleSettingsUpdated
      );
    };
  }, []);

  return settings;
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      to="/"
      className="flex min-w-0 items-center gap-3"
      aria-label="Gram Panchayat Ovali home"
    >
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-full border-2 ${inverse
          ? 'border-footer-accent bg-footer-surface'
          : 'border-green bg-secondary'
          }`}
      >
        <Building2
          className={`size-6 ${inverse ? 'text-footer-accent' : 'text-green'
            }`}
        />
      </span>

      <span className="min-w-0 leading-tight">
        <strong
          className={`block text-[15px] font-bold sm:text-lg ${inverse ? 'text-footer-foreground' : 'text-primary'
            }`}
        >
          Gram Panchayat Ovali
        </strong>

        <span
          className={`block text-sm font-medium ${inverse ? 'text-footer-accent' : 'text-green'
            }`}
        >
          ग्राम पंचायत ओवळी
        </span>

        {!inverse && (
          <small className="block text-[11px] text-muted-foreground">
            Bhiwandi, Thane, Maharashtra
          </small>
        )}
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const settings = usePanchayatSettings();

  const phone = settings?.office_phone || contact.phone;
  const email = settings?.office_email || contact.email;

  return (
    <header className="relative z-50">
      <div className="bg-footer text-footer-foreground">
        <div className="site-container flex min-h-9 items-center justify-between gap-3 py-1 text-[11px] sm:text-xs">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {phone !== TO_BE_UPDATED_EN ? (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-1.5 hover:text-footer-accent"
              >
                <Phone className="size-3" />
                {phone}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 opacity-80">
                <Phone className="size-3" />
                Phone: {phone}
              </span>
            )}

            {email !== TO_BE_UPDATED_EN ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 hover:text-footer-accent"
              >
                <Mail className="size-3" />
                {email}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 opacity-80">
                <Mail className="size-3" />
                Email: {email}
              </span>
            )}
          </div>

          <Link
            to="/admin/login"
            className="inline-flex shrink-0 items-center gap-1.5 hover:text-footer-accent"
          >
            <LockKeyhole className="size-3" />
            Admin Login
          </Link>
        </div>
      </div>

      <div className="tricolor" aria-hidden="true" />

      <nav
        className="border-b border-border bg-card shadow-sm"
        aria-label="Main navigation"
      >
        <div className="site-container flex h-[82px] items-center justify-between gap-4">
          <Brand />

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded px-3 py-2 text-sm font-semibold leading-tight transition-colors ${pathname === item.to
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary hover:text-primary'
                  }`}
              >
                <span className="block">{item.en}</span>
                <span className="mt-0.5 block text-[11px] font-normal opacity-80">
                  {item.mr}
                </span>
              </Link>
            ))}
          </div>

          <Button
            className="lg:hidden"
            variant="ghost"
            size="icon"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>

        {open && (
          <div className="site-container border-t border-border bg-card pb-3 lg:hidden">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between border-b border-border px-3 py-3 text-sm ${pathname === item.to
                  ? 'font-bold text-primary'
                  : 'text-foreground'
                  }`}
              >
                <span>
                  {item.en}{' '}
                  <span className="ml-2 text-muted-foreground">
                    {item.mr}
                  </span>
                </span>

                <ChevronRight className="size-4" />
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  const settings = usePanchayatSettings();

  const phone = settings?.office_phone || contact.phone;
  const email = settings?.office_email || contact.email;
  const address = settings?.office_address || contact.address;
  const hours = settings?.office_hours_en || contact.hours;

  return (
    <footer className="bg-footer text-footer-muted">
      <div className="site-container grid gap-9 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Brand inverse />

          <p className="mt-5 text-sm leading-7">{tagline}</p>
        </div>

        <div>
          <h3 className="footer-heading">
            Quick Links / त्वरित दुवे
          </h3>

          <ul className="space-y-2 text-sm">
            {navItems.map(item => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-2 hover:text-footer-accent"
                >
                  <ChevronRight className="size-3 text-footer-accent" />
                  {item.en}{' '}
                  <span className="text-xs opacity-75">
                    ({item.mr})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-heading">
            Govt. Portals / शासकीय संकेतस्थळे
          </h3>

          <ul className="space-y-2 text-sm">
            {portals.map(p => (
              <li key={p.url}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-footer-accent"
                >
                  <ExternalLink className="size-3 text-footer-accent" />
                  {p.short}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-heading">
            Contact / संपर्क
          </h3>

          <ul className="space-y-3 text-sm leading-6">
            <li className="flex gap-2">
              <MapPin className="mt-1 size-4 shrink-0 text-footer-accent" />
              {address}
            </li>

            <li className="flex items-center gap-2">
              <Phone className="size-4 text-footer-accent" />

              {phone !== TO_BE_UPDATED_EN ? (
                <a
                  href={`tel:${phone}`}
                  className="hover:text-footer-accent"
                >
                  {phone}
                </a>
              ) : (
                <span>{phone}</span>
              )}
            </li>

            <li className="flex items-center gap-2">
              <Mail className="size-4 text-footer-accent" />

              {email !== TO_BE_UPDATED_EN ? (
                <a
                  href={`mailto:${email}`}
                  className="hover:text-footer-accent"
                >
                  {email}
                </a>
              ) : (
                <span>{email}</span>
              )}
            </li>

            <li className="flex gap-2">
              <Clock className="size-4 shrink-0 text-footer-accent" />

              <span>
                Office Hours: {hours}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-footer-line">
        <div className="site-container flex flex-col justify-between gap-2 py-5 text-xs sm:flex-row">
          <span>
            © 2025-26 Gram Panchayat Ovali, Bhiwandi, Thane. All rights reserved.
          </span>

          <span>
            Official Rural Local Governance Portal | Bhiwandi, Thane, Maharashtra
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({
  title,
  marathi,
  breadcrumb,
}: {
  title: string;
  marathi: string;
  breadcrumb: string;
}) {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="site-container py-10 sm:py-12">
        <p className="mb-1 text-sm font-medium text-primary-soft">
          {marathi}
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {title}
        </h1>

        <nav
          aria-label="Breadcrumb"
          className="mt-3 flex items-center gap-1 text-xs text-primary-soft"
        >
          <Link to="/" className="hover:underline">
            Home
          </Link>

          <ChevronRight className="size-3" />

          <span>{breadcrumb}</span>
        </nav>
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  marathi,
  intro,
}: {
  title: string;
  marathi?: string;
  intro?: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-3 h-1 w-10 rounded-full bg-green" />

      <h2 className="text-2xl font-bold text-primary sm:text-[28px]">
        {title}
      </h2>

      {marathi && (
        <p className="mt-1 text-sm font-medium text-green">
          {marathi}
        </p>
      )}

      {intro && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          {intro}
        </p>
      )}
    </div>
  );
}

export function AnnouncementCard({
  item,
}: {
  item: Announcement;
}) {
  return (
    <article className="flex h-full flex-col rounded-md border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {item.date}
        </span>

        <span className="rounded bg-secondary px-2 py-1 font-medium text-green">
          {item.category}
        </span>

        {item.isPinned && (
          <span className="rounded bg-primary/10 px-2 py-1 font-semibold text-primary">
            Pinned
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {item.title}
      </h3>

      {item.titleMarathi && (
        <p className="mt-0.5 text-sm font-medium text-green">
          {item.titleMarathi}
        </p>
      )}

      <p className="mt-1 text-sm font-medium text-primary">
        {item.english}
      </p>

      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
        {item.description}
      </p>

      <Link
        to="/announcements"
        hash={`notice-${item.id}`}
        className="mt-5 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        View Details <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

export function EmptyState({
  title,
  titleMr,
  description,
  descriptionMr,
}: {
  title: string;
  titleMr?: string;
  description: string;
  descriptionMr?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/60 p-10 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-full bg-secondary text-primary">
        <Inbox className="size-6 text-green" />
      </div>

      <h3 className="text-base font-bold text-foreground">
        {title}
      </h3>

      {titleMr && (
        <p className="mt-0.5 text-sm font-medium text-green">
          {titleMr}
        </p>
      )}

      <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
        {description}
      </p>

      {descriptionMr && (
        <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
          {descriptionMr}
        </p>
      )}
    </div>
  );
}

export function NoticeIcon() {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
      <Bell className="size-5" />
    </span>
  );
}

export function PrimaryLink({
  to,
  children,
  outline = false,
}: {
  to:
  | '/'
  | '/about'
  | '/gallery'
  | '/announcements'
  | '/documents'
  | '/contact'
  | '/feedback';
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Button
      asChild
      variant={outline ? 'outline' : 'default'}
      size="lg"
    >
      <Link to={to}>
        {children}
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
}

export function routeHead(
  title: string,
  description: string
) {
  const name = `${title} | Gram Panchayat Ovali`;

  return {
    meta: [
      { title: name },
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:title',
        content: name,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  };
}