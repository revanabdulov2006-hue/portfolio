import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-6xl font-bold tracking-tight text-primary/25">404</p>
      <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
        Bu səhifə mövcud deyil
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Link köhnəlmiş ola bilər və ya səhifə silinib.
      </p>
      <Link to="/" className="mt-8">
        <Button size="lg">Ana səhifəyə qayıt</Button>
      </Link>
    </div>
  )
}
