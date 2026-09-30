import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Building2,
  MapPin,
  Flag,
  Clock,
  Eye,
  Target,
  Users,
  Shield,
  CheckCircle2,
  Navigation,
  Compass,
} from 'lucide-react';
import { PageHeader, SectionTitle, routeHead } from '@/components/site';
import {
  villageFacts,
  villageFacilities,
  connectivity,
  nearbyVillages,
  contact,
  TO_BE_UPDATED_EN,
  TO_BE_UPDATED_MR,
} from '@/lib/site-data';
import { supabase, isSupabaseConfigured, type PanchayatSettingsRecord } from '@/lib/supabase';
import office from '@/assets/panchayat-office.jpg';

export const Route = createFileRoute('/about')({
  head: () =>
    routeHead(
      'About Us',
      'Learn about Gram Panchayat Ovali, governance, facilities, and Census 2011 demographics in Bhiwandi Taluka, Thane District.'
    ),
  component: About,
});

function About() {
  const [liveSettings, setLiveSettings] = useState<PanchayatSettingsRecord | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase
      .from('panchayat_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setLiveSettings(data);
      });
  }, []);

  const officeHours = liveSettings?.office_hours_en || contact.hours;
  const officeHoursMr = liveSettings?.office_hours_mr || contact.hoursMarathi;
  const sarpanchName = liveSettings?.sarpanch_name_en || contact.sarpanch;
  const deputySarpanchName = liveSettings?.deputy_sarpanch_name_en || contact.deputySarpanch;
  const gramSevakName = liveSettings?.gram_sevak_name_en || contact.gramSevak;

  const keyFacts = [
    { icon: MapPin, label: 'Village / गाव', value: `${villageFacts.village}, ${villageFacts.taluka}` },
    { icon: Building2, label: 'District / जिल्हा', value: `${villageFacts.district}, ${villageFacts.state}` },
    { icon: Flag, label: 'PIN Code / पिन कोड', value: villageFacts.pin },
    { icon: Shield, label: 'Village Code (Census)', value: villageFacts.code },
    { icon: Compass, label: 'Panchayat Samiti / पंचायत समिती', value: villageFacts.panchayatSamiti },
    { icon: Building2, label: 'Zilla Parishad / जिल्हा परिषद', value: villageFacts.districtPanchayat },
    { icon: Navigation, label: 'Geographical Area / क्षेत्रफळ', value: villageFacts.area },
    {
      icon: Clock,
      label: 'Office Hours / कार्यालयीन वेळ',
      value: officeHours === TO_BE_UPDATED_EN ? `${TO_BE_UPDATED_EN} (${TO_BE_UPDATED_MR})` : officeHours,
    },
  ];

  const officials = [
    { title: 'Sarpanch / सरपंच', name: sarpanchName },
    { title: 'Deputy Sarpanch / उपसरपंच', name: deputySarpanchName },
    { title: 'Gram Sevak / ग्रामसेवक', name: gramSevakName },
  ];

  return (
    <>
      <PageHeader title="About Us" marathi="आमच्याबद्दल" breadcrumb="About Us" />

      <div className="site-container py-14">
        {/* Intro */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionTitle title="About Gram Panchayat Ovali" marathi="ग्राम पंचायत ओवळी" />
            <p className="text-sm leading-8 text-muted-foreground">
              Gram Panchayat Ovali is the constitutionally established rural local self-government body serving the village
              of Ovali in Bhiwandi Taluka, Thane District, Maharashtra. We are committed to accountable civic administration,
              community welfare, and continuous development of local infrastructure.
            </p>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">
              भिवंडी, ठाणे येथील ओवळी गावातील नागरिकांना पारदर्शक, तत्पर आणि दर्जेदार नागरी सेवा देण्यासाठी ग्राम पंचायत ओवळी
              कटिबद्ध आहे. ग्रामस्थांच्या सहभागातून गावाचा सर्वांगीण विकास साधणे हे आमचे ध्येय आहे.
            </p>
          </div>
          <img
            src={office}
            loading="lazy"
            width={1408}
            height={912}
            className="aspect-[4/3] w-full rounded-md object-cover shadow-sm"
            alt="Gram Panchayat Ovali local office"
          />
        </div>

        {/* Vision & Mission */}
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-7 shadow-sm">
            <Eye className="mb-5 size-8 text-green" />
            <h2 className="text-xl font-bold text-primary">
              Our Vision <span className="block text-sm font-medium text-green">आमची दृष्टी</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              To build a self-reliant, clean, and digitally empowered village through transparent administration, citizen
              participation, and sustainable community services.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-7 shadow-sm">
            <Target className="mb-5 size-8 text-green" />
            <h2 className="text-xl font-bold text-primary">
              Our Mission <span className="block text-sm font-medium text-green">आमचे ध्येय</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              To deliver prompt citizen services, maintain public sanitation, provide robust basic amenities, and ensure every
              resident can access government welfare schemes without difficulty.
            </p>
          </div>
        </div>

        {/* Key Administration & Location Facts */}
        <div className="mt-16">
          <SectionTitle title="Panchayat & Administrative Overview" marathi="पंचायत व प्रशासकीय माहिती" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keyFacts.map(i => (
              <div key={i.label} className="flex items-start gap-4 rounded-md border border-border bg-card p-5 shadow-sm">
                <span className="grid size-10 shrink-0 place-items-center rounded bg-secondary text-green">
                  <i.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{i.label}</p>
                  <p className="mt-1 font-semibold text-foreground text-sm">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panchayat Office Bearers */}
        <div className="mt-16">
          <SectionTitle
            title="Panchayat Office Bearers"
            marathi="पंचायत पदाधिकारी"
            intro="Official elected and administrative representatives. Official records will be updated upon notification."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {officials.map(o => (
              <div key={o.title} className="rounded-md border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-green">{o.title}</p>
                <p className="mt-2 text-base font-bold text-primary">{o.name}</p>
                {o.name === TO_BE_UPDATED_EN && (
                  <p className="mt-1 text-xs text-muted-foreground">{TO_BE_UPDATED_MR}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Explicitly labeled Census 2011 Demographic Information */}
        <div className="mt-16 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase text-primary">
                <Users className="size-3.5" /> Census 2011 Official Data
              </span>
              <h2 className="mt-2 text-2xl font-bold text-primary">Ovali Village Demographics</h2>
              <p className="text-xs text-muted-foreground">
                Official figures recorded in Government of India Census 2011 (Village Code: {villageFacts.code})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-muted-foreground">Data Source:</span>
              <p className="text-xs font-medium text-foreground">Census of India 2011 Records</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md bg-secondary/70 p-4">
              <p className="text-xs text-muted-foreground">Total Population (Census 2011)</p>
              <p className="mt-1 text-2xl font-bold text-primary">{villageFacts.census.population}</p>
              <p className="text-xs text-muted-foreground">
                Males: {villageFacts.census.males} · Females: {villageFacts.census.females}
              </p>
            </div>
            <div className="rounded-md bg-secondary/70 p-4">
              <p className="text-xs text-muted-foreground">Number of Households</p>
              <p className="mt-1 text-2xl font-bold text-primary">{villageFacts.census.households}</p>
              <p className="text-xs text-muted-foreground">Occupied residential houses</p>
            </div>
            <div className="rounded-md bg-secondary/70 p-4">
              <p className="text-xs text-muted-foreground">Sex Ratio</p>
              <p className="mt-1 text-2xl font-bold text-primary">849</p>
              <p className="text-xs text-muted-foreground">Females per 1,000 males</p>
            </div>
            <div className="rounded-md bg-secondary/70 p-4">
              <p className="text-xs text-muted-foreground">Literacy Rate</p>
              <p className="mt-1 text-2xl font-bold text-primary">{villageFacts.census.literacy}</p>
              <p className="text-xs text-muted-foreground">
                Male: {villageFacts.census.maleLiteracy} · Female: {villageFacts.census.femaleLiteracy}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs italic text-muted-foreground">
            * Note: These demographic statistics are strictly from Census 2011 and do not represent current population estimates.
          </p>
        </div>

        {/* Village Amenities & Connectivity */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Facilities */}
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary">Village Facilities & Amenities</h3>
            <p className="mt-0.5 text-xs text-green">गावातील उपलब्ध सोयी-सुविधा</p>
            <div className="mt-5 space-y-3">
              {villageFacilities.map(f => (
                <div key={f.name} className="flex items-center justify-between border-b border-border/60 pb-2 text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <CheckCircle2 className="size-4 text-green" /> {f.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{f.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connectivity */}
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary">Connectivity & Transportation</h3>
            <p className="mt-0.5 text-xs text-green">दळणवळण व संपर्क</p>
            <div className="mt-5 space-y-3">
              {connectivity.map(c => (
                <div key={c} className="flex items-center gap-3 border-b border-border/60 pb-2 text-sm text-foreground">
                  <Navigation className="size-4 text-green shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
              <div className="pt-2 text-xs leading-5 text-muted-foreground">
                <p>• Nearest Major Town: {villageFacts.nearestTown}</p>
                <p>• District Headquarters: {villageFacts.districtDistance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Villages */}
        <div className="mt-16 rounded-md border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary">Nearby Villages & Surrounding Areas</h3>
          <p className="mt-0.5 text-xs text-green">ओवळी परिसरातील नजीकची गावे</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {nearbyVillages.map(v => (
              <span
                key={v}
                className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
