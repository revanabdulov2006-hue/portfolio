/**
 * Landing page-in BÜTÜN mətni buradadır.
 * Rəvan: dəyişiklik üçün yalnız bu fayla toxun, komponentlərə girməyə ehtiyac yoxdur.
 *
 * QAYDA: burada uydurma rəqəm (tələbə sayı, reytinq, "500+ məzun") YAZILMIR.
 * Real məlumat olana qədər belə bölmələr saytda görünmür.
 */

export const hero = {
  firstName: 'RƏVAN',
  lastName: 'ABDULZADƏ',
  tagline: 'Girişimçi. Marketinq, AI, satış və dropshipping üzərinə qurduğumu öyrədirəm.',
  /** Hero-nun sol alt küncündəki qısa mövqeləndirmə. */
  standfirst: 'Təcrübələrimdən öyrəndiklərimi öyrədirəm.',
  cta: 'Təlimlərimə bax',
  /**
   * Hero-da iki qat var: üstdə piksel-art, arxasında eyni pozanın real
   * fotosu. Kursor gəzdikcə üstdəki piksel-art həmin nöqtədə deşilir və arxadakı
   * görünür. Hər iki fayl eyni kətanda hizalanıb — biri dəyişsə, digəri də
   * eyni çərçivə ilə yenidən hazırlanmalıdır.
   */
  imageFront: '/images/hero-front.webp',
  imageBack: '/images/hero-back.webp',
  imageAlt: 'Rəvan Abdulzadə',
} as const

/**
 * Hero-dan sonrakı scroll marquee-nin sözləri.
 * İki sətir əks istiqamətdə hərəkət edir — yuxarıdakı sağa, aşağıdakı sola.
 * Burada yalnız real fəaliyyət sahələri yazılır, uydurma ad/brend yoxdur.
 */
export const marqueeRowOne = [
  'MARKETİNQ',
  'AI ALƏTLƏRİ',
  'SATIŞ',
  'DROPSHIPPING',
  'COLD CALL',
] as const

export const marqueeRowTwo = [
  'MƏHSUL SEÇİMİ',
  'AVTOMATLAŞDIRMA',
  'ETİRAZ İDARƏSİ',
  'KAMPANİYA',
  'TƏDARÜKÇÜ',
] as const

export const about = {
  eyebrow: 'Haqqımda',
  title: 'Bir neçə biznes qurmuşam. İşləyəni də olub, işləməyəni də.',
  body: [
    'Mən Rəvan Abdulzadə — girişimçiyəm. Bu günə kimi bir neçə biznes qurmuşam; bəzisi uğur qazanıb, bəzisi yox. Öyrətdiyim hər şey kitabdan deyil, öz təcrübəmdən gəlir.',
    'Hazırda dörd istiqamətdə işləyirəm və bildiklərimi izləyicilərimlə bölüşürəm.',
  ],
} as const

/** "Haqqımda" bento şəbəkəsi — dörd fəaliyyət sahəsi. */
export const disciplines = [
  {
    id: 'marketinq',
    title: 'Marketinq',
    description:
      'Məhsulun kimə, hansı sözlə və harada danışdığını qurmaq. Kampaniya deyil — sistem.',
    span: 'lg:col-span-3',
  },
  {
    id: 'ai',
    title: 'AI Alətləri',
    description:
      'Süni intellekti gündəlik iş axınına oturtmaq: məzmun, araşdırma, avtomatlaşdırma.',
    span: 'lg:col-span-3',
  },
  {
    id: 'satis',
    title: 'Satış',
    description:
      'Birəbir satış və cold call. Skriptdən çox, qarşıdakını oxumaq və etirazı idarə etmək.',
    span: 'lg:col-span-2',
  },
  {
    id: 'dropshipping',
    title: 'Dropshipping',
    description:
      'Məhsul seçimi, tədarükçü, test və miqyaslandırma — praktikada nəyin işlədiyi.',
    span: 'lg:col-span-4',
  },
] as const

