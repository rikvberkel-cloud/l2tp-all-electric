# Website review — late2theparty.nl (all-electric)

Registratie van verbeterpunten met oplossingsrichting. Opgesplitst in:

- **A. Direct doorvoerbaar** — laagrisico, jij zet er `ja`/`nee` achter en ik voer de `ja`'s uit.
- **B. Doorontwikkelpad** — grotere/langere-termijn stappen waar ik input van jou voor nodig heb.
- **C. Out-of-the-box ideeën** — losse suggesties om uit te kiezen.

Bekijk-datum: 30 augustus 2026. Beoordeeld: homepage, nieuwsbriefarchief, editie #01, privacypagina, `style.css`, `main.js`, `nieuwsbrief.js`.

---

## Algemene indruk

Sterke, eigenzinnige one-pager met een consistente neon/CRT-esthetiek en een scherpe, zelfspottende tone of voice. De techniek is netjes verzorgd: semantische HTML, `prefers-reduced-motion`, `:focus-visible`, lazy-loading van beeld, en een nette fallback voor de portretfoto. De grootste winst zit niet in "mooier maken" (het ziet er al af uit), maar in drie dingen:

1. **Opruimen/ontdubbelen** — er staat verouderde/dubbele code in de repo.
2. **Content die een boeker écht overtuigt** — nu hoor je geen echte DJ-set en is er geen press kit.
3. **Kleine UX-, a11y- en vindbaarheidswinst** — skip-link, share-tags, tab-toetsenbord.

---

## A. Direct doorvoerbaar (ja / nee)

> Zet achter elk punt `ja` of `nee`. Alle punten hieronder zijn nagekeken en laagrisico.

### A1. Ontdubbel de root-kopieën — [ ] ja / [ ] nee
**Wat:** `index.html`, `style.css` en `main.js` staan zowel in de repo-root als in `docs/`. GitHub Pages serveert `docs/` (de `CNAME` staat daar). De root-versies zijn **byte-identiek** aan die in `docs/`, maar missen `hero.jpg`, `collage.jpg`, `CNAME` en de subpagina's `nieuwsbrief/` en `privacy/`.
**Waarom:** Als de root ooit geserveerd wordt zijn de afbeeldingen en links stuk (404). Bovendien moet je ze nu handmatig in sync houden — dat ging al eens mis (commit *"Fix: docs/index.html stond nog niet gelijk aan index.html"*).
**Oplossingsrichting:** Verwijder de drie root-bestanden en werk alleen nog in `docs/` (één bron van waarheid). Alternatief als je root als bron wíl: een klein sync-/buildscript — maar ontdubbelen is simpeler en minder foutgevoelig.
**Risico:** Laag.

### A2. Verwijder dode CSS (~150 regels) — [ ] ja / [ ] nee
**Wat:** Een set classes wordt nergens in de HTML gebruikt (0 referenties, gecontroleerd): `gradient-text`, `text-cyan`, `text-red`, `newsletter__pitch`, `newsletter__what`, `newsletter__archive`, `archive-item`/`archive-list`, `rotterdam-sub`, `rotterdam-icons`, `nb-kicker`, `btn--green`, `neon-green-text`, `btn--copied`, `ml-embedded` en de regel `.genre-tag[href="#"]`.
**Waarom:** Kleinere, beter leesbare stylesheet; minder ruis bij toekomstige wijzigingen.
**Oplossingsrichting:** Weghalen uit `style.css`.
**Risico:** Laag (elk item is geverifieerd zonder referentie).

### A3. Consistente CTA-labels — [ ] ja / [ ] nee
**Wat:** De aanmeldknop heet op de hero "Ontvang de nieuwsbrief", maar in het promoblok en op de editiepagina "Aanmelden".
**Waarom:** Eén consistent label voelt strakker en professioneler.
**Oplossingsrichting:** Kies één variant (voorstel: "Ontvang de nieuwsbrief" op de opvallende plekken, "Aanmelden" mag blijven waar het compact moet).
**Risico:** Laag.

### A4. Social share-tags aanvullen — [ ] ja / [ ] nee
**Wat:** Er zijn alleen Open Graph-tags. Twitter/X-cards, `theme-color` en `apple-touch-icon` ontbreken.
**Waarom:** Nette linkpreviews op X/WhatsApp/iMessage en een gekleurde browserbalk op mobiel.
**Oplossingsrichting:** `twitter:card=summary_large_image` + `twitter:title/description/image`, plus `<meta name="theme-color">`. Op alle pagina's.
**Risico:** Laag.

### A5. Skip-link voor toetsenbord/schermlezers — [ ] ja / [ ] nee
**Wat:** Er is geen "naar inhoud"-link vóór de navigatie.
**Waarom:** Kleine maar standaard toegankelijkheidsverbetering.
**Oplossingsrichting:** Verborgen skip-link toevoegen die bij focus zichtbaar wordt en naar de hoofdinhoud springt.
**Risico:** Laag.

### A6. Toetsenbordnavigatie op de agenda-tabs — [ ] ja / [ ] nee
**Wat:** De tabs "Komend"/"Geweest" hebben `role="tab"` maar werken alleen met muis/enter; pijltjestoets-navigatie ontbreekt.
**Waarom:** Bij het ARIA-tabpatroon hoort pijltjesnavigatie (roving `tabindex`) — nu klopt de belofte van de rol niet helemaal.
**Oplossingsrichting:** Klein stukje JS toevoegen in `main.js` voor links/rechts-toetsen.
**Risico:** Laag–middel.

