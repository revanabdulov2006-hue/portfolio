/**
 * Saytın bütün dəyişdirilə bilən mətn/əlaqə məlumatları BURADADIR.
 * Rəvan: nömrəni, linkləri, adları yalnız bu faylda dəyişməlidir.
 */

export const siteConfig = {
  name: 'Rəvan Abdulzadə',
  role: 'Girişimçi',

  /** Beynəlxalq format — + və boşluq olmadan. wa.me linki bunu tələb edir. */
  whatsappNumber: '994515309697',
  /** Eyni nömrə, insanın oxuduğu formada — footer-də mətn kimi göstərilir. */
  whatsappDisplay: '051 530 96 97',

  /** Boş buraxılan link footer-də ümumiyyətlə göstərilmir. */
  social: {
    instagram: 'https://www.instagram.com/revangrowth',
    instagramHandle: '@revangrowth',
    facebook: 'https://www.facebook.com/share/1BGvAC9b7s/',
    linkedin: '',
  },

  contactEmail: 'revanabdulov2006@gmail.com',
} as const

/** Pullu kurs sifarişi üçün əvvəlcədən doldurulmuş WhatsApp linki. */
export function whatsappOrderLink(courseTitle: string) {
  const text = `Salam, "${courseTitle}" kursu ilə maraqlanıram.`
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`
}
