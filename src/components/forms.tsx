import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.');

const email = z.union([
  z.literal(''),
  z.string().trim().email('Enter a valid email address.').max(255),
]);

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(100),
  mobile: phone,
  email,
  subject: z.string().trim().min(3, 'Enter a subject.').max(150),
  message: z.string().trim().min(10, 'Enter at least 10 characters.').max(1000),
});

const feedbackSchema = z
  .object({
    name: z.string().trim().max(100),
    mobile: z.string().trim(),
    email,
    ward: z.string().trim().max(80),
    category: z.string().min(1, 'Choose a category.'),
    subject: z.string().trim().min(3, 'Enter a subject.').max(150),
    message: z.string().trim().min(10, 'Enter at least 10 characters.').max(1000),
    anonymous: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymous) {
      if (data.name.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['name'],
          message: 'Enter your full name.',
        });
      }

      if (!phone.safeParse(data.mobile).success) {
        ctx.addIssue({
          code: 'custom',
          path: ['mobile'],
          message: 'Enter a valid 10-digit Indian mobile number.',
        });
      }
    }
  });

type Errors = Record<string, string>;

function getSubmissionErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '42501'
  ) {
    return 'This form is available to public visitors who are not signed in. / लॉगिन केलेल्या वापरकर्त्यांसाठी हा फॉर्म उपलब्ध नाही.';
  }

  return 'Your submission could not be saved. Please try again later. / आपला संदेश जतन करता आला नाही. कृपया पुन्हा प्रयत्न करा.';
}

function getErrors(error: z.ZodError): Errors {
  return Object.fromEntries(
    error.issues.map(issue => [String(issue.path[0]), issue.message]),
  );
}

