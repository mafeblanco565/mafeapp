'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { Loader2 } from 'lucide-react';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth, mounted]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Iniciando MB FOCUS...</p>
      </div>
    );
  }

  return <>{children}</>;
}