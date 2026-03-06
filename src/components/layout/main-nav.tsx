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
} from "lucide-react";

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

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm overflow-y-auto">
      {/* Versión Escritorio */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
               <div className="w-2 h-2 bg-accent rounded-full" />
            </div>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary uppercase">
            Focus
          </span>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Navegación Inferior para Móvil (Optimizado para pulgar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t z-50 px-2 py-2 flex justify-around items-center h-20 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 gap-1.5 transition-all active:scale-90",
                isActive ? "text-primary scale-110" : "text-muted-foreground opacity-70"
              )}
            >
              <div className={cn(
                "p-2 rounded-full transition-colors",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tighter",
                isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden transition-all"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
        {/* Botón para abrir el resto del menú en móvil si fuera necesario, 
            pero por ahora dejamos los 5 principales */}
      </div>

      <div className="mt-auto p-6 space-y-1 border-t hidden lg:block">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5" />
          Ajustes
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
