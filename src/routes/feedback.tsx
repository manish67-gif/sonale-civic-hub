import { createFileRoute } from '@tanstack/react-router';
import { MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { PageHeader, SectionTitle, routeHead } from '@/components/site';
import { FeedbackForm } from '@/components/forms';

export const Route = createFileRoute('/feedback')({
  head: () =>
    routeHead(
      'Feedback',
      'Share suggestions, complaints or questions for Gram Panchayat Ovali, Bhiwandi, Thane.'
    ),
  component: Feedback,
});

function Feedback() {
  return (
    <>
      <PageHeader title="Feedback" marathi="अभिप्राय" breadcrumb="Feedback" />

      <div className="site-container grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <div>
          <SectionTitle
            title="Your Feedback Matters"
            marathi="तुमचा अभिप्राय महत्त्वाचा आहे"
            intro="Your suggestions, queries, and complaints help us understand Ovali village priorities and continuously improve civic amenities and administration."
          />
          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            आपल्या मौल्यवान सूचना आणि अभिप्राय ग्रामपंचायत ओवळीच्या कामकाजात सुधारणा करण्यासाठी अत्यंत महत्त्वाचे आहेत.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-3 rounded-md border border-border bg-card p-5 shadow-sm">
              <MessageSquare className="size-5 shrink-0 text-green" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Share your voice / आपले मत नोंदवा</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Give input regarding water supply, village sanitation, streetlights, road maintenance, and local public services.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-md border border-border bg-card p-5 shadow-sm">
              <ShieldCheck className="size-5 shrink-0 text-green" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Anonymous option / निनावी पर्याय</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  You can submit your feedback anonymously without providing your name or mobile number.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-md border border-border bg-card p-5 shadow-sm">
              <HelpCircle className="size-5 shrink-0 text-green" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Civic Grievances / तक्रार निवारण</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Submissions are reviewed by Panchayat administrators to take necessary corrective measures.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
          <SectionTitle title="Submit Your Feedback" marathi="आपला अभिप्राय नोंदवा" />
          <FeedbackForm />
        </div>
      </div>
    </>
  );
}
