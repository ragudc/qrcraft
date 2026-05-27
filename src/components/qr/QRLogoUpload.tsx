"use client"

import { useRef, useCallback } from "react"
import { Label }    from "@/components/ui/label"
import { Button }   from "@/components/ui/button"
import { Slider }   from "@/components/ui/slider"
import { Switch }   from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Upload, X, ImageIcon } from "lucide-react"
import type { QRConfig } from "@/types/qr"

interface QRLogoUploadProps {
  config:   QRConfig
  onUpdate: (partial: Partial<QRConfig>) => void
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/svg+xml"]
const MAX_SIZE_MB     = 1

export function QRLogoUpload({ config, onUpdate }: QRLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert("Only PNG, JPG or SVG files are allowed.")
        return
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`File must be smaller than ${MAX_SIZE_MB}MB.`)
        return
      }
      const reader = new FileReader()
      reader.onload = e => {
        const url = e.target?.result as string
        onUpdate({ logoUrl: url, logoEnabled: true })
      }
      reader.readAsDataURL(file)
    },
    [onUpdate]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">
          Logo / Image
        </Label>
        {config.logoUrl && (
          <div className="flex items-center gap-2">
            <Label
              htmlFor="logo-toggle"
              className="text-xs text-muted-foreground cursor-pointer"
            >
              {config.logoEnabled ? "Visible" : "Hidden"}
            </Label>
            <Switch
              id="logo-toggle"
              checked={config.logoEnabled}
              onCheckedChange={v => onUpdate({ logoEnabled: v })}
            />
          </div>
        )}
      </div>

      {!config.logoUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center
                     gap-2 rounded-lg border-2 border-dashed border-border p-6
                     text-muted-foreground transition-colors
                     hover:border-primary/60 hover:bg-accent/40"
        >
          <Upload className="h-8 w-8" />
          <p className="text-sm font-medium">Click or drag to upload logo</p>
          <p className="text-xs">PNG, JPG, SVG — max {MAX_SIZE_MB}MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center
                          rounded-md border bg-background overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.logoUrl}
              alt="Logo preview"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Logo uploaded
            </p>
            <p className="text-xs text-muted-foreground">Click below to change</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => inputRef.current?.click()}
              aria-label="Change logo"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onUpdate({ logoUrl: null, logoEnabled: false })}
              aria-label="Remove logo"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {config.logoUrl && config.logoEnabled && (
        <>
          <Separator />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Logo Size</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {config.logoSize}%
              </span>
            </div>
            <Slider
              min={10}
              max={40}
              step={5}
              value={[config.logoSize]}
              onValueChange={(v) => {
                const next = typeof v === 'number' ? v : v[0]
                onUpdate({ logoSize: next })
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10% (small)</span>
              <span>40% (large)</span>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
