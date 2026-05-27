import Link from "next/link"
import { QrCode } from "lucide-react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Separator } from "@/components/ui/separator"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">

        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-foreground hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <QrCode className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg">QRCraft</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            My QR Codes
          </Link>
          <Separator orientation="vertical" className="hidden sm:block h-5 mx-1" />
          <ThemeToggle />
        </div>

      </div>
    </header>
  )
}
