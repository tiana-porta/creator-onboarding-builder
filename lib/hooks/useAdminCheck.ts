'use client'

import { useState, useEffect } from 'react'
import { useIframeSdk } from '@whop/react'

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const iframeSdk = useIframeSdk()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true)
        
        if (!iframeSdk) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        // Try to get user info from the SDK
        // The SDK should provide user context
        // For now, we'll check via API endpoint that uses server-side SDK
        const response = await fetch('/api/admin/check')

        if (!response.ok) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        const data = await response.json()
        setIsAdmin(data.isAdmin || false)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [iframeSdk])

  return { isAdmin, loading }
}

