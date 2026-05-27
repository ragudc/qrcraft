"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { RotateCcw } from 'lucide-react'
import { QRConfig, ErrorCorrectionLevel, QRSize } from '@/types/qr'

interface QRControlsProps {
  config: QRConfig
  onUpdate: (partial: Partial<QRConfig>) => void
  onReset: () => void
}

const SIZES: { label: string; value: QRSize }[] = [
  { label: '128 px (Small)',  value: 128 },
  { label: '256 px (Medium)', value: 256 },
  { label: '512 px (Large)',  value: 512 },
]

const ERROR_LEVELS: {
  label: string
  value: ErrorCorrectionLevel
  desc: string
}[] = [
  { label: 'L — Low (7%)',       value: 'L', desc: 'Best for clean environments' },
  { label: 'M — Medium (15%)',   value: 'M', desc: 'Recommended default'         },
  { label: 'Q — Quartile (25%)', value: 'Q', desc: 'Good for logos'              },
  { label: 'H — High (30%)',     value: 'H', desc: 'Best with logo overlay'      },
]

export function QRControls({ config, onUpdate, onReset }: QRControlsProps) {
  return (
    <div className="flex flex-col gap-6">

      {/* URL Input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="qr-url">Destination URL</Label>
        <Input
          id="qr-url"
          type="url"
          placeholder="https://example.com"
          value={config.url}
          onChange={e => onUpdate({ url: e.target.value })}
          className="font-mono text-sm"
        />
        {config.url && (() => {
          try { new URL(config.url); return null }
          catch { return (
            <p className="text-xs text-destructive">
              Please enter a valid URL (include https://)
            </p>
          )}
        })()}
      </div>

      <Separator />

      {/* Size */}
      <div className="flex flex-col gap-2">
        <Label>QR Size</Label>
        <Select
          value={String(config.size)}
          onValueChange={v => onUpdate({ size: Number(v) as QRSize })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {SIZES.map(s => (
              <SelectItem key={s.value} value={String(s.value)}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error Correction */}
      <div className="flex flex-col gap-2">
        <Label>Error Correction Level</Label>
        <Select
          value={config.errorCorrectionLevel}
          onValueChange={v =>
            onUpdate({ errorCorrectionLevel: v as ErrorCorrectionLevel })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {ERROR_LEVELS.map(l => (
              <SelectItem key={l.value} value={l.value}>
                <div className="flex flex-col">
                  <span>{l.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {l.desc}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset to defaults
      </Button>

    </div>
  )
}
