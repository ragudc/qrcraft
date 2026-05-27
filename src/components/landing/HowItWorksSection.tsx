import { Badge } from '@/components/ui/badge'
import { Link2, Sliders, Download } from 'lucide-react'

const STEPS = [
  {
    number:      '01',
    icon:        Link2,
    title:       'Enter your URL',
    description: 'Paste any URL — website, social profile, ' +
                 'menu, contact info or any link you want to share.',
  },
  {
    number:      '02',
    icon:        Sliders,
    title:       'Customize your style',
    description: 'Pick colors, dot styles, corner shapes and ' +
                 'optionally upload your logo. See changes live.',
  },
  {
    number:      '03',
    icon:        Download,
    title:       'Download and share',
    description: 'Export as PNG, SVG or PDF. Use it on print, ' +
                 'digital media, business cards or anywhere you need.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">

        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            How it works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight
                         text-foreground sm:text-4xl">
            Three steps to your QR code
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            No learning curve. No account required. Just results.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Connecting line — desktop only */}
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block"
            style={{ left: '16.6%', right: '16.6%' }}
          />

          {STEPS.map(({ number, icon: Icon, title, description }) => (
            <div key={number}
              className="relative flex flex-col items-center gap-4 text-center">

              <div className="relative flex h-16 w-16 items-center
                              justify-center rounded-2xl border-2
                              border-border bg-background shadow-sm">
                <Icon className="h-7 w-7 text-primary" />
                <span className="absolute -right-2 -top-2
                                 flex h-5 w-5 items-center justify-center
                                 rounded-full bg-primary text-[10px]
                                 font-bold text-primary-foreground">
                  {number.replace('0', '')}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
