import Link from 'next/link'
import { QrCode, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const CURRENT_YEAR = new Date().getFullYear()

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

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
    Icon:  GithubIcon,
  },
  {
    href:  'https://www.linkedin.com/in/robertoalejandroagudelocallejas',
    label: 'LinkedIn',
    Icon:  LinkedInIcon,
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
