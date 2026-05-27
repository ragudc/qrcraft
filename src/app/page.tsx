import { QRGenerator } from '@/components/qr/QRGenerator'

interface HomePageProps {
  searchParams: Promise<{ load?: string; error?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  return (
    <main className="min-h-screen bg-background">
      <QRGenerator loadId={params.load} />
    </main>
  )
}
