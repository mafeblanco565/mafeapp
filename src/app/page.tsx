
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
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { cn } from "@/lib/utils";

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

  const pendingTasksCount = tasks?.filter((t: any) => !t.isCompleted).length || 0;
  const totalPendingBills = bills?.reduce((acc: number, b: any) => !b.isPaid ? acc + b.amount : acc, 0) || 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-headline font-bold tracking-tighter text-primary uppercase">
          MB FOCUS
        </h1>
        <p className="text-muted-foreground text-lg font-bold uppercase tracking-tight opacity-70">
          Productividad Inteligente para tu día a día.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Pendientes", value: pendingTasksCount, icon: CheckCircle2, color: "text-primary", border: "border-l-primary" },
          { label: "Finanzas", value: `$${totalPendingBills.toLocaleString()}`, icon: DollarSign, color: "text-accent", border: "border-l-accent" },
          { label: "Hábitos", value: "Activo", icon: Flame, color: "text-orange-500", border: "border-l-orange-500" },
          { label: "Agenda", value: "Hoy", icon: CalendarIcon, color: "text-blue-500", border: "border-l-blue-500" },
        ].map((stat, i) => (
          <Card key={i} className={cn("border-none border-l-4 shadow-sm hover:shadow-lg transition-all bg-white rounded-3xl overflow-hidden", stat.border)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
              <p className="text-[9px] text-muted-foreground mt-1 font-bold uppercase opacity-50">Sincronizado</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden bg-white border-none shadow-sm rounded-[3rem]">
          <CardHeader className="bg-secondary/20 flex flex-row items-center justify-between border-b px-8 py-8">
            <CardTitle className="text-xl font-headline font-bold text-primary flex items-center gap-3 uppercase tracking-tighter">
              <Zap className="w-6 h-6" /> Tareas Urgentes
            </CardTitle>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="text-primary font-bold uppercase text-[10px] tracking-widest hover:bg-primary/5">
                VER TODAS <ArrowRight className="ml-2 w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8 space-y-4">
             {pendingTasksCount === 0 ? (
               <div className="py-16 text-center text-muted-foreground bg-muted/5 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center gap-3">
                 <CheckCircle2 className="w-12 h-12 opacity-10" />
                 <p className="font-bold text-[10px] uppercase tracking-widest">No hay tareas pendientes</p>
                 <Link href="/tasks">
                   <Button size="sm" className="mt-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg shadow-primary/10">CREAR OBJETIVO</Button>
                 </Link>
               </div>
             ) : (
               tasks?.filter((t: any) => !t.isCompleted).slice(0, 4).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-5 rounded-3xl border bg-card hover:border-primary/30 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-3.5 h-3.5 rounded-full shadow-inner ring-4 ring-offset-2",
                      task.priority === 'Alta' ? 'bg-primary ring-primary/10' : 'bg-accent ring-accent/10'
                    )} />
                    <span className="font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase rounded-lg border-primary/20 bg-primary/5 text-primary h-6">
                    {task.priority}
                  </Badge>
                </div>
               ))
             )}
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-[3rem] overflow-hidden">
          <CardHeader className="px-8 py-8 border-b">
            <CardTitle className="text-xl font-headline font-bold uppercase tracking-tighter">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8 grid grid-cols-2 gap-5">
            {[
              { label: "Compras IA", href: "/grocery", icon: ShoppingCart },
              { label: "Mi Agenda", href: "/calendar", icon: CalendarIcon },
              { label: "Mis Notas", href: "/notes", icon: FileText },
              { label: "Mis Hábitos", href: "/habits", icon: Activity },
            ].map((link) => (
              <Link key={link.label} href={link.href}>
                <Button variant="outline" className="w-full h-32 flex-col gap-4 rounded-[2rem] hover:border-primary hover:bg-primary/5 transition-all shadow-sm border-muted/30">
                  <link.icon className="w-8 h-8 text-primary" />
                  <span className="font-bold text-[10px] uppercase tracking-widest leading-none">{link.label}</span>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
