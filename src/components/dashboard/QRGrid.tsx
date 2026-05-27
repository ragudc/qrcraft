import { QRCard }         from '@/components/dashboard/QRCard'
import { buttonVariants } from '@/components/ui/button'
import { cn }             from '@/lib/utils'
import { QrCode }         from 'lucide-react'
import Link               from 'next/link'
import type { QRRecord }  from '@/types/qr'

interface QRGridProps {
  records: QRRecord[]
}

export function QRGrid({ records }: QRGridProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <QrCode className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">No QR codes yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Generate your first QR code and save it to see it here.
          </p>
        </div>
        <Link href="/" className={cn(buttonVariants())}>
          Create your first QR
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {records.map(record => (
        <QRCard key={record.id} record={record} />
      ))}
    </div>
  )
}
