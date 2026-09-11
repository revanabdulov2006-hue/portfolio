# Rəvan Abdulzadə — Personal Portfolio Landing Page
> Marketing & Satış Strategisti · Meta Reklam Mütəxəssisi · Veb Sayt Qurucusu

---

## 📌 Layihə Məqsədi

Rəvan Abdulzadənin peşəkar xidmətlərini, təlimlərini və brendini təqdim edən **tək səhifəli (single-page) portfolio landing page**. Sayt potensial müştərilərə dərhal güclü bir ilk təəssürat yaratmalı, xidmətləri aydın göstərməli və onları tezliklə əlaqəyə keçirtməlidir.

---

## 🗂️ Fayl Strukturu

```
revan-portfolio/
│
├── index.html           → Əsas & yeganə HTML faylı (single-page)
├── style.css            → Bütün stillər, animasiyalar, responsive
├── script.js            → Bütün interaktivlik, animasiya triggerləri, efektlər
└── assets/
    ├── profile.jpg      → Profil şəkli (əlavə ediləcək)
    └── og-image.jpg     → Social share preview şəkli
```

---

## 🎨 Dizayn Sistemi & Estetika

### Konsept
**"Qaranlıqda parlayan strateq"** — Tünd, dərin bir fon üzərində elektrik mavi & amber vurğular. Hər element sanki enerjilə yüklənmiş kimi titrəyir. Ziyarətçi sayta girən kimi "bu adam öz işinin ustasıdır" hissi keçirməlidir.

### Referans Saytlar (oxşar olmalı)
- **mattfarley.ca** — Sadə amma güclü hero, texniki yetkinlik hissi
- **stripepress.com** — Hərəkətli gradient, dinamik layout
- **robbowen.digital** — Tünd fon, parlayan efektlər, modern typography

### Rəng Palitrası

```css
:root {
  /* Fonlar */
  --bg-void:       #050508;   /* Ən dərin qara — body fon */
  --bg-dark:       #0C0C14;   /* Kartlar & section fonları */
  --bg-surface:    #13131F;   /* Hover səthlər */
  --bg-glass:      rgba(255,255,255,0.04); /* Şüşə effekt */

  /* Əsas Vurğular */
  --electric:      #3B82F6;   /* Elektrik mavi — əsas accent */
  --electric-glow: rgba(59,130,246,0.25);
  --electric-soft: #60A5FA;   /* Açıq mavi — hover */
  --amber:         #F59E0B;   /* Amber — ikincil vurğu & xidmət tagləri */
  --amber-soft:    #FCD34D;
  --white-pure:    #FFFFFF;
  --white-dim:     #E2E8F0;   /* Başlıqlar */
  --white-muted:   #94A3B8;   /* İkincil mətn */
  --white-ghost:   #334155;   /* Separator & placeholder */

  /* Gradient-lər */
  --grad-hero:    linear-gradient(135deg, #050508 0%, #0C0C1A 50%, #050508 100%);
  --grad-accent:  linear-gradient(90deg, #3B82F6, #8B5CF6);
  --grad-amber:   linear-gradient(90deg, #F59E0B, #EF4444);
  --grad-text:    linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
  --grad-btn:     linear-gradient(135deg, #3B82F6 0%, #6366F1 100%);

  /* Kölgə & Parıltı */
  --glow-blue:    0 0 40px rgba(59,130,246,0.3);
  --glow-strong:  0 0 80px rgba(59,130,246,0.15);
  --glow-amber:   0 0 30px rgba(245,158,11,0.25);
  --shadow-card:  0 4px 32px rgba(0,0,0,0.6);
  --shadow-lift:  0 16px 64px rgba(0,0,0,0.5);

  /* Motion */
  --ease-expo:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-back:    cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth:  cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast:     200ms;
  --dur-base:     400ms;
  --dur-slow:     700ms;
  --dur-enter:    1000ms;
}
```

### Tipografiya

