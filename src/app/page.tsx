
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Zap, 
  DollarSign,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "tasks");
  }, [firestore, user]);

  const billsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "bills");
  }, [firestore, user]);

  const { data: tasks } = useCollection(tasksQuery);
  const { data: bills } = useCollection(billsQuery);

  const pendingTasks = tasks?.filter((t: any) => !t.isCompleted).length || 0;
  const pendingBills = bills?.reduce((acc: number, b: any) => !b.isPaid ? acc + b.amount : acc, 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">
          Bienvenido de nuevo
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
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Enfócate en completarlas hoy</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Facturas por Pagar</CardTitle>
            <DollarSign className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingBills.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Monto total pendiente</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Estado General</CardTitle>
            <Zap className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Productivo</div>
            <p className="text-xs text-muted-foreground">¡Sigue así!</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Lista de Compra</CardTitle>
            <ShoppingCart className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activa</div>
            <p className="text-xs text-muted-foreground">Revisa tus pendientes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline font-semibold">Resumen de Actividad</CardTitle>
            <Link href="/calendar">
              <Button variant="ghost" size="sm" className="gap-2">
                Ver Agenda <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
             {pendingTasks === 0 ? (
               <div className="py-8 text-center text-muted-foreground bg-muted/10 rounded-lg">
                 ¡Todo al día! No tienes tareas pendientes.
               </div>
             ) : (
               tasks?.filter((t: any) => !t.isCompleted).slice(0, 3).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-xs text-muted-foreground">Prioridad {task.priority}</span>
                  </div>
                  <Badge variant={task.priority === "Alta" ? "destructive" : "secondary"}>
                    {task.priority}
                  </Badge>
                </div>
               ))
             )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline font-semibold">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/grocery" className="w-full">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ShoppingCart className="w-5 h-5" /> Compras
              </Button>
            </Link>
            <Link href="/tasks" className="w-full">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <CheckCircle2 className="w-5 h-5" /> Tareas
              </Button>
            </Link>
            <Link href="/notes" className="w-full">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Zap className="w-5 h-5" /> Notas
              </Button>
            </Link>
            <Link href="/habits" className="w-full">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Flame className="w-5 h-5" /> Hábitos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
