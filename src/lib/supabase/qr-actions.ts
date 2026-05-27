"use server"

import { revalidatePath } from 'next/cache'
import { createClient }   from '@/lib/supabase/server'

export async function deleteQRCode(id: string): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: record } = await supabase
    .from('qr_codes')
    .select('preview_url')
    .eq('id', id)
    .single()

  if (record?.preview_url) {
    const path = record.preview_url.split('/qr-previews/')[1]
    if (path) {
      await supabase.storage.from('qr-previews').remove([path])
    }
  }

  const { error } = await supabase
    .from('qr_codes')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Failed to delete QR code')

  revalidatePath('/dashboard')
}