```css
/* CDN əlavəsi — <head>-ə yapışdır */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?
  family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&
  family=Bricolage+Grotesque:wght@400;500;600;700;800&
  display=swap" rel="stylesheet">

/* Tətbiq */
--font-display: 'Bricolage Grotesque', sans-serif;  /* Başlıqlar — güclü, yaddaqalan */
--font-body:    'Plus Jakarta Sans', sans-serif;     /* Mətn — oxunaqlı, müasir */

/* Ölçü Sistemi */
.hero-title     { font: 800 clamp(42px, 7vw, 88px)/1.05 var(--font-display); }
.section-title  { font: 700 clamp(28px, 4vw, 48px)/1.1  var(--font-display); }
.card-title     { font: 600 20px/1.3 var(--font-display); }
.body-text      { font: 400 16px/1.7  var(--font-body); }
.label-text     { font: 500 13px/1   var(--font-body); letter-spacing: 0.1em; text-transform: uppercase; }
```

---

## 🏗️ Bölmə Strukturu (Scroll Ardıcıllığı)

```
[Floating Social Sidebar] ← Hər zaman görünən sol kənar
        ↓
[1. NAV]          → Sabit üst naviqasiya
[2. HERO]         → Tam ekran giriş bölməsi
[3. ABOUT]        → Kim olduğu haqqında
[4. STATS]        → Rəqəm statistikaları
[5. SERVICES]     → Xidmətlər kartları
[5.5 RESULTS]     → Nəticələr kartları
[6. WHY ME]       → Üstünlüklər bölməsi
[7. TESTIMONIALS] → Müştəri rəyləri (sonra əlavə ediləcək)
[8. CTA]          → Əlaqə çağrısı
[9. FOOTER]       → Alt footer
```

---

## 📐 Bölmə-Bölmə Texniki Spesifikasiya

---

### 🔲 Floating Social Sidebar

**Mövqe:** `position: fixed`, sol kənar, şaquli mərkəz  
**Animasiya:** Sayt yüklənəndən 1.5s sonra `slideInLeft` ilə görünür

```html
<aside class="social-rail">
  <div class="social-rail__line social-rail__line--top"></div>
  <nav class="social-rail__icons">
    <a href="[INSTAGRAM_URL]" class="social-icon" aria-label="Instagram" target="_blank">
      <!-- Instagram SVG icon -->
    </a>
    <a href="[FACEBOOK_URL]" class="social-icon" aria-label="Facebook" target="_blank">
      <!-- Facebook SVG icon -->
    </a>
    <a href="[WHATSAPP_URL]" class="social-icon" aria-label="WhatsApp" target="_blank">
      <!-- WhatsApp SVG icon -->
    </a>
    <a href="[TELEGRAM_URL]" class="social-icon" aria-label="Telegram" target="_blank">
      <!-- Telegram SVG icon -->
    </a>
  </nav>
  <div class="social-rail__line social-rail__line--bottom"></div>
</aside>
```

```css
.social-rail {
  position: fixed;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.social-rail__line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--white-ghost));
}
.social-rail__line--bottom {
  background: linear-gradient(to bottom, var(--white-ghost), transparent);
}

.social-rail__icons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}

.social-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--white-muted);
  border: 1px solid var(--white-ghost);
  background: var(--bg-glass);
  backdrop-filter: blur(8px);
  transition: all var(--dur-base) var(--ease-expo);
  text-decoration: none;
}

.social-icon:hover {
  color: var(--electric);
  border-color: var(--electric);
  box-shadow: var(--glow-blue);
  transform: translateX(4px);
}

/* Responsiv: mobilddə gizlə */
@media (max-width: 768px) {
  .social-rail { display: none; }
}
```

---

### 1️⃣ NAV — Üst Naviqasiya

**Davranış:** Scroll-da `backdrop-filter: blur` aktivləşir, fon tünd olur (sticky nav)

```html
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="#" class="nav-logo">
      <span class="nav-logo__text">Rəvan<span class="nav-logo__dot">.</span></span>
    </a>
    <ul class="nav-links">
      <li><a href="#about">Haqqımda</a></li>
      <li><a href="#services">Xidmətlər</a></li>
      <li><a href="#results">Nəticələr</a></li>
      <li><a href="#contact">Əlaqə</a></li>
    </ul>
    <a href="#contact" class="btn btn--nav">Əlaqəyə keç →</a>
    <button class="nav-burger" aria-label="Menyu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

```css
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  padding: 16px 0;
  transition: all var(--dur-base) var(--ease-smooth);
}

