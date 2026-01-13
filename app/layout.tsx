import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Theme } from 'frosted-ui'
import { WhopApp } from '@whop/react/components'
import './globals.css'

// Ensure App ID is available - set as fallback if env var doesn't load
if (typeof process !== 'undefined' && !process.env.NEXT_PUBLIC_WHOP_APP_ID) {
  process.env.NEXT_PUBLIC_WHOP_APP_ID = 'app_AVNFP7BwO95Bf8'
}

// FFF-AcidGrotesk font configuration
const acidGrotesk = localFont({
  src: [
    {
      path: '../public/fonts/FFF-AcidGrotesk-UltraLight.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-UltraLightItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-ExtraLightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-Book.otf',
      weight: '450',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-BookItalic.otf',
      weight: '450',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-ExtraBoldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/FFF-AcidGrotesk-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-acid-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Whop University - Onboarding',
  description: 'Welcome to Whop University',
}

// Mark layout as dynamic to prevent static generation issues with WhopApp
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={acidGrotesk.variable} suppressHydrationWarning>
      <body>
        <WhopApp>
          <Theme>
            {children}
          </Theme>
        </WhopApp>
      </body>
    </html>
  )
}
