/** supabase/schema.sql sənədindəki cədvəllərin TypeScript qarşılıqları. */

export type CourseCategory = 'marketinq' | 'ai' | 'satis' | 'dropshipping'

export const CATEGORY_LABELS: Record<CourseCategory, string> = {
  marketinq: 'Marketinq',
  ai: 'AI Alətləri',
  satis: 'Satış',
  dropshipping: 'Dropshipping',
}

export type Profile = {
  id: string
  full_name: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  last_seen_at: string | null
}

export type Course = {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  thumbnail_url: string | null
  category: CourseCategory
  is_free: boolean
  price: number
  currency: string
  learn_points: string[]
  sort_order: number
  is_published: boolean
  created_at: string
}

export type Lesson = {
  id: string
  course_id: string
  title: string
  description: string
  video_url: string | null
  sort_order: number
  created_at: string
}

export type LessonMaterial = {
  id: string
  lesson_id: string
  title: string
  file_url: string
  kind: string
  sort_order: number
}

export type Enrollment = {
  id: string
  user_id: string
  course_id: string
  source: 'free' | 'admin'
  created_at: string
}

export type LessonProgress = {
  id: string
  user_id: string
  lesson_id: string
  completed_at: string
}

export type CourseRequestStatus = 'new' | 'contacted' | 'approved' | 'rejected'

export type CourseRequest = {
  id: string
  user_id: string | null
  course_id: string
  full_name: string
  email: string
  status: CourseRequestStatus
  note: string
  created_at: string
}
