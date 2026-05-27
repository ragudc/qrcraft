"use client"

import { useQRGenerator } from '@/hooks/useQRGenerator'
import { QRControls } from '@/components/qr/QRControls'
import { QRPreview } from '@/components/qr/QRPreview'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export function QRGenerator() {
  const { config, updateConfig, resetConfig, hasValidUrl } =
    useQRGenerator()

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
            <CardDescription>
              Customize your QR code settings
            </CardDescription>
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
            <CardDescription>
              Live preview updates as you type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <QRPreview
              config={config}
              hasValidUrl={hasValidUrl}
            />
          </CardContent>
        </Card>

      </div>
    </section>
  )
}
