<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all application surfaces controlled by semantic CSS tokens and the shared appearance provider so theme, typography, and density remain user-switchable.
- Build as a TanStack Start SPA shell under the repository base path and deploy `dist/client` so GitHub Pages can host every client route.
