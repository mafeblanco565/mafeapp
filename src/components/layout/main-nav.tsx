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
  { name: "Panel Control", href: "/", icon: LayoutDashboard },
  { name: "Lista Compra", href: "/grocery", icon: ShoppingCart },
  { name: "Tareas", href: "/tasks", icon: CheckSquare },
  { name: "Facturas", href: "/bills", icon: CreditCard },
  { name: "Hábitos", href: "/habits", icon: Activity },
  { name: "Calendario", href: "/calendar", icon: Calendar },
  { name: "Notas", href: "/notes", icon: FileText },
  { name: "Admin", href: "/admin", icon: ShieldCheck },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
               <div className="w-2 h-2 bg-accent rounded-full" />
            </div>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">
            MB FOCUS
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
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

      <div className="mt-auto p-6 space-y-1 border-t">
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
