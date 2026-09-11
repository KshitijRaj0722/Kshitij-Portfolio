# Kshitij Raj — Portfolio

Personal portfolio site for **Kshitij Raj**, Java Full Stack Developer.
Built with plain **HTML + CSS + vanilla JavaScript** — no build step, no framework, no dependencies.

## Run it locally

```bash
node ".claude/serve.js"
```

Then open <http://localhost:4173>. (Opening `index.html` directly works too, but a
server is closer to how it'll actually be hosted.)

## Structure

```
index.html                     Single page — all sections
css/style.css                  Design tokens, layout, dark/light themes, responsive
js/main.js                     Theme toggle, nav, scroll reveal, typing, counters,
                               screenshot gallery, contact form
assets/
  img/profile.webp             Hero portrait          ✅
  projects/*.webp              9 project screenshots  ✅
  certificates/guvi-fullstack.png
  resume/Kshitij_Raj_Resume.pdf
.claude/                       Local tooling only — never deployed
  serve.js                     Zero-dependency static server
  build-preview.js             Bundles everything into one shareable HTML file
```

## Features

- Dark / light theme with `localStorage` persistence + system-preference default
- Sticky nav with blur, scroll progress bar and active-section highlighting
- Mobile hamburger menu
- Typing effect on the hero role line
- `IntersectionObserver` scroll reveals and animated stat counters
- Contact form: posts to Formspree when configured, falls back to a `mailto:` draft
- SEO meta tags, Open Graph, JSON-LD `Person` schema
- Respects `prefers-reduced-motion`; has a print stylesheet

---

## ⚠️ TODO — placeholders to replace

Open the site, press **F12** → Console, and type:

```
todo()
```

Every element still needing a real value gets an orange **TODO** badge. Run it again to hide them.

### 1. Profile photo — ✅ done
Done — `assets/img/profile.webp` (760×912, WebP). To swap it, drop in a new file and
update the `<img>` in `index.html`. The CSS crops to a 1 : 1.12 portrait, anchored near the top.

### 2. GitHub username — ✅ done
All references point at [`KshitijRaj0722`](https://github.com/KshitijRaj0722).

### 3. Project links — ✅ done
All six verified returning 200:

| Project | Live | Source |
|---|---|---|
| E-Commerce Platform | `e-commerce-website-sable-pi.vercel.app` | `E-Commerce-website` |
| EventHub | `event-management-system-1qiv.vercel.app` | `EventManagementSystem` |
| CareerNest | `careernest-rho.vercel.app` | `careernest` |

### 4. Project screenshots — ✅ done
All nine are in place: `shop-1..3.webp`, `events-1..3.webp`, `career-1..3.webp`.
Each project shows one main shot plus a thumbnail strip that swaps it on click.

To add or replace one: drop the file in `assets/projects/`, then update the matching
`<button class="shot-thumb" data-src="…" data-alt="…">` and its `<img>` in `index.html`.
Keep images ~1400px wide and WebP-encoded — see `.claude/build-preview.js` for how the
originals were resized (browser canvas, since this machine has no ImageMagick/sharp).

### 5. Certification details — ✅ done

| Certificate | Issued | Verification |
|---|---|---|
| Java Full-Stack Development (GUVI) | 2025 | Hosted image — ID `E7MWjcBFVa9earyx` |
| Cybersecurity Essentials (Cisco) | Jan 2022 | Public Credly badge |
| Prompt Engineering for Everyone (Cognitive Class / IBM) | Nov 2024 | Public certificate page — `AI0117EN` |

Only the GUVI one is a self-hosted image rather than third-party verification.
If GUVI issues a verification URL, swap the `href` on that card to use it.

### 6. DSA profile
In the **Certifications → achievements** block, replace the placeholder text with
a link to your LeetCode / HackerRank / GeeksforGeeks profile.
Delete the whole `.achieve__item` if you'd rather not show it.

### 7. Contact form (optional but recommended)
1. Sign up free at [formspree.io](https://formspree.io) and create a form.
2. Replace `YOUR_FORM_ID` in the `<form action="…">` attribute in `index.html`.

Until then the form gracefully opens the visitor's mail client instead — nothing breaks.

### 8. Blog posts
The three blog cards are drafts. Once an article is published, swap
`Draft — coming soon` for a date and wrap the card in an `<a href="…">`.
If you don't plan to write them, delete the whole `<section id="blog">`
and its two nav links.

### 9. Canonical URL
Once deployed, update `https://kshitijraj0722.github.io/` in the `<link rel="canonical">`,
the `og:url` meta tag and the JSON-LD block.

---

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/KshitijRaj0722/Kshitij-Portfolio.git
git push -u origin main
```

Then: **repo → Settings → Pages → Source: `main` / root**.
Live at `https://kshitijraj0722.github.io/Kshitij-Portfolio/` in about a minute.

> Naming the repo `<username>.github.io` gives you the clean root URL.
> Any other repo name works too — it just serves from `/<repo-name>/`.

### Or Vercel / Netlify
Import the repo, leave the build command empty, set the output directory to `/`.
