# Transform the existing site for Ovali

## Scope
- Keep the current civic design, shared navigation, page structure, responsive behavior, gallery viewer, forms, and admin-login demonstration.
- Replace Sonale identity, contact details, sample notices, photos, and SEO text throughout the public site with Ovali-specific information.
- Use only facts in the supplied brief and its cited references; label Census figures by year and mark unverified contact/representative details as not yet available.
- Make the About page the detailed village-information section while keeping the existing navigation structure.

## Implementation
- Update the editable civic content in `src/lib/site-data.ts` and shared branding/footer/meta in `src/components/site.tsx`.
- Update homepage, About, Gallery, Announcements, Contact, Feedback, Admin Login, root title, and the civic CSS comment as needed.
- Replace notices with an honest empty state and gallery images with Ovali-labeled placeholders; no fabricated Ovali photos or map pins.
- Add verified village overview, Census 2011 statistics, Panchayati Raj levels, location/connectivity, facilities, and nearby villages to About.

## Verification
- Search the whole project for Sonale-specific names, phone/email, stale notices, and metadata.
- Check preview diagnostics and verify all existing routes, key interactions, and small-screen layout.
- Record any non-working backend-dependent admin management as a clear limitation; preserve the current demo login without claiming it is real authentication.
