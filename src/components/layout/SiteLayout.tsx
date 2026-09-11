import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { LiquidCursor } from '@/components/motion/LiquidCursor'
import { CinematicFooter } from '@/components/ui/motion-footer'

/**
 * Səhifə dəyişəndə scroll yuxarı qayıtsın — hash varsa isə həmin bölməyə.
 * Hash dəstəyi olmasa başqa səhifədən `/#isler` kimi keçid işləməzdi:
 * route dəyişir, amma brauzer artıq mövcud olmayan lövbərə baxmır.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Hədəf bölmə yeni route ilə birlikdə mount olur — bir kadr gözləyirik.
      const id = hash.slice(1)
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => window.clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

/**
 * İşıqlı (ağ/mavi) qalan bölmələr: istifadəçinin şəxsi paneli və dərs ekranı.
 * Uzun mətn və video ilə işlənən yerlərdə ağ fon daha rahat oxunur.
 * Qalan ictimai səhifələr tünd temada göstərilir.
 */
function isLightRoute(pathname: string) {
  return pathname === '/telimlerim' || pathname.startsWith('/telimlerim/')
}

export function SiteLayout() {
  const { pathname } = useLocation()
  const dark = !isLightRoute(pathname)

  /*
   * Sinif <body>-yə qoyulur ki, səhifənin sonundakı "rubber band" sürüşməsində
   * və mobil brauzer panellərinin arxasında ağ zolaq görünməsin.
   * useLayoutEffect: rəng dəyişikliyi ilk boyanmadan əvvəl tətbiq olunsun,
   * route keçidində ağ sayrışma olmasın.
   */
  useLayoutEffect(() => {
    document.body.classList.toggle('dark', dark)
    return () => document.body.classList.remove('dark')
  }, [dark])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTop />
      {/* Yalnız ictimai səhifələrdə — admin panel və giriş ekranları
          SiteLayout-dan kənardadır, orada iz görünmür. */}
      <LiquidCursor />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/*
        Kinematik footer tam ekran hündürlükdədir və pərdə kimi açılır —
        uzun landing-də təsirlidir, iş səhifələrində isə yolu uzadardı.
        Ona görə yalnız ana səhifədə göstərilir.
      */}
      {pathname === '/' ? <CinematicFooter /> : <Footer />}
    </div>
  )
}
