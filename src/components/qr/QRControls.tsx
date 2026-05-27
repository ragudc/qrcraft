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
import { QRConfig, ErrorCorrectionLevel, QRSize, DotStyle, CornerStyle } from '@/types/qr'
import { QRColorPicker } from '@/components/qr/QRColorPicker'
import { QRStyleSelector } from '@/components/qr/QRStyleSelector'
import { QRLogoUpload }   from '@/components/qr/QRLogoUpload'

interface QRControlsProps {
  config: QRConfig
  onUpdate: (partial: Partial<QRConfig>) => void
  onReset: () => void
}

const DOT_STYLES: { value: DotStyle; label: string; preview: React.ReactNode }[] = [
  {
    value: 'square',
    label: 'Square',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current">
        <rect x="2" y="2" width="7" height="7"/>
        <rect x="11" y="2" width="7" height="7"/>
        <rect x="2" y="11" width="7" height="7"/>
        <rect x="11" y="11" width="7" height="7"/>
      </svg>
    ),
  },
  {
    value: 'rounded',
    label: 'Rounded',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current">
        <rect x="2" y="2" width="7" height="7" rx="2"/>
        <rect x="11" y="2" width="7" height="7" rx="2"/>
        <rect x="2" y="11" width="7" height="7" rx="2"/>
        <rect x="11" y="11" width="7" height="7" rx="2"/>
      </svg>
    ),
  },
  {
    value: 'dots',
    label: 'Dots',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current">
        <circle cx="5.5" cy="5.5" r="3.5"/>
        <circle cx="14.5" cy="5.5" r="3.5"/>
        <circle cx="5.5" cy="14.5" r="3.5"/>
        <circle cx="14.5" cy="14.5" r="3.5"/>
      </svg>
    ),
  },
  {
    value: 'classy',
    label: 'Classy',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current">
        <path d="M2 4a2 2 0 0 1 2-2h3v7H2zM11 2h3a2 2 0 0 1 2 2v5h-5zM2 11h5v7H4a2 2 0 0 1-2-2zM13 18v-7h5v5a2 2 0 0 1-2 2z"/>
      </svg>
    ),
  },
  {
    value: 'classy-rounded',
    label: 'Classy+',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current">
        <path d="M2 5a3 3 0 0 1 3-3h2v7H2zM11 2h2a3 3 0 0 1 3 3v4h-5zM2 11h5v5a3 3 0 0 1-3 3H2zM13 18v-4a1 1 0 0 0-1-1h-1v5h4a2 2 0 0 0 2-2v-2h-4z"/>
      </svg>
    ),
  },
  {
    value: 'extra-rounded',
    label: 'Extra',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current">
        <rect x="2" y="2" width="7" height="7" rx="3.5"/>
        <rect x="11" y="2" width="7" height="7" rx="3.5"/>
        <rect x="2" y="11" width="7" height="7" rx="3.5"/>
        <rect x="11" y="11" width="7" height="7" rx="3.5"/>
      </svg>
    ),
  },
]

const CORNER_STYLES: { value: CornerStyle; label: string; preview: React.ReactNode }[] = [
  {
    value: 'square',
    label: 'Square',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-none stroke-current stroke-2">
        <rect x="3" y="3" width="14" height="14"/>
        <rect x="6" y="6" width="8" height="8" className="fill-current"/>
      </svg>
    ),
  },
  {
    value: 'extra-rounded',
    label: 'Rounded',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-none stroke-current stroke-2">
        <rect x="3" y="3" width="14" height="14" rx="5"/>
        <rect x="6" y="6" width="8" height="8" rx="3" className="fill-current"/>
      </svg>
    ),
  },
  {
    value: 'dot',
    label: 'Dot',
    preview: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 fill-none stroke-current stroke-2">
        <rect x="3" y="3" width="14" height="14" rx="2"/>
        <circle cx="10" cy="10" r="4" className="fill-current"/>
      </svg>
    ),
  },
]

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

      {/* Colors */}
      <div className="flex flex-col gap-4">
        <Label className="text-sm font-semibold text-foreground">
          Colors
        </Label>
        <QRColorPicker
          label="QR Color (dots)"
          value={config.foregroundColor}
          onChange={v => onUpdate({ foregroundColor: v })}
        />
        <QRColorPicker
          label="Background Color"
          value={config.backgroundColor}
          onChange={v => onUpdate({ backgroundColor: v })}
        />
      </div>

      <Separator />

      {/* Dot Style */}
      <QRStyleSelector
        label="Dot Style"
        options={DOT_STYLES}
        value={config.dotStyle}
        onChange={v => onUpdate({ dotStyle: v })}
      />

      <Separator />

      {/* Corner Style */}
      <QRStyleSelector
        label="Corner Style"
        options={CORNER_STYLES}
        value={config.cornerStyle}
        onChange={v => onUpdate({ cornerStyle: v })}
      />

      <Separator />

      {/* Logo Upload */}
      <QRLogoUpload
        config={config}
        onUpdate={onUpdate}
      />

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
