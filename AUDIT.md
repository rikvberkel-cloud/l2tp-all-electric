# Website-audit — late2theparty.nl (all-electric)

Datum: 30 augustus 2026. Bron: live site (`main` → GitHub Pages `docs/`), plus `AGENTS.md`, `.cursor/rules/all-electric.mdc`, Notion SSOT *Mijn DJ-website + documentatie*, roadmap `db} DJ — L2TP roadmap`.

Scope: bugs, kwetsbaarheden, overbodige code. Geen redesign.

---

## Instructies gevolgd

| Bron | Status |
|------|--------|
| `.cursor/rules/all-electric.mdc` / `AGENTS.md` | Gelezen; werk alleen in `docs/` |
| Notion SSOT | Gelezen; stack, MailerLite `aK1pC9`, valkuilen bevestigd |
| Live Pages | Branch `main`, pad `/docs`, HTTPS enforced, CNAME `www.late2theparty.nl` |

---

## Samenvatting

Geen kritieke beveiligingslekken in deze statische site. Wel een **operationeel risico** (verkeerde default branch), een paar **kleine bugs**, en **dode CSS/JS** uit eerdere iteraties. Review A (augustus 2026) is grotendeels doorgevoerd; dit is een verse controle op de huidige `main`.

---

## 1. Bugs

| # | Ernst | Bevinding | Status |
|---|-------|-----------|--------|
| B1 | Hoog (ops) | Default GitHub-branch is nog `claude/dj-r010-website-qzLwf` met oude KO.OS.-content in root + `docs/`. Uploads via github.com landen daar. Pages serveert wél `main`/`docs/`. | Actie nodig in repo-instellingen (geen codefix) |
| B2 | Laag | `main.js` parallax: `rect` wordt berekend maar nooit gebruikt | Opgeruimd in deze PR |
| B3 | Laag | Agenda “Boek me” gebruikt inline `onclick=` | Verplaatst naar `main.js` |
| B4 | Laag | `id="photo-about"` nergens in JS/CSS gebruikt | Verwijderd |
| B5 | Laag | Cursorgloed/parallax/smooth-scroll negeerden `prefers-reduced-motion` deels | Aangevuld in CSS + JS |
| B5 | Info | FAQ noemt LinkedIn zonder link | Contentkeuze; niet gewijzigd |
| B6 | Info | Nieuwsbrieffilters lifestyle/mode tonen lege staat (geen edities met die tags) | Verwacht tot er content is |
| B7 | Info | Editie #01 gebruikt “DJ Rikkert010” | Bewust historisch per documentatie |

Alle pagina’s (`/`, `/nieuwsbrief/`, `/nieuwsbrief/01/`, `/privacy/`) en assets (`hero.jpg`, `collage.jpg`) geven HTTP 200. Oude paden als `/assets/hero.jpg` geven 404 (correct; die map bestaat niet meer).

---

## 2. Kwetsbaarheden / privacy

Statische site zonder backend, auth of database. Geen secrets in de code.

| # | Risico | Toelichting | Advies |
|---|--------|-------------|--------|
| S1 | AVG / third-party | Google Fonts laadt vanaf Google (IP van bezoeker) | Font zelf hosten (staat al op Notion-todo) |
| S2 | Supply chain | MailerLite `universal.js` zonder Subresource Integrity | Acceptabel voor embeds; SRI breekt vaak bij CDN-updates. Blijf bij account `2547241` / form `aK1pC9` |
| S3 | Third-party cookies | Spotify-embeds (na interactie op mobiel) en MailerLite-formulier | Al genoemd in privacyverklaring |
| S4 | Headers | Geen CSP / HSTS vanuit de site zelf; GitHub Pages + Enforce HTTPS staat aan | Voldoende voor deze stack; CSP via meta is optioneel en snel te streng met embeds |
| S5 | XSS | Inline `onerror` op één afbeelding; vaste strings, geen user input | Laag risico |
| S6 | Open redirects / injectie | Geen server-side rendering, geen query-parsing in eigen JS | Geen issue |
| S7 | Externe links | `rel="noopener"` aanwezig; `noreferrer` ontbreekt | Optioneel; `noopener` dekt tabnabbing |

MailerLite-popup `6erjz7` mag in het dashboard paused blijven (niet in code). DMARC niet verstrengen vóór MailerLite-domeinauthenticatie.

---

## 3. Overbodige code (deze PR)

Verwijderd of opgeschoond:

- CSS: `.genre-tags` / `.genre-tag` (niet meer in HTML; `.hero__band` blijft)
- CSS: `.hero__sub` (ongebruikt alias naast `.hero__kicker`)
- CSS: `.glow-pulse--green` + `@keyframes glowPulseGreen`
- CSS: ongebruikte `@keyframes flicker`
- JS: ongebruikte `rect` in parallax
- HTML: ongebruikte `id="photo-about"`; inline agenda-`onclick`

Niet aangeraakt (bewust of buiten scope):

- Root-duplicaten op de *default* branch (KO.OS.) → los door default branch naar `main` te zetten
- Historische copy in editie #01
- REVIEW.md backlog B/C (productkeuzes)

---

## 4. Wat al goed staat

- Semantische HTML, skip-link, `:focus-visible`, `prefers-reduced-motion`
- Agenda-tabs met pijltjes / Home / End
- OG + Twitter-cards + canonical + JSON-LD op home
- `robots.txt` + `sitemap.xml`
- Mailto met vooringevulde boekingsvelden
- Spotify lazy op mobiel (tap-to-load)
- MailerLite alleen als `.ml-embedded` aanwezig is
- HTTPS enforced, custom domain verified

---

## 5. Aanbevolen vervolgstappen (buiten deze PR)

1. **Default branch** op GitHub omzetten naar `main` (of de huidige Pages-bron). Voorkomt dat uploads de oude KO.OS.-site raken.
2. Google Fonts zelf hosten (AVG).
3. MailerLite-form `aK1pC9` NL + huisstijl; popup `6erjz7` pauzeren.
4. Roadmap Type Website: B1 sets, B2 boekingsflow, enz. (input nodig).
