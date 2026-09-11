# revan-platform

Rəvan Abdulzadənin şəxsi saytı və təlim platforması — marketinq, AI alətləri, satış
və dropshipping üzrə pullu/pulsuz video təlimlər. Landing səhifə, təlim kataloqu,
nümunə dərs funneli, istifadəçi kabineti və admin paneli.

## Tech stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS 3** (shadcn/ui — `new-york`, `components.json`)
- **React Router 7**
- **Framer Motion / motion**, **GSAP** — animasiyalar
- **Supabase** — auth, verilənlər bazası, RLS (`supabase/schema.sql`)
- **oxlint** — linting
- Deploy: **Vercel** (SPA rewrite — `vercel.json`)

## Başlanğıc

```bash
npm install
cp .env.example .env      # dəyərləri Supabase → Project Settings → API-dən doldur
npm run dev               # http://localhost:5173
```

`.env` olmadan da landing və nümunə təlim funneli işləyir (məzmun
`src/content/`-dən gəlir); auth və real təlimlər üçün Supabase dəyərləri lazımdır.

## Skriptlər

| Əmr | İş |
| --- | --- |
| `npm run dev` | Dev server (HMR) |
| `npm run build` | `tsc -b && vite build` → `dist/` |
| `npm run preview` | Build-in lokal önizləməsi |
| `npm run lint` | oxlint |

## Qovluq strukturu

```
docs/            Dizayn brifi və layihə sənədləri
public/          Statik fayllar (favicon, ikonlar, images/)
supabase/        DB sxemi (schema.sql) və quruluş qeydləri
src/
  components/
    auth/        Route guard-ları (RequireAuth, RequireAdmin)
    landing/     Ana səhifə bölmələri (Hero, About, Works, ...)
    layout/      Navbar, Footer, SiteLayout
    motion/      Animasiya sarğıları (Reveal, LiquidCursor, ...)
    ui/          shadcn/ui komponentləri
  config/        Sayt konfiqurasiyası (site.ts)
  content/       Statik məzmun (landing.ts, sampleCourses.ts)
  context/       React kontekstləri (AuthContext)
  lib/           Supabase klienti, query-lər, köməkçilər
  pages/         Route səhifələri (auth/, admin/)
  types/         Paylaşılan TypeScript tipləri (db.ts)
```

`@/` alias → `src/` (`vite.config.ts`, `tsconfig.app.json`).

## Deploy

Vercel-də layihəni bağla, `VITE_SUPABASE_URL` və `VITE_SUPABASE_ANON_KEY`
environment dəyişənlərini əlavə et. `vercel.json` bütün yolları `index.html`-ə
yönləndirir (client-side routing).
