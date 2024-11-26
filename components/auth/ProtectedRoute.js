'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getSession();
        
        if (!session) {
          router.replace('/login');
          return;
        }

        if (requiredRole && session.user.user_metadata.role !== requiredRole) {
          router.replace('/unauthorized');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        router.replace('/login');
      }
    }

    checkAuth();
  }, [router, requiredRole]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return children;
}