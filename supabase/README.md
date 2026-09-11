# Supabase quraşdırma — addım-addım

## 1. Layihə yarat

1. https://supabase.com → **New project**
2. Region: **Frankfurt (eu-central-1)** — Azərbaycana ən yaxını
3. Baza şifrəsini yaz və saxla

## 2. Sxemi qur

Supabase Dashboard → **SQL Editor** → **New query** → `schema.sql` faylının
bütün məzmununu yapışdır → **Run**.

Bir dəfə işlədilir. Bütün cədvəllər, RLS siyasətləri və trigger-lər qurulur.

## 3. Açarları layihəyə yaz

Dashboard → **Project Settings → API**:

```bash
# revan-platform/.env  (bu faylı .env.example-dan kopyala)
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> `.env` faylı git-ə düşmür (`.gitignore`-da bloklanıb). Vercel-də eyni iki dəyəri
> **Settings → Environment Variables** bölməsinə əlavə et.

## 4. Admin hesabı yarat

1. Dashboard → **Authentication → Users → Add user**
   - Email: `revanabdulov2006@gmail.com`
   - Şifrə: özün təyin et (güclü olsun)
   - **Auto Confirm User: ON** ← bunu yandırmasan giriş edə bilməzsən
2. SQL Editor-da:

```sql
update public.profiles
set role = 'admin'
where email = 'revanabdulov2006@gmail.com';
```

3. Panelə giriş: `/admin/giris`

## 5. ⚠️ Şifrə bərpası üçün email şablonu (VACİB)

Saytdakı "şifrəni unutdum" axını **6 rəqəmli kod** gözləyir. Supabase-in standart
şablonu isə yalnız link göndərir — kod gəlmir və axın işləmir.

Dashboard → **Authentication → Emails → Reset Password** şablonunda mətni belə dəyiş:

```html
<h2>Şifrə bərpası</h2>
<p>Şifrəni dəyişmək üçün təsdiq kodun:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
<p>Bu kod qısa müddət keçərlidir. Sən tələb etməmisənsə, məktubu nəzərə alma.</p>
```

Əsas olan `{{ .Token }}` dəyişənidir.

## 6. Email təsdiqi (seçim)

Dashboard → **Authentication → Providers → Email**:

- **Confirm email: ON** → qeydiyyatdan sonra istifadəçi poçtunu təsdiqləməlidir
  (daha təhlükəsiz, tövsiyə olunur)
- **OFF** → qeydiyyatdan dərhal sonra daxil olur

Sayt hər iki halda düzgün işləyir.

> Supabase-in daxili SMTP-si gündə cəmi bir neçə məktub buraxır. Real istifadəyə
> keçəndə **Settings → Authentication → SMTP Settings** bölməsindən öz SMTP-ni
> (Resend, Brevo və s.) qoşmalısan, yoxsa təsdiq və bərpa məktubları çatmayacaq.

## 7. İlk kursu əlavə et

Hazırda kurs/dərs əlavə etmək **Table Editor** üzərindən edilir
(admin paneldəki redaktə forması növbəti mərhələdədir).

```sql
-- Kurs
insert into public.courses
  (slug, title, summary, description, category, is_free, price, learn_points, sort_order, is_published)
values (
  'marketinq-esaslari',
  'Marketinq Əsasları',
  'Sıfırdan marketinq sistemini qurmağı öyrən.',
  E'Bu təlimdə marketinqin əsaslarını praktikada göstərirəm.\nHər dərs bir addımdır.',
  'marketinq',
  true,            -- pulsuz
  0,
  array['Hədəf auditoriyanı müəyyən etmək', 'Mesajı düzgün qurmaq', 'Kanal seçimi'],
  1,
  true             -- dərc olunub
);

-- Dərs (video_url — Google Drive paylaşım linki, olduğu kimi yapışdır)
insert into public.lessons (course_id, title, description, video_url, sort_order)
select id, 'Giriş: marketinq nədir?', 'İlk dərsdə ümumi mənzərəni qururuq.',
       'https://drive.google.com/file/d/FAYL_ID/view?usp=sharing', 1
from public.courses where slug = 'marketinq-esaslari';

-- PDF material (istəyə bağlı)
insert into public.lesson_materials (lesson_id, title, file_url, kind)
select id, 'Dərs konspekti', 'https://drive.google.com/file/d/PDF_ID/view', 'pdf'
from public.lessons where title = 'Giriş: marketinq nədir?';
```

**Google Drive videosu üçün:** faylı sağ klik → **Share** → "Anyone with the link"
seç. Link belə olacaq: `https://drive.google.com/file/d/FAYL_ID/view?usp=sharing` —
olduğu kimi `video_url`-a yaz, sayt onu avtomatik embed formasına çevirir.

## 8. Backup

Dashboard → **Database → Backups**. Pulsuz planda gündəlik backup 7 gün saxlanılır.
Pro planda point-in-time recovery açılır.