.navbar.scrolled {
  background: rgba(5,5,8,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--white-ghost);
  padding: 12px 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo__text {
  font: 700 22px var(--font-display);
  color: var(--white-dim);
}
.nav-logo__dot { color: var(--electric); }

.nav-links {
  display: flex;
  gap: 36px;
  list-style: none;
}
.nav-links a {
  font: 500 14px var(--font-body);
  color: var(--white-muted);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color var(--dur-fast);
}
.nav-links a:hover { color: var(--white-dim); }
```

---

### 2️⃣ HERO — Tam Ekran Giriş

**Konsept:** Tam ekran, tünd fon üzərində gradient mesh dalgası hərəkət edir. Başlıq hərfləri bir-bir görünür (stagger). Sağ tərəfdə Rəvanın profil şəkli — animated glow ring ilə.

```html
<section class="hero" id="hero">

  <!-- Animated arxa plan elementləri -->
  <div class="hero-bg">
    <div class="hero-bg__mesh"></div>          <!-- Hərəkətli gradient -->
    <div class="hero-bg__grid"></div>          <!-- İncə şəbəkə pattern -->
    <div class="hero-bg__orb hero-bg__orb--1"></div>  <!-- Mavi orb -->
    <div class="hero-bg__orb hero-bg__orb--2"></div>  <!-- Amber orb -->
  </div>

  <div class="hero-container">

    <!-- Sol: Mətn -->
    <div class="hero-content">
      <div class="hero-badge">
        <span class="hero-badge__dot"></span>
        <span>Aktiv · Bakı, Azərbaycan</span>
      </div>

      <h1 class="hero-title">
        <span class="hero-title__line" data-line="1">Rəvan</span>
        <span class="hero-title__line hero-title__line--accent" data-line="2">Abdulzadə</span>
      </h1>

      <p class="hero-tagline">
        <!-- [PLACEHOLDER: Buraya qısa tagline əlavə et]           -->
        <!-- Məsələn: "Satışı rəqəmlərə, rəqəmləri nəticəyə çevirirəm" -->
        [TAGLINE — sonra əlavə ediləcək]
      </p>

      <p class="hero-desc">
        Marketing & satış strategiyası, Meta reklam idarəsi, veb sayt qurulumu
        və peşəkar təlimlər ilə bizneslərin böyüməsinə kömək edirəm.
      </p>

      <div class="hero-actions">
        <a href="#services" class="btn btn--primary">
          <span>Xidmətlərə bax</span>
          <svg><!-- arrow icon --></svg>
        </a>
        <a href="#contact" class="btn btn--ghost">
          <span>Əlaqə saxla</span>
        </a>
      </div>

      <!-- Sürətli stat göstəriciləri -->
      <div class="hero-quick-stats">
        <div class="quick-stat">
          <span class="quick-stat__num">[X]+</span>
          <span class="quick-stat__label">Müştəri</span>
        </div>
        <div class="quick-stat__sep"></div>
        <div class="quick-stat">
          <span class="quick-stat__num">[X]+</span>
          <span class="quick-stat__label">Kampaniya</span>
        </div>
        <div class="quick-stat__sep"></div>
        <div class="quick-stat">
          <span class="quick-stat__num">[X]+</span>
          <span class="quick-stat__label">Təlim</span>
        </div>
      </div>
    </div>

    <!-- Sağ: Şəkil -->
    <div class="hero-visual">
      <div class="hero-photo-wrap">
        <div class="hero-photo-ring hero-photo-ring--outer"></div>
        <div class="hero-photo-ring hero-photo-ring--inner"></div>
        <img src="./assets/profile.jpg" alt="Rəvan Abdulzadə" class="hero-photo">
        <div class="hero-photo-glow"></div>
      </div>
      <!-- Floating badge-lər -->
      <div class="hero-float hero-float--1">
        <span>📈</span> Meta Ads Expert
      </div>
      <div class="hero-float hero-float--2">
        <span>🎯</span> Satış Strategisti
      </div>
    </div>

  </div>

  <!-- Aşağı scroll işarəsi -->
  <div class="hero-scroll-hint">
    <div class="scroll-dot"></div>
    <span>Aşağı davam et</span>
  </div>

</section>
```

**Hero Arxa Plan Animasiyaları:**

```css
/* Hərəkətli gradient mesh */
.hero-bg__mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 70% 40%, rgba(59,130,246,0.12) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 20% 70%, rgba(139,92,246,0.08) 0%, transparent 70%);
  animation: meshShift 12s ease-in-out infinite alternate;
}

