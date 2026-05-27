"use client"

import { useState, useCallback }  from 'react'
import { useRouter }              from 'next/navigation'
import { toast }                  from 'sonner'
import { Button }                 from '@/components/ui/button'
import { Separator }              from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Save, LogIn, Loader2 } from 'lucide-react'
import { useAuth }               from '@/hooks/useAuth'
import { signInWithGoogle }      from '@/lib/supabase/auth-actions'
import { captureQRAsBase64 }     from '@/lib/qr/exportHelpers'
import type { QRConfig }         from '@/types/qr'

interface QRSaveButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  config:       QRConfig
  hasValidUrl:  boolean
}

export function QRSaveButton({
  containerRef,
  config,
  hasValidUrl,
}: QRSaveButtonProps) {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [saving,     setSaving]     = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [label,      setLabel]      = useState('')

  const handleSave = useCallback(async () => {
    if (!hasValidUrl || !containerRef.current) return
    setSaving(true)

    try {
      const previewB64 = await captureQRAsBase64(containerRef.current)

      const res = await fetch('/api/qr/save', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          config,
          previewB64,
          label: label.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? 'Save failed')
      }

      toast.success('QR code saved!', {
        description: 'View it in your dashboard.',
        action: {
          label:   'Go to Dashboard',
          onClick: () => router.push('/dashboard'),
        },
      })

      setDialogOpen(false)
      setLabel('')

    } catch (err) {
      console.error('Save error:', err)
      toast.error('Failed to save QR code. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [containerRef, config, hasValidUrl, label, router])

  if (authLoading) return null

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Separator />
        <form action={signInWithGoogle}>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="w-full gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign in to Save
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground">
          Sign in to save and manage your QR codes
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Separator />
      <Button
        size="sm"
        className="w-full gap-2"
        disabled={!hasValidUrl}
        onClick={() => setDialogOpen(true)}
      >
        <Save className="h-4 w-4" />
        Save QR Code
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Save QR Code</DialogTitle>
            <DialogDescription>
              Add an optional label to identify this QR code later.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-2">
            <Label htmlFor="qr-label">Label (optional)</Label>
            <Input
              id="qr-label"
              placeholder="e.g. My website, Instagram profile..."
              value={label}
              onChange={e => setLabel(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !saving) void handleSave()
              }}
              maxLength={60}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving} className="gap-2">
              {saving
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                : <><Save className="h-4 w-4" /> Save</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
