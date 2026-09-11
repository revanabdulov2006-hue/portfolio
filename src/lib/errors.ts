/**
 * İstifadəçiyə göstərilən ümumi xəta mesajı. Xam Supabase/Postgres mətni
 * heç vaxt bura çıxmır — səbəb önəmli deyil, mesaj həmişə eynidir.
 */
export function friendlyErrorMessage(): string {
  return 'Nəsə səhv getdi. Bir az sonra yenidən cəhd edin.'
}