@keyframes meshShift {
  from { transform: scale(1) translate(0, 0); }
  to   { transform: scale(1.1) translate(-2%, 3%); }
}

/* Şəbəkə fon */
.hero-bg__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
}

/* Üzən parlaq kürələr */
.hero-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: orbFloat 8s ease-in-out infinite;
}
.hero-bg__orb--1 {
  width: 400px; height: 400px;
  background: rgba(59,130,246,0.15);
  top: 10%; right: 10%;
  animation-delay: 0s;
}
.hero-bg__orb--2 {
  width: 300px; height: 300px;
  background: rgba(245,158,11,0.08);
  bottom: 20%; left: 20%;
  animation-delay: -4s;
}
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(30px, -20px) scale(1.05); }
}

/* Profil şəkli parlaq halqaları */
.hero-photo-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
.hero-photo-ring--outer {
  width: 110%; height: 110%;
  border-color: rgba(59,130,246,0.2);
  animation: ringPulse 4s ease-in-out infinite;
}
.hero-photo-ring--inner {
  width: 105%; height: 105%;
  border-color: rgba(59,130,246,0.4);
  animation: ringPulse 4s ease-in-out infinite reverse;
}
@keyframes ringPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.6; }
  50%       { transform: translate(-50%, -50%) scale(1.03); opacity: 1; }
}

/* Üzən badge-lər */
.hero-float {
  position: absolute;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--white-ghost);
  border-radius: 12px;
  padding: 10px 16px;
  font: 600 13px var(--font-body);
  color: var(--white-dim);
  white-space: nowrap;
  animation: floatBounce 6s ease-in-out infinite;
}
.hero-float--1 { bottom: 18%; right: -5%; animation-delay: 0s; }
.hero-float--2 { top: 18%;   left: -8%;  animation-delay: -3s; }
@keyframes floatBounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

/* Başlıq hərfləri stagger ilə görünür */
.hero-title__line {
  display: block;
  opacity: 0;
  transform: translateY(30px);
  animation: lineReveal var(--dur-enter) var(--ease-expo) forwards;
}
.hero-title__line[data-line="1"] { animation-delay: 0.2s; }
.hero-title__line[data-line="2"] { animation-delay: 0.4s; }
.hero-title__line--accent {
  background: var(--grad-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@keyframes lineReveal {
  to { opacity: 1; transform: translateY(0); }
}

/* Scroll hint animasiyası */
.scroll-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--electric);
  margin: 0 auto 8px;
  animation: scrollBounce 2s ease-in-out infinite;
}
@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50%       { transform: translateY(8px); opacity: 0.4; }
}
```

---

### 3️⃣ ABOUT — Haqqımda

```html
<section class="about section" id="about">
  <div class="container">
    <div class="section-label">Haqqımda</div>
    <div class="about-grid">
      <div class="about-text">
        <h2 class="section-title">
          Marketing sadəcə reklam deyil —<br>
          <span class="text-accent">düzgün strategiyadır.</span>
        </h2>
        <p class="body-text">
          [PLACEHOLDER: Özünüz haqqında 2-3 cümlə. Kim olduğunuz, nə qədərdir bu sahədəsiniz, 
          niyə bu işi seçdiniz — öz sözlərinizlə yazın, birlikdə redaktə edərik.]
        </p>
        <p class="body-text">
          Meta reklamları, satış psixologiyası və rəqəmsal marketing aləmindəki
          dərin biliyimlə müştərilərin biznesini böyütməsinə birbaşa töhfə verirəm.
        </p>
      </div>
      <div class="about-highlights">
        <div class="highlight-card">
          <div class="highlight-icon">🎯</div>
          <h4>Nəticəyönümlü</h4>
          <p>Hər kampaniya, hər strategi qərar ölçülə bilən nəticəyə əsaslanır.</p>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">📊</div>
          <h4>Məlumat əsaslı</h4>
          <p>Rəqəmləri anlayır, doğru qərara çevirirəm.</p>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">🤝</div>
          <h4>Uzunmüddətli əlaqə</h4>
          <p>Müştərilərimlə münasibət bir layihə ilə bitmir.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### 4️⃣ STATS — Rəqəm Statistikaları

