
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  CheckSquare,
  CreditCard,
  Calendar,
  FileText,
  Activity,
  ShieldCheck,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const items = [
  { name: "Inicio", href: "/", icon: LayoutDashboard },
  { name: "Compras", href: "/grocery", icon: ShoppingCart },
  { name: "Tareas", href: "/tasks", icon: CheckSquare },
  { name: "Facturas", href: "/bills", icon: CreditCard },
  { name: "Hábitos", href: "/habits", icon: Activity },
  { name: "Agenda", href: "/calendar", icon: Calendar },
  { name: "Notas", href: "/notes", icon: FileText },
  { name: "Admin", href: "/admin", icon: ShieldCheck },
];

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const logoImage = PlaceHolderImages.find(img => img.id === "app-logo");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Logo agrandado a w-16 h-16 */}
        <Link href="/" className="flex items-center">
          {logoImage && (
            <div className="relative w-16 h-16 overflow-hidden rounded-lg transition-transform hover:scale-105">
              <Image
                src={logoImage.imageUrl}
                alt="MBFOCUS Logo"
                fill
                className="object-contain"
                data-ai-hint={logoImage.imageHint}
                priority
              />
            </div>
          )}
        </Link>

        {/* Menú Hamburguesa */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-primary/5">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-none shadow-2xl rounded-l-[2rem]">
            <SheetHeader className="mb-8 pt-4">
              <SheetTitle className="text-left flex items-center gap-3 text-primary font-bold uppercase tracking-tighter">
                {logoImage && (
                  <div className="relative w-10 h-10">
                    <Image
                      src={logoImage.imageUrl}
                      alt="Mini Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                MB FOCUS
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-tight transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="my-6 border-t pt-6 space-y-2">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-tight text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Configuración
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-tight text-destructive hover:bg-destructive/5 transition-colors text-left">
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
