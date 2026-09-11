import { siteConfig } from '@/config/site'

export default function Privacy() {
  return (
    <article className="mx-auto max-w-2xl px-5 pb-24 pt-32 sm:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Məxfilik siyasəti
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Son yenilənmə: {new Date().toLocaleDateString('az-AZ')}
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="font-display text-lg font-bold text-foreground">Hansı məlumatı toplayırıq</h2>
          <p className="mt-2">
            Qeydiyyat zamanı yalnız ad, soyad və email ünvanınız toplanır. Şifrəniz bizim
            tərəfimizdən açıq şəkildə saxlanmır — o, Supabase Auth tərəfindən şifrələnmiş
            (hash) formada saxlanılır və heç kim, o cümlədən sayt sahibi, onu görə bilmir.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">Nə üçün istifadə olunur</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Hesabınızı yaratmaq və girişi təmin etmək</li>
            <li>Hansı təlimlərə çıxışınızın olduğunu müəyyən etmək</li>
            <li>Dərslərdə irəliləyişinizi yadda saxlamaq</li>
            <li>Pullu təlim sifarişində sizinlə əlaqə saxlamaq</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">Ödəniş məlumatı</h2>
          <p className="mt-2">
            Saytda onlayn kart ödənişi yoxdur. Heç bir kart nömrəsi və ya bank məlumatı
            saytda daxil edilmir və saxlanmır. Pullu təlimlərin ödənişi WhatsApp üzərindən
            birbaşa razılaşdırılır.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">Üçüncü tərəflər</h2>
          <p className="mt-2">
            Məlumatlarınız Supabase (verilənlər bazası və autentifikasiya) və Vercel (hostinq)
            xidmətlərində saxlanılır. Dərs videoları Google Drive üzərindən yayımlanır.
            Məlumatlarınız reklam məqsədilə heç bir tərəfə satılmır və ötürülmür.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">Hüquqlarınız</h2>
          <p className="mt-2">
            İstənilən vaxt hesabınızın və ona bağlı bütün məlumatların silinməsini tələb edə
            bilərsiniz. Bunun üçün{' '}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-primary underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>{' '}
            ünvanına yazmağınız kifayətdir.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">Əlaqə</h2>
          <p className="mt-2">
            Məxfiliklə bağlı sualınız varsa,{' '}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-primary underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>{' '}
            ünvanına müraciət edin.
          </p>
        </section>
      </div>
    </article>
  )
}
