'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthPersistence = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-state-ready', {
          detail: { user, authenticated: !!user }
        }));
      }
    }
  }, [user, loading]);

  return { user, loading };
};
