import type { Metadata } from 'next';
import './globals.css';
import { MainNav } from '@/components/layout/main-nav';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'MB Focus - Productividad Extrema',
  description: 'Gestiona tus compras, tareas, facturas y hábitos con un enfoque impulsado por IA.',
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
      </head>
      <body className="font-body antialiased bg-background min-h-screen flex">
        <aside className="w-64 fixed inset-y-0 hidden lg:block z-50">
          <MainNav />
        </aside>
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {children}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
