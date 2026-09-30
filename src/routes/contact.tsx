import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { PageHeader, SectionTitle, routeHead } from '@/components/site';
import { ContactForm } from '@/components/forms';
import { contact, TO_BE_UPDATED_EN, TO_BE_UPDATED_MR } from '@/lib/site-data';
import { supabase, isSupabaseConfigured, type PanchayatSettingsRecord } from '@/lib/supabase';

export const Route = createFileRoute('/contact')({
  head: () =>
    routeHead(
      'Contact Us',
      'Contact Gram Panchayat Ovali office in Bhiwandi Taluka, Thane District, Maharashtra – PIN 421302.'
    ),
  component: Contact,
});

function Contact() {
  const [settings, setSettings] = useState<PanchayatSettingsRecord | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase
      .from('panchayat_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  const phoneValue = settings?.office_phone || contact.phone;
  const emailValue = settings?.office_email || contact.email;
  const addressValue = settings?.office_address || contact.address;
  const hoursValue = settings?.office_hours_en || contact.hours;

  const contactCards = [
    {
      icon: MapPin,
      label: 'Office Address / कार्यालयाचा पत्ता',
      value: addressValue,
    },
    {
      icon: Phone,
      label: 'Phone Number / दूरध्वनी',
      value: phoneValue,
      href: phoneValue !== TO_BE_UPDATED_EN ? `tel:${phoneValue}` : undefined,
    },
    {
      icon: Mail,
      label: 'Email Address / ईमेल',
      value: emailValue,
      href: emailValue !== TO_BE_UPDATED_EN ? `mailto:${emailValue}` : undefined,
    },
    {
      icon: Clock,
      label: 'Office Hours / कार्यालयीन वेळ',
      value: hoursValue === TO_BE_UPDATED_EN ? `${TO_BE_UPDATED_EN} (${TO_BE_UPDATED_MR})` : hoursValue,
    },
  ];

  return (
    <>
      <PageHeader title="Contact Us" marathi="संपर्क" breadcrumb="Contact Us" />

      <div className="site-container py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle
              title="Get in Touch"
              marathi="आमच्याशी संपर्क साधा"
              intro="For public civic services, certifications, inquiries, and official panchayat assistance, contact the Gram Panchayat Ovali office directly."
            />

            <div className="space-y-4">
              {contactCards.map(c => (
                <div key={c.label} className="flex gap-4 rounded-md border border-border bg-card p-5 shadow-sm">
                  <span className="grid size-11 shrink-0 place-items-center rounded bg-secondary text-green">
                    <c.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{c.label}</h3>
                    {c.href ? (
                      <a href={c.href} className="mt-1 block text-sm leading-6 text-primary hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-md border border-border bg-secondary/80 p-6 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-card text-green shadow-sm">
                <MapPin className="size-6" />
              </span>
              <p className="mt-3 font-bold text-primary">Ovali, Bhiwandi Taluka</p>
              <p className="text-sm text-muted-foreground">Thane District, Maharashtra · PIN 421302</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Village Code: 552662 · Bhiwandi Panchayat Samiti
              </p>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
            <SectionTitle title="Send a Message" marathi="संदेश पाठवा" />
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
