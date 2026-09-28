<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting published git history — force pushing, or rebasing/amending/squashing commits that are already pushed — as it rewrites history on Lovable's side and the user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep editable civic content in `src/lib/site-data.ts`, separate from route presentation, so future data integration has one source of truth.
- Keep shared site chrome and page patterns in `src/components/site.tsx`, so all public pages stay visually and navigationally consistent.
- Treat contact, feedback, and admin screens as frontend demonstrations only until a secured backend is connected; never imply submission or login has reached the office.
