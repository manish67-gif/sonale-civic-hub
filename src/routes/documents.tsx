import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { FileText, Download, Calendar, Search, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, SectionTitle, EmptyState, routeHead } from '@/components/site';
import { documents as initialDocs, type OfficialDocumentItem } from '@/lib/site-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const Route = createFileRoute('/documents')({
  head: () =>
    routeHead(
      'Documents & Circulars',
      'Official public records, resolutions, citizen forms, and circulars of Gram Panchayat Ovali, Bhiwandi, Thane.'
    ),
  component: Documents,
});

const docCategories = [
  'All',
  'Gram Sabha',
  'Budget & Finance',
  'Citizen Services',
  'Forms',
  'Tenders',
  'Government Schemes',
] as const;

function Documents() {
  const [filter, setFilter] = useState<(typeof docCategories)[number]>('All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<OfficialDocumentItem[]>(initialDocs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);

    supabase
      .from('documents')
      .select('*')
      .eq('is_active', true)
      .order('issue_date', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data && data.length > 0) {
          const mapped: OfficialDocumentItem[] = data.map(d => ({
            id: d.id,
            title: d.title_en,
            titleMarathi: d.title_mr,
            category: d.category,
            documentNumber: d.document_number || undefined,
            issueDate: d.issue_date,
            fileUrl: d.file_url,
            fileSizeBytes: d.file_size_bytes || undefined,
            fileExtension: d.file_extension,
          }));
          setItems(mapped);
        }
      });
  }, []);

  const filtered = items.filter(d => {
    const matchesCategory = filter === 'All' || d.category === filter;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.titleMarathi.toLowerCase().includes(search.toLowerCase()) ||
      (d.documentNumber && d.documentNumber.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHeader title="Documents & Circulars" marathi="कागदपत्रे" breadcrumb="Documents" />

      <div className="site-container py-14">
        <SectionTitle
          title="Official Records & Public Forms"
          marathi="अधिकृत कागदपत्रे व शासन निर्णय"
          intro="Download Gram Sabha resolutions, citizen application forms, circulars, and welfare scheme guidelines for Ovali village."
        />

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter documents by category">
            {docCategories.map(c => (
              <Button
                key={c}
                size="sm"
                variant={filter === c ? 'default' : 'outline'}
                onClick={() => setFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <input
              type="text"
              className="form-control pl-9 text-sm"
              placeholder="Search documents / शोधा..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading documents...</div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(doc => (
              <article
                key={doc.id}
                className="flex flex-col justify-between rounded-md border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="rounded bg-secondary px-2.5 py-1 font-semibold text-green">
                      {doc.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Calendar className="size-3.5" />
                      {doc.issueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{doc.title}</h3>
                  <p className="mt-1 text-sm font-medium text-green">{doc.titleMarathi}</p>

                  {doc.documentNumber && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Doc No: <span className="font-mono">{doc.documentNumber}</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">
                    Format: {doc.fileExtension ? doc.fileExtension.toUpperCase() : 'PDF'}
                    {doc.fileSizeBytes && ` (${Math.round(doc.fileSizeBytes / 1024)} KB)`}
                  </span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Download className="size-4" /> Download / डाउनलोड
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No official documents published at this time"
            titleMr="या वेळी कोणतीही अधिकृत कागदपत्रे उपलब्ध नाहीत"
            description="Official resolutions, public notices, and application forms will be available here when issued."
            descriptionMr="माहिती लवकरच अद्ययावत केली जाईल. अधिक माहितीसाठी कृपया ग्रामपंचायत कार्यालयाशी संपर्क साधा."
          />
        )}
      </div>
    </>
  );
}
