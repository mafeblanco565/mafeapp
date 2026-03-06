import type { Metadata } from 'next';
import './globals.css';
import { MainNav } from '@/components/layout/main-nav';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthCheck } from '@/components/auth-check';

export const metadata: Metadata = {
  title: 'MB FOCUS - Productividad Móvil',
  description: 'Gestiona tu vida desde cualquier lugar con MB FOCUS AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="font-body antialiased bg-[#FDFCF8] min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <AuthCheck>
            <MainNav />
            <main className="flex-1 min-h-screen">
              <div className="container mx-auto p-4 md:p-8 max-w-5xl">
                {children}
              </div>
            </main>
            <Toaster />
          </AuthCheck>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
