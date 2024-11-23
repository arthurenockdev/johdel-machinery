'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const code = searchParams.get('code')
        if (!code) throw new Error('No code found in URL')

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) throw error

        // Get the return URL from the search params
        const returnUrl = searchParams.get('returnUrl') || '/'

        // Show success message
        toast.success('Successfully signed in!')

        // Redirect to the return URL
        router.push(returnUrl)
      } catch (error) {
        console.error('Error in auth callback:', error)
        toast.error('Failed to complete sign in. Please try again.')
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign in...</h1>
        <p className="text-gray-600">Please wait while we complete your sign in.</p>
      </div>
    </div>
  )
}
