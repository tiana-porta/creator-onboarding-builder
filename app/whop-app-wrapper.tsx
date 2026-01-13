'use client'

// Client-side wrapper for WhopApp to avoid server-side rendering issues
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import WhopApp with SSR disabled
const WhopApp = dynamic(
  () => import('@whop/react/components').then((mod) => ({ default: mod.WhopApp })),
  { ssr: false }
)

export default function WhopAppWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render WhopApp on server - only on client
  if (!mounted) {
    return <>{children}</>
  }

  return <WhopApp>{children}</WhopApp>
}

