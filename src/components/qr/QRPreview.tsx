"use client"

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Skeleton }          from '@/components/ui/skeleton'
import type { QRConfig }     from '@/types/qr'
import { buildQROptions }    from '@/lib/qr/generateQR'
import type QRCodeStylingType from 'qr-code-styling'

const emptySubscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export interface QRPreviewHandle {
  qrInstance:   React.RefObject<InstanceType<typeof QRCodeStylingType> | null>
  containerRef: React.RefObject<HTMLDivElement | null>
}

interface QRPreviewProps {
  config:      QRConfig
  hasValidUrl: boolean
}

export const QRPreview = forwardRef<QRPreviewHandle, QRPreviewProps>(
  function QRPreview({ config, hasValidUrl }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const qrRef        = useRef<InstanceType<typeof QRCodeStylingType> | null>(null)
    const [loading, setLoading] = useState(true)
    const isClient = useIsClient()

    useImperativeHandle(ref, () => ({
      qrInstance:   qrRef,
      containerRef: containerRef,
    }))

    // Dep on isClient is intentional: effect runs with isClient=false during
    // hydration (no container yet), then re-runs once the DOM is available.
    useEffect(() => {
      if (!isClient || !containerRef.current) return

      let cancelled = false

      const init = async () => {
        const QRCodeStyling = (await import('qr-code-styling')).default
        if (cancelled) return

        qrRef.current = new QRCodeStyling(buildQROptions(config))
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
          qrRef.current.append(containerRef.current)
        }
        setLoading(false)
      }

      init()
      return () => { cancelled = true }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient])

    useEffect(() => {
      if (!qrRef.current || loading) return
      qrRef.current.update(buildQROptions(config))
    }, [config, loading])

    if (!isClient) {
      return (
        <div className="flex items-center justify-center">
          <Skeleton className="rounded-xl" style={{ width: 256, height: 256 }} />
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative rounded-xl border bg-card p-4 shadow-sm"
          style={{ minHeight: config.size + 32 }}
        >
          {loading && (
            <Skeleton
              className="absolute inset-4 rounded-lg"
              style={{ width: config.size, height: config.size }}
            />
          )}
          <div
            ref={containerRef}
            style={{
              opacity:    loading ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }}
          />
        </div>

        {hasValidUrl && (
          <p className="max-w-xs truncate text-center text-xs text-muted-foreground">
            {config.url}
          </p>
        )}

        {!hasValidUrl && (
          <p className="text-xs text-muted-foreground">
            Enter a valid URL to generate your QR code
          </p>
        )}
      </div>
    )
  }
)
