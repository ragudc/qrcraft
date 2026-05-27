import { Card, CardContent } from '@/components/ui/card'
import {
  Palette,
  Download,
  Shield,
  Zap,
  ImageIcon,
  BarChart3,
} from 'lucide-react'

const FEATURES = [
  {
    icon:        Palette,
    title:       'Full Customization',
    description: 'Choose dot styles, corner shapes, colors and add ' +
                 'your brand logo in the center of the QR code.',
  },
  {
    icon:        Download,
    title:       'Multiple Formats',
    description: 'Download your QR code as PNG for web, SVG for ' +
                 'print, or PDF with metadata — ready to use anywhere.',
  },
  {
    icon:        Zap,
    title:       'Real-time Preview',
    description: 'See every change instantly. No waiting, no ' +
                 'page reloads. Your QR updates as you type.',
  },
  {
    icon:        ImageIcon,
    title:       'Logo Overlay',
    description: 'Upload your brand logo and place it in the center ' +
                 'of the QR code with adjustable size and error correction.',
  },
  {
    icon:        Shield,
    title:       'No Sign-up Required',
    description: 'Generate and download QR codes instantly without ' +
                 'creating an account. Sign in only to save your history.',
  },
  {
    icon:        BarChart3,
    title:       'QR History Dashboard',
    description: 'Sign in to save unlimited QR codes. Reload any ' +
                 'saved configuration and manage your collection.',
  },
]

export function FeaturesSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight
                         text-foreground sm:text-4xl">
            Everything you need
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Professional QR codes without the complexity or the price tag.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title}
              className="border-border/60 transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex h-10 w-10 items-center
                                justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
