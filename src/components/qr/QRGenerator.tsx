"use client"

import { useRef, useEffect }  from 'react'
import { useQRGenerator }     from '@/hooks/useQRGenerator'
import { QRControls }         from '@/components/qr/QRControls'
import { QRPreview, type QRPreviewHandle } from '@/components/qr/QRPreview'
import { QRDownloadButtons }  from '@/components/qr/QRDownloadButtons'
import { QRSaveButton }       from '@/components/qr/QRSaveButton'
import { createClient }       from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import type { QRConfig }      from '@/types/qr'

interface QRGeneratorProps {
  loadId?: string
}

export function QRGenerator({ loadId }: QRGeneratorProps) {
  const { config, updateConfig, resetConfig, hasValidUrl } = useQRGenerator()
  const previewRef = useRef<QRPreviewHandle>(null)

  useEffect(() => {
    if (!loadId) return

    const supabase = createClient()
    supabase
      .from('qr_codes')
      .select('config_json')
      .eq('id', loadId)
      .single()
      .then(({ data }) => {
        if (data?.config_json) {
          const saved = data.config_json as QRConfig
          Object.entries(saved).forEach(([k, v]) => {
            updateConfig({ [k]: v } as Partial<QRConfig>)
          })
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadId])

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          QR Code Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create beautiful, custom QR codes in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
            <CardDescription>Customize your QR code settings</CardDescription>
          </CardHeader>
          <CardContent>
            <QRControls
              config={config}
              onUpdate={updateConfig}
              onReset={resetConfig}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
            <CardDescription>Live preview — updates as you type</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <QRPreview
              ref={previewRef}
              config={config}
              hasValidUrl={hasValidUrl}
            />
            <QRDownloadButtons
              qrInstance={previewRef.current?.qrInstance ?? { current: null }}
              containerRef={previewRef.current?.containerRef ?? { current: null }}
              config={config}
              hasValidUrl={hasValidUrl}
            />
            <QRSaveButton
              containerRef={previewRef.current?.containerRef ?? { current: null }}
              config={config}
              hasValidUrl={hasValidUrl}
            />
          </CardContent>
        </Card>

      </div>
    </section>
  )
}
