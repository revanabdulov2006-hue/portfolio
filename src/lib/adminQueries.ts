import { supabase } from '@/lib/supabase'
import type { Course, CourseRequest, Profile } from '@/types/db'

/** Admin "Ümumi baxış" göstəriciləri. */
export type AdminStats = {
  users: number
  courses: number
  publishedCourses: number
  enrollments: number
  openRequests: number
  completedLessons: number
  topViewed: { title: string; views: number }[]
  topRequested: { title: string; requests: number }[]
}

async function countOf(table: string, filter?: (q: never) => never): Promise<number> {
  void filter
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true })
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const [users, courses, enrollments, completedLessons] = await Promise.all([
    countOf('profiles'),
    countOf('courses'),
    countOf('enrollments'),
    countOf('lesson_progress'),
  ])

  const { count: publishedCourses } = await supabase
    .from('courses')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true)

  const { count: openRequests } = await supabase
    .from('course_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')

  // Ən çox baxılan / sorğu gələn kurslar — kiçik həcmdə klient tərəfdə qruplaşdırılır.
  const { data: views } = await supabase.from('course_views').select('course_id, courses(title)')
  const { data: reqs } = await supabase
    .from('course_requests')
    .select('course_id, courses(title)')

  const tally = (rows: { course_id: string; courses: { title: string } | null }[] | null) => {
    const map = new Map<string, number>()
    for (const r of rows ?? []) {
      const title = r.courses?.title
      if (!title) continue
      map.set(title, (map.get(title) ?? 0) + 1)
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  return {
    users,
    courses,
    publishedCourses: publishedCourses ?? 0,
    enrollments,
    openRequests: openRequests ?? 0,
    completedLessons,
    topViewed: tally(views as never).map(([title, views]) => ({ title, views })),
    topRequested: tally(reqs as never).map(([title, requests]) => ({ title, requests })),
  }
}

/** İstifadəçi + qoşulduğu kurslar + hər kursda progress. */
export type AdminUserRow = {
  profile: Profile
  courses: { title: string; slug: string; done: number; total: number; percent: number }[]
}

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('user_id, courses(id, title, slug)')

  const { data: lessons } = await supabase.from('lessons').select('id, course_id')
  const { data: progress } = await supabase.from('lesson_progress').select('user_id, lesson_id')

  const lessonCourse = new Map<string, string>()
  const lessonsPerCourse = new Map<string, number>()
  for (const l of (lessons ?? []) as { id: string; course_id: string }[]) {
    lessonCourse.set(l.id, l.course_id)
    lessonsPerCourse.set(l.course_id, (lessonsPerCourse.get(l.course_id) ?? 0) + 1)
  }

  // user → course → tamamlanan dərs sayı
  const doneMap = new Map<string, Map<string, number>>()
  for (const p of (progress ?? []) as { user_id: string; lesson_id: string }[]) {
    const courseId = lessonCourse.get(p.lesson_id)
    if (!courseId) continue
    const perUser = doneMap.get(p.user_id) ?? new Map<string, number>()
    perUser.set(courseId, (perUser.get(courseId) ?? 0) + 1)
    doneMap.set(p.user_id, perUser)
  }

  // Supabase embed-i massiv kimi tipləyir; to-one əlaqədə tək obyekt gəlir.
  const enrollRows = (enrollments ?? []) as unknown as {
    user_id: string
    courses: { id: string; title: string; slug: string } | null
  }[]

  return ((profiles ?? []) as Profile[]).map((profile) => {
    const mine = enrollRows.filter((e) => e.user_id === profile.id && e.courses)
    return {
      profile,
      courses: mine.map((e) => {
        const c = e.courses!
        const total = lessonsPerCourse.get(c.id) ?? 0
        const done = doneMap.get(profile.id)?.get(c.id) ?? 0
        return {
          title: c.title,
          slug: c.slug,
          done,
          total,
          percent: total === 0 ? 0 : Math.round((done / total) * 100),
        }
      }),
    }
  })
}

export type AdminRequestRow = CourseRequest & {
  courses: { id: string; title: string; slug: string } | null
  /** İstifadəçinin artıq bu kursa çıxışı varmı. */
  granted: boolean
}

export async function fetchAdminRequests(): Promise<AdminRequestRow[]> {
  const { data, error } = await supabase
    .from('course_requests')
    .select('*, courses(id, title, slug)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  const rows = (data ?? []) as (CourseRequest & {
    courses: { id: string; title: string; slug: string } | null
  })[]

  const { data: enrollments } = await supabase.from('enrollments').select('user_id, course_id')
  const granted = new Set(
    ((enrollments ?? []) as { user_id: string; course_id: string }[]).map(
      (e) => `${e.user_id}:${e.course_id}`,
    ),
  )

  return rows.map((r) => ({
    ...r,
    granted: r.user_id ? granted.has(`${r.user_id}:${r.course_id}`) : false,
  }))
}

/** Pullu kursa çıxış icazəsi verir və sorğunu "təsdiqləndi" edir. */
export async function approveRequest(req: AdminRequestRow) {
  if (!req.user_id) throw new Error('Bu sorğu hesabsız yaradılıb, təsdiqlənə bilməz.')

  const { error: enrErr } = await supabase
    .from('enrollments')
    .insert({ user_id: req.user_id, course_id: req.course_id, source: 'admin' })
  if (enrErr && enrErr.code !== '23505') throw new Error(enrErr.message)

  const { error } = await supabase
    .from('course_requests')
    .update({ status: 'approved' })
    .eq('id', req.id)
  if (error) throw new Error(error.message)
}

export async function revokeAccess(req: AdminRequestRow) {
  if (!req.user_id) return
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('user_id', req.user_id)
    .eq('course_id', req.course_id)
  if (error) throw new Error(error.message)
}

export async function setRequestStatus(id: string, status: CourseRequest['status']) {
  const { error } = await supabase.from('course_requests').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as Course[]
}

export async function toggleCoursePublished(id: string, next: boolean) {
  const { error } = await supabase.from('courses').update({ is_published: next }).eq('id', id)
  if (error) throw new Error(error.message)
}
