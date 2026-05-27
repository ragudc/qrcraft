"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface StyleOption<T extends string> {
  value:   T
  label:   string
  preview: React.ReactNode
}

interface QRStyleSelectorProps<T extends string> {
  label:    string
  options:  StyleOption<T>[]
  value:    T
  onChange: (value: T) => void
}

export function QRStyleSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: QRStyleSelectorProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg border-2 p-2",
              "text-xs transition-all hover:border-primary/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === opt.value
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center">
              {opt.preview}
            </div>
            <span className="text-center leading-tight">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
