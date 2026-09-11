import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 21st.dev / shadcn komponentlərinin gözlədiyi class birləşdiricisi. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
