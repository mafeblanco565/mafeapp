import type { Metadata } from 'next';
import './globals.css';
import { MainNav } from '@/components/layout/main-nav';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

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
      <body className="font-body antialiased bg-[#FDFCF8] min-h-screen flex flex-col lg:flex-row">
        <FirebaseClientProvider>
          <aside className="lg:w-64 fixed inset-y-0 left-0 hidden lg:block z-50">
            <MainNav />
          </aside>
          
          {/* Navbar móvil solo para el logo */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                  <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
                </div>
                <span className="font-bold text-primary tracking-tight uppercase">MB FOCUS</span>
             </div>
          </div>

          <main className="flex-1 lg:ml-64 min-h-screen pb-20 lg:pb-0">
            <div className="container mx-auto p-4 md:p-8 max-w-5xl">
              {children}
            </div>
          </main>
          
          {/* La navegación móvil está dentro de MainNav pero renderizada al final en pantallas pequeñas */}
          <div className="lg:hidden">
            <MainNav />
          </div>
          
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
