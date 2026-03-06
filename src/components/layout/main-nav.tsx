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
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center gap-2">
          {logoImage && (
            <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-sm">
              <Image
                src={logoImage.imageUrl}
                alt="MB FOCUS Logo"
                fill
                className="object-cover"
                data-ai-hint={logoImage.imageHint}
              />
            </div>
          )}
          <span className="font-headline font-bold text-lg tracking-tight text-primary uppercase">
            MB FOCUS
          </span>
        </Link>

        {/* Hamburguesa a la derecha */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:h-10 md:w-10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-left flex items-center gap-2 text-primary">
                {logoImage && (
                  <div className="relative w-6 h-6 overflow-hidden rounded">
                    <Image
                      src={logoImage.imageUrl}
                      alt="Mini Logo"
                      fill
                      className="object-cover"
                      data-ai-hint={logoImage.imageHint}
                    />
                  </div>
                )}
                Módulos
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
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-secondary hover:text-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="my-4 border-t pt-4">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Ajustes
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-left">
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