**Animasiya:** Bölməyə scroll edildikdə sayğaclar 0-dan rəqəmə qədər sayır (CountUp.js tərzi, vanilla JS ilə)

```html
<section class="stats section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item" data-count="[X]" data-suffix="+">
        <span class="stat-number">0</span>
        <span class="stat-label">Xoşbəxt Müştəri</span>
      </div>
      <div class="stat-item" data-count="[X]" data-suffix="+">
        <span class="stat-number">0</span>
        <span class="stat-label">Meta Kampaniya</span>
      </div>
      <div class="stat-item" data-count="[X]" data-suffix="+">
        <span class="stat-number">0</span>
        <span class="stat-label">Təlim Keçirildi</span>
      </div>
      <div class="stat-item" data-count="[X]" data-suffix="K+">
        <span class="stat-number">0</span>
        <span class="stat-label">Reklam Büdcəsi İdarə Edildi (AZN)</span>
      </div>
    </div>
  </div>
</section>
```

```css
.stats { background: var(--bg-dark); border-top: 1px solid var(--white-ghost); border-bottom: 1px solid var(--white-ghost); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--white-ghost); }
.stat-item { background: var(--bg-dark); padding: 48px 32px; text-align: center; }
.stat-number { display: block; font: 800 clamp(40px, 5vw, 64px)/1 var(--font-display); background: var(--grad-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-label { display: block; font: 500 14px var(--font-body); color: var(--white-muted); margin-top: 10px; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
```

---

### 5️⃣ SERVICES — Xidmətlər

```html
<section class="services section" id="services">
  <div class="container">
    <div class="section-label">Xidmətlər</div>
    <h2 class="section-title">Nə təklif edirəm?</h2>
    <p class="section-desc">
      Biznesinizin ehtiyacına görə xüsusi həll yolları hazırlayıram.
    </p>
    <div class="services-grid">

      <div class="service-card" data-index="1">
        <div class="service-card__number mono">01</div>
        <div class="service-card__icon">📈</div>
        <h3 class="service-card__title">Meta Reklam İdarəsi</h3>
        <p class="service-card__desc">
          Facebook və Instagram reklamlarının tam idarəsi — hədəf kütlə seçimi,
          kreativ, optimallaşdırma və hesabat.
        </p>
        <div class="service-card__tags">
          <span class="tag">Facebook Ads</span>
          <span class="tag">Instagram Ads</span>
          <span class="tag">Retargeting</span>
        </div>
        <div class="service-card__arrow">→</div>
      </div>

      <div class="service-card" data-index="2">
        <div class="service-card__number mono">02</div>
        <div class="service-card__icon">🎓</div>
        <h3 class="service-card__title">Meta Reklam Təlimləri</h3>
        <p class="service-card__desc">
          Sıfırdan Meta reklam sistemini öyrən. Praktik, nəticəyönümlü,
          real nümunələrlə keçirilən təlimlər.
        </p>
        <div class="service-card__tags">
          <span class="tag">Fərdi Təlim</span>
          <span class="tag">Qrup Dərsi</span>
          <span class="tag">Online</span>
        </div>
        <div class="service-card__arrow">→</div>
      </div>

      <div class="service-card" data-index="3">
        <div class="service-card__number mono">03</div>
        <div class="service-card__icon">🌐</div>
        <h3 class="service-card__title">Veb Sayt Qurulumu</h3>
        <p class="service-card__desc">
          Biznesiniz üçün peşəkar, sürətli, mobil uyğun veb sayt —
          dizayndan yerləşdirməyə qədər tam xidmət.
        </p>
        <div class="service-card__tags">
          <span class="tag">Landing Page</span>
          <span class="tag">Portfolio</span>
          <span class="tag">E-ticarət</span>
        </div>
        <div class="service-card__arrow">→</div>
      </div>

      <div class="service-card" data-index="4">
        <div class="service-card__number mono">04</div>
        <div class="service-card__icon">🎯</div>
        <h3 class="service-card__title">Satış & Marketing Strategiyası</h3>
        <p class="service-card__desc">
          Biznesiniz üçün xüsusi satış huni, müştəri yolçuluğu
          və marketing strategiyasının hazırlanması.
        </p>
        <div class="service-card__tags">
          <span class="tag">Satış Hunisi</span>
          <span class="tag">SMM</span>
          <span class="tag">Brending</span>
        </div>
        <div class="service-card__arrow">→</div>
      </div>

    </div>
  </div>
</section>
```

