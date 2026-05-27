"use client"

import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import { ArrowDown, Sparkles } from 'lucide-react'

export function HeroSection() {
  const scrollToGenerator = () => {
    document
      .getElementById('generator')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative flex flex-col items-center
                        justify-center gap-6 px-4 py-20
                        text-center md:py-28">

      <div className="animate-fade-in">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Free QR code generator
        </Badge>
      </div>

      <div className="flex flex-col gap-3 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold tracking-tight
                       text-foreground
                       sm:text-5xl md:text-6xl lg:text-7xl">
          Create beautiful{' '}
          <span className="text-primary">QR codes</span>
          {' '}in seconds
        </h1>
        <p className="mx-auto max-w-xl text-base
                      text-muted-foreground
                      sm:text-lg md:text-xl">
          Customize colors, styles and add your logo.
          Download in PNG, SVG or PDF — no sign-up required.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up">
        <Button size="lg" onClick={scrollToGenerator}
          className="gap-2 text-base px-8">
          <ArrowDown className="h-4 w-4" />
          Start generating
        </Button>
        <Button size="lg" variant="outline"
          onClick={scrollToGenerator}
          className="text-base px-8">
          See how it works
        </Button>
      </div>

      <div className="flex flex-wrap items-center
                      justify-center gap-6 pt-4
                      animate-fade-in">
        {[
          { value: 'Free',      label: 'Forever'        },
          { value: '3',         label: 'Export formats' },
          { value: '6',         label: 'Dot styles'     },
          { value: 'Unlimited', label: 'QR codes'       },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col items-center gap-0.5">
            <span className="text-2xl font-bold text-foreground">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

    </section>
  )
}
