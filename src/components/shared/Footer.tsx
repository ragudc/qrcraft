import Link from 'next/link'
import { QrCode, GitFork, Globe, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const CURRENT_YEAR = new Date().getFullYear()

const PRODUCT_LINKS = [
  { href: '/#generator', label: 'Generator' },
  { href: '/#features',  label: 'Features'  },
  { href: '/dashboard',  label: 'Dashboard' },
]

const RESOURCE_LINKS = [
  { href: 'https://supabase.com', label: 'Supabase' },
  { href: 'https://vercel.com',   label: 'Vercel'   },
  { href: 'https://nextjs.org',   label: 'Next.js'  },
]

const AUTHOR_LINKS = [
  {
    href:  'https://github.com/ragudc',
    label: 'GitHub',
    Icon:  GitFork,
  },
  {
    href:  'https://www.linkedin.com/in/robertoalejandroagudelocallejas',
    label: 'LinkedIn',
    Icon:  Globe,
  },
  {
    href:  'mailto:robertoagudeloc@gmail.com',
    label: 'robertoagudeloc@gmail.com',
    Icon:  Mail,
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">

        {/* Top area */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

          {/* Brand block */}
          <div className="flex flex-col gap-3 md:max-w-50">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-foreground
                         w-fit hover:opacity-80 transition-opacity"
            >
              <div className="flex h-7 w-7 items-center justify-center
                              rounded-md bg-primary shrink-0">
                <QrCode className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>QRCraft</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create beautiful, custom QR codes for free.
              No sign-up required.
            </p>
          </div>

          {/* Link columns — 1 col on mobile, 3 cols on sm+ */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

            {/* Product */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">Product</p>
              <nav className="flex flex-col gap-2">
                {PRODUCT_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground
                               hover:text-foreground transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">Resources</p>
              <nav className="flex flex-col gap-2">
                {RESOURCE_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground
                               hover:text-foreground transition-colors w-fit"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Built by */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">Built by</p>
              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-medium text-foreground">
                  Roberto Agudelo
                </p>
                <nav className="flex flex-col gap-2">
                  {AUTHOR_LINKS.map(({ href, label, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className="group flex items-center gap-1.5 text-sm
                                 text-muted-foreground hover:text-foreground
                                 transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0
                                       group-hover:text-primary transition-colors" />
                      <span className="break-all">{label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-2 text-center
                        sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {CURRENT_YEAR} QRCraft. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with{' '}
            <span className="text-foreground font-medium">Next.js</span>
            {' '}·{' '}
            <span className="text-foreground font-medium">Supabase</span>
            {' '}·{' '}
            <span className="text-foreground font-medium">shadcn/ui</span>
          </p>
        </div>

      </div>
    </footer>
  )
}
