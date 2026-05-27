"use client"

import { useState, useCallback }  from 'react'
import { toast }                   from 'sonner'
import { Button }                  from '@/components/ui/button'
import { Separator }               from '@/components/ui/separator'
import { ImageDown, FileCode2, FileText, Loader2 } from 'lucide-react'
import type QRCodeStyling          from 'qr-code-styling'
import { exportPNG, exportSVG, exportPDF } from '@/lib/qr/exportHelpers'
import type { QRConfig }           from '@/types/qr'

interface QRDownloadButtonsProps {
  qrInstance:   React.RefObject<InstanceType<typeof QRCodeStyling> | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  config:       QRConfig
  hasValidUrl:  boolean
}

type Format = 'png' | 'svg' | 'pdf'

export function QRDownloadButtons({
  qrInstance,
  containerRef,
  config,
  hasValidUrl,
}: QRDownloadButtonsProps) {
  const [loading, setLoading] = useState<Record<Format, boolean>>({
    png: false,
    svg: false,
    pdf: false,
  })

  const setFormatLoading = (fmt: Format, val: boolean) =>
    setLoading(prev => ({ ...prev, [fmt]: val }))

  const handleExport = useCallback(
    async (fmt: Format) => {
      if (!hasValidUrl) return
      setFormatLoading(fmt, true)

      try {
        if (fmt === 'png') {
          if (!qrInstance.current) throw new Error('QR not ready')
          await exportPNG(qrInstance.current, config.url)
          toast.success('PNG downloaded successfully')
        }
        if (fmt === 'svg') {
          if (!qrInstance.current) throw new Error('QR not ready')
          await exportSVG(qrInstance.current, config.url)
          toast.success('SVG downloaded successfully')
        }
        if (fmt === 'pdf') {
          if (!containerRef.current) throw new Error('Container not ready')
          await exportPDF(containerRef.current, config.url, config.size)
          toast.success('PDF downloaded successfully')
        }
      } catch (err) {
        console.error(`Export ${fmt.toUpperCase()} error:`, err)
        toast.error(`Failed to download ${fmt.toUpperCase()}. Please try again.`)
      } finally {
        setFormatLoading(fmt, false)
      }
    },
    [qrInstance, containerRef, config, hasValidUrl]
  )

  const isAnyLoading = Object.values(loading).some(Boolean)

  const buttons: {
    fmt:     Format
    label:   string
    icon:    React.ReactNode
    variant: 'default' | 'outline' | 'secondary'
  }[] = [
    { fmt: 'png', label: 'PNG', icon: <ImageDown className="h-4 w-4" />, variant: 'default'  },
    { fmt: 'svg', label: 'SVG', icon: <FileCode2  className="h-4 w-4" />, variant: 'outline' },
    { fmt: 'pdf', label: 'PDF', icon: <FileText   className="h-4 w-4" />, variant: 'outline' },
  ]

  return (
    <div className="flex flex-col gap-3 w-full">
      <Separator />

      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Download
      </p>

      <div className="grid grid-cols-3 gap-2">
        {buttons.map(({ fmt, label, icon, variant }) => (
          <Button
            key={fmt}
            variant={variant}
            size="sm"
            disabled={!hasValidUrl || isAnyLoading}
            onClick={() => handleExport(fmt)}
            className="gap-1.5 w-full"
          >
            {loading[fmt] ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
            {loading[fmt] ? '...' : label}
          </Button>
        ))}
      </div>

      {!hasValidUrl && (
        <p className="text-xs text-muted-foreground text-center">
          Enter a valid URL to enable downloads
        </p>
      )}
    </div>
  )
}
