import { redirect }      from 'next/navigation'
import { createClient }  from '@/lib/supabase/server'
import { QRGrid }        from '@/components/dashboard/QRGrid'
import { buttonVariants } from '@/components/ui/button'
import { cn }            from '@/lib/utils'
import { Separator }     from '@/components/ui/separator'
import { QrCode, Plus }  from 'lucide-react'
import Link              from 'next/link'
import type { QRRecord } from '@/types/qr'

export const metadata = {
  title:       'My QR Codes — QRCraft',
  description: 'Manage your saved QR codes',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: records, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Dashboard fetch error:', error)
  }

  const qrRecords = (records ?? []) as QRRecord[]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              My QR Codes
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {qrRecords.length === 0
              ? 'No QR codes saved yet'
              : `${qrRecords.length} QR code${qrRecords.length === 1 ? '' : 's'} saved`
            }
          </p>
        </div>

        <Link href="/" className={cn(buttonVariants(), 'gap-2 w-full sm:w-auto')}>
          <Plus className="h-4 w-4" />
          New QR Code
        </Link>
      </div>

      <Separator className="my-6" />

      <QRGrid records={qrRecords} />
    </main>
  )
}