function Field({
  label,
  labelMr,
  name,
  required,
  error,
  children,
}: {
  label: string;
  labelMr?: string;
  name: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="form-label" htmlFor={name}>
        {label}
        {labelMr && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            ({labelMr})
          </span>
        )}
        {required && <span className="text-destructive"> *</span>}
      </label>

      {children}

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function Input({
  name,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  error?: string | undefined;
}) {
  return (
    <input
      id={name}
      name={name}
      className="form-control"
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
  );
}

function Result({
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
    <div
      role="status"
      className="rounded-md border border-green/30 bg-secondary p-7 text-center"
    >
      <CheckCircle2 className="mx-auto mb-3 size-9 text-green" />

      <h3 className="text-lg font-bold text-primary">{title}</h3>

      {titleMr && (
        <p className="mt-1 text-sm font-medium text-green">{titleMr}</p>
      )}

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {descriptionMr && (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {descriptionMr}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const [isDemoSubmission, setIsDemoSubmission] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setValues(v => ({
      ...v,
      [e.target.name]: e.target.value,
    }));

    setErrors(v => ({
      ...v,
      [e.target.name]: '',
    }));

    setSubmitError('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();

    const result = contactSchema.safeParse(values);

    if (!result.success) {
      setErrors(getErrors(result.error));
      setSubmitError('');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setSubmitError('');

    /*
     * Real Supabase submission.
     *
     * If Supabase is configured, the form must successfully
     * insert into the database. If RLS rejects the request,
     * we show an error instead of falsely showing Demo Mode.
     */
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: dbError } = await supabase
          .from('contact_submissions')
          .insert([
            {
              full_name: values.name,
              mobile: values.mobile,
              email: values.email || null,
              subject: values.subject,
              message: values.message,
            },
          ]);

        if (dbError) {
          throw dbError;
        }

        setIsDemoSubmission(false);
        setSubmitError('');
        setStatus('success');
        return;
      } catch (err) {
        console.error('Supabase contact submission failed:', err);

        setIsDemoSubmission(false);
        setSubmitError(getSubmissionErrorMessage(err));
        setStatus('error');

        return;
      }
    }

    /*
     * Demo mode is used ONLY when Supabase is not configured.
     */
    setIsDemoSubmission(true);
    setStatus('success');
  }

  if (status === 'success') {
    return isDemoSubmission ? (
      <Result
        title="Contact Form Checked (Demo Mode)"
        titleMr="संदेश नोंदवला (डेमो मोड)"
        description="This is a demonstration submission because Supabase backend credentials are not yet configured. When connected, your message will be saved to the Gram Panchayat inbox."
        descriptionMr="बॅकएंड जोडणी उपलब्ध झाल्यावर हा संदेश थेट ग्रामपंचायत कार्यालयाकडे नोंदवला जाईल."
      />
    ) : (
      <Result
        title="Message Submitted Successfully"
        titleMr="आपला संदेश यशस्वीरित्या प्राप्त झाला"
        description="Thank you for reaching out. Your message has been received by Gram Panchayat Ovali."
        descriptionMr="ग्राम पंचायत ओवळीशी संपर्क साधल्याबद्दल धन्यवाद. आपला संदेश प्राप्त झाला आहे."
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full Name"
          labelMr="पूर्ण नाव"
          name="name"
          required
          error={errors['name']}
        >
          <Input
            name="name"
            value={values.name}
            onChange={update}
            maxLength={100}
            autoComplete="name"
            placeholder="e.g. Ramesh Patil"
            error={errors['name']}
          />
        </Field>

        <Field
          label="Mobile Number"
          labelMr="मोबाईल क्रमांक"
          name="mobile"
          required
          error={errors['mobile']}
        >
          <Input
            name="mobile"
            type="tel"
            inputMode="tel"
            value={values.mobile}
            onChange={update}
            maxLength={10}
            autoComplete="tel"
            placeholder="10-digit mobile number"
            error={errors['mobile']}
          />
        </Field>
      </div>

      <Field
        label="Email Address"
        labelMr="ईमेल"
        name="email"
        error={errors['email']}
      >
        <Input
          name="email"
          type="email"
          value={values.email}
          onChange={update}
          maxLength={255}
          autoComplete="email"
          placeholder="your.email@example.com (optional)"
          error={errors['email']}
        />
      </Field>

      <Field
        label="Subject"
        labelMr="विषय"
        name="subject"
        required
        error={errors['subject']}
      >
        <Input
          name="subject"
          value={values.subject}
          onChange={update}
          maxLength={150}
          placeholder="Brief topic of your inquiry"
          error={errors['subject']}
        />
      </Field>

      <Field
        label="Message"
        labelMr="संदेश"
        name="message"
        required
        error={errors['message']}
      >
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={update}
          maxLength={1000}
          rows={5}
          className="form-control"
          placeholder="Type your message here..."
          aria-invalid={!!errors['message']}
          aria-describedby={errors['message'] ? 'message-error' : undefined}
        />
      </Field>

      {status === 'error' && (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-destructive"
        >
          <AlertCircle className="size-4" />
          {submitError ||
            'Please correct the highlighted fields. / कृपया आवश्यक माहिती तपासा.'}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'loading'}>
        <Send className="mr-2 size-4" />
        {status === 'loading'
          ? 'Submitting…'
          : 'Send Message / संदेश पाठवा'}
      </Button>
    </form>
  );
}

const categories = [
  'Water Supply',
  'Cleanliness',
  'Roads & Streetlights',
  'Health & Sanitation',
  'Panchayat Services',
  'Suggestion',
  'Complaint',
  'Other',
];

export function FeedbackForm() {
  const [values, setValues] = useState({
    name: '',
    mobile: '',
    email: '',
    ward: '',
    category: '',
    subject: '',
    message: '',
    anonymous: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [rating, setRating] = useState(0);

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const [isDemoSubmission, setIsDemoSubmission] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function update(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setValues(v => ({
      ...v,
      [e.target.name]: e.target.value,
    }));

    setErrors(v => ({
      ...v,
      [e.target.name]: '',
    }));

    setSubmitError('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();

    const result = feedbackSchema.safeParse(values);

    if (!result.success) {
      setErrors(getErrors(result.error));
      setSubmitError('');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setSubmitError('');

    /*
     * Real Supabase submission.
     *
     * If Supabase is configured, the form must successfully
     * insert into the database. If RLS rejects the request,
     * we show an error instead of falsely showing Demo Mode.
     */
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: dbError } = await supabase
          .from('feedback_submissions')
          .insert([
            {
              full_name: values.anonymous ? null : values.name,
              mobile: values.anonymous ? null : values.mobile,
              email: values.anonymous ? null : values.email || null,
              ward: values.ward || null,
              category: values.category,
              subject: values.subject,
              message: values.message,
              rating: rating > 0 ? rating : null,
              is_anonymous: values.anonymous,
            },
          ]);

        if (dbError) {
          throw dbError;
        }

        setIsDemoSubmission(false);
        setSubmitError('');
        setStatus('success');
        return;
      } catch (err) {
        console.error('Supabase feedback submission failed:', err);

        setIsDemoSubmission(false);
        setSubmitError(getSubmissionErrorMessage(err));
        setStatus('error');

        return;
      }
    }

    /*
     * Demo mode is used ONLY when Supabase is not configured.
     */
    setIsDemoSubmission(true);
    setStatus('success');
  }

  if (status === 'success') {
    return isDemoSubmission ? (
      <Result
        title="Feedback Form Checked (Demo Mode)"
        titleMr="अभिप्राय नोंदवला (डेमो मोड)"
        description="This is a demonstration submission because Supabase backend credentials are not yet configured. When connected, feedback will be saved to the database."
        descriptionMr="बॅकएंड जोडणी उपलब्ध झाल्यावर हा अभिप्राय थेट डेटाबेसमध्ये नोंदवला जाईल."
      />
    ) : (
      <Result
        title="Feedback Submitted Successfully"
        titleMr="आपला अभिप्राय यशस्वीरित्या नोंदवला गेला"
        description="Thank you for your valuable feedback. It helps us improve Gram Panchayat Ovali services."
        descriptionMr="आपल्या बहुमोल अभिप्रायाबद्दल धन्यवाद. यामुळे ग्राम पंचायत ओवळीच्या सेवांमध्ये सुधारणा करण्यास मदत होईल."
      />
    );
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full Name"
          labelMr="पूर्ण नाव"
          name="name"
          required={!values.anonymous}
          error={errors['name']}
        >
          <Input
            name="name"
            value={values.name}
            onChange={update}
            maxLength={100}
            autoComplete="name"
            disabled={values.anonymous}
            placeholder={
              values.anonymous
                ? 'Not required for anonymous feedback'
                : 'Your full name'
            }
            error={errors['name']}
          />
        </Field>

        <Field
          label="Mobile Number"
          labelMr="मोबाईल क्रमांक"
          name="mobile"
          required={!values.anonymous}
          error={errors['mobile']}
        >
          <Input
            name="mobile"
            type="tel"
            inputMode="tel"
            value={values.mobile}
            onChange={update}
            maxLength={10}
            disabled={values.anonymous}
            placeholder={
              values.anonymous ? 'Not required' : '10-digit mobile number'
            }
            error={errors['mobile']}
          />
        </Field>

        <Field
          label="Email (Optional)"
          labelMr="ईमेल"
          name="email"
          error={errors['email']}
        >
          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={update}
            maxLength={255}
            disabled={values.anonymous}
            placeholder="your.email@example.com"
            error={errors['email']}
          />
        </Field>

        <Field
          label="Ward / Area (Optional)"
          labelMr="वार्ड / परिसर"
          name="ward"
          error={errors['ward']}
        >
          <Input
            name="ward"
            value={values.ward}
            onChange={update}
            maxLength={80}
            placeholder="e.g. Ward No. 1 / परिसर"
            error={errors['ward']}
          />
        </Field>
      </div>

      <Field
        label="Category"
        labelMr="वर्गवारी"
        name="category"
        required
        error={errors['category']}
      >
        <select
          className="form-control"
          id="category"
          name="category"
          value={values.category}
          onChange={update}
          aria-invalid={!!errors['category']}
          aria-describedby={
            errors['category'] ? 'category-error' : undefined
          }
        >
          <option value="">Select a category / वर्गवारी निवडा</option>

          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Subject"
        labelMr="विषय"
        name="subject"
        required
        error={errors['subject']}
      >
        <Input
          name="subject"
          value={values.subject}
          onChange={update}
          maxLength={150}
          placeholder="Briefly describe your feedback"
          error={errors['subject']}
        />
      </Field>

      <Field
        label="Message / Details"
        labelMr="सविस्तर अभिप्राय"
        name="message"
        required
        error={errors['message']}
      >
        <textarea
          id="message"
          name="message"
          className="form-control"
          rows={5}
          maxLength={1000}
          value={values.message}
          onChange={update}
          placeholder="Share your suggestions, questions, or concerns in detail..."
          aria-invalid={!!errors['message']}
          aria-describedby={errors['message'] ? 'message-error' : undefined}
        />

        <p className="mt-1 text-right text-xs text-muted-foreground">
          {values.message.length} / 1000 characters
        </p>
      </Field>

      <fieldset>
        <legend className="form-label">
          Service Rating (Optional){' '}
          <span className="text-xs font-normal text-muted-foreground">
            / सेवा मूल्यांकन
          </span>
        </legend>

        <div
          className="flex gap-1"
          role="group"
          aria-label="Rate our service"
        >
          {[1, 2, 3, 4, 5].map(n => (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              key={n}
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              aria-pressed={rating === n}
              className={
                n <= rating ? 'text-rating' : 'text-muted-foreground'
              }
            >
              <Star
                className={`size-6 ${n <= rating ? 'fill-current' : ''}`}
              />
            </Button>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          checked={values.anonymous}
          onChange={e => {
            setValues(v => ({
              ...v,
              anonymous: e.target.checked,
              name: e.target.checked ? '' : v.name,
              mobile: e.target.checked ? '' : v.mobile,
            }));

            setErrors(v => ({
              ...v,
              name: '',
              mobile: '',
            }));

            setSubmitError('');
          }}
          className="size-4 accent-primary"
        />

        Submit Anonymously{' '}
        <span className="text-muted-foreground">
          / निनावी अभिप्राय
        </span>
      </label>

      {status === 'error' && (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-destructive"
        >
          <AlertCircle className="size-4" />
          {submitError ||
            'Please correct the highlighted fields. / कृपया आवश्यक माहिती तपासा.'}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'loading'}>
        <Send className="mr-2 size-4" />

        {status === 'loading'
          ? 'Submitting…'
          : 'Submit Feedback / अभिप्राय नोंदवा'}
      </Button>
    </form>
  );
}