import type { Course } from '@/types/db'

/** Nümunə dərs — real `Lesson` tipinin UI üçün lazım olan hissəsi. */
export type SampleLesson = {
  id: string
  title: string
  description: string
}

export type SampleCourse = Course & { lessons: SampleLesson[] }

/**
 * NÜMUNƏ təlimlər.
 *
 * Bunlar Supabase-də hələ dərc olunmuş təlim olmayanda göstərilir ki, səhifə
 * boş qalmasın və dizayn real məzmunla necə görünəcəyi bilinsin. Admin paneldən
 * ilk təlim dərc olunan kimi bu siyahı avtomatik yox olur — heç bir yerdə
 * nümunə ilə real təlim qarışmır.
 *
 * TODO(Rəvan): real təlimlər əlavə olunandan sonra bu faylı silmək olar.
 */
export const SAMPLE_COURSES: SampleCourse[] = [
  {
    id: 'sample-meta-kabinet',
    slug: 'numune-meta-reklam-kabineti',
    title: 'Meta Reklam Kabineti — Sıfırdan Qurulum',
    summary:
      'Business Manager, piksel, hadisə quraşdırması və ilk kampaniyanın strukturu. Reklam açmadan əvvəl qurulmalı olan hər şey.',
    description:
      'Reklam açmazdan əvvəl qurulmayan hər şey sonra bahalı səhvə çevrilir. Bu təlimdə Business Manager-i sıfırdan qurur, pikseli saytına oturdur və hadisələri düzgün adlandırırıq.\nSonda ilk kampaniyanın strukturunu birlikdə yığırıq — büdcə, hədəf kütlə və kreativ bir-birinə bağlı şəkildə.',
    thumbnail_url: null,
    category: 'marketinq',
    is_free: true,
    price: 0,
    currency: 'AZN',
    learn_points: [
      'Business Manager və reklam hesabının düzgün qurulması',
      'Piksel və hadisələrin (event) sayta oturdulması',
      'Domen təsdiqi və hadisələrin prioritetləşdirilməsi',
      'İlk kampaniyanın struktur məntiqi: kampaniya → dəst → reklam',
    ],
    sort_order: 1,
    is_published: true,
    created_at: '',
    lessons: [
      {
        id: 'l1',
        title: 'Business Manager-in qurulması',
        description: 'Hesab strukturu, rollar və ilkin təhlükəsizlik parametrləri.',
      },
      {
        id: 'l2',
        title: 'Piksel və hadisələr',
        description: 'Pikselin sayta əlavəsi, standart və fərdi hadisələrin qurulması.',
      },
      {
        id: 'l3',
        title: 'Domen təsdiqi',
        description: 'Domenin təsdiqi və hadisələrin prioritetləşdirilməsi.',
      },
      {
        id: 'l4',
        title: 'İlk kampaniyanın strukturu',
        description: 'Məqsəd seçimi, büdcə paylanması və reklam dəstlərinin məntiqi.',
      },
    ],
  },
  {
    id: 'sample-cold-call',
    slug: 'numune-cold-call-ilk-30-saniye',
    title: 'Cold Call: İlk 30 Saniyə',
    summary:
      'Zəngin ilk yarım dəqiqəsi qalanını həll edir. Açılış cümləsi, səs tonu və qarşı tərəfi danışdıran suallar.',
    description:
      'Cold call-da qərar ilk yarım dəqiqədə verilir. Bu təlim skript əzbərləmək haqqında deyil — qarşıdakını oxumaq və söhbəti idarə etmək haqqındadır.\nReal zənglərdən nümunələrlə açılış cümləsini, səs tonunu və ilk etirazın necə keçildiyini addım-addım işləyirik.',
    thumbnail_url: null,
    category: 'satis',
    is_free: true,
    price: 0,
    currency: 'AZN',
    learn_points: [
      'Açılış cümləsinin qurulması və ilk 8 saniyə',
      'Səs tonu, tempi və pauzanın idarəsi',
      'Qarşı tərəfi danışdıran suallar',
      '«Vaxtım yoxdur» və «maraqlı deyil» cavablarının keçilməsi',
    ],
    sort_order: 2,
    is_published: true,
    created_at: '',
    lessons: [
      {
        id: 'l1',
        title: 'İlk 8 saniyə',
        description: 'Zəngin açılışı: kim olduğunu necə deyirsən və niyə dinləyirlər.',
      },
      {
        id: 'l2',
        title: 'Səs tonu və temp',
        description: 'Danışıq sürəti, pauza və nəfəs — inandırıcılığın texniki tərəfi.',
      },
      {
        id: 'l3',
        title: 'Danışdıran suallar',
        description: 'Qapalı suallardan qaçmaq və söhbəti qarşı tərəfə açmaq.',
      },
      {
        id: 'l4',
        title: 'İlk etiraz',
        description: 'Ən çox rast gəlinən iki cavab və onların keçilməsi.',
      },
    ],
  },
  {
    id: 'sample-ai-mezmun',
    slug: 'numune-ai-mezmun-konveyeri',
    title: 'AI ilə Məzmun Konveyeri',
    summary:
      'Bir gündə aylıq məzmun planı: araşdırma, ssenari, kadr siyahısı və təkrar istifadə oluna bilən şablonlar.',
    description:
      'AI alətləri məzmun istehsalını sürətləndirir, amma yalnız iş axını qurulubsa. Burada bir günə aylıq məzmun planı çıxaran konveyer qururuq.\nAraşdırmadan ssenariyə, kadr siyahısından təkrar istifadə oluna bilən şablonlara qədər bütün mərhələ.',
    thumbnail_url: null,
    category: 'ai',
    is_free: true,
    price: 0,
    currency: 'AZN',
    learn_points: [
      'Mövzu araşdırması və ideya bankının qurulması',
      'Ssenari yazımı üçün işlək prompt strukturu',
      'Kadr siyahısı və çəkiliş planının hazırlanması',
      'Şablonların saxlanması və təkrar istifadəsi',
    ],
    sort_order: 3,
    is_published: true,
    created_at: '',
    lessons: [
      {
        id: 'l1',
        title: 'İdeya bankı',
        description: 'Mövzuların toplanması və prioritetləşdirilməsi.',
      },
      {
        id: 'l2',
        title: 'Ssenari promptu',
        description: 'Nəticəni proqnozlaşdırıla bilən edən prompt strukturu.',
      },
      { id: 'l3', title: 'Kadr siyahısı', description: 'Ssenaridən çəkiliş planına keçid.' },
      { id: 'l4', title: 'Şablon sistemi', description: 'Bir dəfə qur, hər ay istifadə et.' },
    ],
  },
  {
    id: 'sample-dropshipping',
    slug: 'numune-dropshipping-ilk-satis',
    title: 'Dropshipping: Məhsuldan İlk Satışa',
    summary:
      'Məhsul seçimi, tədarükçü ilə danışıq, mağaza qurulumu, test büdcəsi və nəyin dayandırılacağına qərar vermək.',
    description:
      'Dropshipping-də uğur məhsul seçimində başlayır və test büdcəsinin idarəsində bitir. Bu təlimdə praktikada nəyin işlədiyini, nəyin işləmədiyini danışıram.\nTədarükçü ilə danışıqdan mağaza qurulumuna, test büdcəsindən dayandırma qərarına qədər.',
    thumbnail_url: null,
    category: 'dropshipping',
    is_free: false,
    price: 149,
    currency: 'AZN',
    learn_points: [
      'Məhsul seçimi meyarları və yoxlama üsulları',
      'Tədarükçü ilə danışıq və nümunə sifarişi',
      'Mağazanın qurulması və məhsul səhifəsi',
      'Test büdcəsi və dayandırma qərarı',
    ],
    sort_order: 4,
    is_published: true,
    created_at: '',
    lessons: [
      {
        id: 'l1',
        title: 'Məhsul seçimi',
        description: 'Hansı məhsul test etməyə dəyər, hansı vaxt itkisidir.',
      },
      {
        id: 'l2',
        title: 'Tədarükçü',
        description: 'Danışıq, nümunə sifarişi və keyfiyyət yoxlaması.',
      },
      {
        id: 'l3',
        title: 'Mağaza qurulumu',
        description: 'Məhsul səhifəsinin strukturu və etibar elementləri.',
      },
      {
        id: 'l4',
        title: 'Test və qərar',
        description: 'Test büdcəsi, ölçüləcək göstəricilər və dayandırma həddi.',
      },
      {
        id: 'l5',
        title: 'Miqyaslandırma',
        description: 'İşləyən məhsulun büdcəsinin necə artırılması.',
      },
    ],
  },
  {
    id: 'sample-satis-hunisi',
    slug: 'numune-satis-hunisi-sistemi',
    title: 'Satış Hunisi Sistemi',
    summary:
      'Reklamdan ödənişə qədər bütün yol: təklif, açılış səhifəsi, izləmə və müraciətin satışa çevrilmə addımları.',
    description:
      'Reklama pul xərcləyib satış almamağın səbəbi çox vaxt reklamda deyil, arxadakı sistemdə olur. Bu təlimdə reklamdan ödənişə qədər bütün yolu qururuq.\nTəklif, açılış səhifəsi, izləmə və müraciətin satışa çevrilmə addımları bir sistem kimi.',
    thumbnail_url: null,
    category: 'marketinq',
    is_free: false,
    price: 199,
    currency: 'AZN',
    learn_points: [
      'Təklifin (offer) qurulması və sınaqdan keçirilməsi',
      'Açılış səhifəsinin struktur məntiqi',
      'Müraciətlərin izlənməsi və axının qurulması',
      'Müraciətdən ödənişə keçid addımları',
    ],
    sort_order: 5,
    is_published: true,
    created_at: '',
    lessons: [
      { id: 'l1', title: 'Təklif', description: 'Nəyi, kimə və hansı sözlə təklif edirsən.' },
      {
        id: 'l2',
        title: 'Açılış səhifəsi',
        description: 'Bölmə-bölmə struktur və hansı bölmənin nəyə xidmət etdiyi.',
      },
      {
        id: 'l3',
        title: 'İzləmə',
        description: 'Müraciətlərin qeydə alınması və mənbəyə görə ayrılması.',
      },
      { id: 'l4', title: 'Bağlama axını', description: 'İlk təmasdan ödənişə qədər addımlar.' },
    ],
  },
  {
    id: 'sample-etiraz',
    slug: 'numune-etiraz-idaresi',
    title: 'Etiraz İdarəsi və Bağlama',
    summary:
      '«Bahadır», «düşünüm», «sonra yazaram» — hər birinin arxasındakı əsl səbəb və cavabı.',
    description:
      '«Bahadır», «düşünüm», «sonra yazaram» — bunlar cavab deyil, örtükdür. Bu təlimdə hər birinin arxasındakı əsl səbəbi tanımağı və uyğun cavabı öyrənirsən.\nReal danışıqlardan nümunələrlə, təzyiq etmədən bağlama texnikaları.',
    thumbnail_url: null,
    category: 'satis',
    is_free: false,
    price: 129,
    currency: 'AZN',
    learn_points: [
      'Etirazın arxasındakı əsl səbəbin tanınması',
      '«Bahadır» etirazının dəyər söhbətinə çevrilməsi',
      '«Düşünüm» və «sonra yazaram» cavablarının idarəsi',
      'Təzyiqsiz bağlama sualları',
    ],
    sort_order: 6,
    is_published: true,
    created_at: '',
    lessons: [
      {
        id: 'l1',
        title: 'Etirazı oxumaq',
        description: 'Deyilən sözün arxasındakı əsl narahatlıq.',
      },
      {
        id: 'l2',
        title: '«Bahadır»',
        description: 'Qiymət etirazının dəyər söhbətinə çevrilməsi.',
      },
      {
        id: 'l3',
        title: '«Düşünüm»',
        description: 'Qərarsızlığın səbəbini üzə çıxaran suallar.',
      },
      { id: 'l4', title: 'Bağlama', description: 'Təzyiqsiz, təbii bağlama texnikaları.' },
    ],
  },
]

/** Slug-a görə nümunə təlimi tapır. Tapılmasa `undefined`. */
export function getSampleCourse(slug: string): SampleCourse | undefined {
  return SAMPLE_COURSES.find((c) => c.slug === slug)
}

/**
 * Nümunə rejimində tamamlanmış dərslər brauzerdə saxlanılır — baza olmasa da
 * progress real işləsin və səhifə yenilənəndə itməsin.
 */
const STORE_KEY = 'revan.sample-progress'

export function readSampleProgress(slug: string): Set<string> {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    const all = raw ? (JSON.parse(raw) as Record<string, string[]>) : {}
    return new Set(all[slug] ?? [])
  } catch {
    return new Set()
  }
}

export function writeSampleProgress(slug: string, done: Set<string>) {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    const all = raw ? (JSON.parse(raw) as Record<string, string[]>) : {}
    all[slug] = [...done]
    localStorage.setItem(STORE_KEY, JSON.stringify(all))
  } catch {
    // Şəxsi rejimdə localStorage bağlı ola bilər — progress sadəcə saxlanmır.
  }
}
