// parts/profileShared.ts — Types shared by the Profile page pieces (and EditProfile)
import type { ChangeEvent } from 'react'

export interface ProfileForm { first_name: string; last_name: string; gender: string; contact_number: string; email: string; address_city: string; address_province: string; occupation: string; has_partner: boolean }
export interface AttStats { present: number; late: number; absent: number; excused: number }
export type FieldHandler = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void   // curried form-field onChange
