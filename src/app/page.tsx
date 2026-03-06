
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Flame, 
  Zap, 
  DollarSign,
  ShoppingCart,
  Calendar as CalendarIcon,
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
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary uppercase">
          Bienvenido a MBFOCUS
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Tu centro de control personal para un día productivo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Tareas Hoy</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">{pendingTasks}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">Pendientes de completar</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Finanzas</CardTitle>
            <DollarSign className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">${pendingBills.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">Total por pagar</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Racha</CardTitle>
            <Flame className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">Activa</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">¡Sigue construyendo hábitos!</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Calendario</CardTitle>
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">Activo</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">Revisa tu agenda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden bg-white border-none shadow-sm rounded-[2.5rem]">
          <CardHeader className="bg-secondary/30 flex flex-row items-center justify-between border-b px-8 py-6">
            <CardTitle className="text-lg font-headline font-bold text-primary flex items-center gap-2 uppercase tracking-tighter">
              <Zap className="w-5 h-5" /> Tareas Urgentes
            </CardTitle>
            <Link href="/tasks">
              <Button variant="link" size="sm" className="text-primary font-bold uppercase text-[10px] tracking-widest">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8 space-y-4">
             {pendingTasks === 0 ? (
               <div className="py-12 text-center text-muted-foreground bg-muted/5 rounded-[2rem] border-2 border-dashed flex flex-col items-center gap-2">
                 <CheckCircle2 className="w-10 h-10 opacity-20" />
                 <p className="font-bold text-xs uppercase tracking-widest">No hay tareas pendientes</p>
                 <Link href="/tasks">
                   <Button size="sm" variant="outline" className="mt-4 rounded-xl font-bold uppercase text-[10px] tracking-widest">CREAR NUEVA</Button>
                 </Link>
               </div>
             ) : (
               tasks?.filter((t: any) => !t.isCompleted).slice(0, 4).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-5 rounded-2xl border bg-card hover:bg-secondary/20 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full shadow-inner ${task.priority === 'Alta' ? 'bg-primary' : 'bg-accent'}`} />
                    <span className="font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase rounded-lg border-primary/20 bg-primary/5 text-primary">
                    {task.priority}
                  </Badge>
                </div>
               ))
             )}
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-[2.5rem]">
          <CardHeader className="px-8 py-6 border-b">
            <CardTitle className="text-lg font-headline font-bold uppercase tracking-tighter">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8 grid grid-cols-2 gap-4">
            <Link href="/grocery">
              <Button variant="outline" className="w-full h-28 flex-col gap-3 rounded-[1.5rem] hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
                <ShoppingCart className="w-7 h-7 text-primary" />
                <span className="font-bold text-[10px] uppercase tracking-widest">Compras IA</span>
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="outline" className="w-full h-28 flex-col gap-3 rounded-[1.5rem] hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
                <CalendarIcon className="w-7 h-7 text-primary" />
                <span className="font-bold text-[10px] uppercase tracking-widest">Mi Agenda</span>
              </Button>
            </Link>
            <Link href="/notes">
              <Button variant="outline" className="w-full h-28 flex-col gap-3 rounded-[1.5rem] hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
                <FileText className="w-7 h-7 text-primary" />
                <span className="font-bold text-[10px] uppercase tracking-widest">Mis Notas</span>
              </Button>
            </Link>
            <Link href="/habits">
              <Button variant="outline" className="w-full h-28 flex-col gap-3 rounded-[1.5rem] hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
                <Activity className="w-7 h-7 text-primary" />
                <span className="font-bold text-[10px] uppercase tracking-widest">Hábitos</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