/**
 * Gördüyüm işlər. Sıra saytda göründüyü sıradır — massivdəki yeri dəyişsən,
 * nömrələmə (01, 02, …) avtomatik yenilənir.
 *
 * Reklam bloklarındakı RƏQƏMLƏR Meta Ads Manager ekran görüntülərindən
 * götürülüb — şəkillər public/images/results/ altındadır. Qayda budur:
 * yalnız ekran görüntüsü ilə təsdiqlənən rəqəm yazılır.
 *
 * Şəkil əlavə etmək üçün faylı public/images/works/ altına at və yolunu
 * `image`-ə yaz (məs. '/images/works/asanbiznesim.png'). `image: null`
 * qalarsa saxta görüntü qoyulmur — mətn paneli göstərilir.
 * `href`-ə canlı sayt linkini yazsan, blokda «Sayta bax» düyməsi çıxır.
 *
 * Massiv boş olsa, bölmə saytda ümumiyyətlə görünmür.
 */
export type Work = {
  id: string
  title: string
  field: string
  summary: string
  /** İstəsən xarici link ver, yoxdursa null saxla. */
  href: string | null
  /** public/images/ altına atdığın şəkil; yoxdursa null. */
  image: string | null
  /**
   * Portret şəkillər (sosial media postu kimi) üçün `true`.
   * Geniş ekran görüntüsü ilə eyni hündürlükdə göstərilsə, portret şəkil
   * `object-contain` altında kiçik bir zolağa sıxılardı — bu bayraq ona
   * daha hündür çərçivə verir.
   */
  tall?: boolean
}

export const works: Work[] = [
  {
    id: 'asanbiznesim',
    title: 'AsanBiznesim',
    field: 'Startup · ERP sistemi',
    summary:
      'Öz startapım. Market və aptek kimi kiçik bizneslərin tədarükçü, faktura, borc, srok, işçi və xərc hesabatını bir platformada birləşdirən idarəetmə sistemi — dəftər-kağız və WhatsApp xaosunu əvəz edir.',
    href: 'https://asanbiznesim.com',
    image: '/images/works/asanbiznesim.webp',
  },
  {
    id: 'perzongallery',
    title: 'PerzonGallery',
    field: 'Veb sayt · E-ticarət',
    summary:
      'Ətir mağazası üçün onlayn satış saytı. Məhsul kataloqu, brend filtrləri, seçilmişlər və səbət — üstəlik iki dil və birbaşa WhatsApp sifarişi. Mağaza satışı dükandan kənara çıxarır.',
    href: null,
    image: '/images/works/perzongallery.webp',
  },
  {
    id: 'bytantuni',
    title: 'By Tantuni',
    field: 'Veb sayt · Menyu sistemi',
    summary:
      'Tantuni işlətməsi üçün rəqəmsal menyu sistemi. Kateqoriyalara bölünmüş, axtarışı və səbəti olan, telefondan açılan menyu — qiymət və məhsul dəyişikliyi anında yenilənir, yenidən çap lazım gəlmir.',
    href: null,
    image: '/images/works/bytantuni.webp',
  },
  {
    id: 'lead-form-650',
    title: '7 gündə 650 lead — lead başına $0.20',
    field: 'Meta Ads · Lead generasiya',
    summary:
      'Bir həftəlik kampaniyada forma vasitəsilə 650 müraciət, cəmi $133.17 reklam xərci ilə. Lead başına orta xərc $0.20.',
    href: null,
    image: '/images/results/meta-650-leads.png',
  },
  {
    id: 'messaging-cpl',
    title: 'Mesajlaşma kampaniyalarında $0.13–$0.29 CPL',
    field: 'Meta Ads · Optimallaşdırma',
    summary:
      'Paralel işləyən beş kampaniyada potensial müştəri başına xərc $0.13 ilə $0.29 arasında saxlanıldı; başladılan mesajlaşmanın xərci $0.20–$0.44.',
    href: null,
    image: '/images/results/meta-leads-cpl.png',
  },

  {
    id: 'ai-post',
    title: 'AI ilə hazırlanmış post nümunəsi',
    field: 'AI dizayn · Sosial media',
    summary:
      'AsanBiznesim üçün hazırladığım reklam postu — ideya, vizual və mətn süni intellekt alətləri ilə bir axında çıxdı. Agentliyə vermədən, bir neçə saat ərzində kampaniyaya hazır kreativ.',
    href: null,
    image: '/images/works/ai-post.webp',
    tall: true,
  },
]

export const closing = {
  title: 'Bildiklərimi öyrədirəm.',
  body: 'Pullu və pulsuz təlimlərin hamısı bir yerdə. Pulsuzlara dərhal başlaya bilərsən.',
  cta: 'Təlimlərimə bax',
} as const
