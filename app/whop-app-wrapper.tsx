'use client'

// Client-side wrapper for WhopApp to avoid server-side rendering issues
import { WhopApp } from '@whop/react/components'

export default function WhopAppWrapper({ children }: { children: React.ReactNode }) {
  return <WhopApp>{children}</WhopApp>
}

