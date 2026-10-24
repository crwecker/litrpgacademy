# LitRPG Academy: vision and roadmap

_Last updated 2026-10-24._

LitRPG Academy is **Letterboxd for LitRPG, plus a writer's corner**. Readers find their next book, rank what
they've read in tier lists, and share those lists on Reddit and Discord. Writers get a home too, starting with
[Writinator](https://writinator.com).

Game elements (realms, bosses) are flavor that rewards ranking and reviewing. They are not a minute-logging tracker.

## Roadmap

1. **Discovery core** (done on the `rebuild` branch): server-rendered book pages, browse/search, realm hubs,
   OG tags, sitemap. Reads the existing Neon database without migrations.
2. **Accounts and ranking**: magic-link sign-in, the log/diary (finished on a date, tier, optional review),
   want-to-read shelf, tier lists, and a "top 4" on the profile (SSS + SS = 4 slots). Carry over the existing users' data.
3. **Shareable tier lists**: public URL with a generated OG image, "Copy as Markdown" for Reddit, PNG download,
   and "rank this list yourself."
4. **Social**: curated lists, follows, likes on reviews and lists, activity feed ("what my friends read"), year in review.
5. **Writer's corner and events**: Writinator, guides, author-claimed book pages, trends from our own community
   data, and monthly realm boss events driven by reviews and rankings.

## Data sources

- **Royal Road** blocks scrapers (Cloudflare 403 on every HTML page since about 2026-10-04). We don't work
  around it. A request for API access or an allowlist has been drafted. Per-fiction RSS
  (`/fiction/syndication/{id}`) still works and can power "new chapter" updates.
- **Existing catalog**: about 9,000 books and 23,000 stats snapshots (June 2025 to October 2026).
- **Published books**: Open Library and Google Books APIs for covers, ISBNs, and descriptions.
- **Our community**: tier rankings, logs, reviews, and lists are the primary signal.

## Idea ledger

Ideas from the original PRD, `Realms.md`, the old tiers README, and the commit history, and where each stands.

| Idea | Source | Status |
| --- | --- | --- |
| See what friends and family read and thought | PRD | Phase 4 |
| Where to find each book and how other sites rank it | PRD | Partial: Royal Road stats, Amazon links |
| Resources for LitRPG writers | PRD | Phase 5; Writinator linked now |
| Boss abilities as mechanics (Tribulation Flame, Judgment Roar, Null Pointer Crash, Cycle Rewind, Boss Modifier Stack…) | Realms.md | Phase 5 as event modifiers |
| Realm effects while a boss is awake | Realms.md | Phase 5 |
| Seraphen, Herald of the Forgotten Realms (second Isekai boss) | Realms.md | Unused; candidate event boss |
| Shared boss HP, milestones, respawn, battle story log | Legacy code | Built in legacy; to be reworked around rankings |
| XP for reviews, rankings, reading status | Legacy code | Built in legacy; to be reworked |
| Tier lists (SSS 1 slot, SS 3, S 5), drag and drop | Legacy code | Phase 2 |
| Public reviews on book pages | Tiers README | Done (read-only) |
| Review likes, tier list sharing, tier-based recommendations, export | Tiers README | Phases 3 and 4 |
| "Make S tiers premium" | Commit history | Styling only; monetization undecided |
| Academy "classroom" | Legacy code | Placeholder; undecided |

## Legacy app

The 2025 Vite + Netlify Functions app lives in `legacy/` on this branch for reference while porting. The live site
still runs it from `main`. Its battle and add-book endpoints accept unauthenticated writes, and `JWT_SECRET` falls back
to a hardcoded default. Fix or retire them before or at cutover.
