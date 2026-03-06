
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Zap, 
  DollarSign,
  ShoppingCart,
  Calendar as CalendarIcon,
  Plus,
  Loader2,
  FileText,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingTasks = tasks?.filter((t: any) => !t.isCompleted).length || 0;
  const pendingBills = bills?.reduce((acc: number, b: any) => !b.isPaid ? acc + b.amount : acc, 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">
          Bienvenido a MBFOCUS
        </h1>
        <p className="text-muted-foreground text-lg">
          Tu centro de control personal para un día productivo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Tareas Hoy</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTasks}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Pendientes de completar</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Finanzas</CardTitle>
            <DollarSign className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${pendingBills.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total por pagar</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Racha</CardTitle>
            <Flame className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Iniciado</div>
            <p className="text-[10px] text-muted-foreground mt-1">¡Sigue construyendo hábitos!</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Calendario</CardTitle>
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Activo</div>
            <p className="text-[10px] text-muted-foreground mt-1">Revisa tu agenda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden">
          <CardHeader className="bg-secondary/30 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg font-headline font-bold text-primary flex items-center gap-2">
              <Zap className="w-5 h-5" /> Tareas Urgentes
            </CardTitle>
            <Link href="/tasks">
              <Button variant="link" size="sm" className="text-primary font-bold">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
             {pendingTasks === 0 ? (
               <div className="py-12 text-center text-muted-foreground bg-muted/5 rounded-xl border-2 border-dashed flex flex-col items-center gap-2">
                 <CheckCircle2 className="w-10 h-10 opacity-20" />
                 <p className="font-medium">No hay tareas pendientes</p>
                 <Link href="/tasks">
                   <Button size="sm" variant="outline" className="mt-2">Crear nueva tarea</Button>
                 </Link>
               </div>
             ) : (
               tasks?.filter((t: any) => !t.isCompleted).slice(0, 4).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-secondary/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'Alta' ? 'bg-red-500' : 'bg-orange-400'}`} />
                    <span className="font-medium group-hover:text-primary transition-colors">{task.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase">
                    {task.priority}
                  </Badge>
                </div>
               ))
             )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-headline font-bold">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 gap-4">
            <Link href="/grocery">
              <Button variant="outline" className="w-full h-24 flex-col gap-3 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <span className="font-bold text-xs uppercase tracking-wider">Compras IA</span>
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="outline" className="w-full h-24 flex-col gap-3 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <span className="font-bold text-xs uppercase tracking-wider">Mi Agenda</span>
              </Button>
            </Link>
            <Link href="/notes">
              <Button variant="outline" className="w-full h-24 flex-col gap-3 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all">
                <FileText className="w-6 h-6 text-primary" />
                <span className="font-bold text-xs uppercase tracking-wider">Mis Notas</span>
              </Button>
            </Link>
            <Link href="/habits">
              <Button variant="outline" className="w-full h-24 flex-col gap-3 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all">
                <Activity className="w-6 h-6 text-primary" />
                <span className="font-bold text-xs uppercase tracking-wider">Hábitos</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