```css
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 48px;
}

.service-card {
  position: relative;
  padding: 36px;
  background: var(--bg-dark);
  border: 1px solid var(--white-ghost);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-expo);
}

/* Parlaq kənar efekti hover-da */
.service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid transparent;
  background: var(--grad-accent) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-expo);
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lift), var(--glow-blue);
  border-color: transparent;
}
.service-card:hover::before { opacity: 1; }

.service-card__number {
  font: 500 12px var(--font-body);
  color: var(--electric);
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.service-card__icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: block;
}

.service-card__arrow {
  position: absolute;
  top: 36px; right: 36px;
  font-size: 20px;
  color: var(--white-ghost);
  transition: all var(--dur-base) var(--ease-expo);
}
.service-card:hover .service-card__arrow {
  color: var(--electric);
  transform: translate(4px, -4px);
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 100px;
  font: 500 12px var(--font-body);
  color: var(--electric-soft);
  margin: 4px 4px 0 0;
}

@media (max-width: 768px) {
  .services-grid { grid-template-columns: 1fr; }
}
```

---

### 5️⃣.5️⃣ RESULTS — Nəticələr

```html
<section class="results section" id="results">
  <div class="container">
    <div class="section-label reveal-up">Nəticələr</div>
    <h2 class="section-title reveal-up">Hekayələr yox, <span class="text-accent">rəqəmlər danışır</span></h2>
    <p class="section-desc reveal-up">
      Müştərilərimlə qazandığımız real kampaniya göstəriciləri şifahi sözlərə ehtiyac qoymur.
    </p>
    <div class="results-grid">
      <!-- 2 Kart daxil olmaqla ...  -->
    </div>
  </div>
</section>
```

```css
.results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; margin-top: 48px; }
.result-card { background: var(--bg-surface); border: 1px solid var(--white-ghost); border-radius: 24px; overflow: hidden; transition: transform var(--dur-base) var(--ease-expo); }
.result-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lift), var(--glow-strong); border-color: rgba(59, 130, 246, 0.3); }
.result-card__image-wrapper { position: relative; width: 100%; height: 240px; overflow: hidden; background: var(--bg-dark); }
.result-card__image { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease-expo); }
.result-card:hover .result-card__image { transform: scale(1.05); }
.result-card__overlay { position: absolute; top: 16px; left: 16px; }
.result-card__content { padding: 32px; }
```

---

### 6️⃣ WHY ME — Niyə Mən?

```html
<section class="why-me section">
  <div class="container">
    <div class="why-me-inner">
      <div class="why-me-text">
        <div class="section-label">Üstünlüklər</div>
        <h2 class="section-title">Niyə<br><span class="text-accent">Rəvanla?</span></h2>
        <p class="body-text">
          [PLACEHOLDER: Bu bölmə üçün 1-2 cümlə — nə üçün sizi seçsinlər?]
        </p>
      </div>
      <div class="why-me-list">
        <div class="why-item">
          <div class="why-item__check">✓</div>
          <div>
            <h4>Real nəticə, söz yox</h4>
            <p>Kampaniyalarımı rəqəmlərlə ölçürük, vədlərlə yox.</p>
          </div>
        </div>
        <div class="why-item">
          <div class="why-item__check">✓</div>
          <div>
            <h4>Yerli bazarı tanıyıram</h4>
            <p>Azərbaycan auditoriyasının dinamikasını dərindən anlayıram.</p>
          </div>
        </div>
        <div class="why-item">
          <div class="why-item__check">✓</div>
          <div>
            <h4>Daimi dəstək</h4>
            <p>Layihə bitdikdən sonra da yanınızdayam.</p>
          </div>
        </div>
        <div class="why-item">
          <div class="why-item__check">✓</div>
          <div>
            <h4>Şəffaf kommunikasiya</h4>
            <p>Hər addımı, hər məsrəfi biləcəksiniz.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### 7️⃣ CTA — Əlaqə Bölməsi

```html
<section class="cta section" id="contact">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-glow"></div>
      <div class="section-label">Əlaqə</div>
      <h2 class="cta-title">
        Biznesinizi böyütməyə<br>hazırsınız?
      </h2>
      <p class="cta-desc">
        Pulsuz ilkin məsləhət üçün indi əlaqə saxlayın.
        Birlikdə ən uyğun həll yolunu tapaq.
      </p>
      <div class="cta-buttons">
        <a href="https://wa.me/[WHATSAPP_NUMBER]" class="btn btn--primary btn--large" target="_blank">
          <svg><!-- WhatsApp icon --></svg>
          WhatsApp-da Yaz
        </a>
        <a href="https://instagram.com/[INSTAGRAM_HANDLE]" class="btn btn--outline btn--large" target="_blank">
          <svg><!-- Instagram icon --></svg>
          Instagram-da İzlə
        </a>
      </div>
      <p class="cta-email">
        Və ya email: <a href="mailto:[EMAIL]">[EMAIL — əlavə ediləcək]</a>
      </p>
    </div>
  </div>
