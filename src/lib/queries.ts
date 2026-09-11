import { supabase } from '@/lib/supabase'
import type { Course, Lesson, LessonMaterial } from '@/types/db'

/** Kataloq: yalnız dərc olunmuş kurslar, admin sıralamasına görə. */
export async function fetchPublishedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Course[]
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as Course | null) ?? null
}

/**
 * Kurs detal səhifəsindəki məzmun planı.
 * RPC istifadə olunur ki, qoşulmamış ziyarətçi də dərs adlarını görsün,
 * amma video linkləri açılmasın (RLS dərs cədvəlini bağlayır).
 */
export async function fetchCourseOutline(slug: string): Promise<{ title: string }[]> {
  const { data, error } = await supabase.rpc('course_outline', { course_slug: slug })
  if (error) throw new Error(error.message)
  return (data ?? []) as { title: string }[]
}

/** İstifadəçinin çıxışı olan kurslar + hər birində tamamlama faizi. */
export type EnrolledCourse = {
  course: Course
  totalLessons: number
  completedLessons: number
  percent: number
}

export async function fetchMyCourses(userId: string): Promise<EnrolledCourse[]> {
  const { data: enrollments, error: enrErr } = await supabase
    .from('enrollments')
    .select('course_id, courses(*)')
    .eq('user_id', userId)

  if (enrErr) throw new Error(enrErr.message)
  // Supabase embed-i massiv kimi tipləyir; to-one əlaqədə tək obyekt gəlir.
  const rows = (enrollments ?? []) as unknown as { course_id: string; courses: Course | null }[]
  const courses = rows.map((r) => r.courses).filter((c): c is Course => !!c)
  if (courses.length === 0) return []

  const courseIds = courses.map((c) => c.id)

  const { data: lessons, error: lesErr } = await supabase
    .from('lessons')
    .select('id, course_id')
    .in('course_id', courseIds)
  if (lesErr) throw new Error(lesErr.message)

  const { data: progress, error: progErr } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
  if (progErr) throw new Error(progErr.message)

  const doneIds = new Set((progress ?? []).map((p) => p.lesson_id as string))
  const byCourse = new Map<string, { total: number; done: number }>()

  for (const l of (lessons ?? []) as { id: string; course_id: string }[]) {
    const bucket = byCourse.get(l.course_id) ?? { total: 0, done: 0 }
    bucket.total += 1
    if (doneIds.has(l.id)) bucket.done += 1
    byCourse.set(l.course_id, bucket)
  }

  return courses.map((course) => {
    const b = byCourse.get(course.id) ?? { total: 0, done: 0 }
    return {
      course,
      totalLessons: b.total,
      completedLessons: b.done,
      percent: b.total === 0 ? 0 : Math.round((b.done / b.total) * 100),
    }
  })
}

/** Dərs paneli üçün: kurs + dərslər + materiallar + tamamlananlar. */
export type CoursePlayerData = {
  course: Course
  lessons: Lesson[]
  materials: Record<string, LessonMaterial[]>
  completed: Set<string>
}

export async function fetchCoursePlayer(
  slug: string,
  userId: string,
): Promise<CoursePlayerData | null> {
  const course = await fetchCourseBySlug(slug)
  if (!course) return null

  const { data: lessons, error: lesErr } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })
  if (lesErr) throw new Error(lesErr.message)

  const lessonRows = (lessons ?? []) as Lesson[]
  const lessonIds = lessonRows.map((l) => l.id)

  const materials: Record<string, LessonMaterial[]> = {}
  if (lessonIds.length > 0) {
    const { data: mats, error: matErr } = await supabase
      .from('lesson_materials')
      .select('*')
      .in('lesson_id', lessonIds)
      .order('sort_order', { ascending: true })
    if (matErr) throw new Error(matErr.message)

    for (const m of (mats ?? []) as LessonMaterial[]) {
      ;(materials[m.lesson_id] ??= []).push(m)
    }
  }

  const { data: progress, error: progErr } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
  if (progErr) throw new Error(progErr.message)

  return {
    course,
    lessons: lessonRows,
    materials,
    completed: new Set((progress ?? []).map((p) => p.lesson_id as string)),
  }
}

/** Pulsuz kursa özü qoşulur. RLS pullu kursda bunu bloklayır. */
export async function enrollFree(userId: string, courseId: string) {
  const { error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, course_id: courseId, source: 'free' })

  // 23505 = unique violation → artıq qoşulub, bu xəta deyil.
  if (error && error.code !== '23505') throw new Error(error.message)
}

export async function hasEnrollment(userId: string, courseId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return !!data
}

/** Pullu kurs üçün adminə sorğu (lead) yazır. */
export async function createCourseRequest(params: {
  userId: string
  courseId: string
  fullName: string
  email: string
}) {
  const { error } = await supabase.from('course_requests').insert({
    user_id: params.userId,
    course_id: params.courseId,
    full_name: params.fullName,
    email: params.email,
  })
  if (error) throw new Error(error.message)
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const { error } = await supabase
    .from('lesson_progress')
    .insert({ user_id: userId, lesson_id: lessonId })
  if (error && error.code !== '23505') throw new Error(error.message)
}

export async function unmarkLessonComplete(userId: string, lessonId: string) {
  const { error } = await supabase
    .from('lesson_progress')
    .delete()
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
  if (error) throw new Error(error.message)
}

/** Statistika üçün kurs baxışı qeyd edir. Sükutla uğursuz olur — UI-ı bloklamamalıdır. */
export async function logCourseView(courseId: string, userId: string | null) {
  await supabase.from('course_views').insert({ course_id: courseId, user_id: userId })
}