### A7. Prefilled boekingsmail — [ ] ja / [ ] nee
**Wat:** De "Mail me"-knop opent een leeg mailtje.
**Waarom:** Een voorgevuld onderwerp/body verlaagt de drempel en levert je meteen bruikbare info.
**Oplossingsrichting:** `mailto:` uitbreiden met `?subject=Boeking%20—%20[datum]%20[plek]&body=...` met een paar invulhints (datum, locatie, type feest).
**Risico:** Laag. (Zie ook B2 voor een echt formulier.)

### A8. Findability: robots + sitemap + JSON-LD — [ ] ja / [ ] nee
**Wat:** `robots`-meta staat alleen op de privacypagina; er is geen `sitemap.xml`/`robots.txt` en geen structured data.
**Waarom:** Betere indexering en kans op rich results.
**Oplossingsrichting:** `robots.txt` + `sitemap.xml` in `docs/`, en een `Person`/`MusicGroup`-JSON-LD blok met naam, plaats en `sameAs` (Spotify, LinkedIn).
**Risico:** Laag.

### A9. Visuele finetuning (smaakgevoelig) — [ ] ja / [ ] nee
**Wat:** Twee kleine ritme-dingen:
- `.container` is 860px breed, de nav 1000px — op grote schermen zweeft de content wat smal onder een bredere balk.
- Het verschil tussen `.section` en `.section--alt` is erg subtiel, waardoor de sectie-afwisseling nauwelijks leest.
**Oplossingsrichting:** Container en nav-breedte gelijktrekken (of bewust kiezen), en `--alt` iets meer contrast/een dunne scheidingslijn geven.
**Risico:** Laag (puur cosmetisch; graag jouw smaakvoorkeur).

---

## B. Doorontwikkelpad (input van jou nodig)

### B1. Laat je horen als DJ (sets/mixes)
Nu staan er Spotify-**playlists** (curatie), maar een boeker wil een échte set horen. 
**Vraag:** Heb je opgenomen sets? Zo ja, op welk platform (SoundCloud/Mixcloud)? Dan maak ik een "Sets"-sectie met embed. Zo nee, dan is de eerste stap: één set opnemen.

### B2. Echte boekingsflow
`mailto:` werkt, maar een kort formulier kwalificeert beter. 
**Vraag:** Wil je een formulier (bijv. Formspree/Basin/MailerLite-form) met velden als datum, locatie, type feest, budget? En welke dienst heeft je voorkeur? (A7 is de tussenoplossing zolang dit er niet is.)

### B3. Press kit / EPK
Voor boekingen helpt een compacte kit: korte bio, hi-res foto('s), logo, genres/BPM, tech rider en contact — als aparte pagina of downloadbare PDF. 
**Vraag:** Heb je dit materiaal (foto's, bio-tekst), en wil je het publiek of alleen on-request?

### B4. Nieuwsbrief: inline aanmelden + groei
Aanmelden gaat nu alleen via een popup (`ml('show', ...)`). Een inline embed-formulier op de nieuwsbriefpagina werkt ook als de popup geblokkeerd wordt. 
**Vraag:** Wil je een inline MailerLite-embed? Zo ja, welk embed-formulier-id gebruik ik?

### B5. Agenda met echte data
"Komend" is nu leeg en nieuwe gigs voeg je toe door HTML te kopiëren. 
**Vraag:** Wil je een lichte datastructuur (bijv. een klein JSON-blok dat de lijst rendert) zodat toevoegen makkelijker is, en wil je "zet in agenda" (iCal)-knoppen per optreden?

### B6. Verhaal in "Over" versterken
Het sterke narratief (van eerste les → eerste gig → Rousseau-analogie) zit nu verspreid over FAQ en nieuwsbrief. 
**Vraag:** Wil je op de homepage een korte mini-bio/timeline die dat verhaal bundelt, of houd je het bewust op grap-niveau?

### B7. Beeld & merk
Eén portretfoto doet nu dubbel werk (hero/OG én "Over mij"). Meer foto's achter de decks onderbouwen de claims "clubervaring" en "imago". 
**Vraag:** Heb je extra fotomateriaal (liefst live/achter de decks)?

---

## C. Out-of-the-box ideeën

- **"Banger van de maand" op de homepage** — trek automatisch de banger van de laatste editie naar boven, speelbaar.
- **Interactieve issue-tree** — klik op een lampje (Looks/Imago/Clubervaring/Techniek) voor een korte uitleg; koppelt de homepage aan het nieuwsbrief-verhaal.
- **Neon 404-pagina** in dezelfde stijl (nu waarschijnlijk de kale GitHub-404).
- **Kleine easter egg** — logo 3× klikken of een toetsencombinatie → airhorn + confetti. Past bij de toon.
- **"Deel deze banger"-knop** per editie via de Web Share API.
- **PWA-manifest** — site "installeerbaar" met het 🎧-icoon op de homescreen.
- **Deelbare gig-kaartjes** — genereer per optreden een socialbeeld in huisstijl.

---

## Bewezen bevindingen (onderbouwing van A1 en A2)

- **A1:** `diff` tussen root en `docs/` van alle drie bestanden geeft geen verschil (identiek); root mist `hero.jpg`, `collage.jpg`, `CNAME` en de subpagina's.
- **A2:** Grep op de genoemde classes in `docs/index.html`, `docs/nieuwsbrief/**` en `docs/privacy/**` geeft 0 treffers per class.