</section>
```

```css
.cta-inner {
  position: relative;
  text-align: center;
  padding: 80px 40px;
  background: var(--bg-dark);
  border: 1px solid var(--white-ghost);
  border-radius: 28px;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 400px;
  background: radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.cta-title {
  font: 800 clamp(32px, 5vw, 56px)/1.1 var(--font-display);
  color: var(--white-dim);
  margin-bottom: 20px;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 36px 0 24px;
}
```

---

### 8️⃣ FOOTER

```html
<footer class="footer">
  <div class="container">
    <div class="footer-inner">
      <span class="footer-name">Rəvan Abdulzadə</span>
      <span class="footer-copy">© 2025 · Bütün hüquqlar qorunur</span>
      <div class="footer-socials">
        <a href="[INSTAGRAM_URL]" aria-label="Instagram">IG</a>
        <a href="[FACEBOOK_URL]" aria-label="Facebook">FB</a>
        <a href="[WHATSAPP_URL]" aria-label="WhatsApp">WA</a>
      </div>
    </div>
  </div>
</footer>
```

---

## 🎬 JavaScript Funksiyaları (script.js)

```javascript
// ─── 1. Navbar scroll effekti ──────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── 2. CountUp animasiyası (Stats bölməsi) ────────────────────
function countUp(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const display = el.querySelector('.stat-number');
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      display.textContent = target + suffix;
      clearInterval(timer);
    } else {
      display.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

// ─── 3. Intersection Observer — scroll-triggered animasiyalar ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');

      // Stats sayğacı
      if (entry.target.classList.contains('stat-item')) {
        countUp(entry.target);
      }

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Hər animasiyalı elementi müşahidə et
document.querySelectorAll(
  '.service-card, .stat-item, .highlight-card, .why-item, .hero-content, .hero-visual'
).forEach(el => observer.observe(el));

// ─── 4. Smooth Scroll ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── 5. Mobil Burger Menyu ─────────────────────────────────────
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
  burger.classList.toggle('is-active');
});

// ─── 6. Kursor parıltısı efekti (desktop) ─────────────────────
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
```

```css
/* Kursor glow efekti */
.cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  transition: left 0.1s, top 0.1s;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) {
  .hero-container    { flex-direction: column-reverse; gap: 40px; }
  .hero-visual       { width: 280px; height: 280px; }
  .social-rail       { left: 12px; }
}

/* Mobil */
@media (max-width: 768px) {
  .social-rail       { display: none; }  /* Alt footer sociallar göstərilir */
  .services-grid     { grid-template-columns: 1fr; }
  .stats-grid        { grid-template-columns: repeat(2, 1fr); }
  .hero-actions      { flex-direction: column; }
  .nav-links         { display: none; }  /* Burger ilə açılır */
  .nav-links.is-open {
    display: flex; flex-direction: column;
    position: absolute; top: 100%; left: 0; right: 0;
    background: var(--bg-dark);
    padding: 20px; gap: 16px;
    border-bottom: 1px solid var(--white-ghost);
  }
  .hero-float        { display: none; } /* Mobil üçün kaldır */
}

/* Kiçik Mobil */
@media (max-width: 480px) {
  .stats-grid        { grid-template-columns: 1fr; }
  .cta-buttons       { flex-direction: column; align-items: center; }
}
```

---

## 🔘 Düymə Sistemi

```css
/* Əsas düymə — gradient, parlayan hover */
.btn--primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--grad-btn);
  color: #fff;
  border: none;
  border-radius: 12px;
  font: 600 15px var(--font-body);
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all var(--dur-base) var(--ease-expo);
}
.btn--primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity var(--dur-fast);
}
.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(59,130,246,0.4);
}
.btn--primary:hover::after { opacity: 1; }
.btn--primary:active { transform: translateY(0); }

