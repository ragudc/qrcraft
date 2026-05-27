"use client"

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Image                       from 'next/image'
import { toast }                   from 'sonner'
import { Card, CardContent }       from '@/components/ui/card'
import { Button }                  from '@/components/ui/button'
import { Badge }                   from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Download, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { deleteQRCode } from '@/lib/supabase/qr-actions'
import type { QRRecord } from '@/types/qr'

interface QRCardProps {
  record: QRRecord
}

export function QRCard({ record }: QRCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [imgError,   setImgError]    = useState(false)
  const [alertOpen,  setAlertOpen]   = useState(false)

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(record.created_at))

  const displayUrl = record.url.length > 35
    ? `${record.url.slice(0, 32)}...`
    : record.url

  const handleLoad = () => {
    const params = new URLSearchParams({ load: record.id })
    router.push(`/?${params.toString()}`)
  }

  const handleDelete = () => {
    setAlertOpen(false)
    startTransition(async () => {
      try {
        await deleteQRCode(record.id)
        toast.success('QR code deleted')
      } catch {
        toast.error('Failed to delete QR code')
      }
    })
  }

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {/* Preview image */}
      <div className="relative flex h-44 items-center justify-center bg-muted/30 border-b overflow-hidden">
        {record.preview_url && !imgError ? (
          <Image
            src={record.preview_url}
            alt={record.label ?? record.url}
            width={140}
            height={140}
            className="object-contain p-2"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center text-3xl">
              🔲
            </div>
            <span className="text-xs">No preview</span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-col gap-3 p-4">
        {/* Label + URL */}
        <div className="flex flex-col gap-1 min-w-0">
          {record.label && (
            <p className="text-sm font-semibold text-foreground truncate">
              {record.label}
            </p>
          )}
          <a
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors truncate group/link"
          >
            <span className="truncate">{displayUrl}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-normal">
            {record.config_json.size}px
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formattedDate}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoad}
            className="flex-1 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Load
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => setAlertOpen(true)}
            className="gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5"
          >
            {isPending
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Trash2 className="h-3.5 w-3.5" />
            }
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete QR Code?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The QR code and its
              preview image will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
