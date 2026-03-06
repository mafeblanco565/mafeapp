"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Flame, 
  Zap, 
  DollarSign 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">
          Bienvenido de nuevo, Maestro del Foco
        </h1>
        <p className="text-muted-foreground">
          Esto es lo que tienes pendiente para hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde ayer</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Próximas Facturas</CardTitle>
            <DollarSign className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$420.00</div>
            <p className="text-xs text-muted-foreground">Vencen en los próximos 7 días</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Racha de Hábitos</CardTitle>
            <Flame className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Días</div>
            <p className="text-xs text-muted-foreground">Récord personal: 12</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <Zap className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Óptimo</div>
            <p className="text-xs text-muted-foreground">Última sincronización: hace 1m</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enfoque de Hoy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline font-semibold">Enfoque de Hoy</CardTitle>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Revisar informes trimestrales", priority: "Alta", time: "10:00 AM" },
              { title: "Ir al supermercado", priority: "Media", time: "05:00 PM" },
              { title: "Pagar factura de electricidad", priority: "Alta", time: "Cualquier momento" },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                </div>
                <Badge variant={task.priority === "Alta" ? "destructive" : "secondary"}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progreso de Hábitos */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline font-semibold">Seguimiento de Hábitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: "Meditación Matutina", progress: 80, color: "bg-primary" },
              { name: "Leer 20 Páginas", progress: 45, color: "bg-accent" },
              { name: "Entrenamiento", progress: 100, color: "bg-primary" },
            ].map((habit, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{habit.name}</span>
                  <span className="text-muted-foreground">{habit.progress}%</span>
                </div>
                <Progress value={habit.progress} className="h-2" />
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4" />
              ¡No olvides registrar tu hidratación!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
