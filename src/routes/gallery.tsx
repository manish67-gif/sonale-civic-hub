import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, SectionTitle, EmptyState, routeHead } from '@/components/site';
import { gallery as initialGallery, type GalleryItem } from '@/lib/site-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const Route = createFileRoute('/gallery')({
  head: () =>
    routeHead(
      'Photo Gallery',
      'Explore photographs of village life, community events, and public infrastructure at Gram Panchayat Ovali.'
    ),
  component: Gallery,
});

function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[]>(initialGallery);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);

    supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data && data.length > 0) {
          const mapped: GalleryItem[] = data.map(d => ({
            id: d.id,
            title: d.title_en,
            mr: d.title_mr,
            category: d.category,
            description: d.description_en || undefined,
            image: d.image_url,
          }));
          setItems(mapped);
        }
      });
  }, []);

  const validImages = items.filter(g => Boolean(g.image));

  useEffect(() => {
    if (selected === null) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'ArrowRight') setSelected(v => (v === null ? null : (v + 1) % validImages.length));
      if (e.key === 'ArrowLeft')
        setSelected(v => (v === null ? null : (v - 1 + validImages.length) % validImages.length));
    };
    window.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handle);
      document.body.style.overflow = '';
    };
  }, [selected, validImages.length]);

  const selectedImage = selected === null ? undefined : validImages[selected];

  return (
    <>
      <PageHeader title="Photo Gallery" marathi="फोटो गॅलरी" breadcrumb="Gallery" />

      <div className="site-container py-14">
        <SectionTitle
          title="Village Life & Infrastructure"
          marathi="गावाचे जीवन व विकास कार्य"
          intro="Photographs of Gram Panchayat Ovali village, community initiatives, and public amenities."
        />

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading gallery photos...</div>
        ) : validImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {validImages.map((g, index) => (
              <Button
                key={g.id}
                variant="ghost"
                onClick={() => setSelected(index)}
                className="group h-auto flex-col items-stretch overflow-hidden rounded-md border border-border bg-card p-0 text-left shadow-sm hover:bg-card hover:shadow-md"
                aria-label={`Open image: ${g.title}`}
              >
                <img
                  src={g.image}
                  loading="lazy"
                  width={1104}
                  height={800}
                  alt={g.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="block p-3 sm:p-4">
                  <span className="block text-xs font-medium text-green">{g.category}</span>
                  <span className="mt-1 block text-sm font-semibold text-foreground">{g.title}</span>
                  <span className="block text-xs text-muted-foreground">{g.mr}</span>
                </span>
              </Button>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Photographs will be added when authentic Ovali images are available"
            titleMr="अधिकृत छायाचित्रे उपलब्ध झाल्यावर येथे जोडली जातील"
            description="Verified village and panchayat photos can be uploaded via the admin portal or will appear here as they become available."
            descriptionMr="माहिती लवकरच अद्ययावत केली जाईल."
          />
        )}
      </div>

      {selected !== null && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-footer/95 p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between text-footer-foreground">
              <span className="inline-flex items-center gap-2 text-sm">
                <Images className="size-4" />
                {selected + 1} / {validImages.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelected(null)}
                aria-label="Close gallery"
                className="text-footer-foreground hover:text-primary"
              >
                <X />
              </Button>
            </div>
            <img
              src={selectedImage.image}
              width={1104}
              height={800}
              alt={selectedImage.title}
              className="max-h-[70vh] w-full rounded object-contain"
            />
            <div className="mt-4 flex items-center justify-between text-footer-foreground">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelected((selected - 1 + validImages.length) % validImages.length)}
                aria-label="Previous image"
              >
                <ChevronLeft />
              </Button>
              <div className="text-center">
                <p className="font-semibold">{selectedImage.title}</p>
                <p className="text-sm text-footer-muted">{selectedImage.mr}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelected((selected + 1) % validImages.length)}
                aria-label="Next image"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
