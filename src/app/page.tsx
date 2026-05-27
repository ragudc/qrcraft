import { HeroSection }        from '@/components/landing/HeroSection'
import { FeaturesSection }    from '@/components/landing/FeaturesSection'
import { HowItWorksSection }  from '@/components/landing/HowItWorksSection'
import { QRGenerator }        from '@/components/qr/QRGenerator'
import { Separator }          from '@/components/ui/separator'

interface HomePageProps {
  searchParams: Promise<{ load?: string; error?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-background">

      {/* 1 — Hero */}
      <HeroSection />

      <Separator />

      {/* 2 — Features */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* 3 — How it works */}
      <HowItWorksSection />

      <Separator />

      {/* 4 — Generator (scroll target) */}
      <div id="generator" className="scroll-mt-16">
        <QRGenerator loadId={params.load} />
      </div>

    </main>
  )
}