/* Ghost düymə */
.btn--ghost {
  padding: 14px 28px;
  background: transparent;
  color: var(--white-dim);
  border: 1px solid var(--white-ghost);
  border-radius: 12px;
  font: 600 15px var(--font-body);
  text-decoration: none;
  transition: all var(--dur-base) var(--ease-expo);
  display: inline-flex; align-items: center; gap: 8px;
}
.btn--ghost:hover {
  border-color: var(--electric);
  color: var(--electric);
  background: rgba(59,130,246,0.08);
}

/* Outline düymə */
.btn--outline {
  padding: 14px 28px;
  background: transparent;
  color: var(--electric);
  border: 1px solid var(--electric);
  border-radius: 12px;
  font: 600 15px var(--font-body);
  text-decoration: none;
  transition: all var(--dur-base) var(--ease-expo);
  display: inline-flex; align-items: center; gap: 8px;
}
.btn--outline:hover {
  background: var(--electric);
  color: #fff;
}

/* Böyük ölçü */
.btn--large { padding: 18px 36px; font-size: 16px; border-radius: 14px; }

/* Nav düyməsi */
.btn--nav {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 10px;
}
```

---

## ✅ [PLACEHOLDER] — Tamamlanacaq Məlumatlar

Aşağıdakı məlumatlar sizindir, birlikdə əlavə edəcəyik:

| Sahə | Cari Dəyər | Status |
|------|-----------|--------|
| Tagline (hero başlıq altı) | `[PLACEHOLDER]` | ⏳ Gözlənilir |
| Müştəri sayı | `[X]+` | ⏳ Gözlənilir |
| Kampaniya sayı | `[X]+` | ⏳ Gözlənilir |
| Təlim sayı | `[X]+` | ⏳ Gözlənilir |
| Reklam büdcəsi | `[X]K+` AZN | ⏳ Gözlənilir |
| Haqqımda mətni | `[PLACEHOLDER]` | ⏳ Gözlənilir |
| Niyə mən — mətni | `[PLACEHOLDER]` | ⏳ Gözlənilir |
| Instagram URL | `[INSTAGRAM_URL]` | ⏳ Gözlənilir |
| Facebook URL | `[FACEBOOK_URL]` | ⏳ Gözlənilir |
| WhatsApp nömrəsi | `[WHATSAPP_NUMBER]` | ⏳ Gözlənilir |
| Telegram URL | `[TELEGRAM_URL]` | ⏳ Gözlənilir |
| Email | `[EMAIL]` | ⏳ Gözlənilir |
| Profil şəkli | `./assets/profile.jpg` | ⏳ Yüklənəcək |

---

## 📋 Kodlama AI-yə Veriləcək Əmrlər

```
"index.html faylını yarat. Yuxarıdakı MD-dəki tam strukturu həyata keçir.
 Tünd fon, hərəkətli gradient orbs, grid pattern, stagger animasiyaları.
 Font: Bricolage Grotesque (başlıq) + Plus Jakarta Sans (mətn).
 Rəng sistemi CSS variables ilə tam tətbiq edilsin."

"Sol kənarda fixed social sidebar əlavə et: Instagram, Facebook, WhatsApp, Telegram.
 SVG ikonları ilə, hover-da glow efekti, mobilə gizlənsin."

"Hero bölməsini hazırla: sol tərəfdə stagger ilə açılan başlıq + 
 sağda glow halqalı profil şəkli. Floating badge-lər üzən animasiya ilə."

"Stats bölməsini hazırla: 4 rəqəm sayğacı — scroll edildikdə 0-dan 
 hədəfə qədər sayır (vanilla JS Intersection Observer)."

"Services bölməsini hazırla: 2×2 grid, hover-da gradient border + 
 translateY efekti, tag elementləri mavi rəngdə."
```

---

*Bu MD faylı inkişaf etdirilməkdədir. Məlumatlar əlavə edildikdə yenilənəcək.*  
**Rəvan Abdulzadə © 2025**
