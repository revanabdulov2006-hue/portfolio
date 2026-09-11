import { Hero } from '@/components/landing/Hero'
import { DisciplineBand } from '@/components/landing/DisciplineBand'
import { About } from '@/components/landing/About'
import { Teaching } from '@/components/landing/Teaching'
import { Works } from '@/components/landing/Works'
import { Closing } from '@/components/landing/Closing'

/**
 * Ana səhifə — yalnız Rəvan haqqında.
 * Brifin qaydası: burada heç bir kurs kartı, qiymət və ya kurs siyahısı yoxdur;
 * yeganə keçid "Təlimlərimə bax" düymələridir.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <DisciplineBand />
      <About />
      <Teaching />
      <Works />
      <Closing />
    </>
  )
}
