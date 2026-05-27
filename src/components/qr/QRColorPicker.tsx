"use client"

import { useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface QRColorPickerProps {
  label:    string
  value:    string
  onChange: (color: string) => void
  className?: string
}

export function QRColorPicker({
  label,
  value,
  onChange,
  className,
}: QRColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>{label}</Label>

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-9 w-9 flex-shrink-0 rounded-md border-2 border-border
                     shadow-sm transition-transform hover:scale-105
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-ring"
          style={{ backgroundColor: value }}
          aria-label={`Pick ${label}`}
        />

        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="sr-only"
          aria-hidden="true"
        />

        <Input
          type="text"
          value={value.toUpperCase()}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v)
          }}
          maxLength={7}
          placeholder="#000000"
          className="font-mono text-sm uppercase"
        />

      </div>
    </div>
  )
}
