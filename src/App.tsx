import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { RequireAdmin, RequireAuth } from '@/components/auth/Guards'
import { SiteLayout } from '@/components/layout/SiteLayout'

import Home from '@/pages/Home'
import Courses from '@/pages/Courses'
import CourseDetail from '@/pages/CourseDetail'
import SampleLessonPanel from '@/pages/SampleLessonPanel'
import MyCourses from '@/pages/MyCourses'
import LessonPanel from '@/pages/LessonPanel'
import Privacy from '@/pages/Privacy'
import NotFound from '@/pages/NotFound'

import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'

import AdminLogin from '@/pages/admin/AdminLogin'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminRequests from '@/pages/admin/AdminRequests'
import AdminCourses from '@/pages/admin/AdminCourses'

/**
 * `key={slug}` — başqa nümunə təlimə keçəndə panel yenidən mount olsun.
 * Onsuz saxlanmış progress state-in ilkin dəyəri kimi yalnız bir dəfə
 * oxunar və köhnə təlimin faizi ekranda qalardı.
 */
function SampleLessonPanelRoute() {
  const { slug } = useParams()
  return <SampleLessonPanel key={slug} />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* --- Auth: sayt çərçivəsindən kənar, tam ekran --- */}
          <Route path="/giris" element={<Login />} />
          <Route path="/qeydiyyat" element={<Register />} />
          <Route path="/sifremi-unutdum" element={<ForgotPassword />} />

          {/* --- Admin: ictimai saytdan tam izolə --- */}
          <Route path="/admin/giris" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="istifadeciler" element={<AdminUsers />} />
              <Route path="sorgular" element={<AdminRequests />} />
              <Route path="kurslar" element={<AdminCourses />} />
            </Route>
          </Route>

          {/* --- İctimai sayt --- */}
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="telimler" element={<Courses />} />
            <Route path="telimler/:slug" element={<CourseDetail />} />
            {/* Nümunə dərs paneli — baza qurulmadan funnelin sonunu göstərir.
                Real panel `/telimlerim/:slug`-dadır və girişi tələb edir. */}
            <Route path="telimler/:slug/izle" element={<SampleLessonPanelRoute />} />
            <Route path="mexfilik-siyaseti" element={<Privacy />} />

            {/* Yalnız daxil olmuş istifadəçi üçün */}
            <Route element={<RequireAuth />}>
              <Route path="telimlerim" element={<MyCourses />} />
              <Route path="telimlerim/:slug" element={<LessonPanel />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
