import { useState, type FormEvent, useEffect } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { LockKeyhole, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Brand, routeHead } from '@/components/site';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAdminAuth } from '@/lib/auth-context';

export const Route = createFileRoute('/admin/login')({
  head: () =>
    routeHead(
      'Admin Login',
      'Administrative sign-in for Gram Panchayat Ovali authorized personnel only.'
    ),
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'info' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: '/admin/dashboard' });
    }
  }, [user, isLoading, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    const valid = z
      .object({
        email: z.string().trim().email('Please enter a valid official email.'),
        password: z.string().min(6, 'Password must be at least 6 characters.'),
      })
      .safeParse({ email, password });

    if (!valid.success) {
      setMessage({ text: valid.error.issues[0]?.message ?? 'Invalid credentials.', type: 'error' });
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setMessage({
        text: 'Supabase credentials are not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable live authentication.',
        type: 'info',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
        setLoading(false);
        return;
      }

      if (data.session) {
        setMessage({ text: 'Sign in successful! Redirecting...', type: 'success' });
        navigate({ to: '/admin/dashboard' });
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      setMessage({ text: errMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="site-container flex min-h-[65vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-md border border-border bg-card p-7 shadow-sm sm:p-9">
        <div className="mb-7 flex justify-center">
          <Brand />
        </div>
        <div className="mb-7 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-secondary text-green">
            <LockKeyhole className="size-5" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-primary">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">प्रशासकीय प्रवेश · Gram Panchayat Ovali</p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="form-label">
              Official Email / ईमेल
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                className="form-control pl-10"
                value={email}
                onChange={e => setEmail(e.target.value)}
                maxLength={255}
                placeholder="admin@ovali-panchayat.in"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="form-label">
              Password / संकेतशब्द
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                className="form-control pl-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {message && (
            <div
              role="alert"
              className={`flex items-start gap-2 rounded p-3 text-xs leading-5 ${
                message.type === 'error'
                  ? 'border border-destructive/20 bg-destructive/10 text-destructive'
                  : message.type === 'success'
                  ? 'border border-green/20 bg-green/10 text-green'
                  : 'border border-border bg-secondary text-primary'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <Button className="w-full" size="lg" disabled={loading} type="submit">
            {loading ? 'Authenticating…' : 'Sign In / प्रवेश करा'}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Authorized personnel only. Public registration is strictly disabled.
        </p>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to Home / मुख्यपृष्ठावर परत जा
        </Link>
      </div>
    </div>
  );
}
